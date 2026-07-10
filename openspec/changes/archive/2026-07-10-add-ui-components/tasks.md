## 1. 基礎元件建立

- [x] 1.1 建立 `src/components/ui/Button.vue`,依設計決策「Button 元件的 variant/size 介面」實作 Button component renders with variant and size options:提供 `variant`(primary/secondary/danger/ghost,預設 primary)與 `size`(sm/md/lg,預設 md)props,點擊時原生 `click` 事件正常冒泡;於 `npm run dev` 開啟畫面手動驗證四種 variant、三種 size 皆正確套用不同樣式,且 `disabled` 為 true 時按鈕呈現 disabled 樣式並無法觸發 click。
- [x] 1.2 建立 `src/components/ui/Card.vue`,依設計決策「Card 元件的 slot 結構」實作 Card component provides structured content slots:提供 default、`header`(選用)、`footer`(選用)slot 與 `padding` prop(預設 true);手動驗證僅提供 default slot 時不出現 header/footer 區塊,提供 header 與 footer 內容時三個區塊依序正確渲染。
- [x] 1.3 建立 `src/components/ui/Input.vue`,依設計決策「Input 元件走 v-model 而非手動綁定」實作 Input component supports v-model binding and validation error display:透過 `modelValue`/`update:modelValue` 支援 v-model,並提供 `label`、`type`、`placeholder`、`error`、`disabled` props;手動驗證在欄位輸入文字時外部綁定的 ref 值同步更新,且 `error` 有值時欄位邊框轉紅並在下方顯示錯誤文字。
- [x] 1.4 建立 `src/components/ui/Table.vue`,依設計決策「Table 元件用 columns + scoped slot 客製欄位」實作 Table component renders rows from column definitions with custom cell override:依 `columns`(`{ key, label }[]`)與 `rows` 渲染表格,未提供對應 `cell-<key>` scoped slot 時顯示 `row[column.key]`,提供時改用該 slot 內容渲染並傳入 row 作為 slot prop;手動驗證帶有假資料時預設欄位正確顯示、`rows` 為空陣列時顯示 `emptyText`(預設「尚無資料」)。
- [x] 1.5 建立 `src/components/ui/Modal.vue`,依設計決策「Modal 元件走 v-model 控制開關」實作 Modal component supports v-model visibility control and dismiss interactions:透過 `modelValue`/`update:modelValue` 控制開關並提供 `title`、default slot、`footer` slot;點擊遮罩或按下 Escape 鍵時 emit `update:modelValue` 為 false 並 emit `close`;手動驗證三種關閉途徑(點擊遮罩、按 Escape、點擊 footer 內按鈕)皆能正確關閉視窗並觸發對應事件。

## 2. 展示頁與導覽整合

- [x] 2.1 建立 `src/views/UiShowcase.vue`,依設計決策「UiShowcase 頁面與導覽」實作 UI component showcase page is reachable from navigation 的畫面內容:於同一頁面渲染 Button 四種 variant 範例、Card(含 header/footer)範例、Input 一般與 error 狀態各一個、Table(3 筆假資料,狀態欄以 `#cell-status` scoped slot 使用既有 `StatusBadge` 元件渲染)、以及一顆觸發 Modal 開關的按鈕;以 `npm run dev` 啟動後於瀏覽器開啟 `/ui-showcase` 手動驗證五個元件皆成功渲染且瀏覽器 console 無錯誤或警告。
- [x] 2.2 在 `src/router/index.js` 新增 `path: '/ui-showcase'`、`name: 'UiShowcase'` 路由設定,並在 `src/components/AppSidebar.vue` 新增一個導覽項目(置於 Dashboard 之後、Orders 分類之前)連到該路由,完成 UI component showcase page is reachable from navigation 的 Sidebar link navigates to the showcase page 情境;手動驗證點擊側邊欄新項目後網址列變更為 `/ui-showcase` 且畫面正確切換,原有 Dashboard 與 Orders 導覽項目行為不受影響。
