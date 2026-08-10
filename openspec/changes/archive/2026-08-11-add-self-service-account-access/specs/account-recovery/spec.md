## ADDED Requirements

### Requirement: Members can request a password reset without account enumeration
The frontend SHALL provide a public forgot-password form. For every syntactically valid email submission, it MUST request a Supabase password recovery email and render the same neutral sent result regardless of whether the email belongs to an account. Provider rate limits and network failures SHALL use retryable messages that do not reveal account existence.

#### Scenario: Reset request is submitted
- **WHEN** a visitor submits a syntactically valid email address
- **THEN** the frontend SHALL call Supabase password reset with the configured `/reset-password` redirect and SHALL display the neutral sent result

#### Scenario: Unknown email is submitted
- **WHEN** a visitor submits an email address that is not registered
- **THEN** the visible result SHALL be indistinguishable from the result for a registered email

### Requirement: Recovery links permit one password replacement
The reset-password route SHALL accept a valid Supabase recovery session and SHALL permit the member to submit a new password and exact confirmation once. The new password MUST satisfy the same 8–64 character, letter-and-digit, no-whitespace, username-difference, and weak-password rules used at registration.

#### Scenario: Valid recovery session changes password
- **WHEN** a member follows a valid recovery link and submits matching valid new passwords
- **THEN** the frontend SHALL call Supabase user update once, show success, remove recovery callback parameters, and navigate away from the reset form

#### Scenario: New password violates policy
- **WHEN** a recovery session exists but the submitted new password violates any account password rule
- **THEN** the frontend SHALL display the relevant field error and SHALL NOT call Supabase user update

#### Scenario: Recovery link is invalid or expired
- **WHEN** the reset-password route cannot establish a valid recovery session
- **THEN** the frontend SHALL reject password submission and show an action to request a new recovery email

### Requirement: Password recovery does not expose credentials or tokens
The application MUST NOT persist plaintext passwords or recovery tokens in application state outside the active form and Supabase session handling. It MUST NOT include passwords, access tokens, refresh tokens, or raw callback fragments in logs or user-visible errors.

#### Scenario: Recovery operation fails
- **WHEN** Supabase rejects password update or callback exchange
- **THEN** the application SHALL display a mapped non-sensitive error and SHALL NOT render the raw provider payload
