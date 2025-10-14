# Changelog

All notable changes to the Logseq Reminder Notifications plugin will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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