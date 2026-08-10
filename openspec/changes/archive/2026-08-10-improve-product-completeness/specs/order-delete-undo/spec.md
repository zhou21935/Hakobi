## ADDED Requirements

### Requirement: Deleted orders remain undoable while the current order view stays mounted
After deletion confirmation, the frontend SHALL remove the selected order from active projections immediately and SHALL display an undo control without a countdown. The undo opportunity SHALL exist only while the current order view remains mounted and SHALL NOT survive a reload, route navigation, sign-out, or document unload.

#### Scenario: User undoes before leaving
- **WHEN** a user confirms deletion and activates undo while the current order view remains mounted
- **THEN** the frontend SHALL cancel the pending delete, restore the same order to active projections, and SHALL NOT call `DELETE /api/orders/:id`

#### Scenario: Undo remains available without a timer
- **WHEN** an order has a pending deletion and the user remains on the current order view
- **THEN** the undo control SHALL remain visible until the user activates it or the view lifecycle ends

#### Scenario: User reloads or leaves the view
- **WHEN** the order view unmounts, the user signs out, or the document begins unloading while deletion is pending
- **THEN** the frontend SHALL finalize the existing permanent delete request exactly once and the undo control SHALL disappear

### Requirement: Failed deferred deletion restores confirmed state when possible
If the permanent delete request fails while the application can still update its UI, the frontend SHALL restore the removed order to active projections or reload confirmed orders and SHALL display a user-readable error. A failure that occurs after document unload SHALL be recoverable only by the next normal orders load, which will show the order again if the backend did not delete it.

#### Scenario: Delete API fails during route navigation
- **WHEN** leaving the order view finalizes deletion and `DELETE /api/orders/:id` returns an error before the application unloads
- **THEN** the order SHALL become visible again from confirmed state and the frontend SHALL display the deletion error

### Requirement: Only one pending undo deletion is active
The frontend SHALL allow at most one pending undo deletion. Confirming deletion of a second order SHALL immediately finalize the first pending deletion before starting an undo opportunity for the second order.

#### Scenario: Second deletion replaces pending undo
- **WHEN** order A has a pending undo and the user confirms deletion of order B
- **THEN** the frontend SHALL submit deletion of order A exactly once and SHALL show the undo control for order B only
