## 1. 調整導覽項目順序與樣式

- [x] 1.1 將 `src/components/AppSidebar.vue` 中「📋 全部訂單」`<li>` 區塊移到「📊 總覽」`<li>` 之後，實現「Top-level sidebar navigation items render with consistent styling and adjacency」中「全部訂單緊接在總覽之後」的排序規範；驗證方式：在瀏覽器開啟應用程式，確認側邊欄由上而下順序為 總覽 → 全部訂單 → UI 元件展示 → 分類清單
- [x] 1.2 移除全部訂單 `router-link` class 中的 `text-sm`，使其與總覽的 class list（`flex items-center gap-3 px-4 py-2 rounded-full text-ink hover:bg-white/50 transition-colors`）完全一致，實現「Top-level sidebar navigation items render with consistent styling and adjacency」中兩者樣式一致的規範；驗證方式：比對瀏覽器 DevTools 中兩個 `router-link` 元素的 class attribute 字串相同

## 2. 驗證行為不變

- [x] 2.1 確認 `/orders` 路由啟用時，「全部訂單」項目套用 active 狀態 class（`bg-gradient-to-br from-primary-from to-primary-to text-white shadow-emphasis`），驗證方式：於瀏覽器導覽至 `/orders`，觀察該導覽項目背景是否呈現漸層並帶有陰影
- [x] 2.2 確認「UI 元件展示」與「分類」清單其餘內容與各自路由連結不受影響，驗證方式：於瀏覽器逐一點擊「UI 元件展示」與各分類連結，確認皆能正確導航且樣式與位置調整前一致
