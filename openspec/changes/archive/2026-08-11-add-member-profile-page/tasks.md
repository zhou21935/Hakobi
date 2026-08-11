## 1. 資料模型與驗證契約

- [x] 1.1 依「以 member_profiles 保存可編輯欄位並由 Auth session 提供唯讀 Email」新增 additive migration：以「會員」回填並建立 `display_name` non-null、2–30 字元及僅中文／ASCII 英數 check constraints，確保新 profile 同樣取得合法初始值，交付 `Member display names have a constrained non-unique format`；以 `server/src/migration.test.ts` 的欄位、backfill、boundary 與非法字元 assertions 驗證。
- [x] 1.2 依「由資料庫約束與 owner-update RLS 作為最終安全邊界」授予 authenticated owner 對自身 profile 的 update 能力，以 `USING` 與 `WITH CHECK` 阻止跨會員更新且不開放 insert/delete，並保留 username normalized unique constraint 為競態最終裁決；以 `server/src/migration.test.ts` 的 owner update、other-user rejection、unique collision 與 privilege assertions 驗證。
- [x] 1.3 在 `src/domain/accountValidation.js` 建立 display-name 純驗證契約，讓 2–30 個中文／ASCII 英數通過，空值、空白、底線、連字號、標點與 Emoji 失敗，且不改變既有 username 規則；以 `src/domain/__tests__/accountValidation.spec.js` 的規格 boundary table 驗證 `王小明`、`Hakobi01`、`王小明88` 及所有拒絕案例。

## 2. 會員資料狀態與更新

- [x] 2.1 依「在既有 auth store 集中會員資料載入與更新」擴充 profile shape 為 `{ userId, username, displayName }`，讓 `loadProfile()` 載入新欄位，並新增 owner-scoped `updateProfile()` 驗證與 mutation；成功後才同步 confirmed profile，unique violation 固定回報「此名稱已被使用」，其他失敗使用非敏感訊息且不清除草稿所需資料，交付 `Members can update only their owned editable profile fields`；以 `src/stores/__tests__/auth.spec.js` 驗證 payload 不含 Email、normalized username、成功同步、衝突、一般失敗、logout 與 user switch 清理。

## 3. 個人資料頁與導覽

- [x] 3.1 依「表單只在成功回應後更新全域會員資料」建立 `src/views/Profile.vue`：呈現載入中、載入失敗與重試，提供 username/displayName 草稿與唯讀 session Email，欄位錯誤不送 mutation、送出期間防重複、成功顯示訊息並重設 dirty 狀態、失敗保留草稿，交付 `Authenticated members can view their personal profile` 與更新流程；以 `src/views/__tests__/Profile.spec.js` 驗證 loading、retry、readonly Email、validation、pending、success、username conflict、generic failure 及未確認資料不污染 sidebar state。
- [x] 3.2 依「以獨立會員導覽區段呈現個人資料入口」註冊受保護 `/profile` route，並在側邊欄訂單分類後新增「會員／個人資料」入口，維持 active style 與行動版點擊收合；以 `src/router/__tests__/authGuard.spec.js` 驗證匿名 safe redirect 與已驗證會員存取，以 `src/components/__tests__/AppSidebar.spec.js` 驗證區段位置、連結、active state 與 close event。
- [x] 3.3 依「以獨立會員導覽區段呈現個人資料入口」及 `Authenticated members can view their personal profile` 精簡會員介面：從 `src/views/Profile.vue` 移除「查看並更新你的會員識別資料」、將 `display_name` 輸入標籤改為「真實姓名」，並在 `src/components/AppSidebar.vue` 將頁尾會員使用名稱置中且保留 truncate；以 `src/views/__tests__/Profile.spec.js` 與 `src/components/__tests__/AppSidebar.spec.js` 驗證文案不存在、標籤正確及會員名稱具置中樣式。

## 4. 整合驗證

- [x] 4.1 驗證 App session coordination 能讓直接進入 `/profile` 的會員取得 owned profile，儲存成功後側邊欄立即顯示 confirmed username，載入或儲存失敗不顯示其他會員資料；以 `src/__tests__/App.spec.js` 補齊整合案例，並執行 `npm test`、`npm --prefix server test`、`npm --prefix server run typecheck`、`npm run build`、`npm --prefix server run build` 與 `spectra validate add-member-profile-page`，確認 Goals / Non-Goals 的帳號安全、Fastify API、圖片及 Email 寫入均未進入實作範圍。
