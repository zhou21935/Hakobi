## ADDED Requirements

### Requirement: Top-level sidebar navigation items render with consistent styling and adjacency

The system SHALL render the "總覽" (Overview) and "全部訂單" (All Orders) sidebar navigation items as adjacent top-level entries using identical button classes (padding, rounded shape, font size, hover, and active-state styling), with "全部訂單" positioned immediately below "總覽".

#### Scenario: All Orders item matches Overview item styling

- **WHEN** the sidebar renders the "總覽" and "全部訂單" navigation items
- **THEN** both `router-link` elements SHALL share the same class list (`flex items-center gap-3 px-4 py-2 rounded-full text-ink hover:bg-white/50 transition-colors`) and the same active-state class (`bg-gradient-to-br from-primary-from to-primary-to text-white shadow-emphasis`)

#### Scenario: All Orders item is positioned directly below Overview

- **WHEN** the sidebar navigation list is rendered
- **THEN** the "全部訂單" list item SHALL immediately follow the "總覽" list item, before "UI 元件展示" and the category list
