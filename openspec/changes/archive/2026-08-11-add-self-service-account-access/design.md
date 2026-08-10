## Context

Hakobi 是 Vue 單頁應用，直接透過 Supabase JavaScript client 管理 Email／密碼 session，Fastify 後端只驗證 Supabase JWT 並提供受保護的訂單 API。目前只有登入與登出，沒有公開註冊、Email confirmation、會員資料或密碼復原。這次變更跨越前端路由與狀態、Supabase Auth 設定、Postgres migration、Email redirect 及正式 SMTP，因此需要先固定安全邊界與資料生命週期。

## Goals / Non-Goals

**Goals:**

- 任何人可用 Email、唯一會員使用名稱與符合規則的密碼自行註冊。
- Email 未驗證前不建立可使用受保護訂單功能的 session；點擊有效驗證連結後自動進入訂單頁。
- 會員可重寄驗證信、申請密碼重設信並設定符合相同規則的新密碼。
- 使用名稱以資料庫正規化唯一鍵作最終一致性保證，登入後可可靠顯示。
- 註冊、登入、驗證及復原流程提供不洩漏帳號存在性的安全錯誤訊息。
- 開發、測試與正式環境有明確 redirect URL、Email template、SMTP 與 migration 部署方式。

**Non-Goals:**

- 第三方登入、使用名稱登入、MFA、角色權限及管理員會員後台。
- 個人資料編輯、變更 Email、刪除帳號或人工審核。
- 修改 Fastify 訂單 API 的 JWT 契約或新增自製密碼儲存。

## Decisions

### 使用 Supabase Auth 完成 Email confirmation 與帳號復原

註冊呼叫 Supabase signUp，傳入 Email、密碼、會員使用名稱 metadata 及驗證 callback URL。Hosted Supabase 必須啟用 Confirm Email；成功註冊但尚未驗證時不接受為可用 session。驗證連結導回公開的 `/verify-email`，由 Supabase client 處理 implicit callback/session，畫面確認 session 與 `email_confirmed_at` 後導向 `/orders`。重寄使用 signup resend；忘記密碼使用 reset-password Email，並導回 `/reset-password` 後以 recovery session 呼叫 updateUser。

選擇 Supabase 內建 Token 而非自建驗證碼表，因為現有 session 已由 Supabase 管理，可避免重複實作 Token 產生、期限、單次使用與密碼雜湊。Email callback URL 必須列入允許清單；錯誤或過期 callback 留在公開結果頁，不建立受保護 session。

### 以 member_profiles 與正規化唯一鍵保存會員使用名稱

新增 `public.member_profiles`：`user_id uuid primary key references auth.users(id) on delete cascade`、`username text not null`、`username_normalized text not null unique`、建立與更新時間。正規化使用 trim 後的 Unicode 小寫結果；顯示欄保存原始大小寫。格式為 3–20 個 Unicode 字元，只接受 Han 字元、ASCII 英文字母、數字與底線。

註冊先呼叫唯讀 availability RPC 提供即時提示，最後仍由唯一索引防止競態。`auth.users` insert trigger 從 `raw_user_meta_data.username` 驗證並建立 profile；格式錯誤或唯一衝突使建立帳號交易失敗。若 signUp 回傳資料庫建立錯誤，前端重新查詢名稱 availability；已被占用時固定顯示「此名稱已被使用」，其他錯誤顯示一般註冊失敗。profile 啟用 RLS，會員只能讀取自己的完整 profile；公開 RPC 只回傳 availability boolean。

選擇獨立 profile table 而非只依賴 user metadata，因為 metadata 無法提供可靠的 case-insensitive unique constraint，也不適合作為後續會員資料的查詢來源。

### 共用帳號驗證規則並由 Supabase 提供密碼基線

新增純函式帳號驗證模組供註冊與重設密碼共用。密碼必須為 8–64 字元、至少一個 ASCII 英文字母與一個數字、無 Unicode 或 ASCII 空白、不與正規化使用名稱相同，且不得命中 case-insensitive 弱密碼集合 `password`、`password123`、`12345678`、`qwerty123`、`admin123`。確認密碼必須完全相同。

Supabase Auth 設定 minimum length 8 並要求 letters and digits，提供直接 API 層的基線保護；應用層另外執行 64 字元上限、空白、使用名稱比較與專案弱密碼集合。密碼只傳給 Supabase Auth，Hakobi database、store、log 與錯誤訊息均不保存或輸出明文。

### 公開帳號路由與原始目的地導向

新增 `/register`、`/verify-email`、`/forgot-password`、`/reset-password` 公開路由。一般已登入會員進入 login、register 或 forgot-password 時導向 `/orders`；reset-password 僅在有效 recovery session 存在時允許設定密碼。受保護頁將原始 fullPath 放入 `redirect`，登入成功後只接受站內、以單一 `/` 開頭且不以 `//` 開頭的路徑，無效值回退 `/orders`，避免 open redirect。

App shell 在 authenticated session 後載入自己的 profile 與 orders；登出或 401 同時清除兩者。側邊欄顯示已確認 profile 的使用名稱，profile 暫時載入失敗時顯示 Email 的安全替代文字且提供可重試錯誤，不阻擋已驗證 session 的訂單操作。

### 使用不洩漏帳號存在性的 Email 回應

忘記密碼送出後，不論 Email 是否存在都顯示相同成功文案。重寄驗證信同樣使用中性送出結果；Supabase rate limit 錯誤顯示稍後再試，不揭露 Email 是否已註冊。使用名稱是產品識別名稱，因此 availability 可明確回傳已使用；這項可枚舉性是唯一名稱需求的刻意取捨。

## Implementation Contract

- **註冊介面**：`auth.signUp({ email, username, password })` 只接受通過共用驗證的資料，對 Supabase 傳送 `options.data.username` 與環境對應的 Email callback。成功後清除密碼欄位並前往驗證等待狀態，不把未驗證 user 視為 authenticated。
- **會員資料介面**：auth store 暴露 `profile`、`profileLoading`、`profileError`、`checkUsernameAvailability(username)` 與 `loadProfile()`；profile shape 至少包含 `{ userId, username }`。任何 session owner 只能取得自己的 profile。
- **驗證介面**：`/verify-email` 區分處理中、成功、無效／過期與可重寄狀態；有效 callback 建立 session 後導向 `/orders`，失敗不得顯示受保護 App shell。
- **復原介面**：forgot-password 對所有格式正確 Email 顯示相同送出結果；`/reset-password` 只有 recovery session 可提交，成功後撤銷復原狀態並導向登入或 orders，無效／過期連結顯示重新申請操作。
- **錯誤介面**：使用名稱衝突固定顯示「此名稱已被使用」；密碼驗證錯誤綁定密碼欄位；Supabase rate limit 與網路錯誤使用可重試訊息；畫面與 log 不輸出 Token、密碼或 Supabase 原始敏感錯誤。
- **驗收**：以 domain tests 覆蓋 username/password 邊界表，以 store/view/router tests 覆蓋註冊、Email callback、重寄、復原、redirect 防護與 session 清理；migration tests 驗證 profile schema、RLS、trigger、unique normalization 與 availability RPC；執行前端測試與 build、server tests/typecheck/build、Spectra validate。
- **範圍內**：提案所列五個 capabilities、Supabase migration/Auth 設定、公開帳號頁與會員名稱顯示。
- **範圍外**：第三方登入、使用名稱登入、Fastify 會員 API、付費 Supabase leaked-password protection、會員資料編輯及角色系統。

## Risks / Trade-offs

- [使用名稱預檢與實際註冊間存在競態] → 唯一索引與 auth trigger 作最終裁決，失敗後重查 availability 並顯示固定衝突訊息。
- [Supabase 內建測試寄信有低 rate limit 與交付不保證] → 正式環境切換自有 SMTP，部署檢查包含註冊、重寄與復原信件。
- [應用層的 64 字元、名稱比較與小型黑名單可被直接呼叫 Supabase API 繞過] → Supabase 強制 8 字元及 letters+digits 作平台基線；文件記錄額外規則屬 Hakobi client contract，若未來需要 hostile-client 強制則另案導入合適 Auth hook／受信任註冊服務。
- [Email callback fragment 或錯誤可能殘留瀏覽器網址] → callback 處理完成後以 router replace 清除敏感參數，測試確認錯誤畫面不重印原始 fragment。
- [Email 驗證與 profile 載入完成順序不同] → profile 由 auth user 建立 trigger 原子建立，App shell 額外提供 loading/error fallback，不以空字串冒充使用名稱。

## Migration Plan

1. 建立 member profile table、格式／唯一 constraint、RLS、availability RPC 與 auth user trigger，先在測試 Supabase 套用並驗證兩個並行相同名稱只有一個成功。
2. 在 Supabase Auth 設定啟用公開 signup、Confirm Email、minimum length 8、letters+digits，加入本機與正式 callback allowlist。
3. migration 對既有缺少 profile 的 Auth user，以 Email local-part 清理成合法基底後加上 UUID 前 8 碼建立 deterministic unique username；完成 orphan count 為零的驗證後，才部署公開帳號路由與 store 並開放新註冊入口。
4. 正式環境配置 SMTP 與 Email templates，端到端驗證註冊、重寄與復原。
5. 回滾以前向 migration 停用新入口與 trigger；保留 auth users/profile 資料，不重設遠端資料庫。若需要移除 schema，另建經審查的 migration。

## Open Questions

無。既有 Auth users 的 profile 補建格式、Email 驗證後自動登入及弱密碼執行邊界均已在 Decisions 與 Migration Plan 固定。
