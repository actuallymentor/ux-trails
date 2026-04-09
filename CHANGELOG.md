# Changelog

## [0.22.0] - 2026-04-09

### Added
- "Error prevention" Zhang subcategory with i18n for all 11 locales (uncommitted)
- "Remove all tooltips from input fields" UX sin (uncommitted)
- "Remove placeholders from input fields" UX sin (uncommitted)

## [0.21.0] - 2026-04-09

### Added
- "Good error messages" Zhang subcategory with hidden password requirements sin (uncommitted)
- i18n for "Good error messages" subcategory across all 11 locales (uncommitted)

## [0.20.0] - 2026-04-03

### Added
- "Force chatbot on user for appointments" UX sin with rigid chat widget (uncommitted)
- Zhang subcategory "Flexibility and efficiency" with i18n for all 11 locales (uncommitted)
- "Informative feedback" Zhang subcategory (b5f713f)

### Changed
- Move "Forced small hamburger menu" from Other to Zhang / Informative feedback (b5f713f)
- Update "change language" instruction to reference menu dropdown (cdfdaa2)

## [0.19.0] - 2026-04-03

### Added
- "Call lab results by acronyms" UX sin under Zhang / Minimize memory load (uncommitted)
- "Instruct instead of do" UX sin with instruction modal (uncommitted)
- Zhang subcategory "Minimize memory load" with i18n for all 11 locales (uncommitted)

## [0.18.0] - 2026-04-03

### Added
- Read/unread message state with status badges (uncommitted)
- Unread message count pill in menu navigation (uncommitted)
- "Opaque messages count" UX sin under Zhang / Visibility of system state (uncommitted)
- Unread count subtitle on messages page (uncommitted)
- "No input feedback" UX sin under Zhang / Visibility of system state (uncommitted)
- "Ambiguous icons" UX sin under Zhang / Match between system and real world (uncommitted)
- "Dropdown icon from language select is missing" UX sin (uncommitted)
- Globe icon on language selector in menu (uncommitted)

### Changed
- Move "Buttons disguised as text" sin to Zhang / Match between system and real world (uncommitted)
- Viewing a message marks it as read automatically (uncommitted)
- Unread badge uses accent color instead of primary (uncommitted)
- Remove app settings link from menu navigation (uncommitted)

### Fixed
- Messages page layout alignment via Column width/wrap overrides (uncommitted)

## [0.17.0] - 2026-04-03

### Added
- Add "Opaque lab measurement counts" UX sin under Zhang / Visibility of system state (uncommitted)
- When enabled, lab result counts show "1+" instead of actual numbers (uncommitted)

## [0.16.0] - 2026-04-03

### Added
- Add "Inconsistent action naming" UX sin under Zhang / Consistency and standards (uncommitted)
- When enabled, homepage quick actions show confusing alternative labels (uncommitted)

## [0.15.0] - 2026-04-03

### Added
- Add "App Settings" page at `/profile/app-settings` with language selector (uncommitted)
- Add "App settings" link to navigation menu (uncommitted)
- Add `appSettings` and `menu.appSettings` i18n keys across all 11 locales (uncommitted)

### Changed
- Homepage "Change language" quick action now links to App Settings page (uncommitted)

## [0.14.0] - 2026-04-03

### Added
- Add "Quick actions" section to homepage with new appointment, edit profile, and change language links (uncommitted)
- Add `homepage.quickActions` i18n keys across all 11 locales (uncommitted)

## [0.13.0] - 2026-04-03

### Added
- Add "Confusing synonym use" UX sin under Zhang / Consistency and standards (uncommitted)
- When enabled, "Heart rate" shown as "Pulse rate" on detail, documents, and messages pages (uncommitted)
- Add `labs.synonyms.heartrate` i18n key across all 11 locales (uncommitted)

## [0.12.0] - 2026-04-03

### Added
- Add subcategory grouping under Zhang heuristics section (uncommitted)
- Add "Visibility of system state" subcategory with i18n across all 11 locales (uncommitted)

## [0.11.0] - 2026-04-03

### Added
- Add heart rate lab result (60–100 bpm) with mock data generation (uncommitted)
- Add `heartrate` i18n key across all 11 locales (uncommitted)

## [0.10.0] - 2026-04-03

### Added
- Split admin page UX sins into "Zhang et al. heuristics" and "Other UX sins" sections (uncommitted)
- Add `category` field to `SIN_CATALOG` for section grouping (uncommitted)
- Add i18n keys `sectionZhang` and `sectionOther` across all 11 locales (uncommitted)

## [0.9.0] - 2026-03-31

### Added
- i18n support for 7 new languages: French, German, Italian, Portuguese, Polish, Russian, Japanese (c4a6072)

### Changed
- Language selector shows native language names instead of flag emojis (uncommitted)
