## 1. 路由與首頁測試

- [x] 1.1 先以失敗測試覆蓋 `All-orders view lists orders across every category` 與「首頁沿用 AllOrders 行為」，驗證 `/` 呈現標題「訂單總覽」及完整跨分類訂單功能，並以相關 view/router Vitest 在實作前如預期失敗驗證。
- [x] 1.2 先以失敗測試覆蓋「舊 orders 路由使用 redirect」，驗證 `/orders` 導向 `/` 且 `/orders/:category` 不受影響，並以 router Vitest 在實作前如預期失敗驗證。

## 2. 導覽與帳號目的地測試

- [x] 2.1 先以失敗測試覆蓋 `Sidebar exposes one consolidated order overview entry` 與「側欄只保留單一總覽入口」，驗證側欄保留「總覽」、移除「全部訂單」且分類與會員連結不變，並以 AppSidebar Vitest 在實作前如預期失敗驗證。
- [x] 2.2 先以失敗測試覆蓋 `Users authenticate with Supabase email credentials`、`Public account routes respect authentication state`、`Email confirmation is mandatory before protected use` 與「所有預設成功導向統一為首頁」，驗證各帳號流程預設導向 `/` 且合法 `/orders/parcel` redirect 保留，並以相關 view/router Vitest 在實作前如預期失敗驗證。

## 3. 合併頁面與路由

- [x] 3.1 將既有 AllOrders 行為設為 `/` 的「訂單總覽」，加入 `/orders` 至 `/` 的相容 redirect，並依 `Dashboard shows order count summaries` 的移除規格刪除 Dashboard 元件及更新受影響路由測試；以第 1 組測試轉為通過及全域搜尋無殘留 Dashboard 元件引用驗證。
- [x] 3.2 更新側欄為單一「總覽」入口並統一登入、Email 驗證、密碼重設與 guest-only guard 的預設目的地為 `/`，同時保留合法 protected redirect；以第 2 組測試轉為通過驗證。

## 4. 完整驗證

- [x] 4.1 執行完整前端測試與 production build，驗證訂單 CRUD、分類頁、帳號流程與響應式列表未受合併影響；以 `npm test -- --run` 與 `npm run build` 均成功完成驗證。

## 5. 分類頁標題精簡

- [x] 5.1 先以失敗測試覆蓋 `Category order views use title-only headings` 與「分類頁只保留主標題」，驗證 `/orders/agent` 與 `/orders/parcel` 保留分類名稱且不顯示「管理…分類的訂單」副標題；以 `npm test -- --run tests/views/OrderList.spec.js` 在實作前如預期失敗驗證。
- [x] 5.2 移除兩個分類訂單頁共用的說明副標題，讓搜尋、排序、篩選及訂單操作維持原狀；以第 5.1 項測試轉為通過驗證。

## 6. 更新後完整驗證

- [x] 6.1 執行完整前端測試與 production build，確認分類頁標題精簡未影響合併後首頁、訂單 CRUD、帳號流程與響應式列表；以 `npm test -- --run` 與 `npm run build` 均成功完成驗證。
