## MODIFIED Requirements

### Requirement: Tracking numbers can be copied with visible feedback
The details modal SHALL provide independent copy controls when non-empty order-number or tracking-number values exist. The frontend MUST copy the exact displayed value for the activated field, SHALL show temporary success feedback only for that field after a successful copy, and SHALL show a user-readable failure message while keeping the value visible when copying fails.

#### Scenario: Order number is copied
- **WHEN** a user activates copy for order number `114-2938471-0038` and the Clipboard API succeeds
- **THEN** the frontend SHALL write exactly `114-2938471-0038` to the clipboard and SHALL temporarily display `已複製 ✓` for the order-number field

#### Scenario: Tracking number is copied
- **WHEN** a user activates copy for tracking number `EN123456789JP` and the Clipboard API succeeds
- **THEN** the frontend SHALL write exactly `EN123456789JP` to the clipboard and SHALL temporarily display `已複製 ✓` for the tracking-number field

#### Scenario: Clipboard operation fails
- **WHEN** the Clipboard API rejects a copy operation for either field
- **THEN** the frontend SHALL display `複製失敗，請手動選取` for that field, SHALL keep its value visible, and SHALL NOT produce an unhandled error

#### Scenario: Copyable value is absent
- **WHEN** the selected order has an empty order number or tracking number
- **THEN** the corresponding field SHALL display `尚未填寫` and SHALL NOT render a copy control
