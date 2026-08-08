## Context

Hakobi 目前以前端 Vue/Vite 應用程式與 `server/` 內的 Fastify API 組成，程式碼統一由 `main` 維護，但尚未具備一致的合併前檢查與可重現的部署宣告。此變更會同時影響 GitHub Actions、兩個 Node.js 專案、Render 服務設定與操作文件，因此需要明確定義跨服務契約。部署所需的 Supabase 與跨來源設定屬於敏感或環境相依資料，不得寫入版本庫。

## Goals / Non-Goals

**Goals:**

- 對 `main` 的 pull request 與 push 自動執行前端及後端的安裝、測試與建置檢查。
- 以單一 Render Blueprint 宣告前端靜態網站與後端 Web Service，兩者皆追蹤 `main`，且只在 CI checks 通過後自動部署。
- 透過 `/health` 檢查後端服務是否可接收流量，並讓前端 client-side routes 回寫至 `index.html`。
- 清楚文件化 Render 建立服務、環境變數、首次部署與回復方式。

**Non-Goals:**

- 不在 CI 或 Render 部署期間自動執行 Supabase migration、資料庫重設或遠端 CRUD 驗證。
- 不建立 staging、preview database、自訂網域或 Docker 部署流程。
- 不由版本庫保存任何 Supabase URL、資料庫連線字串、API key 或部署憑證。
- 不在此變更中透過使用者的 Render 帳號建立實際服務；交付物是可由操作者套用的 Blueprint 與操作說明。

## Decisions

### GitHub Actions separates frontend and backend checks

CI 使用同一個 workflow 中彼此獨立的 frontend 與 backend jobs。前端依序執行 `npm ci`、`npm test`、`npm run build`；後端在 `server/` 工作目錄依序執行 `npm ci`、`npm test`、`npm run typecheck`、`npm run build`。兩個 job 都在 `pull_request` 與推送至 `main` 時執行，讓失敗範圍可直接辨識，亦可平行縮短等待時間。

替代方案是只建立單一 job 串行檢查兩個專案，但任一階段失敗會延後另一端的結果，也不利於將 GitHub branch protection 的 required checks 分開設定，因此不採用。

### Render Blueprint defines two main-branch services

根目錄 `render.yaml` 宣告一個 Vite static site 與一個以 `server/` 為 root directory 的 Node Web Service。靜態網站建置產物為 `dist`；後端建置後以既有 `npm start` 啟動。兩個服務皆明確指定 `main`，避免已移除的 `dev` 再成為部署來源。

替代方案是從 Render Dashboard 個別建立服務，但設定無法隨程式碼審查與版本化，重建環境也較容易產生漂移，因此不採用。

### Render waits for CI and checks API health

兩個服務使用 `autoDeployTrigger: checksPass`，避免 GitHub Actions 尚未成功的 commit 自動上線。後端設定 `/health` 為 health check path，由現有 Fastify endpoint 回傳成功狀態；Render 只有在服務健康時才視部署為可用。

替代方案是每次 commit 立即部署或完全停用自動部署。前者可能部署未通過檢查的版本，後者增加人工操作且容易遺漏，因此不採用。

### Deployment configuration is injected without repository secrets

Blueprint 只列出變數名稱並以 `sync: false` 要求操作者在 Render 設定值。前端需要 `VITE_SUPABASE_URL`、`VITE_SUPABASE_ANON_KEY`、`VITE_API_BASE_URL`；後端需要 `SUPABASE_URL`、`SUPABASE_DB_URL`、`CORS_ORIGIN`。`PORT` 由 Render 注入，不列為人工設定。`.env.example` 與 `server/.env.example` 只保留無敏感資訊的範例與說明。

替代方案是將值寫在 Blueprint 或 GitHub secrets 再轉送至 Render；前者會洩漏秘密，後者增加不必要的同步管道，因此不採用。

### Static site rewrites client-side routes

靜態網站加入 `/*` 到 `/index.html` 的 rewrite，確保使用者直接載入 Vue Router 路徑或重新整理時仍由前端路由處理，而非收到 Render 404。

替代方案是僅支援根路徑，但這會讓 client-side routing 在直接造訪時失效，因此不採用。

## Implementation Contract

- GitHub Actions workflow 必須在 `pull_request` 與 `main` push 觸發，且 frontend、backend 任一命令回傳非零狀態時，對應 check 必須失敗並阻止 checks-pass 部署。
- frontend job 必須使用專案根目錄 lockfile 執行安裝、測試與 production build；backend job 必須使用 `server/package-lock.json` 執行安裝、測試、型別檢查與建置。
- `render.yaml` 必須可描述兩個服務：前端從根目錄建置並發布 `dist`；後端以 `server/` 為根目錄建置、用 `npm start` 啟動並由 `/health` 接受健康檢查。兩者的 branch 均為 `main`，自動部署條件均為 GitHub checks 通過。
- 前端環境變數在 Vite build 時提供；後端環境變數在服務啟動時提供。缺少必要值時沿用應用程式既有的明確失敗行為，不以預設秘密或靜默 fallback 代替。
- README 必須列出 Render Blueprint 建立流程、六個環境變數的用途、前後端 URL 互相設定的順序、GitHub required checks 建議，以及重新部署上一個成功 commit 的回復方式。
- 自動化設定的驗收包含：前端與後端既有測試、型別檢查與建置皆通過；針對 workflow 與 Blueprint 的設定契約測試可辨識觸發分支、命令、服務類型、部署條件、health check、SPA rewrite 與環境變數名稱；`spectra validate` 通過。
- 範圍內包含 CI、Blueprint、環境變數範例及部署文件。範圍外包含實際建立 Render 帳號資源、寫入真實秘密、修改資料庫 schema、執行 production migration 與設定自訂網域。

## Risks / Trade-offs

- [Render Blueprint 欄位或免費方案行為變更] → 依 Render Blueprint 規格撰寫，並以設定契約測試鎖定本專案依賴的欄位。
- [前端 API URL 與後端 CORS origin 形成首次設定順序] → README 明確要求先建立 Blueprint 取得服務 URL，再填入互相依賴的值並重新部署。
- [checksPass 需要 GitHub checks 與 Render repository integration 正常連結] → 文件加入整合與 required checks 檢查清單；連結失敗時由操作者在 Render 查看部署事件。
- [CI 與 Render 重複執行安裝及建置，增加時間] → 保留此重複以確保部署環境自行產生可驗證成品；CI jobs 彼此獨立執行以減少總等待時間。
- [純文字設定契約測試無法完整取代 Render schema 驗證] → 測試涵蓋本專案的必要契約，實際 Blueprint 建立時仍由 Render 做最終 schema 驗證。

## Migration Plan

1. 合併 CI workflow 與 Blueprint 至 `main`，確認 GitHub Actions 的 frontend、backend checks 成功。
2. 在 Render 連結 GitHub repository 並從 `render.yaml` 建立 Blueprint。
3. 輸入 Supabase 相關變數，待 Render 分配前後端 URL 後設定 `VITE_API_BASE_URL` 與 `CORS_ORIGIN`，再重新部署兩個服務。
4. 驗證靜態網站首頁與 client-side route、後端 `/health`，以及瀏覽器對 API 的跨來源請求。
5. 若部署失敗，保留上一個成功部署提供服務，修正設定後重試；若新版本行為異常，於 Render 重新部署上一個已通過 CI 的 commit。

## Open Questions

無。服務顯示名稱可在套用 Blueprint 時由操作者依 Render 帳號內的命名可用性調整，不改變部署契約。
