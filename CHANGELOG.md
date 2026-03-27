# Changelog

## [0.2.1] - 2026-03-13

### Fixed
- translate lab test names dynamically on language switch instead of using stale store values
- regenerate document/message letters when language changes

## [0.2.0] - 2026-03-13

### Fixed
- fix timezone bug in date comparisons rejecting valid future dates (is_future, date_after_timestamp_validator, get_slots_for_date)

### Added
- add Dutch postcode validation (4 digits + 2 letters) to profile settings with inline feedback and i18n error messages
