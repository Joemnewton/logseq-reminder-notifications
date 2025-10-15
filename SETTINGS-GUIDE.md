# Settings Guide - Reminder Notifications Plugin v1.3.0

This plugin now includes a comprehensive settings GUI that allows you to customize how reminders work. You can access the settings through Logseq's plugin settings panel.

## Available Settings

### 1. Default Reminder Intervals
**Setting:** `defaultReminderIntervals`
**Type:** String (comma-separated)
**Default:** `"0,5"`

This setting allows you to configure which reminder intervals are enabled by default. Enter the intervals in minutes as a comma-separated list. For example, if you have a block scheduled for 20:45, you can set reminders to go off:
- At the time of the event (0 minutes before)
- 5 minutes before
- 10 minutes before
- 15 minutes before
- 30 minutes before
- 60 minutes before

**Example configurations:**
- `"0,5"` - Reminders at the scheduled time and 5 minutes before
- `"0,5,15"` - Reminders at the scheduled time, 5 minutes before, and 15 minutes before
- `"5,15,30"` - Reminders 5, 15, and 30 minutes before the scheduled time
- `"0"` - Only at the scheduled time

### 2. Enable All-Day Reminders
**Setting:** `enableAllDayReminders`
**Type:** Boolean
**Default:** `false`

When enabled, this setting allows the plugin to send reminders for blocks that are scheduled for a day but don't have a specific time. For example, blocks with `SCHEDULED: <2025-01-15>` or `scheduled:: 2025-01-15`.

### 3. All-Day Reminder Time
**Setting:** `allDayReminderTime`
**Type:** String
**Default:** `"09:00"`

This setting specifies what time to send reminders for all-day scheduled blocks. Use 24-hour format (e.g., "09:00" for 9 AM, "14:30" for 2:30 PM).

**Note:** This setting only takes effect when `enableAllDayReminders` is set to `true`.

### 4. Polling Interval
**Setting:** `pollIntervalSeconds`
**Type:** Number
**Default:** `30`
**Range:** 10-300 seconds

This setting controls how often the plugin checks for due reminders. Lower values mean more frequent checks but higher CPU usage. Higher values mean less frequent checks but may miss reminders if they're very close together.

### 5. Daily Rescan Hour
**Setting:** `dailyRescanHour`
**Type:** Number
**Default:** `3`
**Range:** 0-23

This setting specifies the hour of day (in 24-hour format) when the plugin performs a full rescan of all scheduled blocks. This helps catch any blocks that might have been missed during normal operation.

## How to Use Settings

1. Open Logseq
2. Go to Settings (gear icon)
3. Navigate to the "Plugins" section
4. Find "Reminder Notifications" in the list
5. Click the settings icon next to the plugin
6. Adjust the settings as needed
7. Changes are applied immediately

## Settings Behavior

- **Immediate Effect:** Most settings changes take effect immediately without requiring a restart
- **Automatic Rescan:** When you change reminder intervals or all-day reminder settings, the plugin automatically rescans for scheduled blocks
- **Polling Restart:** When you change the polling interval, the plugin automatically restarts its polling mechanism
- **Daily Rescan Reschedule:** When you change the daily rescan hour, the plugin reschedules the next daily rescan

## Troubleshooting

If you're not receiving reminders after changing settings:

1. Check that notification permissions are granted in your browser/system
2. Try running the manual rescan command: `/reminders: rescan`
3. Check the browser console for any error messages
4. Verify that your scheduled blocks are in the correct format

## Examples

### Example 1: Multiple Reminders
To get reminders 15 minutes, 5 minutes, and at the time of an event:
- Set `defaultReminderIntervals` to `"0,5,15"`

### Example 2: All-Day Reminders
To enable all-day reminders at 8:30 AM:
- Set `enableAllDayReminders` to `true`
- Set `allDayReminderTime` to `"08:30"`

### Example 3: Frequent Checking
To check for reminders every 15 seconds:
- Set `pollIntervalSeconds` to `15`

**Note:** Very frequent polling may impact performance.
