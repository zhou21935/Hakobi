## Context

登入狀態由 Auth store 非同步初始化。應用程式 shell 目前只監看 `isAuthenticated`，但重新整理時 session 還原與 `initialized` 完成是兩個相鄰狀態變化：session 先出現時因尚未 initialized 而不載入 profile，initialized 隨後完成又不會觸發只監看登入狀態的 watcher。側欄因 profile 持續為空而顯示 Auth Email fallback。

## Goals / Non-Goals

**Goals:**

- 在 Auth 初始化完成且 session 有效後載入一次擁有者會員資料。
- 讓重新整理或重新登入後的側欄在載入期間保留空白身份區，成功後直接顯示已儲存會員名稱，全程不閃現暫時文字。
- 將個人資料 username 欄位標籤統一為「會員名稱」。

**Non-Goals:**

- 不在 localStorage 或其他瀏覽器儲存空間快取會員資料。
- 不調整 Supabase 查詢、RLS、會員名稱格式或載入錯誤策略。
- 不將真實姓名改成側欄主要識別文字。

## Decisions

### 同時監看初始化與登入狀態

應用程式 shell 以 `initialized` 與 `isAuthenticated` 的組合狀態決定何時載入 orders 與 profile。只有兩者皆為 true 且 profile 尚未存在、也未在載入時才呼叫 `loadProfile`，沿用既有防重條件。替代方案是在 Auth store 的 `initialize` 內直接載入 profile，但這會把 UI 所需資料請求耦合進 session 基礎設施並改變 store 責任。

### 載入期間保留空白身份區

profile 尚未載入且沒有載入錯誤時，應用程式把側欄標示為 identity loading。側欄保留原身份列高度，但該列不渲染「會員」、Email 或其他可見身份文字；只有 profile 載入失敗時才顯示 Email，成功時則直接顯示 reactive profile username。使用明確 loading prop 能區分「正在等待資料」與一般缺少 identity 的狀態，避免讓空字串同時代表多種語意。

### 個人資料採用會員名稱標籤

只把 username 輸入欄位的可見標籤從「會員使用名稱」改成「會員名稱」，保留欄位名稱、資料形狀、驗證與 autocomplete，避免純文案修改擴大成資料模型變更。

## Implementation Contract

- Behavior：重新整理或重新登入並建立有效 session 時，Auth 初始化完成後呼叫一次既有 `loadProfile`；等待期間側欄保留身份列高度但沒有可見身份文字，成功後直接顯示 profile username。
- Interface：`AppSidebar` 接收明確的 Boolean identity loading 狀態；true 時身份列為空且保持既有高度，false 時使用 username、失敗 Email fallback 或既有中性 fallback。
- Initialization boundary：initialized 為 false 時不得啟動 profile 或 orders 載入；profile 已存在或 profileLoading 為 true 時不得重複查詢。
- Failure mode：profile 查詢失敗後才啟用安全 Email fallback，並沿用非敏感錯誤與重試控制，不保留另一位會員的 username。
- Presentation：個人資料頁 username 輸入欄位的標籤必須是「會員名稱」，內部欄位仍為 `username`。
- Acceptance：App、AppSidebar 與 Profile 的 Vitest 先重現初始化時序、無暫時身份文字與標籤失敗再轉為通過，完整 `npm test -- --run` 與 `npm run build` 通過。
- In scope：應用程式 shell 的初始化監看、個人資料標籤及相關測試。
- Out of scope：後端、資料庫、Auth provider 設定、會員資料欄位與驗證規則。

## Risks / Trade-offs

- [組合 watcher 在多個狀態連續更新時重複執行] → 沿用 initialized、profile、profileLoading 與 orders loading 防重條件，並以呼叫次數測試鎖定。
- [測試直接改 mock 狀態但不是 reactive，無法重現時序] → 使用 Vue reactive mock state，明確模擬 session 先恢復、initialized 後完成的重新整理流程。
- [以中性「會員」取代 Email 仍會造成暫時文字閃現] → loading 階段保留空白身份列，成功或失敗後才顯示穩定身份。
- [空白身份列可能造成 footer 高度跳動] → 保留身份列既有行高與 margin，只隱藏 loading 階段的文字內容。
