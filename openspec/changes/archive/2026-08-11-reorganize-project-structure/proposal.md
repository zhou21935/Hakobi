## Summary

將 Hakobi 的前端、後端、共用元件與測試檔案整理成一致且可辨識的專案結構，維持既有功能、建置與部署行為不變。

## Motivation

目前前端測試分散於多個 `__tests__` 目錄，後端正式碼與 `*.test.ts` 混放，且後端資料夾使用 `server`、共用元件與業務元件的分類不一致。隨功能增加，開發者需要反覆搜尋檔案位置，也容易在新增元件或測試時延續不同慣例。

## Proposed Solution

- 保留 Vue 前端於專案根目錄及 `src/`，不新增 `frontend/` 包裝層。
- 將 `src/components/AppSidebar.vue` 與 `src/components/StatusBadge.vue` 移至 `src/components/common/`，保留 `src/components/ui/` 與 `src/components/orders/`。
- 將所有前端測試集中至根目錄 `tests/`，依 `components`、`views`、`stores`、`domain`、`services`、`router`、`app` 與 `lib` 分類。
- 將 `server/` 改名為 `backend/`，維持 Fastify 模組結構，並將後端測試集中至 `backend/tests/`，依 `app`、`orders`、`config` 與 `migrations` 分類。
- 將部署與專案設定測試集中至 `scripts/tests/`，與前端、後端測試分離。
- 同步更新 import、Vite、Vitest、TypeScript、npm、CI、Render、部署驗證與文件路徑，使既有開發、測試、建置與部署命令維持可用。

## Non-Goals

- 不將前端移入 `frontend/`。
- 不導入 npm workspaces 或改用其他套件管理器。
- 不改變任何頁面、API、資料模型、Supabase migration 或業務行為。
- 不重寫元件、store、service 或後端模組的內部設計。
- 不移動 `supabase/`、`openspec/`、`docs/` 或根目錄部署設定。

## Alternatives Considered

- 將前端整包移至 `frontend/`：目錄最對稱，但會增加 Vite、Render、CI 與 npm 根路徑的變更，現階段收益不足。
- 保留測試與正式碼相鄰：搬移最少，但不符合集中管理前端與後端測試的目標。
- 導入 npm workspaces：可統一依賴管理，但會同時改變 lockfile 與安裝模型，超出純結構整理範圍。

## Capabilities

### New Capabilities

- `project-structure`: 定義前端、後端、共用元件及各類測試的標準位置，以及搬移後必須維持的開發、驗證與部署入口。

### Modified Capabilities

(none)

## Impact

- Affected specs: `project-structure`
- Affected code:
  - New: `src/components/common/AppSidebar.vue`, `src/components/common/StatusBadge.vue`, `tests/`, `backend/`, `backend/tests/`, `scripts/tests/`
  - Modified: `src/App.vue`, `src/router/index.js`, `src/views/AllOrders.vue`, `src/views/OrderList.vue`, `vite.config.js`, `package.json`, `.github/workflows/ci.yml`, `render.yaml`, `scripts/verify-supabase-deployment.mjs`, `README.md`, `docs/supabase-setup.md`
  - Removed: `src/components/AppSidebar.vue`, `src/components/StatusBadge.vue`, all frontend `src/**/__tests__/` directories, `server/`, `scripts/__tests__/`, `scripts/deploymentConfig.spec.js`
- External systems: Render service roots and GitHub Actions working directories change from `server` to `backend`; deployed behavior and environment variables remain unchanged.
