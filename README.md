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

## 功能

- 訂單管理：新增、編輯、刪除訂單，依分類（代購／集運包裹）與狀態（待出貨／集運中／運送中／已抵台／已完成）檢視
- 關鍵字搜尋（依名稱、備註）與排序（依下單日期、金額），可與分類/狀態篩選同時使用
- 響應式版面，支援手機／平板尺寸（側邊欄抽屜導覽）
- 訂單資料驗證規則集中於 `src/domain/orderValidation.js`，表單與 store 共用同一份規則

## 專案結構

```
src/
├── components/
│   ├── ui/         # 通用 UI 元件（Button、Card、Modal…）
│   └── orders/     # 訂單相關元件（OrderCard、OrderFormModal、SearchSortControls…）
├── domain/          # 與框架無關的驗證/邏輯純函式（orderValidation）
├── views/          # 路由頁面（Dashboard、AllOrders、OrderList、UiShowcase）
├── stores/          # Pinia store（orders）
├── router/          # 路由設定
└── assets/          # 全域樣式
```

## Spec-Driven Development

本專案使用 [Spectra](https://github.com/spectra-app/spectra) 進行 Spec-Driven Development：

- `openspec/specs/` — 目前生效的功能規格
- `openspec/changes/` — 變更提案與已封存的變更歷程

詳見專案根目錄的 `CLAUDE.md` / `AGENTS.md`。
