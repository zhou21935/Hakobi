## ADDED Requirements

### Requirement: Modal supports backward-compatible responsive layout customization

The shared Modal component SHALL provide an explicit interface for callers to customize responsive overlay, panel, header, content, and footer layout classes needed by large or bottom-sheet dialogs. Every customization input MUST default to the current Modal layout so existing callers retain their present width, centering, spacing, scrolling, Escape handling, overlay-close behavior, and background-scroll lock without modification.

#### Scenario: Existing caller receives unchanged defaults

- **WHEN** a caller renders Modal without responsive customization inputs
- **THEN** the overlay remains centered with the existing page padding
- **AND** the panel retains its current maximum width, height, spacing, and independent content scrolling

#### Scenario: Order form supplies responsive customization

- **WHEN** the order form passes its responsive Modal customization
- **THEN** the phone panel can align to the bottom and the desktop panel can expand to 880px
- **AND** header, content, and footer styling can change at the defined breakpoints without replacing Modal lifecycle behavior

#### Scenario: Modal lifecycle remains intact after customization

- **WHEN** a customized Modal is closed by Escape, overlay click, or its model update
- **THEN** it emits the same close and model-update events as before
- **AND** document and body scrolling are restored to their prior values
