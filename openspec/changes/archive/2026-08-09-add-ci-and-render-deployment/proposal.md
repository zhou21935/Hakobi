## Why

Hakobi 目前缺少自動化品質門檻與可重現的正式部署設定，程式推送後仍需手動確認前後端建置與部署。加入 GitHub Actions 與 Render Blueprint，可讓唯一的 `main` 分支在完整檢查通過後，自動部署前端與 API。

## What Changes

- 新增 GitHub Actions CI，在 pull request 與 `main` push 上分別驗證前端測試／建置及後端測試／型別檢查／建置。
- 新增 Render Blueprint，將 Vue/Vite 前端部署為 Static Site，將 Fastify 後端部署為 Web Service。
- Render 服務使用 `main` 分支並等待 GitHub CI checks 通過後才自動部署。
- 後端使用現有 `/health` 作為 Render HTTP health check。
- 前端加入 Vue Router SPA fallback rewrite，讓直接開啟非根路由仍回傳 `index.html`。
- 在部署文件中列出 Render 首次建立時必填的前端公開設定、後端秘密與跨服務 URL／CORS 設定。

## Non-Goals

- 不由 CI 自動執行 Supabase migration、database reset 或需要測試使用者密碼的遠端 CRUD 驗證。
- 不建立 staging 環境、preview database、自訂網域或 Docker image。
- 不將 Supabase database URL、使用者密碼或 deploy hook 寫入 repository。

## Capabilities

### New Capabilities

- `ci-render-deployment`: 定義 GitHub Actions 品質門檻、Render 前後端服務、CI gated deployment、SPA routing、health check 與部署環境設定。

### Modified Capabilities

(none)

## Impact

- Affected specs: ci-render-deployment
- Affected code:
  - New: .github/workflows/ci.yml
  - New: render.yaml
  - New: scripts/deploymentConfig.spec.js
  - Modified: README.md
  - Modified: .env.example
  - Modified: server/.env.example
  - Removed: none
- External systems: GitHub Actions, Render Static Site, Render Web Service, Supabase
