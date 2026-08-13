## 1. Migration 與資料契約

- [x] 1.1 以 TDD 為「Database schema enforces ownership and query performance」及「Attachment limits are enforced at trusted boundaries」新增 migration 失敗測試，鎖定 `orders.order_number`、空 `product_categories`、private bucket、`order_attachments` constraints／RLS／indexes 與並行最多 10 筆 guard；驗證目標：`backend/tests/migrations/migration.test.ts` 在 migration 建立前失敗。
- [x] 1.2 實作設計決策「附件使用獨立 metadata table 與 private Storage bucket」與「附件限制由資料庫與後端雙層執行」，新增 `supabase/migrations/20260813000000_persist_order_number_and_attachments.sql` 並保留既有資料；驗證目標：migration tests、Supabase reset／migration verification 通過，empty categories 可寫入且第 11 筆 metadata 在並行下被拒絕。

## 2. Order 欄位、驗證與輸入控制

- [x] 2.1 以 TDD 覆蓋「Orders are persisted with validated ownership and values」、「Order responses use the stable public shape」、「Users can partially update an owned order」與「Order number is persisted through create and edit」，驗證 `orderNumber` create／patch／mapper round-trip、200 字元界線及 `productCategories: []`；驗證目標：backend schema/mapper/repository tests 與 frontend API/store tests 在實作前失敗。
- [x] 2.2 實作設計決策「訂單號碼加入既有 order JSON 契約」，更新 orders Zod schema、mapper、repository typing、frontend API/store 與表單／詳情回填，確保 public response 不含 ownership/storage 欄位；驗證目標：task 2.1 tests 全數通過且舊 client 省略 `orderNumber` 時得到 `''`。
- [x] 2.3 以 TDD 覆蓋「Order validation rules have a single shared source」、「Orders store rejects invalid data on write」、「Order form displays field-specific errors sourced from the shared validator」、「Orders can be tagged with one or more product categories」與「Amount input prevents negative entry without a spinner」，鎖定空分類合法、不支援分類非法，以及 `35.29`／`0`／`-6`／非數字金額邊界；驗證目標：validation、store、OrderFormModal tests 在實作前失敗。
- [x] 2.4 實作設計決策「商品分類以空陣列表示未選擇」與「金額使用 decimal input mode 與正數防線」，移除分類必填、讓 amount 使用 `type="text"`＋`inputmode="decimal"` 且無 spinner／負值，同時保留 shared validator、Zod 與 SQL `amount > 0`；驗證目標：task 2.3 tests 通過，`-6` 不會形成負數 request，`35.29` 可正常送出。

## 3. 私有附件後端

- [x] 3.1 以 TDD 為「Owned orders support private attachments」及「Storage service-role 封裝在單一深層 adapter」新增 adapter/service 失敗測試，使用兩個 user fixture 鎖定 server-generated path、owner precheck、response 排除 storage path，以及 cross-user HTTP 404；驗證目標：`backend/tests/order-attachments/` 新 tests 在 module 建立前失敗。
- [x] 3.2 實作單一 Supabase Storage adapter、server-only config 與 attachment repository/service，使 service-role 永不進入 frontend 且每次 storage 操作前驗證 owned order／metadata；驗證目標：task 3.1 tests、backend config tests、typecheck 通過，缺少 credential 時啟動明確失敗。
- [x] 3.3 以 TDD 為「Owners can list download and delete attachment resources」及「單檔 multipart API 隔離失敗」新增 routes 失敗測試，鎖定 list、單檔 multipart upload、signed redirect、204 delete、MIME／1 byte／10 MB／10 files 邊界與穩定錯誤碼；驗證目標：route tests 在 routes 註冊前失敗。
- [x] 3.4 實作 `GET/POST/download/DELETE` attachment routes、multipart streaming limits 與 app registration，讓合法檔案符合 public Attachment shape且非法 type／size／count 分別回傳指定 400／413／409；驗證目標：task 3.3 route tests 與 backend integration tests 通過。
- [x] 3.5 以 TDD 實作「Attachment lifecycle failures remain recoverable」及設計決策「上傳與刪除採補償式一致性」，鎖定 metadata insert 失敗清除新 object、Storage delete 失敗保留 metadata、刪除 order 清除 objects；驗證目標：service fault-injection tests 可觀察正確補償與重試狀態。

## 4. 附件前端同步

- [x] 4.1 以 TDD 為「Attachment API requests preserve multipart semantics」、「API errors use one frontend contract」與「Order mutations are confirmed by the backend」新增 frontend API/store 失敗測試，鎖定 FormData 不手設 Content-Type、encoded IDs、附件錯誤碼、confirmed order 不因附件失敗回滾；驗證目標：`tests/services/ordersApi.spec.js` 與 `tests/stores/orders.spec.js` 新案例在實作前失敗。
- [x] 4.2 實作 frontend list/upload/download/delete attachment methods 與 store/form/details workflow；新增訂單後以上傳 settled results 顯示成功項目及逐檔失敗重試，編輯模式回填並能刪除／下載 confirmed attachments；驗證目標：task 4.1 tests 與 OrderFormModal／OrderDetailsModal component tests 通過。

## 5. 整合、資安與部署驗收

- [x] 5.1 執行完整 frontend/backend tests、typecheck、production builds、migration verification 與 audit discipline，使用兩個帳號驗證 owned attachment 正常且 cross-user list/download/delete 統一 404；驗證目標：所有命令成功、API response 無 `storagePath`／credential、`git diff --check` 無錯誤，並依 Implementation Contract 逐項人工驗收。
