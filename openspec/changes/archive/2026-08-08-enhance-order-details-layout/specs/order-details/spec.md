## ADDED Requirements

### Requirement: Order details present distinct responsive information groups
The order details modal SHALL present basic information, order attributes, logistics information, and business dates as separate rounded warm-purple information surfaces. At viewport widths below the `sm` breakpoint, every information group SHALL arrange fields in one column. At the `sm` breakpoint and above, each group SHALL arrange compatible fields in two columns while long-form values remain readable. System information SHALL appear after a visual divider with lower emphasis and SHALL NOT use the primary information-card surface.

#### Scenario: Details are grouped on a desktop viewport
- **WHEN** a user opens order details at a viewport width at or above the `sm` breakpoint
- **THEN** the four primary sections SHALL appear as distinct rounded warm-purple surfaces with compatible fields arranged in two columns
- **AND** system information SHALL appear after a divider with lower visual emphasis

#### Scenario: Details use one column on a narrow viewport
- **WHEN** a user opens order details at a 375 pixel viewport width
- **THEN** every information group SHALL arrange its fields in one column without horizontal page overflow

### Requirement: Order details use explicit date and timestamp formats
The order details modal SHALL display order date, estimated shipment date, and estimated arrival date as `YYYY/MM/DD` without a time component. It SHALL display creation and update timestamps converted to the `Asia/Taipei` time zone as `YYYY/MM/DD HH:mm`, using a 24-hour clock with zero-padded numeric fields. Empty date or timestamp values SHALL continue to display `尚未填寫`.

#### Scenario: Business dates omit time components
- **WHEN** an order business-date value is `2026-08-05T16:00:00.000Z`
- **THEN** the corresponding detail value SHALL display `2026/08/05`
- **AND** it SHALL NOT display a time or time-zone suffix

#### Scenario: System timestamps use Taipei 24-hour time
- **WHEN** an order system timestamp is `2026-08-06T14:55:00.000Z`
- **THEN** the corresponding detail value SHALL display `2026/08/06 22:55`

### Requirement: Order details retain fixed actions and a discoverable content scrollbar
The order details modal SHALL keep its header and footer actions visible while overflowing detail content scrolls in one internal content region. On platforms supporting scrollbar styling, that region SHALL use an approximately 6 pixel thin scrollbar with a transparent track, a rounded low-contrast warm-gray or warm-purple thumb, no arrow buttons, and increased thumb contrast during pointer interaction. Platforms without custom scrollbar support SHALL retain a functional native scrollbar.

#### Scenario: Long details scroll without moving actions
- **WHEN** order details exceed the modal maximum height
- **THEN** the detail content SHALL scroll independently while the close and edit actions remain visible
- **AND** the page SHALL expose only the modal content region as scrollable

#### Scenario: Custom scrollbar styling is unsupported
- **WHEN** the browser does not support the configured custom scrollbar rules
- **THEN** the detail content SHALL remain scrollable through the browser's native scrollbar, mouse wheel, keyboard, and touch input
