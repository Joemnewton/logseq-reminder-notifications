# 🔔 Logseq ## Features

- 🔔 **Dual Notifications**: Both desktop notifications and Logseq in-app messages
- 📅 **Flexible Scheduling**: Supports both `SCHEDULED: <timestamp>` format and `scheduled:: property` format
- ⏰ **Time Parsing**: Handles various time formats including `<2025-10-14 Tue 14:30>` and `2025-10-14 14:30`
- 🚀 **Automatic Detection**: Automatically finds new scheduled blocks every 2 minutes - no manual rescanning needed!
- ⚡ **Quick Rescan**: Use `Cmd+Shift+R` or `/reminders: rescan` for immediate detection
- 📆 **All-Day Support**: Get reminders for date-only blocks (e.g., `<2025-10-14>`) at a configurable time
- 🔢 **Multiple Reminders**: Set multiple alerts (e.g., 1 hour, 30 min, 15 min, 5 min before)
- 🌙 **Quiet Hours**: Disable notifications during sleep/focus hours (e.g., 10 PM - 7 AM)
- ⏰ **Overdue Alerts**: Keep getting reminded about missed scheduled items
- 🎨 **Customizable**: Custom notification prefixes, sound control, weekend modes
- ⚙️ **Highly Configurable**: 12+ settings for personalized reminder experience
- 🚫 **Duplicate Prevention**: Prevents multiple notifications for the same scheduled block
- 🛡️ **Non-intrusive**: Won't interfere with your typing or editing experiencetifications Plugin

A powerful Logseq plugin that provides desktop notifications and in-app alerts for scheduled blocks. Never miss your scheduled tasks and reminders again!

![Plugin Demo](https://img.shields.io/badge/Logseq-Plugin-blue) ![Version](https://img.shields.io/badge/version-1.2.0-green) ![License](https://img.shields.io/badge/license-MIT-blue)

## 🎯 Perfect for
- **GTD practitioners** who schedule specific review times
- **Students** with study sessions and assignment deadlines  
- **Professionals** tracking meeting reminders and follow-ups
- **Anyone** who wants reliable notifications for time-based tasks

## Features

- 🔔 **Dual Notifications**: Both desktop notifications and Logseq in-app messages
- 📅 **Flexible Scheduling**: Supports both `SCHEDULED: <timestamp>` format and `scheduled:: property` format
- ⏰ **Time Parsing**: Handles various time formats including `<2025-10-14 Tue 14:30>` and `2025-10-14 14:30`
- � **Automatic Detection**: Automatically finds new scheduled blocks every 2 minutes - no manual rescanning needed!
- ⚡ **Quick Rescan**: Use `Cmd+Shift+R` or `/reminders: rescan` for immediate detection
- ⚙️ **Configurable Settings**: Customize lead time, check intervals, and rescan schedule
- 🚫 **Duplicate Prevention**: Prevents multiple notifications for the same scheduled block
- 🎯 **Smart Filtering**: Only shows reminders with specific times (ignores date-only schedules)
- 🛡️ **Non-intrusive**: Won't interfere with your typing or editing experience

## Installation

## 📥 Installation

### From Logseq Marketplace (Recommended)
1. Open Logseq → **Settings** → **Plugins** → **Marketplace**
2. Search for "Reminder Notifications"
3. Click **Install**
4. Enable the plugin and grant notification permissions when prompted

### Manual Installation (Development)
1. **Enable Developer Mode** in Logseq:
   - Go to **Settings** → **Advanced** → **Developer mode** ✅

2. **Download and Load**:
   - Download this repository as ZIP and extract
   - Go to **Settings** → **Plugins** → **Load unpacked plugin**
   - Select the extracted folder containing `package.json`

3. **Grant Permissions**:
   - Allow notifications when Logseq prompts you
   - macOS users: Ensure Logseq has notification permissions in System Settings

4. **Configure**:
   - Go to **Settings** → **Plugins** → **Reminder Notifications**
   - Adjust lead time, check interval, and rescan schedule as needed

### Development Setup

1. Clone this repository
2. Open in VS Code or your preferred editor
3. Test in Logseq by loading as an unpacked plugin

## Usage

### Supported Scheduling Formats

The plugin recognizes scheduled blocks in these formats:

#### 1. Journal-style Timestamps (in block content)
```
- SCHEDULED: <2025-10-14 Tue 14:30> Call the dentist
- TODO Buy groceries SCHEDULED: <2025-10-15 Wed 09:00>
```

#### 2. Property-based Scheduling
```
- Call the dentist
  scheduled:: 2025-10-14 14:30
  
- Buy groceries
  scheduled:: 2025-10-15T09:00
```

#### 3. Mixed Formats
```
- Meeting with team SCHEDULED: <2025-10-14 Tue 15:30>
  scheduled:: 2025-10-14 15:30
  notes:: Discuss project timeline
```

### Testing the Plugin

#### Quick Test Setup

1. **Create a test block** with a near-future time:
   ```
   - Test reminder SCHEDULED: <2025-10-14 Mon 16:45>
   ```
   (Replace with current date and a time 2-3 minutes from now)

2. **Enable desktop notifications** when prompted by Logseq

3. **Wait for automatic detection** - the plugin scans every 2 minutes automatically

4. **Get notified** - you'll receive both desktop and in-app notifications at the scheduled time!

#### Manual Control Options

**If you want immediate detection:**
- **Keyboard shortcut**: Press `Cmd+Shift+R` (Mac) or `Ctrl+Shift+R` (Windows/Linux)
- **Slash command**: Type `/reminders: rescan` in any block and press Enter
- **Check console**: Open Developer Tools (F12) → Console tab for detailed logs

### Configuration

Access plugin settings via **Settings** → **Plugins** → **Reminder Notifications**:

#### ⏰ **Basic Timing**
- **Lead Time (minutes)**: Show notifications X minutes before scheduled time (default: 0, max: 120)
- **Check Interval (seconds)**: How often to check for due reminders (default: 30, range: 10-300)
- **Daily Rescan Hour**: Hour of day for automatic rescan in 24h format (default: 3, range: 0-23)

#### 📅 **All-Day Reminders**
- **Enable All-Day Block Reminders**: Get notified for blocks like `SCHEDULED: <2025-10-14>` (default: off)
- **All-Day Reminder Time**: When to remind for all-day blocks (default: 9:00 AM, supports 15-min intervals)

#### 🔢 **Multiple Reminders**
- **Enable Multiple Reminders**: Get notified at multiple intervals before scheduled time
- **Reminder Intervals**: Comma-separated minutes before (default: "15,5,0" = 15 min, 5 min, and on-time)

#### 🌙 **Quiet Hours & Modes**
- **Weekend Quiet Mode**: Reduce reminder frequency on weekends
- **Quiet Hours Start/End**: No notifications during these hours (default: 10 PM - 7 AM)

#### ⏰ **Overdue Management**
- **Enable Overdue Reminders**: Keep reminding about missed scheduled items
- **Overdue Reminder Interval**: How often to remind about overdue items (default: 60 min)

#### 🎨 **Customization**
- **Notification Title Prefix**: Customize notification titles (default: "📅 Reminder")
- **Enable Notification Sound**: Play sound with notifications (default: on)

### Console Logging

The plugin provides detailed console logging for debugging:
- Open browser dev tools (F12) → Console tab
- Look for messages prefixed with 🔔, 📅, 🔍, etc.
- Scan results show found reminders and their scheduled times

## Limitations and Known Issues

### Current Limitations

1. **Date-only schedules ignored**: Blocks with `SCHEDULED: <2025-10-14>` (no time) won't trigger notifications
2. **Next 7 days only**: Only scans for reminders within the next week to avoid performance issues
3. **Local timezone only**: Uses system timezone, no custom timezone support
4. **Desktop permission required**: Desktop notifications need browser permission
5. **Memory-based scheduling**: Reminders are lost if Logseq is closed/restarted (rescanned on startup)

### Browser Compatibility

- **Desktop notifications**: Requires modern browser with Notification API support
- **Fallback behavior**: If desktop notifications fail, in-app messages still work
- **Permission handling**: Automatically requests notification permission on first load

### Performance Considerations

- **Database queries**: Scans all blocks with "SCHEDULED:" or `scheduled` properties
- **Memory usage**: Stores upcoming reminders in memory (limited to 7 days)
- **Query frequency**: Default 30-second polling interval balances responsiveness vs. performance
- **Large graphs**: May be slower on very large Logseq graphs (>10,000 blocks)

### Troubleshooting

#### No notifications appearing
1. Check browser notification permissions (click browser's lock icon)
2. Verify block has time component: `14:30` not just `<2025-10-14>`
3. Check console for error messages
4. Try manual rescan: `/reminders: rescan`

#### Duplicate notifications
- Plugin tracks notifications to prevent duplicates
- Restarting Logseq may cause one duplicate (will be prevented thereafter)
- Check "Already Notified" in settings (internal storage)

#### Performance issues
- Reduce check interval in settings (increase seconds)
- Change daily rescan to off-peak hours
- Contact support for very large graphs (>50,000 blocks)

## Development

### File Structure
```
logseq-reminder-plugin/
├── manifest.json          # Plugin metadata and settings schema
├── index.js              # Main plugin logic
├── utils/
│   └── time.js          # Time parsing utilities
└── README.md            # This documentation
```

### Key Functions

- `parseScheduledDateTime(text)`: Parse timestamps from various formats
- `scanForUpcomingReminders()`: Query database for scheduled blocks
- `checkForDueReminders()`: Check if any reminders are due
- `sendNotification(reminder)`: Send both desktop and in-app notifications

### Debugging

Enable verbose logging by checking the browser console:
1. Press F12 to open dev tools
2. Go to Console tab
3. Look for plugin messages (prefixed with emojis)
4. Filter by "Reminder" to see only plugin logs

### Contributing

1. Fork this repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly with various timestamp formats
5. Submit a pull request

## License

MIT License - feel free to modify and distribute.

## Support

For issues and feature requests:
1. Check the console for error messages
2. Test with minimal examples
3. Include Logseq version and browser information
4. Provide sample scheduled blocks that aren't working