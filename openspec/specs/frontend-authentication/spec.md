# frontend-authentication Specification

## Purpose

TBD - created by archiving change 'order-supabase-integration'. Update Purpose after archive.

## Requirements

### Requirement: Users authenticate with Supabase email credentials
The frontend SHALL allow a user to sign in with email and password through Supabase Auth and SHALL render protected application routes only while an authenticated session exists.

#### Scenario: Valid credentials establish a session
- **WHEN** a user submits valid email and password credentials
- **THEN** the frontend SHALL establish the Supabase session and navigate to the orders application

#### Scenario: Invalid credentials are rejected
- **WHEN** Supabase rejects submitted credentials
- **THEN** the frontend SHALL remain on the login view and display a non-sensitive authentication error

---
### Requirement: Authentication state survives reloads
The frontend MUST restore the current Supabase session during application startup and MUST keep protected content in a loading state until restoration completes.

#### Scenario: Existing session is restored
- **WHEN** the application starts with a valid stored Supabase session
- **THEN** the frontend SHALL restore the user and permit protected navigation without another login

#### Scenario: No session exists
- **WHEN** session restoration completes without an authenticated user
- **THEN** the frontend SHALL redirect protected navigation to the login view

---
### Requirement: API calls use the current access token
Every protected backend request MUST obtain the current Supabase session access token at request time and send it as exactly one Authorization Bearer value. The frontend MUST NOT place access tokens in application logs or user-facing errors.

#### Scenario: Authenticated order request
- **WHEN** an authenticated user triggers an orders API operation
- **THEN** the request SHALL contain `Authorization: Bearer <current-access-token>`

#### Scenario: Session is unavailable
- **WHEN** an orders API operation cannot obtain an authenticated session
- **THEN** the frontend SHALL reject the operation locally as unauthenticated and SHALL navigate to the login view

---
### Requirement: Users can end their session
The frontend SHALL provide logout that signs out through Supabase, clears user-scoped in-memory order state, and returns to the login view.

#### Scenario: Logout succeeds
- **WHEN** an authenticated user activates logout
- **THEN** the frontend SHALL terminate the Supabase session, clear loaded orders, and render the login view
