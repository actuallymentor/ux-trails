# Changelog

## [0.3.1] - 2026-03-29

### Fixed
- remove redundant password hint text; requirement details now only in label tooltip

## [0.3.0] - 2026-03-27

### Added
- add UX sins infrastructure: Zustand store, admin panel (/admin), config page (/config)
- add researcher toggle panel with QR code sharing for cross-device configuration
- add first UX sin: hidden password requirements on registration form
- add translations for admin/config pages in all 4 locales (EN, NL, ES, ZH)
- add `qrcode.react` dependency for QR code rendering

## [0.2.1] - 2026-03-13

### Fixed
- translate lab test names dynamically on language switch instead of using stale store values
- regenerate document/message letters when language changes

## [0.2.0] - 2026-03-13

### Fixed
- fix timezone bug in date comparisons rejecting valid future dates (is_future, date_after_timestamp_validator, get_slots_for_date)

### Added
- add Dutch postcode validation (4 digits + 2 letters) to profile settings with inline feedback and i18n error messages
