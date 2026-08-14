## Why

目前側欄導覽與複製控制混用 emoji，瀏覽器分頁也沒有穩定呈現 Hakobi 品牌名稱與圖示，字體則混用 Baloo 2 與 Noto Sans TC，造成跨平台視覺不一致。需要統一 SVG 品牌識別、功能圖示與開源中文字體，讓導覽、頁籤、文字及操作控制維持一致呈現。

## What Changes

- 從 `C:\Users\User\Downloads\Hakobi logo 三方案評選.zip` 匯入正式 `hakobi-logo.svg` 與 `hakobi-icon.svg` 品牌資產。
- 側欄品牌區改用正式 Hakobi logo，不再顯示包裹 emoji。
- 側欄的總覽、海外代購、集運包裹與個人資料導覽項目改用指定的 SVG icon。
- 瀏覽器分頁使用 Hakobi icon，且所有路由固定顯示頁籤標題 `Hakobi`。
- 可複製訂單詳細值的複製按鈕改用指定的 SVG copy icon，保留既有複製、成功與錯誤行為。
- 全站字體改用 Google Fonts 的 `Chiron GoRound TC`，未另行指定的文字預設使用 Medium 500。
- 新增元件測試，防止 emoji、圖示識別與固定頁籤品牌行為回歸。

## Capabilities

### New Capabilities

- `app-brand-icons`: 規範 Hakobi 品牌 logo、瀏覽器頁籤識別、側欄導覽 icon 與複製控制 icon 的一致呈現。
- `app-typography`: 規範全站載入並使用 Chiron GoRound TC，以及預設 Medium 500 字重。

### Modified Capabilities

（無）

## Impact

- Affected specs: app-brand-icons, app-typography
- Affected code:
  - New: `src/components/icons/AppIcon.vue`, `public/hakobi-logo.svg`, `public/favicon.svg`, `tests/components/icons/AppIcon.spec.js`
  - Modified: `src/components/common/AppSidebar.vue`, `src/components/ui/CopyableDetailValue.vue`, `src/router/index.js`, `src/assets/main.css`, `index.html`, `tests/components/common/AppSidebar.spec.js`, `tests/components/ui/CopyableDetailValue.spec.js`, `tests/router/authGuard.spec.js`
  - Removed: 無
