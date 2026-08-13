# Hakobi

簡單好用的海外代購與集運訂單管理工具，集中記錄商品、付款、物流、日期與附件資訊。

**[線上體驗 Hakobi](https://hakobi-web.onrender.com)**

> 線上版本使用 Render 免費服務。後端閒置後首次載入可能需要約一分鐘啟動。

## 功能

- 新增、編輯、查看與刪除訂單
- 管理海外代購與集運包裹
- 依貨物狀態篩選，並依日期或金額排序
- 搜尋商品名稱與備註
- 記錄訂單號碼、追蹤號碼及附件
- 支援刪除後復原；重新整理或離開頁面後永久刪除
- Email 註冊、驗證、登入及密碼重設
- 響應式介面，支援電腦、平板與手機

## 技術棧

- Vue 3 + Vite
- Vue Router + Pinia
- Tailwind CSS
- Fastify + TypeScript
- Supabase Auth + PostgreSQL + Storage
- Vitest
- Render

## 從原始碼執行

需要 Node.js 20+。

```sh
git clone https://github.com/zhou21935/Hakobi.git
cd Hakobi
npm install
npm --prefix backend install
```

建立環境變數檔案：

```sh
cp .env.example .env
cp backend/.env.example backend/.env
```

填入 Supabase 與 API 設定後，分別啟動前後端：

```sh
npm run dev
npm run dev:backend
```

前端預設使用 `http://localhost:5173`，後端預設使用 `http://localhost:3000`。

## 常用指令

```sh
npm test                    # 前端測試
npm run build               # 前端正式建置
npm run test:backend        # 後端測試
npm run typecheck:backend   # 後端型別檢查
npm run build:backend       # 後端正式建置
npm run test:all            # 執行全部測試
```

## 專案結構

```text
src/                Vue 前端
tests/              前端測試
backend/src/        Fastify 後端
backend/tests/      後端測試
supabase/           Database migrations
openspec/           Spectra 規格與變更紀錄
docs/               設定與部署文件
```

## 部署與設定

- [Supabase 設定與 migration](docs/supabase-setup.md)
- [Render Blueprint](render.yaml)

請勿將 `.env`、Supabase service-role key、資料庫密碼或其他憑證提交至版本控制。
