## MODIFIED Requirements

### Requirement: Users authenticate with Supabase email credentials
The frontend SHALL allow a confirmed user to sign in with email and password through Supabase Auth and SHALL render protected application routes only while an authenticated session with a confirmed email exists. A successful login SHALL navigate to a validated same-origin `redirect` path captured from the original protected request, or `/` when the value is absent or unsafe.

#### Scenario: Valid confirmed credentials establish a session
- **WHEN** a confirmed user submits valid email and password credentials without a redirect destination
- **THEN** the frontend SHALL establish the Supabase session and navigate to `/`

#### Scenario: Original protected destination is restored
- **WHEN** a confirmed user was redirected from `/orders/parcel` to login and then submits valid credentials
- **THEN** the frontend SHALL establish the session and replace the route with `/orders/parcel`

#### Scenario: Unsafe redirect is rejected
- **WHEN** login receives a redirect value that is external, begins with `//`, or does not begin with a single `/`
- **THEN** the frontend SHALL ignore that value and navigate to `/`

#### Scenario: Invalid credentials are rejected
- **WHEN** Supabase rejects submitted credentials
- **THEN** the frontend SHALL remain on the login view and display a non-sensitive authentication error

#### Scenario: Unconfirmed credentials are rejected
- **WHEN** Supabase rejects correct credentials because the email is not confirmed
- **THEN** the frontend SHALL remain outside protected content and display an action to continue email verification

### Requirement: Public account routes respect authentication state
The router SHALL expose public routes for login, registration, email verification, forgot password, and reset password. An ordinary confirmed session MUST be redirected away from login, registration, and forgot-password routes to `/`. The reset-password route MUST accept password submission only during a valid Supabase recovery session.

#### Scenario: Authenticated member opens registration
- **WHEN** a confirmed authenticated member navigates to `/register`
- **THEN** the router SHALL replace the destination with `/`

#### Scenario: Anonymous visitor opens an account route
- **WHEN** a visitor without a session opens `/register`, `/verify-email`, or `/forgot-password`
- **THEN** the router SHALL render the requested public account view without the authenticated App shell

#### Scenario: Ordinary session opens reset password
- **WHEN** a session exists without a password recovery authentication event and the user opens `/reset-password`
- **THEN** the frontend SHALL reject password submission and display an action to request a recovery email
