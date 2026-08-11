## MODIFIED Requirements

### Requirement: Email confirmation is mandatory before protected use
Supabase Auth MUST require email confirmation for new email-password accounts. A signup response without a confirmed session SHALL remain outside protected application content. A valid confirmation link SHALL establish a confirmed session, clear callback parameters from the browser URL, and navigate to `/`.

#### Scenario: Unconfirmed member attempts to sign in
- **WHEN** a member submits correct credentials before confirming the email address
- **THEN** authentication SHALL be rejected with a user-safe instruction to verify the email and protected routes SHALL remain unavailable

#### Scenario: Member follows a valid confirmation link
- **WHEN** Supabase accepts the one-time email confirmation token and returns a confirmed session
- **THEN** the frontend SHALL show confirmation success, clear callback parameters, and replace the route with `/`

#### Scenario: Confirmation link is invalid or expired
- **WHEN** the confirmation callback contains an invalid or expired token
- **THEN** the frontend SHALL show a non-sensitive failure state with an action to request another confirmation email and SHALL NOT render protected content
