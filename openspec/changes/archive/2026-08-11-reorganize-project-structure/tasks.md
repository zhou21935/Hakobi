## 1. 基準與分支

- [x] 1.1 依「搬移使用 Git 可追蹤的分段驗證」從最新 `main` 建立 `refactor/reorganize-project-structure`，記錄前端、後端及工具測試的檔案數與案例數基準，並以 `git status -sb`、`rg --files` 及三組既有測試輸出確認分支與 baseline 可供搬移後比較。

## 2. 前端元件與測試

- [x] 2.1 依「共用元件集中於 components common」交付 `Frontend components are grouped by reuse boundary`：將 `AppSidebar`、`StatusBadge` 集中至 `src/components/common/`，修正所有 runtime 與 test imports 且不保留相容副本；以 `rg` 確認舊路徑無引用，並以相關 component、view 與 App tests 驗證 UI 行為不變。
- [x] 2.2 依「測試依執行責任集中而不增加 unit integration 層級」將所有前端 `*.spec.js` 集中至 `tests/` 下的 `components`、`views`、`stores`、`domain`、`services`、`router`、`app`、`lib` 分類，統一使用 `@` alias 指向 `src/`；以搬移前後測試檔及案例數相等、`npm test` 全數通過、`src/**/__tests__/` 不存在，交付 `Tests are centralized by execution responsibility` 的前端部分。
- [x] 2.3 依「測試依執行責任集中而不增加 unit integration 層級」將 `scripts/__tests__/` 與 `scripts/deploymentConfig.spec.js` 集中至 `scripts/tests/`，更新 Vite include 與檔案定位，使部署測試從 repository root 穩定讀取 CI、Render 與文件；以 `npm test` 收集全部工具案例且不再收集舊路徑驗證。

## 3. 後端目錄與測試

- [x] 3.1 依「後端改名須同步所有操作與部署入口」將完整 `server/` package 搬為 `backend/`，保持 `backend/src/` runtime module topology、依賴與環境變數契約不變，交付 `Source code has explicit frontend and backend ownership`；以 `npm --prefix backend run typecheck`、`npm --prefix backend run build` 及 `rg` 確認 active code/config 不再依賴 `server/`。
- [x] 3.2 依「測試依執行責任集中而不增加 unit integration 層級」將後端 `*.test.ts` 集中至 `backend/tests/app`、`backend/tests/orders`、`backend/tests/config`、`backend/tests/migrations`，調整 Vitest 與 TypeScript 設定，使 typecheck 包含 tests、production build 排除 tests；以前後案例數相等、`npm --prefix backend test`、typecheck、build 全數通過且 `backend/src/**/*.test.ts` 不存在驗證。

## 4. 操作、部署與文件契約

- [x] 4.1 依「前端維持根目錄 package 並提供統一操作入口」在根目錄維持前端 `dev`、`test`、`build`，提供 `dev:backend`、`test:backend`、`typecheck:backend`、`build:backend`、`test:all`、`build:all`，交付 `Development and deployment entry points remain operational` 的本機介面；以逐一執行 test、typecheck 與 build commands 驗證退出碼皆為零。
- [x] 4.2 依「後端改名須同步所有操作與部署入口」更新 `.github/workflows/ci.yml` 的 backend working directory/cache lockfile、`render.yaml` 的 API `rootDir` 與部署設定 assertions，同時保持前端 CI 與 Render 從 repository root 執行；以工具測試及設定內容 assertions 驗證 CI/Render 不含 active `server` 路徑。
- [x] 4.3 交付 `Documentation uses canonical project paths`：更新 `README.md`、`docs/supabase-setup.md` 與其他 active 文件中的開發、測試、建置及環境檔指令，保留歷史 Spectra archives 不變；以 `rg` 排除 archive 後搜尋 `server/` 與舊測試路徑，並逐項確認文件命令對應實際檔案。

## 5. 完整驗證與範圍確認

- [x] 5.1 執行 `npm test`、`npm run test:backend`、`npm run typecheck:backend`、`npm run build`、`npm run build:backend`、部署驗證及 `spectra validate reorganize-project-structure`，比較搬移前後測試檔與案例數，確認 `Tests are centralized by execution responsibility`、`Development and deployment entry points remain operational` 全部成立，且 UI、API、Supabase migrations、依賴版本與 archived specs 均未產生範圍外變更。
