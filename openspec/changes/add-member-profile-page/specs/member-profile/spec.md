## ADDED Requirements

### Requirement: Member display names have a constrained non-unique format
Every member profile MUST contain a display name between 2 and 30 Unicode characters inclusive. A display name MUST contain only Han characters, ASCII letters, or ASCII digits, MUST NOT contain whitespace or special symbols, and SHALL NOT be required to be unique.

#### Scenario: Display-name format is validated consistently
- **WHEN** a member enters a display name in the profile form or submits it to the database
- **THEN** the frontend and database SHALL produce the expected result in the format example

##### Example: Display-name boundary and character cases

| Input | Expected result |
| --- | --- |
| `王小明` | accepted |
| `Hakobi01` | accepted |
| `王小明88` | accepted |
| one valid character | rejected: fewer than 2 characters |
| 31 valid characters | rejected: more than 30 characters |
| `王 小明` | rejected: contains whitespace |
| `Hakobi_01` | rejected: contains a special symbol |
| `王小明🙂` | rejected: contains a special symbol |
| empty value | rejected: required |

#### Scenario: Existing profiles receive a valid display name
- **WHEN** the profile migration runs for an existing member without a display name
- **THEN** the database SHALL set the display name to `會員` and SHALL enforce the same non-null format constraints for subsequent writes

### Requirement: Authenticated members can view their personal profile
The authenticated application SHALL provide a protected personal profile page at `/profile`. The page MUST display the session owner's editable username and display name, MUST label the display-name field `真實姓名`, and MUST display the Supabase Auth Email as a read-only value that is not stored in or submitted to `member_profiles`. The page SHALL display the `個人資料` heading without the subtitle `查看並更新你的會員識別資料`. The sidebar footer SHALL center the member username consistently with the logout control while preserving single-line truncation for long usernames.

#### Scenario: Member opens the profile page from navigation
- **WHEN** a confirmed member selects `個人資料` under the sidebar `會員` section
- **THEN** the application SHALL navigate to `/profile` and display the member's username, display name, and read-only session Email

#### Scenario: Anonymous visitor requests the profile page
- **WHEN** a visitor without an authenticated confirmed session requests `/profile`
- **THEN** the existing authentication guard SHALL redirect the visitor to login with `/profile` preserved as the safe return destination

#### Scenario: Profile loading fails
- **WHEN** the session remains valid but the owned profile cannot be loaded
- **THEN** the page SHALL display a non-sensitive load error and retry action, SHALL NOT display another member's cached data, and SHALL keep the Email read-only

#### Scenario: Profile presentation uses concise member-facing labels
- **WHEN** a confirmed member views the personal profile page and authenticated sidebar
- **THEN** the page SHALL show the `個人資料` heading without `查看並更新你的會員識別資料`, SHALL label the display-name input `真實姓名`, and SHALL center the sidebar footer username like the logout control

### Requirement: Members can update only their owned editable profile fields
An authenticated member SHALL be able to update the username and display name of only the profile whose `user_id` matches the session owner. Row Level Security MUST reject updates to another member's profile. The application MUST validate both fields before mutation, MUST preserve the submitted form when a write fails, and MUST update confirmed application profile state only after a successful database response.

#### Scenario: Valid profile update succeeds
- **WHEN** a member changes username from `Hakobi_01` to `Hakobi_02`, sets display name to `王小明`, and submits valid values
- **THEN** the database SHALL save the username, its normalized value `hakobi_02`, and the display name, and the page and sidebar SHALL show the confirmed values with a success message

#### Scenario: Profile validation fails before mutation
- **WHEN** either editable field is empty or fails its defined format or length constraint
- **THEN** the page SHALL display the corresponding field error and SHALL NOT send an update mutation

#### Scenario: Updated username is already occupied
- **WHEN** a member submits a valid username whose normalized value is owned by another profile
- **THEN** the database unique constraint SHALL reject the update, the page SHALL display `此名稱已被使用`, and the submitted display name and username SHALL remain in the form

#### Scenario: Profile write fails unexpectedly
- **WHEN** a valid owned update fails for a reason other than username conflict
- **THEN** the page SHALL display a non-sensitive save error, preserve the submitted form, and keep the previously confirmed profile in global application state

#### Scenario: Member attempts to update another profile
- **WHEN** authenticated member A directly submits an update targeting member B's `user_id`
- **THEN** Row Level Security SHALL update no member B data and SHALL return no member B profile row

#### Scenario: Email is excluded from profile updates
- **WHEN** a member saves the personal profile form
- **THEN** the update payload SHALL contain only the editable profile fields and normalized username data and SHALL NOT contain or modify the Auth Email
