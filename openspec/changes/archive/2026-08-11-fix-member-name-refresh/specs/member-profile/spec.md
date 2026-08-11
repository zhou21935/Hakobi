## MODIFIED Requirements

### Requirement: Authenticated interface displays the owned member username
After a confirmed session is established, the application SHALL load the session owner's profile after authentication initialization completes and display its username in the authenticated interface. A restored valid session after a page refresh MUST trigger the owned profile load even when the authenticated state became true before initialization completed. While that profile request is pending, the sidebar SHALL reserve the identity row's layout space but SHALL NOT display `會員`, the session Email, or any other identity text. The Email fallback SHALL appear only after profile loading fails. Logout and unauthorized-session cleanup MUST clear the profile from memory.

#### Scenario: Owned profile loads
- **WHEN** a confirmed member enters the authenticated application and profile loading succeeds
- **THEN** the sidebar SHALL display the preserved member username

#### Scenario: Page refresh restores an existing session
- **WHEN** a protected page refresh restores a valid session before authentication initialization is marked complete
- **THEN** the application SHALL load the session owner's profile once initialization completes, SHALL keep the reserved identity row free of visible text while waiting, and SHALL display the preserved member username after success

#### Scenario: Profile loading remains pending
- **WHEN** the authenticated session Email is available but the owned profile request has not succeeded or failed
- **THEN** the sidebar SHALL preserve the identity row height and SHALL NOT display `會員`, the session Email, or any other identity text

#### Scenario: Sign-in establishes a new authenticated session
- **WHEN** a member signs out and then signs in again while the new session owner's profile is loading
- **THEN** the sidebar SHALL preserve an empty identity row until that profile succeeds or fails and SHALL NOT flash a default identity

#### Scenario: Profile loading fails temporarily
- **WHEN** the confirmed session is valid but the profile request fails
- **THEN** the application SHALL retain protected access, display the session Email as a fallback identity with a retryable profile error, and SHALL NOT display another member's cached username

#### Scenario: Member signs out
- **WHEN** the member signs out or an API response invalidates the session
- **THEN** the application SHALL clear the loaded profile together with user-scoped order state

### Requirement: Authenticated members can view their personal profile
The authenticated application SHALL provide a protected personal profile page at `/profile`. The page MUST display the session owner's editable username with the field label `會員名稱` and editable display name with the field label `真實姓名`, and MUST display the Supabase Auth Email as a read-only value that is not stored in or submitted to `member_profiles`. The page SHALL display the `個人資料` heading without the subtitle `查看並更新你的會員識別資料`. The sidebar footer SHALL center the member username consistently with the logout control while preserving single-line truncation for long usernames.

#### Scenario: Member opens the profile page from navigation
- **WHEN** a confirmed member selects `個人資料` under the sidebar `會員` section
- **THEN** the application SHALL navigate to `/profile` and display the member's username under `會員名稱`, display name under `真實姓名`, and read-only session Email

#### Scenario: Anonymous visitor requests the profile page
- **WHEN** a visitor without an authenticated confirmed session requests `/profile`
- **THEN** the existing authentication guard SHALL redirect the visitor to login with `/profile` preserved as the safe return destination

#### Scenario: Profile loading fails
- **WHEN** the session remains valid but the owned profile cannot be loaded
- **THEN** the page SHALL display a non-sensitive load error and retry action, SHALL NOT display another member's cached data, and SHALL keep the Email read-only

#### Scenario: Profile presentation uses concise member-facing labels
- **WHEN** a confirmed member views the personal profile page and authenticated sidebar
- **THEN** the page SHALL show the `個人資料` heading without `查看並更新你的會員識別資料`, SHALL label the username input `會員名稱`, SHALL label the display-name input `真實姓名`, and SHALL center the sidebar footer username like the logout control
