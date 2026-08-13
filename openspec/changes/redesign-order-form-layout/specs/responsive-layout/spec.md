## ADDED Requirements

### Requirement: Order form adapts across phone, tablet, and desktop viewports

The order create and edit form SHALL use one responsive implementation with three layout ranges: viewports below 640px SHALL use a bottom sheet with single-column fields and a fixed action footer; viewports from 640px through 1023px SHALL use a centered dialog up to 560px wide with selected field groups in two columns; viewports at or above 1024px SHALL use a centered dialog up to 880px wide with Product and Notes spanning the full width and Cargo and Shipping arranged side by side. At every range, the content region SHALL scroll independently without horizontal overflow while the header and action footer remain operable.

#### Scenario: Phone layout uses a bottom sheet

- **WHEN** the order form is rendered at a 390px viewport width
- **THEN** the panel aligns to the bottom edge and uses phone-appropriate rounded top corners
- **AND** form controls are arranged in one column except intentional compact pairs such as amount and currency
- **AND** the content region scrolls while the action footer remains visible

#### Scenario: Tablet layout uses a centered dialog

- **WHEN** the order form is rendered at a 768px viewport width
- **THEN** the panel is centered and constrained to 560px
- **AND** suitable Cargo fields can use two columns
- **AND** the panel remains within the viewport height

#### Scenario: Desktop layout uses grouped two-column cards

- **WHEN** the order form is rendered at a 1280px viewport width
- **THEN** the panel is centered and constrained to 880px
- **AND** Product and Notes span both columns
- **AND** Cargo and Shipping occupy adjacent columns

#### Scenario: Create and edit modes share responsive behavior

- **WHEN** the viewport changes while either create or edit mode is open
- **THEN** the same form controls reflow through the defined ranges
- **AND** no separate viewport-specific form state or duplicate input is rendered
