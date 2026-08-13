## Context

現有 Fastify orders API 使用 JWT 的 `request.userId` 與 PostgreSQL repository 強制擁有權，order request 為 strict JSON。訂單號碼與附件目前只存在 `OrderFormModal.vue` 本地狀態，submit payload 明確排除兩者。Supabase migration 已建立帶 RLS 的 orders table，但專案尚無 Storage adapter、multipart route 或附件 metadata table。商品分類目前同時被前端 validator、Zod 與資料庫 cardinality check 視為必填；金額使用 `type="number"`，因此瀏覽器顯示 spinner。

## Goals / Non-Goals

**Goals:**

- 讓訂單號碼可由建立／編輯 API 保存並在列表、詳情與表單回填。
- 以 private Supabase Storage 和 metadata table 提供擁有權隔離的附件上傳、列表、下載與刪除。
- 讓最多 10 個 PDF、JPEG、PNG 附件可各自成功、失敗與重試，單檔不得超過 10 MB。
- 商品分類未選擇時以空陣列通過前端、API 與資料庫；不支援的值仍被拒絕。
- 金額輸入不顯示原生 spinner、不接受負號，且所有非正數仍被完整驗證鏈拒絕。

**Non-Goals:**

- 不提供公開 bucket、永久公開 URL、附件分享、病毒掃描、縮圖、內容 OCR 或版本歷史。
- 不讓用戶端直接持有 service-role credential 或自行組合可信 storage path。
- 不保證訂單建立與多檔 Storage upload 形成跨服務原子交易；附件失敗不回滾訂單。
- 不改變貨幣、金額精度與既有 `amount > 0` 資料庫限制。

## Decisions

### 訂單號碼加入既有 order JSON 契約

新增 `orders.order_number text not null default ''`，Zod 以 trim 後最長 200 字元接受空字串，mapper 使用 `orderNumber`／`order_number` 雙向映射。建立、更新、列表、單筆詳情及 store confirmed order 均使用同一欄位，不建立獨立資源。訂單號碼不設唯一限制，因不同平台與帳號可能產生相同格式。

### 附件使用獨立 metadata table 與 private Storage bucket

`order_attachments` 保存 `id`, `order_id`, `user_id`, `storage_path`, `original_name`, `mime_type`, `size_bytes`, `created_at`。bucket 固定為 private；storage path 由 server 產生為 `<userId>/<orderId>/<attachmentId>`，原始檔名只作顯示資料。資料庫 FK cascade 清除 metadata，但 Storage object 必須由 service 明確刪除，避免將檔案 binary 或不受控 JSON 放入 orders row。

### 單檔 multipart API 隔離失敗

端點為 `GET /api/orders/:orderId/attachments`、`POST /api/orders/:orderId/attachments`、`GET /api/orders/:orderId/attachments/:attachmentId/download`、`DELETE /api/orders/:orderId/attachments/:attachmentId`。每個 POST 接受一個 multipart `file`，後端在讀取及上傳前限制 10 MB、MIME type 與擁有權。新增訂單先 POST order，再對選取檔案執行附件 POST 並以 settled results 呈現逐檔結果；這比單一混合 request 更容易重試且不改變既有 order JSON route。

### Storage service-role 封裝在單一深層 adapter

後端新增一個 Storage adapter，封裝 upload、remove 與短效 signed download URL；設定要求 server-only Supabase URL 與 service-role key。routes 不直接操作 SDK，service 在每次 Storage 操作前透過 repository 驗證 `order_id + user_id`，並以 metadata 的可信 storage path 操作。adapter 的刪除測試是移除後所有附件功能都無法存取 Storage，證明它不是無行為的轉送層。

### 附件限制由資料庫與後端雙層執行

允許 MIME type 僅 `application/pdf`, `image/jpeg`, `image/png`，`size_bytes` 為 1 到 10,485,760。後端在 upload 前拒絕無效檔案；metadata table 以 check constraint 防止錯誤資料。每訂單最多 10 筆由 transaction-safe database trigger 或等價鎖定機制保護，避免並行請求繞過單純 count-then-insert。

### 上傳與刪除採補償式一致性

上傳順序為驗證擁有權與限制、上傳 object、寫入 metadata；metadata 寫入失敗時 service 必須移除剛上傳的 object。刪除先驗證 metadata 擁有權，再移除 object，最後刪除 metadata；若 Storage removal 失敗則保留 metadata 並回傳錯誤供重試。刪除訂單前 service 先列出並移除 objects，再刪除 order；不能把 FK cascade 誤當成 Storage object cleanup。

### 商品分類以空陣列表示未選擇

`productCategories` 保持 array 型別但移除 `.min(1)` 與前端必填錯誤，create default 為 `[]`。migration 將欄位設為 `not null default '{}'`，check 只驗證所有元素屬於 `merch`, `book`, `other`，不再驗證 cardinality。這保留既有資料形狀並避免 `null` 分支。

### 金額使用 decimal input mode 與正數防線

表單以 `type="text"`、`inputmode="decimal"` 呈現金額，輸入處理只保留數字與單一小數點且不允許負號，所以沒有瀏覽器 spinner。共用 normalize 仍將字串轉 number，共用 validator、Zod positive 與 SQL check 仍拒絕空白、非有限數字、0 與負數；前端輸入限制不是唯一安全防線。

## Implementation Contract

**Observable behavior**

- 建立或編輯訂單可保存空白或最多 200 字元的訂單號碼，重開表單與詳情均顯示後端確認值。
- 不選商品分類仍可建立與編輯訂單，結果的 `productCategories` 為 `[]`；不支援值仍回傳 validation error。
- 金額 control 無 spinner，手機提示 decimal keyboard，輸入 `-6` 不會在 control 中形成負數；`35.29` 可送出，空白、`0`、負數及非數字不能建立訂單。
- 每張 owned order 可列出、上傳、下載與刪除最多 10 個附件；PDF、JPEG、PNG 且 1–10 MB 可接受，其他 MIME、空檔或超過限制回傳 HTTP 400/413 的穩定錯誤。
- 新增訂單的部分附件失敗時訂單仍存在，成功附件保持可見，失敗附件顯示檔名與可重試錯誤。
- 任何附件端點對非擁有者不得透露訂單或附件是否存在，回傳同一個 HTTP 404 resource error。

**Interface and data shape**

- Order public shape 新增 `orderNumber: string`，create default 為 `''`，patch 為 optional。
- Attachment public shape 為 `{ id: string, orderId: string, name: string, mimeType: 'application/pdf' | 'image/jpeg' | 'image/png', size: number, createdAt: string }`，不得回傳 `storagePath` 或 service credential。
- `GET /api/orders/:orderId/attachments` 回傳 `{ data: Attachment[] }`。
- `POST /api/orders/:orderId/attachments` 接受單一 multipart field `file`，成功回傳 HTTP 201 與 `{ data: Attachment }`。
- `GET /api/orders/:orderId/attachments/:attachmentId/download` 對 owned attachment 回傳短效 signed URL redirect；URL 不進入持久化 state。
- `DELETE /api/orders/:orderId/attachments/:attachmentId` 成功回傳 HTTP 204。
- frontend API 提供 list、upload、download、delete attachment methods；multipart request 不手動設定 Content-Type boundary。

**Failure modes**

- `ATTACHMENT_TYPE_NOT_ALLOWED` → HTTP 400；`ATTACHMENT_TOO_LARGE` → HTTP 413；`ATTACHMENT_LIMIT_REACHED` → HTTP 409。
- 非 owned 或不存在的 order/attachment → HTTP 404 `RESOURCE_NOT_FOUND`，不得回傳 403 造成資源探測差異。
- Storage upload 失敗不得新增 metadata；metadata insert 失敗必須嘗試補償刪除 object並記錄 server error。
- Storage delete 失敗不得刪除 metadata；使用者可重試，UI 不得先永久移除 confirmed item。
- 建立訂單後附件失敗不刪除訂單，store 仍以 created order 更新 confirmed collection。

**Acceptance criteria**

- Migration tests 驗證 order number、空 product categories、private bucket、metadata constraints、RLS/ownership 與 10-file concurrency guard。
- Backend schema、mapper、repository、routes/service tests 覆蓋 order number、optional categories、附件 happy paths、限制、補償與 cross-user 404。
- Frontend validation/component/API/store tests覆蓋無 spinner positive decimal input、optional categories、order number round-trip、multipart boundary、部分失敗與重試。
- `npm test`、backend test/typecheck/build、frontend production build 與 migration verification 全部成功。
- 以兩個不同 user fixture 驗證無法 list、download 或 delete 對方附件，response 不含 storage path 或 credential。

**Scope boundaries**

- In scope: frontend order form/details/store/API、Fastify orders 與 attachment modules、server Storage adapter/config、Supabase migration、相關 tests。
- Out of scope: public sharing、掃毒、預覽生成、OCR、批次 zip、附件版本、背景 job，以及既有訂單自動回填未知訂單號碼。

## Risks / Trade-offs

- [Risk] service-role 可繞過 Storage RLS → 僅 server adapter 持有 key，每次操作先以 repository 驗證 owned order/metadata，response 永不暴露 path/key。
- [Risk] DB 與 Storage 無跨系統 transaction → 使用補償刪除、保留可重試 metadata 與明確錯誤，不假裝原子一致。
- [Risk] 並行上傳繞過 10 檔限制 → 以 database trigger 或 row lock 保護 metadata insert，而非僅在 application count。
- [Risk] multipart buffering 導致記憶體壓力 → 使用 streaming/limit-aware parser，在超過 10 MB 時提早終止。
- [Risk] SQL migration 改動既有 product category constraint → 先保留現有 values，再替換 constraint 與 default；rollback 前須確認沒有空陣列資料。

## Migration Plan

1. 部署 migration：新增 nullable-compatible order number default、調整 product categories constraint、建立 private bucket／metadata table／policies／限制 trigger。
2. 設定 backend server-only Storage credentials，部署支援新欄位及附件 API 的後端。
3. 部署前端，使新 payload 與附件 workflow 開始使用；舊前端因後端 defaults 仍可運作。
4. 驗證 owned upload/download/delete 與 cross-user isolation，再開放正式流量。
5. Rollback 時先停用附件 UI/routes；保留資料與 objects，避免破壞性刪除。只有確認不存在空 product categories 後才能恢復舊 cardinality constraint。

## Open Questions

(none)
