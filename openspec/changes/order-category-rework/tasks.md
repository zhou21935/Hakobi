## 1. MultiSelect 元件

- [x] 1.1 新建 `src/components/ui/MultiSelect.vue`，依設計決策「新建 MultiSelect 元件，而非讓 Select 元件同時支援單選與多選」，實作規格「MultiSelect component supports v-model binding over multiple selected values」：`modelValue` 為字串陣列並支援雙向綁定、`options`/`label`/`placeholder`/`error`/`disabled` props 齊全；透過在 `/ui-showcase` 手動勾選/取消勾選數個選項，確認每次都正確觸發 `update:modelValue` 且陣列內容符合預期
- [x] 1.2 實作規格「MultiSelect dropdown panel opens and closes predictably」：點擊控制項展開面板、選取單一選項後面板不關閉（可連續勾選）、點擊元件外部或按下 Escape 鍵才關閉面板，開關邏輯比照 `Modal.vue` 既有的點外部/Escape 關閉模式；透過手動操作確認上述四種互動情境的面板開關行為都正確
- [x] 1.3 實作規格「MultiSelect displays a validation error message」：`error` prop 為非空字串時，在控制項下方顯示錯誤文字並套用錯誤視覺樣式；透過手動測試比對有錯誤訊息與無錯誤訊息兩種狀態下的畫面差異

## 2. 訂單資料模型調整

- [x] 2.1 依設計決策「category 欄位維持原名與單一字串型別，僅收斂值域」，修改 `src/stores/orders.js` 的 `CATEGORIES`/`CATEGORY_LABELS`，只保留 `agent`（代購）、`parcel`（集運包裹）兩項；透過檢查匯出的常數物件只剩這兩個 key 確認完成
- [x] 2.2 依設計決策「isConsolidated 原地重新命名為 isPreorder，而非新增欄位並棄用舊欄位」，將訂單資料模型的 `isConsolidated` 移除、新增 `isPreorder: boolean`（預設 `false`）；透過在 store 呼叫 `addOrder` 不帶任何參數，檢查回傳物件不含 `isConsolidated` 且 `isPreorder` 為 `false` 確認
- [x] 2.3 依設計決策「productCategories 為新的 string[] 欄位，值域固定為三項，必填無預設值」，新增 `PRODUCT_CATEGORIES`/`PRODUCT_CATEGORY_LABELS` 常數（周邊/書籍/其他）與訂單物件的 `productCategories: string[]` 欄位（預設空陣列）；透過在 store 呼叫 `addOrder` 檢查回傳物件包含空陣列 `productCategories` 確認
- [x] 2.4 確認需求「Orders can be flagged as sent to a consolidation warehouse」已依 REMOVED 版本完整移除：程式碼中不再有任何 `isConsolidated` 的宣告或使用；透過在 `src` 目錄下搜尋 `isConsolidated` 字串確認搜尋結果為零筆

## 3. 側邊欄導覽收斂

- [x] 3.1 實作規格「Sidebar navigation offers exactly two order categories」：修改 `src/components/AppSidebar.vue` 的 `categories` 陣列為 `['agent', 'parcel']`；透過在瀏覽器打開側邊欄，手動確認「分類」區塊剛好顯示「代購」與「集運包裹」兩個連結，且不再有其餘三個分類的連結

## 4. 表單欄位調整

- [x] 4.1 將 `src/components/orders/OrderFormModal.vue` 中「送往集運倉」checkbox 改為「預購商品」checkbox 並綁定 `form.isPreorder`，實作規格「Orders can be flagged as a preorder item」；透過手動勾選/取消勾選「預購商品」並送出表單，檢查儲存後訂單物件的 `isPreorder` 值與畫面操作一致
- [x] 4.2 在 `OrderFormModal.vue` 新增「商品分類」`MultiSelect` 欄位並綁定 `form.productCategories`，實作規格「Orders can be tagged with one or more product categories」：未選擇任何分類時送出應顯示驗證錯誤且不建立/更新訂單；透過手動測試三種情境（不選、選 1 項、選 3 項）確認送出結果分別為「阻擋並顯示錯誤」「成功並正確持久化 1 項」「成功並正確持久化 3 項」
- [x] 4.3 確認規格「User can create a preorder order with required field validation」描述的既有驗證行為不受本次變更影響：商品名稱空白、金額為 0 或負數時仍分別阻擋送出並顯示對應錯誤訊息；透過手動測試這兩種情境確認行為與變更前一致

## 5. 訂單卡片顯示

- [x] 5.1 依設計決策「OrderCard 徽章顯示順序固定」，修改 `src/components/orders/OrderCard.vue`：在 `StatusBadge` 之後，`order.isPreorder` 為真時顯示「預購」標籤，接著依周邊、書籍、其他的固定順序（而非使用者選取順序）顯示 `order.productCategories` 對應標籤；透過建立測試訂單並以不同勾選順序選取商品分類、切換預購勾選狀態，確認卡片顯示的標籤內容與順序符合固定順序規則

## 6. 展示頁與收尾驗證

- [x] 6.1 檢查 `src/views/UiShowcase.vue` 是否引用了已移除的 `isConsolidated` 欄位或已移除的分類值，若有則更新為 `isPreorder`/`productCategories` 的對應範例；透過瀏覽 `/ui-showcase` 頁面確認畫面正常渲染且無過期欄位痕跡
- [x] 6.2 執行 `npm run build` 確認本次資料模型與新元件變更後專案仍可成功建置；以指令 exit code 為 0 作為驗證依據
