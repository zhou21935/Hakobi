## ADDED Requirements

### Requirement: Member usernames have a canonical format
A member username MUST contain between 3 and 20 Unicode characters inclusive and MUST contain only Han characters, ASCII letters, ASCII digits, or underscore. It MUST NOT contain whitespace or other symbols. The system SHALL preserve the submitted display form and SHALL derive the uniqueness key by trimming and Unicode lowercasing the value.

#### Scenario: Username format is validated
- **WHEN** a visitor enters a member username
- **THEN** the system SHALL produce the expected result in the format example

##### Example: username format cases

| Input | Expected result | Normalized value |
| --- | --- | --- |
| `Hakobi_01` | accepted | `hakobi_01` |
| `箱子君` | accepted | `箱子君` |
| `ab` | rejected: fewer than 3 characters | — |
| 21 valid characters | rejected: more than 20 characters | — |
| `hako bi` | rejected: whitespace | — |
| `hako-bi` | rejected: unsupported symbol | — |

### Requirement: Member usernames are unique under normalized comparison
The database MUST enforce a unique constraint on the normalized username. An availability query SHALL return only whether a valid normalized username is available. Preflight availability checks MUST NOT replace the database constraint as the final decision during concurrent registrations.

#### Scenario: Existing username differs only by ASCII case
- **WHEN** profile `Hakobi` already exists and a visitor checks or submits `hakobi`
- **THEN** the system SHALL treat the normalized value as occupied and display `此名稱已被使用`

#### Scenario: Concurrent visitors request the same username
- **WHEN** two valid signup transactions concurrently request the same normalized username
- **THEN** exactly one profile SHALL be created and the rejected flow SHALL display `此名稱已被使用` after confirming availability is no longer true

### Requirement: Every email-password member has one owned profile
A successful Auth user creation MUST atomically create exactly one member profile keyed by the Auth user UUID using validated username metadata. Profile rows MUST be protected by Row Level Security so an authenticated member can read only their own full profile. Deleting the Auth user MUST cascade to its profile.

#### Scenario: Auth user creation succeeds
- **WHEN** Supabase creates an email-password user with valid unused username metadata
- **THEN** the database trigger SHALL create one profile with the same user UUID, preserved display username, and normalized unique username

#### Scenario: Username metadata is invalid
- **WHEN** Auth user creation supplies missing or invalid username metadata
- **THEN** the database SHALL reject the user creation transaction and SHALL NOT leave an Auth user without a profile

#### Scenario: Member reads another profile directly
- **WHEN** authenticated member A queries the full profile row owned by member B
- **THEN** Row Level Security SHALL return no member B profile data

### Requirement: Authenticated interface displays the owned member username
After a confirmed session is established, the application SHALL load the session owner's profile and display its username in the authenticated interface. Logout and unauthorized-session cleanup MUST clear the profile from memory.

#### Scenario: Owned profile loads
- **WHEN** a confirmed member enters the authenticated application and profile loading succeeds
- **THEN** the sidebar SHALL display the preserved member username

#### Scenario: Profile loading fails temporarily
- **WHEN** the confirmed session is valid but the profile request fails
- **THEN** the application SHALL retain protected access, display a non-sensitive fallback identity and a retryable profile error, and SHALL NOT display another member's cached username

#### Scenario: Member signs out
- **WHEN** the member signs out or an API response invalidates the session
- **THEN** the application SHALL clear the loaded profile together with user-scoped order state
