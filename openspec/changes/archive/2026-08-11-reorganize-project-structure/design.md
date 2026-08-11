## Context

Hakobi 是同一 repository 內的 Vue/Vite 前端、Fastify 後端、Supabase migrations 與部署工具。前端目前以根目錄為 package root，後端位於 `server/` 且有獨立 package。前端測試分散於 `src/**/__tests__/`，後端測試與正式碼共置於 `server/src/`，工具測試同時出現在 `scripts/__tests__/` 與 `scripts/deploymentConfig.spec.js`。本次整理跨越原始碼、測試、CI、Render、TypeScript、Vitest、npm scripts 與文件，必須以可回復的分階段搬移維持所有入口可用。

## Goals / Non-Goals

**Goals:**

- 讓前端正式碼維持在根目錄 `src/`，避免無必要的 package root 搬移。
- 以 `common`、`orders`、`ui` 清楚區分共用、業務與基礎 UI 元件。
- 將前端、後端及工具測試分別集中於 `tests/`、`backend/tests/`、`scripts/tests/`。
- 將後端 package 從 `server/` 改名為 `backend/`。
- 保持既有前端、後端、完整專案驗證、CI 與 Render 部署結果等價。

**Non-Goals:**

- 不建立 `frontend/`。
- 不導入 npm workspaces、不合併 lockfile、不改套件管理器。
- 不變更 UI、API、驗證規則、資料庫 schema、環境變數名稱或部署服務名稱。
- 不因搬移而重構 feature module、store、repository 或 service 邊界。

## Decisions

### 前端維持根目錄 package 並提供統一操作入口

根目錄繼續擁有前端依賴、Vite 設定與預設 `dev`、`test`、`build` 指令，避免改動靜態站點 root。另提供明確的 backend 與 all scripts，讓開發者可在根目錄執行前端、後端或完整驗證。替代方案是建立 `frontend/` 或 npm workspaces；兩者都會擴大依賴與部署遷移面，故不採用。

### 共用元件集中於 components common

`AppSidebar` 與 `StatusBadge` 是跨頁面或跨功能使用的應用元件，移至 `src/components/common/`；基礎視覺元件留在 `src/components/ui/`，訂單專屬元件留在 `src/components/orders/`。不導入新的 feature-based 架構，避免同時搬動 views、stores 與 services。

### 測試依執行責任集中而不增加 unit integration 層級

前端測試集中至根目錄 `tests/`，以來源責任分類；後端測試集中於 `backend/tests/`；部署與設定測試集中於 `scripts/tests/`。不增加 `unit/` 與 `integration/` 中間層，因目前檔案數量不足以抵銷額外巢狀結構。前端測試使用既有 `@` alias 匯入 `src/`，後端測試使用穩定的相對路徑或 Vitest 可解析的明確 alias，避免搬移後的深層脆弱 import。

### 後端改名須同步所有操作與部署入口

`server/` 以完整目錄搬移為 `backend/`，同步修改 GitHub Actions working directory 與 cache lockfile、Render `rootDir`、根目錄 npm scripts、README、Supabase setup 文件及部署設定 assertions。`backend/src/` 的 runtime module topology 保持不變。

### 搬移使用 Git 可追蹤的分段驗證

先建立獨立 refactor 分支並更新設定契約，再使用 Git 可辨識的移動完成元件、測試與後端目錄遷移。每一組搬移後立即修正 import 並執行對應測試；最後執行前後端全部測試、typecheck、build、部署設定測試與 Spectra validation。若中途失敗，回復該組尚未提交的搬移，不影響已確認的前一組。

## Implementation Contract

**Behavior:** 使用者看到的頁面、路由、會員與訂單流程保持不變；API endpoint、回應、資料庫 migration 與環境變數契約保持不變。開發者可從根目錄啟動前端，並透過明確的 backend scripts 啟動、測試、typecheck 與建置後端。

**Directory interface:**

- 前端正式碼位於 `src/`，前端測試只位於 `tests/`。
- 共用應用元件位於 `src/components/common/`，基礎 UI 位於 `src/components/ui/`，訂單元件位於 `src/components/orders/`。
- 後端正式碼位於 `backend/src/`，後端測試只位於 `backend/tests/`。
- 部署與專案設定測試只位於 `scripts/tests/`。
- Supabase migrations 保持位於 `supabase/migrations/`。

**Command interface:** 根目錄既有 `npm run dev`、`npm test`、`npm run build` 保持前端語意；新增或統一 `dev:backend`、`test:backend`、`typecheck:backend`、`build:backend`、`test:all` 與 `build:all`。`backend/package.json` 保持 `dev`、`test`、`typecheck`、`build` 與 `start`。

**Failure modes:** 任一搬移造成 unresolved import、測試未被 Vitest 收集、TypeScript 將測試輸出至 `dist`、CI cache 找不到 lockfile、Render service root 無效，皆視為實作失敗，不得以跳過測試、放寬 include 或保留重複舊檔修補。

**Acceptance criteria:** 前端 Vitest 只從 `tests/**/*.spec.js` 與 `scripts/tests/**/*.spec.js` 收集預期檔案；後端 Vitest 只從 `backend/tests/**/*.test.ts` 收集預期檔案；前端與後端測試、後端 typecheck、兩端 build、部署驗證與 Spectra validation 全部成功；repository 不再保留 `server/`、前端 `src/**/__tests__/` 或後端 `backend/src/**/*.test.ts`。

**Scope boundaries:** 本次只處理檔案位置、import 與工具設定；不修改產品行為、測試案例的業務 assertions 或依賴版本，除非為支援新路徑所必需。

## Risks / Trade-offs

- [大量搬移使 import 遺漏] → 以分類分批搬移，使用 `rg` 搜尋舊路徑並在每批後執行對應測試。
- [Vitest 顯示成功但漏收測試] → 搬移前後比較測試檔數與執行案例數，並加入測試路徑設定 assertions。
- [後端 tests 位於 rootDir 外造成 TypeScript 錯誤] → `tsconfig.json` 負責 src 與 tests typecheck，`tsconfig.build.json` 明確以 `backend/src` 為 root 且排除 tests。
- [Render 路徑錯誤只在部署時出現] → 更新並執行部署設定測試，驗證 backend `rootDir` 與前端根目錄維持不變。
- [集中測試使來源對應較不直觀] → 測試子目錄沿用正式碼責任名稱，檔名保持與被測模組一致。

## Migration Plan

1. 從最新 `main` 建立 `refactor/reorganize-project-structure`。
2. 更新測試、TypeScript、npm、CI、Render 與部署驗證設定，使目標路徑有明確契約。
3. 搬移共用前端元件並修正 imports。
4. 搬移前端及工具測試，確認 Vitest 收集數不減少。
5. 將 `server/` 搬為 `backend/`，再將後端測試移出 `backend/src/` 並修正 imports。
6. 更新文件中所有舊路徑，搜尋並消除非歷史文件中的 `server/` 與舊測試位置。
7. 執行完整驗證、提交功能重構、封存 Spectra change、合併 `main`、推送並刪除分支。

回復策略：在尚未合併前以 Git rename history 將整個 refactor commit revert；資料庫與外部狀態未變更，不需要資料回復。

## Open Questions

無；前端保持根目錄、測試不增加 unit/integration 層級、Supabase 保持根目錄均已確定。
