# Netlify OG Thumbnail Replacer - Changelog

All notable changes to this project will be documented in this file.

## [1.4] - 2026-04-19
### Added
- Support for `@connect netlify.app` to reduce permission prompts
- Cleaner, production-ready code (removed excessive debug logs)
- Improved reliability of thumbnail detection

### Changed
- Switched to more stable selectors based on Netlify's actual DOM structure (`tw-aspect-screenshot`, `.media`, `li.clickable`)

## [1.3] - 2026-04-19
### Added
- Proper project name extraction from `<a href="/projects/NAME/">` links
- Better card traversal using `closest('li.clickable')` and `.media`

### Fixed
- Major selector issues that prevented project name detection

## [1.2-debug] - 2026-04-19
### Added
- Heavy debugging mode with detailed console logs
- Multiple fallback methods for extracting project names
- Logging of all links inside cards

## [1.1-debug] - 2026-04-19
### Added
- Initial debug version with extensive logging
- MutationObserver + polling for React-heavy Netlify UI
- Cache to avoid repeated requests

## [1.0] - 2026-04-19
### Added
- Initial working version
- Automatic fetching of `og:image` and `twitter:image` meta tags
- Replacement of Netlify default `.webp` thumbnails
- Basic MutationObserver support

---

## Notes
- Versions marked "debug" were temporary development versions used to diagnose Netlify's DOM structure.
- The script is tailored specifically for https://app.netlify.com/teams/*/projects
