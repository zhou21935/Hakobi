# 共同開發規範

本節是本專案所有 coding agent 的主要工作規範。除非使用者明確要求例外，所有實作、Git 與收尾操作都必須遵守。

## 分支與實作

- 實作任何新功能前，必須先從最新的 `main` 建立獨立功能分支，不得直接在 `main` 實作。
- 分支名稱應清楚描述工作內容，例如 `feature/add-member-profile-page`、`fix/profile-loading-error`。

## Commit 格式

- Commit 訊息必須採用統一的 Conventional Commits 格式：`<type>: <繁體中文摘要>`。
- 常用類型包括：
  - `feat:`：新增或擴充功能。
  - `fix:`：修正錯誤。
  - `style:`：不影響行為的介面、樣式或格式調整。
  - `chore:`：封存規格、維護工具或其他非功能性工作。
  - `test:`：新增或調整測試。
  - `docs:`：文件變更。
  - `refactor:`：不改變外部行為的程式重構。
- 功能實作與 Spectra 封存必須分開提交；封存 commit 使用 `chore: 封存 <change-name> 並同步規格`。

## 完成與收尾

- 功能分支完成後，必須先更新 `main`，再將功能分支合併至 `main`。
- 合併完成後必須推送 `main` 至遠端。
- 確認遠端 `main` 已包含變更後，必須刪除本機及遠端功能分支。
- 除非使用者明確要求，這套收尾流程不以建立 Pull Request 為必要條件。

## 共用代理設定與提交範圍

- `.agents/**`、`.claude/**` 中供團隊共用的 skills、commands 與專案設定變更必須納入版本控制，並使用獨立的 `chore:` commit，不得混入功能 commit。
- 提交前必須逐檔確認內容，不得提交 token、登入資訊、快取、工作階段資料、個人偏好或只適用於單一電腦的路徑與設定。
- `settings.local.json` 及其他明確標示為 local、private、secret 或 credential 的檔案一律不得提交。
- 工作目錄存在其他未提交變更時，必須只暫存本次工作相關檔案，不得使用 `git add .` 或 `git add -A`。

<!-- SPECTRA:START v1.0.2 -->

# Spectra Instructions

This project uses Spectra for Spec-Driven Development(SDD). Specs live in `openspec/specs/`, change proposals in `openspec/changes/`.

## Use `$spectra-*` skills when:

- A discussion needs structure before coding → `$spectra-discuss`
- User wants to plan, propose, or design a change → `$spectra-propose`
- Tasks are ready to implement → `$spectra-apply`
- There's an in-progress change to continue → `$spectra-ingest`
- User asks about specs or how something works → `$spectra-ask`
- Implementation is done → `$spectra-archive`
- Commit only files related to a specific change → `$spectra-commit`

## Workflow

discuss? → propose → apply ⇄ ingest → archive

- `discuss` is optional — skip if requirements are clear
- Requirements change mid-work? `ingest` → resume `apply`

## Parked Changes

Changes can be parked（暫存）— temporarily moved out of `openspec/changes/`. Parked changes won't appear in `spectra list` but can be found with `spectra list --parked`. To restore: `spectra unpark <name>`. The `$spectra-apply` and `$spectra-ingest` skills handle parked changes automatically.

<!-- SPECTRA:END -->
