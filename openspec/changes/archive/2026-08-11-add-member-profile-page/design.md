## Context

Hakobi 已透過 Supabase Auth 建立已驗證 session，並以 `member_profiles` 保存每位會員唯一的使用名稱。應用目前只在登入後載入 `user_id` 與 `username` 並顯示於側邊欄；資料表只有 owner-select RLS，尚無會員自行更新能力，也沒有個人資料頁。這次變更跨越 Postgres migration、Pinia auth store、Vue Router、側邊欄與新頁面，但不引入新的後端服務或外部依賴。

## Goals / Non-Goals

**Goals:**

- 讓已驗證會員從左側欄進入受保護的 `/profile` 頁面。
- 顯示並允許更新使用名稱與顯示名稱，同時唯讀顯示 Supabase Auth Email。
- 在前端與資料庫一致執行顯示名稱 2–30 字元、僅中文／英文字母／數字、不可空白或特殊符號的規則。
- 維持使用名稱的既有格式、正規化、唯一性與並行衝突安全。
- 讓載入、驗證、儲存成功及失敗都有可測試且不遺失輸入的狀態。
- 以精簡且一致的文案呈現個人資料頁，並讓側邊欄頁尾會員識別與登出操作視覺置中。

**Non-Goals:**

- 不提供 Email 變更、密碼修改、帳號刪除、頭像、角色、權限分級或多重要素驗證。
- 不新增 Fastify 會員 API、額外 profile service 或新的狀態管理 store。
- 不讓 Email 成為 `member_profiles` 的重複欄位。
- 不要求顯示名稱唯一，也不讓顯示名稱取代使用名稱作為唯一識別。

## Decisions

### 以 member_profiles 保存可編輯欄位並由 Auth session 提供唯讀 Email

新增 `display_name` 欄位；既有及新建 profile 以合法的「會員」作為初始值，使 migration 可直接建立非空約束，會員之後可在個人資料頁修改。Email 由目前 session 的 Auth user 讀取，不複製到 profile，避免兩份 Email 狀態漂移。替代方案是把 Email 同步進 profile，但會增加同步、驗證與刪除責任，因此不採用。

### 由資料庫約束與 owner-update RLS 作為最終安全邊界

migration 為 `display_name` 增加長度與字元約束，並加入 authenticated owner 的 update policy 與必要權限。使用名稱更新仍寫入正規化值，資料庫 unique constraint 是並行更新的最終裁決；前端 availability query 只用於提早提示。替代方案是只依賴前端驗證，但無法防止直接請求或競態，因此不採用。

### 在既有 auth store 集中會員資料載入與更新

`auth` store 擴充 profile shape、`loadProfile()` select 欄位及 `updateProfile()` mutation，集中處理驗證、Supabase 錯誤映射、成功後記憶體同步與 session 清理。`Profile.vue` 只管理表單草稿和呈現狀態。此介面隱藏驗證、正規化、唯一衝突與 owner-scoped mutation；不建立只轉送呼叫的新 service。若刪除 store 更新介面，頁面便失去一致的資料安全與跨介面同步行為，因此此邊界具有實際深度。

### 以獨立會員導覽區段呈現個人資料入口

側邊欄在訂單「分類」區段後新增「會員」標題與「個人資料」連結，避免將會員頁誤認為訂單分類。`/profile` 使用既有 protected shell 與 auth guard；行動版點擊後沿用收合側邊欄行為。替代方案是只讓頁尾使用名稱可點擊，但可發現性較低且缺少明確導覽標籤，因此不採用。

個人資料頁僅保留「個人資料」主標題，不顯示額外副標題；`display_name` 的畫面標籤使用「真實姓名」，資料欄位與驗證契約仍維持 `display_name`。側邊欄頁尾會員使用名稱採與登出按鈕一致的置中對齊，長文字仍維持單行截斷。

### 表單只在成功回應後更新全域會員資料

頁面以已載入 profile 建立表單草稿；驗證失敗不發送請求，送出期間防止重複提交。成功回應後才取代 store profile、重設 dirty 狀態並顯示成功訊息；失敗則保留草稿並顯示可安全呈現的錯誤。使用名稱 unique violation 固定映射為「此名稱已被使用」，其他寫入錯誤使用一般儲存失敗訊息，避免暴露供應商或資料庫細節。

## Implementation Contract

- Navigation: 已驗證會員可從側邊欄「會員」區段的「個人資料」連結進入 `/profile`；匿名訪客仍由既有 guard 導向登入頁。
- Presentation: 個人資料頁只顯示「個人資料」主標題且不得顯示「查看並更新你的會員識別資料」；`display_name` 輸入標籤為「真實姓名」。側邊欄頁尾會員使用名稱與登出控制均置中，名稱過長時不得破壞頁尾版面。
- Profile shape: store profile 至少包含 `{ userId, username, displayName }`；頁面 Email 來自 `auth.user.email`，畫面為唯讀且任何 profile update payload 均不得包含 Email。
- Display-name validation: 值必填，Unicode 字元數為 2–30，只接受中文、ASCII 英文字母與 ASCII 數字；任何位置的空白、底線、連字號、標點、Emoji 或其他符號均拒絕。`王小明`、`Hakobi01`、`王小明88` 接受；`王 小明`、`Hakobi_01`、`王小明🙂` 與空字串拒絕。
- Username validation: 沿用既有 3–20 字元與允許字元規則；更新 payload 同時提供其 lowercase-trimmed normalized value，最終唯一性由資料庫約束保證。
- Database ownership: authenticated member 只能 select 與 update 自己 `user_id` 的 profile，不能讀取或更新其他會員資料；insert/delete 權限不因本變更開放。
- Loading: 進入頁面時已有 profile 則初始化表單；尚未載入時顯示 loading 並使用既有 load operation。載入失敗顯示重試操作且不得顯示其他會員的快取資料。
- Save success: 更新成功後 store、側邊欄與表單顯示相同 username/displayName，頁面顯示成功訊息且 Email 維持原 session 值。
- Save failure: 欄位錯誤顯示在對應欄位且不發送 mutation；使用名稱衝突顯示「此名稱已被使用」；其他失敗顯示一般錯誤並保留草稿，不以未確認資料更新側邊欄。
- Migration: migration 為所有既有 profile 回填合法的「會員」並建立 non-null 與 check constraints；新 profile 同樣取得合法初始顯示名稱。
- Acceptance: migration schema/RLS assertions、domain boundary table、auth store load/update/unique-failure tests、router guard tests、sidebar navigation tests、Profile view 狀態 tests，以及前端與 server 完整測試及 builds 全部通過。
- In scope: profile schema、owner update、store update contract、頁面與導覽。Out of scope: 所有帳號安全操作、管理員能力、Fastify 會員端點及圖片儲存。

## Risks / Trade-offs

- [既有會員沒有自訂顯示名稱] → migration 以「會員」回填，避免空值或非法 username 衍生值，並允許會員稍後修改。
- [availability preflight 與最終更新間存在競態] → 保留 unique constraint 為最終裁決並把 unique violation 映射為固定欄位錯誤。
- [直接 Supabase update 擴大資料表權限] → 僅授予 authenticated update，RLS 的 USING 與 WITH CHECK 均綁定 `auth.uid() = user_id`，資料庫 check constraints 再驗證內容。
- [表單草稿與側邊欄顯示不同步] → 只在 confirmed update response 後更新 store，失敗時保留草稿但維持全域 confirmed profile。

## Migration Plan

1. 先套用 additive migration，新增有合法預設值的 `display_name`、約束、update policy 與權限。
2. 部署讀取新欄位並提供編輯頁的前端；舊前端可繼續只讀既有欄位。
3. 驗證 owner 可更新自己、不能更新他人，以及使用名稱衝突與非法顯示名稱均被資料庫拒絕。
4. 回滾前端不影響新增欄位；若確定不再使用本功能，可在後續 migration 移除 update policy、權限、約束與欄位，不修改既有 Auth Email。

## Open Questions

無；Email 已確定為唯讀，顯示名稱規則已確定為必填 2–30 個中文、英文字母或數字。
