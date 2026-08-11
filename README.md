# Hakobi

訂單 / 預購管理系統。使用 Vue 3 + Vite 建置，透過 Pinia 管理訂單狀態，以 Tailwind CSS 打造介面。

## 技術棧

- [Vue 3](https://vuejs.org/)（`<script setup>` SFC）
- [Vite](https://vite.dev/)
- [Vue Router](https://router.vuejs.org/)
- [Pinia](https://pinia.vuejs.org/)（含 `pinia-plugin-persistedstate`）
- [Tailwind CSS](https://tailwindcss.com/)

## 開發

```sh
npm install
npm run dev       # 啟動開發伺服器
npm run build     # 建置正式版本
npm run preview   # 預覽建置結果
npm test          # 執行測試（Vitest）
```


## 後端

後端位於 `backend/`，提供公開 `GET /health` 及受 Supabase access token 保護的 `/api/orders` CRUD API。

```sh
npm --prefix backend install
cp backend/.env.example backend/.env
npm run dev:backend
npm run test:backend
npm run typecheck:backend
npm run build:backend
```

設定與 owner/cross-owner 驗證步驟見 [`docs/supabase-setup.md`](docs/supabase-setup.md)。

前端需由 `.env.example` 設定 Supabase Project URL、anonymous publishable key 與 API base URL。部署 migration 後，以 `npm run verify:deployment` 驗證 health、訂單 CRUD 與兩使用者資料隔離；遠端環境禁止執行 database reset。

## CI 與 Render 部署

GitHub Actions 會在每個 pull request 與推送至 `main` 時執行兩個獨立 check：

- `Frontend`：locked dependency install、前端測試與 production build。
- `Backend`：locked dependency install、後端測試、TypeScript typecheck 與 production build。

建議在 GitHub 的 `Settings > Branches > Branch protection rules` 保護 `main`，開啟合併前必須通過 status checks，並將 `Frontend`、`Backend` 設為 required checks。Render 的兩個服務亦使用 `checksPass`，只有連結 commit 的 GitHub checks 全數通過後才自動部署。

### 由 Blueprint 建立 Render 服務

1. 先在 Render 連結此 GitHub repository，選擇 **New > Blueprint**，並指定根目錄的 `render.yaml`。
2. 在 Blueprint 預覽確認 static site `hakobi-web` 與 Web Service `hakobi-api` 的可用名稱及預期公開 URL。若名稱已被使用，依 Render 提示調整名稱，並以實際 URL 填寫下列跨服務變數。
3. 在建立畫面輸入六個 `sync: false` 環境變數。所有值只存於 Render，不要提交真實值到 `.env.example`、`backend/.env.example` 或 `render.yaml`。
4. 建立服務後再次核對 Render 分配的公開 URL：前端的 `VITE_API_BASE_URL` 必須等於後端 origin，後端的 `CORS_ORIGIN` 必須等於前端 origin。若實際 URL 與建立時預期不同，修正變數並手動重新部署兩個服務。

| Render 服務 | 變數 | 用途 |
| --- | --- | --- |
| `hakobi-web` | `VITE_SUPABASE_URL` | 瀏覽器可見的 Supabase Project URL |
| `hakobi-web` | `VITE_SUPABASE_ANON_KEY` | 瀏覽器可見的 anonymous publishable key；不可使用 service-role key |
| `hakobi-web` | `VITE_API_BASE_URL` | Fastify API 的 HTTPS origin，例如 `https://hakobi-api.onrender.com` |
| `hakobi-api` | `SUPABASE_URL` | 後端驗證 access token 使用的 Supabase Project URL |
| `hakobi-api` | `SUPABASE_DB_URL` | 後端專用 PostgreSQL 連線字串；不得加上 `VITE_` 前綴 |
| `hakobi-api` | `CORS_ORIGIN` | 唯一允許的前端 HTTPS origin，例如 `https://hakobi-web.onrender.com` |

`PORT` 由 Render 自動注入，不要在 Blueprint 中自行設定。Vite 的三個變數會在 static site build 時嵌入前端 bundle；修改後必須重新部署前端。後端三個變數則在 Web Service 啟動時讀取，缺值或格式錯誤會讓服務明確啟動失敗。

### 上線驗證

部署成功後依序確認：

1. 開啟 static site 首頁，確認頁面可載入並可登入。
2. 直接開啟一個 Vue Router client-side route 並重新整理，確認仍回傳應用程式而非 404。
3. 請求 `https://<backend-host>/health`，確認 HTTP 200 且回傳 `{"status":"ok"}`。
4. 從前端執行訂單讀取，確認瀏覽器沒有 CORS 錯誤；若失敗，核對 `VITE_API_BASE_URL` 與 `CORS_ORIGIN` 是否使用完整、無尾端路徑的 HTTPS origin。

CI 與 Render 部署不會自動執行 Supabase migration、database reset 或使用測試帳號的遠端 CRUD 驗證。需要更新 schema 時，仍依 [`docs/supabase-setup.md`](docs/supabase-setup.md) 的人工流程執行。

### 失敗與回復

- GitHub check 失敗：先在 Actions 查看 `Frontend` 或 `Backend` 的第一個失敗命令；修正後推送新 commit，Render 不會部署失敗的 commit。
- Render build 或 health check 失敗：在 Render Events／Logs 檢查缺少的環境變數、建置錯誤及 `/health` 狀態，修正後重新部署。
- 新版本通過部署但行為異常：在 Render 對兩個服務選擇上一個已通過 CI 的 commit 並執行 **Deploy commit**。確認 `/health`、client-side route 與 CORS 後，再處理有問題的新版本。

## 功能

- 訂單管理：新增、編輯、刪除訂單，依分類（代購／集運包裹）與狀態（待出貨／集運中／運送中／已抵台／已完成）檢視
- 關鍵字搜尋（依名稱、備註）與排序（依下單日期、金額），可與分類/狀態篩選同時使用
- 響應式版面，支援手機／平板尺寸（側邊欄抽屜導覽）
- 訂單資料驗證規則集中於 `src/domain/orderValidation.js`，表單與 store 共用同一份規則
- 刪除訂單後，在目前訂單頁停留期間可使用「復原」撤回；重新整理、切換頁面、登出或關閉頁面時才提交永久刪除
- 全部訂單頁可直接新增訂單並選擇「海外代購」或「集運包裹」分類；未知路由與不支援分類會顯示 Not Found 頁面
- 任何人可使用唯一會員名稱與 Email 自行註冊；完成 Email 驗證後才能使用訂單功能
- 支援重新寄送驗證信、忘記密碼與 Email 密碼重設，登入成功會返回原本要求的站內頁面
- 密碼須為 8–64 個字元並至少包含一個英文字母與一個數字，禁止空白、使用名稱相同值與常見弱密碼

## 專案結構

```
src/
├── components/
│   ├── common/     # 跨功能共用元件（AppSidebar、StatusBadge）
│   ├── ui/         # 基礎 UI 元件（Button、Card、Modal…）
│   └── orders/     # 訂單相關元件（OrderCard、OrderFormModal、SearchSortControls…）
├── domain/          # 與框架無關的驗證/邏輯純函式（訂單與帳號規則）
├── views/           # 訂單與公開帳號路由頁面
├── stores/          # Pinia store（orders、auth）
├── router/          # 路由設定
└── assets/          # 全域樣式
tests/                # 集中的前端測試，依來源責任分類
backend/
├── src/              # Fastify 後端正式程式
└── tests/            # 集中的後端測試
scripts/
└── tests/            # CI、Render 與部署工具測試
```

## Spec-Driven Development

本專案使用 [Spectra](https://github.com/spectra-app/spectra) 進行 Spec-Driven Development：

- `openspec/specs/` — 目前生效的功能規格
- `openspec/changes/` — 變更提案與已封存的變更歷程

詳見專案根目錄的 `CLAUDE.md` / `AGENTS.md`。
