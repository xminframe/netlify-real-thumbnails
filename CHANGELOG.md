# Netlify Real OG Thumbnails - Changelog

All notable changes to this project will be documented in this file.

## [1.6] - 2026-04-19
### Added
- Full support for both **List view** and **Grid view**
- More robust project name detection
- Better container traversal for grid layout

### Improved
- Cleaner and more maintainable code structure

## [1.5] - 2026-04-19
### Added
- Failure caching to prevent repeated requests while waiting for Tampermonkey permissions
- Gentler polling interval (3 seconds)
- `@connect netlify.app` for smoother permission handling

### Improved
- More reliable thumbnail detection using `tw-aspect-screenshot` class
- Cleaner production code (removed debug spam)

## [1.4] - 2026-04-19
### Added
- Support for `@connect netlify.app`
- Final polished, production-ready version

## [1.3] - 2026-04-19
### Added
- Proper project name extraction from `/projects/NAME/` links
- Better card traversal using `closest('li.clickable')`

### Fixed
- Major selector issues that prevented project name detection

## [1.0] - 2026-04-19
### Added
- Initial working version
- Automatic fetching of `og:image` / `twitter:image` meta tags
- Replacement of Netlify default thumbnails

---

**Note**: Early debug versions (1.1 and 1.2) were used internally for development and are not included in this repository.
