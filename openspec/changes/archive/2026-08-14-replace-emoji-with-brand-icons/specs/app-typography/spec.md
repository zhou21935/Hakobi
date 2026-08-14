## ADDED Requirements

### Requirement: Application typography uses Chiron GoRound TC at Medium weight

The frontend SHALL load `Chiron GoRound TC` from the specified Google Fonts variable-weight stylesheet, SHALL use it as the first-choice heading and body font family, and MUST render text without an explicit weight at Medium 500.

#### Scenario: Application font resources load

- **WHEN** the application HTML is requested
- **THEN** it SHALL preconnect to `https://fonts.googleapis.com` and `https://fonts.gstatic.com`
- **AND** it SHALL load `https://fonts.googleapis.com/css2?family=Chiron+GoRound+TC:wght@200..900&display=swap`
- **AND** it SHALL NOT request Baloo 2 or Noto Sans TC

#### Scenario: Default application typography is applied

- **WHEN** application content has no explicit font family or font weight override
- **THEN** it SHALL inherit `Chiron GoRound TC` with Medium 500
- **AND** system UI and sans-serif fonts SHALL remain available as fallbacks

#### Scenario: Explicit emphasis remains available

- **WHEN** a component explicitly applies a semibold or bold font-weight utility
- **THEN** the variable font SHALL render the requested weight without the global Medium default overriding it
