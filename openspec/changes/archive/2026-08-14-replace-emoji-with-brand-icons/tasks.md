## 1. 圖示基礎與品牌頁籤

- [x] 1.1 依「匯入正式 Hakobi 品牌 SVG 資產」從 `C:\Users\User\Downloads\Hakobi logo 三方案評選.zip` 原樣匯入 `logo/hakobi-logo.svg` 與 `logo/hakobi-icon.svg` 為 `public/hakobi-logo.svg` 與 `public/favicon.svg`；以 PowerShell 位元雜湊比較兩組來源／目的檔並確認完全相同。
- [x] 1.2 依「建立集中式 AppIcon SVG 元件」完成受限 `name` 介面的 `AppIcon`，讓 `overview`、`agent`、`parcel`、`profile`、`copy` 五種功能 icon 以一致 SVG 輸出且不接受任意 path；先新增 `tests/components/icons/AppIcon.spec.js`，再以 `npm test -- --run tests/components/icons/AppIcon.spec.js` 驗證所有變體與 `aria-hidden`。
- [x] 1.3 實作「Hakobi brand identity is consistent across application chrome」與「固定頁籤品牌識別」，讓側欄以 `/hakobi-logo.svg` 顯示正式 logo、`/favicon.svg` 使用正式 icon，且初始載入及所有路由導覽後 `document.title` 精確等於 `Hakobi`；先補 AppSidebar 與 router 測試，再以 `npm test -- --run` 驗證。

## 2. 導覽與操作圖示

- [x] 2.1 實作「Sidebar navigation uses deterministic SVG icons」，讓總覽、海外代購、集運包裹、個人資料分別使用 `overview`、`agent`、`parcel`、`profile` 且側欄不含 📦、📊、👤；先新增 AppSidebar icon 識別與 emoji 排除測試，再以 `npm test -- --run tests/components/common/AppSidebar.spec.js` 驗證。
- [x] 2.2 依「複製 icon 與狀態文字共存」實作「Copy controls use the copy SVG without changing clipboard behavior」，讓非空值按鈕顯示 `copy` SVG 並保留可存取名稱、精確複製、兩秒重設、空值與錯誤行為；先新增 CopyableDetailValue 測試，再以 `npm test -- --run tests/components/ui/CopyableDetailValue.spec.js` 驗證。

## 3. 整體驗收

- [x] 3.1 依 Implementation Contract 的範圍完成回歸驗收，確認未改變路由目的地、資料模型與 Clipboard 控制流程；執行 `npm test -- --run`、`npm run build` 與 `spectra analyze replace-emoji-with-brand-icons --json` 且不得有 Critical 或 Warning。

## 4. 全站字體

- [x] 4.1 依「統一 Chiron GoRound TC 與 Medium 500 預設字重」實作「Application typography uses Chiron GoRound TC at Medium weight」，讓 `index.html` 只載入指定 Chiron GoRound TC variable stylesheet 並保留兩個 preconnect，且 `main.css` 的 heading／sans 字體都以該字體為第一順位、body 預設為 500；先新增會檢查 HTML 與 CSS 契約的測試，再以 `npm test -- --run tests/app/Typography.spec.js` 驗證。
- [x] 4.2 完成追加字體需求的整體回歸驗收，確認既有 icon、品牌、路由與 Clipboard 行為未改變；執行 `npm test -- --run`、`npm run build` 與 `spectra analyze replace-emoji-with-brand-icons --json` 且不得有 Critical 或 Warning。
