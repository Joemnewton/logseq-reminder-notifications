# Changelog

All notable changes to the Logseq Reminder Notifications plugin will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.2.0] - 2025-10-14

### Added
- **All-day reminders** - Enable notifications for blocks scheduled without specific times (e.g., `SCHEDULED: <2025-10-14>`)
- **Configurable all-day time** - Set default reminder time for all-day blocks (default 9:00 AM)
- **Multiple reminder intervals** - Get reminded at multiple times before scheduled events (e.g., 60, 30, 15, 5 minutes before)
- **Quiet hours** - Disable notifications during specified hours (default 10 PM - 7 AM)
- **Weekend mode** - Reduce reminder frequency on weekends
- **Overdue reminders** - Continue getting reminded about missed scheduled items
- **Custom notification prefixes** - Personalize notification titles
- **Notification sound control** - Enable/disable notification sounds
- **Enhanced lead time** - Extended maximum lead time to 2 hours

### Improved
- **Better notification context** - Messages now show timing context (e.g., "in 15 minutes", "OVERDUE")
- **Smarter notification keys** - Support multiple reminders for the same block
- **Weekend awareness** - Optional reduced frequency on weekends

### Settings Added
- `enableAllDayReminders` - Toggle all-day block reminders
- `allDayReminderTime` - Time for all-day reminders (default 9:00 AM)
- `multipleReminders` - Enable multiple reminder intervals
- `reminderIntervals` - Comma-separated intervals (default "15,5,0")
- `weekendMode` - Quiet mode for weekends
- `quietHoursStart` / `quietHoursEnd` - Define quiet hours
- `notificationSound` - Control notification sounds
- `overdueReminders` - Enable overdue notifications
- `overdueInterval` - How often to remind about overdue items
- `customNotificationPrefix` - Customize notification titles

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