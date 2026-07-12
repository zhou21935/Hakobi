## Summary

重新設計訂單的分類機制：側邊欄「分類」導覽收斂為「代購」與「集運包裹」兩個業務分類，並將原本混雜在分類清單裡的商品類型（預購商品、追星周邊、漫畫小說）與「集運」相關的重複概念，拆解為訂單表單內的獨立欄位。

## Motivation

目前側邊欄用同一個 `category` 欄位同時表達兩種不同性質的分類：一種是決定訂單歸屬與導覽入口的業務分類（代購、集運包裹），另一種其實是商品類型描述（預購商品、追星周邊、漫畫小說）。這讓側邊欄項目偏多、難以維護，也讓「集運包裹」這個側邊欄分類跟表單裡獨立存在的「送往集運倉」checkbox 語意重疊、容易混淆使用者。

## Proposed Solution

1. 側邊欄「分類」導覽收斂為「代購」（agent）、「集運包裹」（parcel）兩項；移除「預購商品」、「追星周邊」、「漫畫小說」的側邊欄導覽路由與對應的 `/orders/:category` 頁面入口。
2. 移除獨立的「送往集運倉」（`isConsolidated`）欄位與 checkbox，其語意併入側邊欄「集運包裹」分類本身，不再由訂單上的另一個布林欄位重複表達。
3. 表單內原本「送往集運倉」checkbox 的位置與樣式重新命名為「預購商品」（新欄位 `isPreorder`，取代 `isConsolidated`）；勾選後除了表單內可見，也要在 `OrderCard` 的 `StatusBadge` 旁顯示一個「預購」標籤。
4. 新增必填的「商品分類」欄位（`productCategories`，值域：周邊／書籍／其他），可複選、無預設值，透過新建的多選下拉元件選取；選取結果以標籤形式顯示在 `OrderCard` 上（可能同時顯示多個標籤）。
5. 既有 `category` 為 preorder/merch/manga 的舊訂單資料不遷移、不補值——側邊欄不再有專屬入口，但仍會出現在「全部訂單」頁面。

## Non-Goals (optional)

- 不重新命名 `preorder-orders` 這個 spec capability 本身。「預購」雖然已從分類降級為訂單旗標，但本次變更僅調整其內部需求內容，capability 目錄名稱維持不變，避免不必要的 spec 目錄異動；日後如需正名再另案處理。
- 不替既有 preorder/merch/manga 舊訂單資料做分類遷移或補值；「商品分類」與「預購商品」欄位僅套用於本次變更之後新建立或編輯的訂單。
- 不在「代購」「集運包裹」頁面內新增依「商品分類」篩選的 UI（例如額外的 filter tabs）；商品分類目前僅供輸入與顯示，不做為篩選條件。

## Alternatives Considered (optional)

- 曾考慮把「商品分類」做成打勾群組（沿用既有 `Checkbox.vue`，3 個選項並排），成本較低且不用新建元件；但使用者明確要求「下拉多選」的互動形式，因此改為新建多選下拉元件（`MultiSelect.vue`）。
- 曾考慮讓「集運包裹」側邊欄分類與「送往集運倉」checkbox 並存；但使用者選擇將兩者合併為單一概念，只保留側邊欄分類，避免同一個「集運」概念在兩處分別維護。

## Capabilities

### New Capabilities

- `ui-multi-select`: 新建的多選下拉元件，支援 `v-model` 綁定字串陣列（可複選）、必填驗證錯誤顯示、選取後以標籤呈現已選項目

### Modified Capabilities

- `preorder-orders`: 側邊欄分類收斂為代購/集運包裹兩項並移除其餘三個分類路由；移除「送往集運倉」`isConsolidated` 欄位，改為「預購商品」`isPreorder` 欄位並於訂單卡片顯示對應標籤；新增必填的「商品分類」`productCategories` 欄位（周邊/書籍/其他，可複選）並將選取結果顯示於訂單卡片

## Impact

- Affected specs: `preorder-orders`（modified）、`ui-multi-select`（new）
- Affected code:
  - New:
    - src/components/ui/MultiSelect.vue
  - Modified:
    - src/stores/orders.js
    - src/components/AppSidebar.vue
    - src/components/orders/OrderFormModal.vue
    - src/components/orders/OrderCard.vue
    - src/views/OrderList.vue
    - src/views/UiShowcase.vue
