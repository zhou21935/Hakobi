## 1. 設定契約測試

- [x] 1.1 先新增會失敗的 `scripts/deploymentConfig.spec.js`，以檔案內容斷言 **Continuous integration validates both applications** 與 **GitHub Actions separates frontend and backend checks**：workflow 僅在 pull request／`main` push 觸發，frontend 執行 `npm ci`、`npm test`、`npm run build`，backend 在 `server/` 執行 `npm ci`、`npm test`、`npm run typecheck`、`npm run build`；以 `npm test -- scripts/deploymentConfig.spec.js` 確認設定尚未建立時測試失敗。
- [x] 1.2 擴充同一個失敗測試，斷言 **Render Blueprint defines the production topology**、**Render services expose deployable application behavior**、**Render Blueprint defines two main-branch services**、**Render waits for CI and checks API health** 與 **Static site rewrites client-side routes**：兩服務追蹤 `main` 且使用 `checksPass`、前端發布 `dist` 並 rewrite 至 `/index.html`、後端從 `server/` 建置啟動並檢查 `/health`；再次以 `npm test -- scripts/deploymentConfig.spec.js` 確認紅燈包含缺少 Blueprint 的原因。
- [x] 1.3 擴充同一個失敗測試，斷言 **Deployment configuration remains externalized** 與 **Deployment configuration is injected without repository secrets**：Blueprint 僅宣告六個必要變數名稱並以 `sync: false` 外部注入，且不要求人工設定 `PORT`；以 `npm test -- scripts/deploymentConfig.spec.js` 確認未實作前測試失敗且測試檔不含真實憑證。

## 2. CI 與 Render Blueprint

- [x] 2.1 建立 `.github/workflows/ci.yml`，交付彼此獨立的 frontend／backend checks 並精確執行設計指定的 locked install、測試、型別檢查與建置命令；以 `npm test -- scripts/deploymentConfig.spec.js` 驗證 CI 觸發條件與命令契約轉為通過。
- [x] 2.2 建立 `render.yaml`，交付從 `main` 且在 checks 通過後部署的 Vite static site 與 Fastify Web Service，包含 `dist` 發布、SPA rewrite、`server/` build/start、`/health` 及六個 `sync: false` 變數；以 `npm test -- scripts/deploymentConfig.spec.js` 驗證完整 Blueprint 契約通過。

## 3. 環境設定與操作文件

- [x] 3.1 更新 `.env.example` 與 `server/.env.example`，讓前端三個公開 build-time 變數及後端三個 runtime 變數皆有無秘密範例，且不把 Render 注入的 `PORT` 誤列為必填；以 `rg "VITE_SUPABASE_URL|VITE_SUPABASE_ANON_KEY|VITE_API_BASE_URL|SUPABASE_URL|SUPABASE_DB_URL|CORS_ORIGIN" .env.example server/.env.example` 及人工敏感值檢視驗證。
- [x] 3.2 更新 `README.md`，交付 Blueprint 建立、取得兩個服務 URL 後設定 `VITE_API_BASE_URL`／`CORS_ORIGIN`、六個變數用途、GitHub required checks、首頁／client route／`/health`／CORS 驗證及上一個 CI-passing commit 回復程序；以內容檢視逐項核對 **Deployment configuration remains externalized** 的新環境設定與異常回復情境。

## 4. 整合驗證

- [x] 4.1 執行 `npm test` 與 `npm run build`，確認前端既有測試、部署設定契約測試及 production build 全部成功，且 workflow／Blueprint 的實作未破壞使用者介面建置。
- [x] 4.2 在 `server/` 執行 `npm test`、`npm run typecheck` 與 `npm run build`，確認後端既有測試、型別與 production start artifact 全部成功，並人工確認 `/health` endpoint 仍符合 Render health check 契約。
- [x] 4.3 執行 `git diff --check`、`spectra analyze add-ci-and-render-deployment --json` 與 `spectra validate add-ci-and-render-deployment`，確認設定、文件與規格沒有格式錯誤、Critical／Warning 漂移或未涵蓋需求。
