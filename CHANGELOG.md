# Changelog

All notable changes to the Logseq Reminder Notifications plugin will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

# Changelog

## [1.2.2] - 2025-10-14 - STABLE RELEASE
### 🚨 Critical Bug Fixes
- **FIXED**: Syntax error in parseScheduledDateTime function that completely broke time parsing
- **FIXED**: XCode crashes when accessing plugin settings (removed problematic settings schema)  
- **FIXED**: Duplicate notifications for past events (improved time filtering with 5-minute tolerance)
- **FIXED**: Plugin ID conflicts causing duplicate entries in plugin list
- **FIXED**: Overly aggressive past event filtering that blocked current notifications

### 🔧 Stability Improvements
- Simplified settings schema to prevent crashes (removed advanced settings temporarily)
- Enhanced debug output for better troubleshooting
- Session-only notification tracking (no persistent storage to avoid conflicts)
- Improved time parsing with comprehensive error handling
- Better block detection and processing logic

### ✅ Verified Working Features
- Basic reminder notifications (desktop + in-app)
- Scheduled block detection and parsing
- Time-based notification triggering
- Duplicate notification prevention
- Past event filtering (blocks events older than 5 minutes)
- Manual rescan via slash command

### 🚫 Temporarily Disabled Features
- Advanced settings UI (to prevent crashes)
- Multiple reminder intervals
- All-day reminders
- Quiet hours
- Overdue reminders
- Custom notification prefixes

## [1.2.1] - 2025-10-14 - DEBUGGING VERSION
### Attempted Fixes (Partially Successful)
- Removed persistent storage references
- Simplified notification tracking
- Improved past event filtering

## [1.2.0] - 2025-10-14 - UNSTABLE (CRITICAL BUGS)
### Added (But Buggy)
- Multiple reminder intervals support (caused crashes)
- All-day reminder support (caused parsing issues)
- Quiet hours functionality (caused XCode crashes)
- Weekend mode (caused settings conflicts)
- Overdue reminder system (caused duplicate notifications)
- Enhanced notification customization (caused crashes)
- Comprehensive settings panel (caused XCode crashes)

### Issues Discovered
- Settings schema caused XCode crashes when accessed
- Syntax errors broke core parsing functionality  
- Overly complex features introduced instability
- Persistent storage caused settings.json conflicts

## [1.1.0] - 2025-10-14

## [1.1.0] - 2025-10-14

### Added
- **Automatic block detection** - Plugin now automatically scans for new scheduled blocks every 2 minutes
- **Keyboard shortcut** - Added `Cmd+Shift+R` (or `Ctrl+Shift+R`) for quick manual rescan
- **Periodic background scanning** - Ensures no scheduled blocks are missed
- **Enhanced logging** - Better console output for debugging and monitoring

### Fixed
- **UI interference resolved** - Removed problematic database listeners that caused invisible text while typing
- **Real-time detection** - No more need for manual `/reminders: rescan` after creating scheduled blocks
- **Performance improvements** - Optimized scanning frequency and debouncing

### Changed
- **Scanning frequency** - Automatic scans every 2 minutes (down from manual-only)
- **Better user experience** - Plugin now "just works" without manual intervention

## [1.0.0] - 2025-10-14

### Added
- Desktop and in-app notifications for scheduled blocks
- Support for both `SCHEDULED: <timestamp>` and `scheduled:: property` formats
- Configurable lead time (0-60 minutes before scheduled time)
- Configurable polling interval (10-300 seconds)
- Daily automatic rescanning at configurable hour
- Manual rescan via `/reminders: rescan` slash command
- Duplicate notification prevention
- Smart time parsing for various timestamp formats
- Local timezone support
- 7-day reminder window
- Comprehensive error handling and logging

### Technical Details
- Works with Logseq desktop app
- Uses Datascript queries for efficient block scanning
- Persistent notification tracking in plugin settings
- Graceful fallbacks for notification permissions
- Detailed console logging for debugging

### Known Limitations
- Only scans blocks within next 7 days
- Requires specific time format (ignores date-only schedules)
- Uses local system timezone only
- Desktop notifications require permission grant