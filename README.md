# Logseq Reminder Notifications Plugin

**v1.2.2 - STABLE RELEASE** 🚀

![Plugin Demo](https://img.shields.io/badge/Logseq-Plugin-blue) ![Version](https://img.shields.io/badge/version-1.2.2-green) ![License](https://img.shields.io/badge/license-MIT-blue)

Desktop and in-app notifications for scheduled blocks in Logseq. Never miss your scheduled tasks and reminders again!

## 🎬 Demo

<!-- TODO: Add screenshots/GIF showing:
1. Desktop notification popup
2. In-app notification in Logseq
3. Plugin working with scheduled block
-->

![Reminder Notification Demo](./screenshots/demo.gif)
*Desktop notification and in-app message for scheduled reminders*

## ✨ Key Features

## 🎯 Current Status

✅ **WORKING FEATURES:**
- 🔔 Desktop notifications for scheduled blocks
- 📱 In-app toast messages  
- ⚡ Automatic block detection and parsing
- 🕒 Reliable notification timing
- 📋 Manual rescan via `/reminders: rescan` command
- 🔍 Smart parsing of `SCHEDULED: <timestamp>` formats
- 🛡️ Duplicate notification prevention
- ⏰ Past event filtering (ignores events older than 5 minutes)

🚧 **TEMPORARILY DISABLED** (for stability):
- Settings GUI (to prevent crashes)
- Multiple reminder intervals
- All-day reminders  
- Quiet hours functionality

## Installation

1. **Download this repository:**
   ```bash
   git clone https://github.com/Joemnewton/logseq-reminder-notifications.git
   ```

2. **Load in Logseq:**
   - Settings → Plugins → "Load unpacked plugin"
   - Select the `logseq-reminder-notifications` folder
   - Enable the plugin

3. **Grant permissions:**
   - Allow notifications when prompted
   - Check browser notification settings if needed

## Usage

### Supported Formats

**Journal-style timestamps (RECOMMENDED):**
```
SCHEDULED: <2025-10-14 Mon 14:30> Call the dentist
SCHEDULED: <2025-10-15 Tue 09:00> Team meeting
```

**Property-based scheduling:**
```
- Call the dentist
  scheduled:: 2025-10-14 14:30
```

### Commands

- `/reminders: rescan` - Manually refresh reminder list

## 📺 Screenshots

### Desktop Notifications
![Desktop Notification](./screenshots/desktop-notification.png)
*Native desktop notification that appears even when Logseq is minimized*

### In-App Notifications  
![In-App Message](./screenshots/in-app-message.png)
*Toast message that appears within Logseq when you're actively using the app*

### Console Output
![Console Debug](./screenshots/console-output.png)
*Debug information showing plugin scanning and processing scheduled blocks*

## Configuration

**Current Settings (Hardcoded for Stability):**
- Lead time: 0 minutes (notifications at scheduled time)
- Check interval: 30 seconds  
- Past event tolerance: 5 minutes (prevents spam from old events)

## 🔧 Recent Fixes (v1.2.2)

This version fixes critical bugs from earlier releases:

- ✅ **Fixed XCode crashes** - Removed problematic settings schema
- ✅ **Fixed syntax error** - Repaired broken time parsing function  
- ✅ **Fixed duplicate notifications** - Better past event filtering
- ✅ **Fixed plugin conflicts** - Consistent plugin ID
- ✅ **Restored functionality** - Notifications work reliably again

## Troubleshooting

**No notifications?**
1. Check browser console (F12) for error messages
2. Run `/reminders: rescan` to refresh
3. Verify your block uses supported timestamp format:
   - ✅ `SCHEDULED: <2025-10-14 Mon 14:30> Task`
   - ❌ `SCHEDULED: <2025-10-14> Task` (no time)

**Console debugging:**
- Look for `🔔 Reminder Notifications plugin v1.2.2-BUGFIX starting...`
- Check for detailed parsing messages when running rescan

## Development Roadmap

This is a **stable maintenance release** focused on reliability. Future versions will gradually re-add advanced features:

1. **v1.3.0**: Basic settings UI (lead time only)
2. **v1.4.0**: Multiple reminder intervals  
3. **v1.5.0**: All-day reminder support
4. **v1.6.0**: Quiet hours and advanced features

## Contributing

1. Fork this repository
2. Test your changes thoroughly
3. Submit a pull request with clear description

## License

MIT License - See LICENSE file for details.

## Support

For issues:
1. Check browser console for errors
2. Include your Logseq version and block format
3. Create an issue on GitHub with reproduction steps