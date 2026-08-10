## ADDED Requirements

### Requirement: Anyone can register with email, username, and password
The frontend SHALL provide a public registration form requiring an email address, a member username, a password, and an exact confirmation password. It MUST validate all fields before calling Supabase Auth and MUST submit the display username as signup metadata.

#### Scenario: Valid registration enters email verification state
- **WHEN** a visitor submits a valid unused username, a valid email, and matching valid passwords
- **THEN** the frontend SHALL call Supabase signup once, SHALL NOT treat an unconfirmed user as authenticated, and SHALL render the email verification waiting state

#### Scenario: Confirmation password differs
- **WHEN** the confirmation password does not exactly match the password
- **THEN** the frontend SHALL display a field error and SHALL NOT call Supabase signup

### Requirement: Registration passwords satisfy the Hakobi password policy
A registration password MUST contain between 8 and 64 characters inclusive, at least one ASCII letter and one digit, and no whitespace. It MUST NOT equal the member username under case-insensitive comparison and MUST NOT equal a case-insensitive entry in the weak-password set `password`, `password123`, `12345678`, `qwerty123`, or `admin123`. Uppercase letters, lowercase letters, and special characters SHALL be accepted without requiring every category.

#### Scenario: Password boundaries and composition are validated
- **WHEN** the registration form validates a password
- **THEN** it SHALL produce the expected result in the boundary example

##### Example: password policy cases

| Password | Username | Expected result |
| --- | --- | --- |
| `hako2026` | `mika` | accepted |
| `Hakobi@2026` | `mika` | accepted |
| `abc1234` | `mika` | rejected: fewer than 8 characters |
| 65 characters containing letters and digits | `mika` | rejected: more than 64 characters |
| `hakobihakobi` | `mika` | rejected: missing digit |
| `123456789` | `mika` | rejected: missing letter |
| `hako bi2026` | `mika` | rejected: whitespace |
| `MIKA2026` | `mika2026` | rejected: equals username case-insensitively |
| `Password123` | `mika` | rejected: weak password case-insensitively |

### Requirement: Email confirmation is mandatory before protected use
Supabase Auth MUST require email confirmation for new email-password accounts. A signup response without a confirmed session SHALL remain outside protected application content. A valid confirmation link SHALL establish a confirmed session, clear callback parameters from the browser URL, and navigate to `/orders`.

#### Scenario: Unconfirmed member attempts to sign in
- **WHEN** a member submits correct credentials before confirming the email address
- **THEN** authentication SHALL be rejected with a user-safe instruction to verify the email and protected routes SHALL remain unavailable

#### Scenario: Member follows a valid confirmation link
- **WHEN** Supabase accepts the one-time email confirmation token and returns a confirmed session
- **THEN** the frontend SHALL show confirmation success, clear callback parameters, and replace the route with `/orders`

#### Scenario: Confirmation link is invalid or expired
- **WHEN** the confirmation callback contains an invalid or expired token
- **THEN** the frontend SHALL show a non-sensitive failure state with an action to request another confirmation email and SHALL NOT render protected content

### Requirement: Confirmation email can be resent safely
The verification waiting and failure states SHALL allow a visitor to request another signup confirmation email. The response MUST avoid disclosing whether an email belongs to an account, and rate-limit failures SHALL instruct the visitor to wait before retrying.

#### Scenario: Resend request is accepted
- **WHEN** a visitor submits a syntactically valid email for confirmation resend
- **THEN** the frontend SHALL call Supabase resend with type `signup` and SHALL display the same neutral sent message regardless of account existence

#### Scenario: Resend is rate limited
- **WHEN** Supabase rejects a resend request because of rate limiting
- **THEN** the frontend SHALL display a wait-and-retry message and SHALL NOT expose the raw provider error
