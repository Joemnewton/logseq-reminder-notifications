# Test Notes for Reminder Plugin v1.2.0 (Bug Fixed Version)

## Critical Bug Fixes Applied

### ❌ Issues Resolved:
1. **XCode crash when accessing plugin settings** - Simplified settings schema
2. **Duplicate notifications for past events** - Disabled overdue reminder system
3. **Complex settings causing JSON parsing errors** - Removed all advanced settings temporarily

### ✅ What's Working Now:
- Basic reminder notifications (desktop + in-app)
- Lead time setting (minutes before scheduled time)
- Check interval setting (how often to scan)
- All-day reminders with configurable hour
- Automatic block detection

### 🔧 Simplified Settings:
- **Lead Time**: 0-∞ minutes before reminder
- **Check Interval**: How often to scan (default 30 seconds)  
- **Enable All-Day Reminders**: For blocks without specific times
- **All-Day Reminder Hour**: What time to remind (0-23, default 9 AM)

### 🚫 Temporarily Disabled:
- Multiple reminder intervals  
- Quiet hours
- Overdue reminders
- Weekend mode
- Custom notification prefixes
- Persistent notification tracking
- Advanced sound settings

## Testing Steps

1. **Install Plugin**: 
   - Go to Logseq Settings → Plugins
   - Click "Load unpacked plugin"
   - Select this folder
   
2. **Test Basic Reminder**:
   ```
   SCHEDULED: <2025-01-15 Wed 14:30> Call dentist
   ```
   
3. **Test All-Day Reminder**:
   ```
   SCHEDULED: <2025-01-15 Wed> Review documents
   ```
   
4. **Check Settings**:
   - Go to Settings → Plugins → Reminder Notifications
   - Should open without crashes
   - Adjust lead time and test

## Next Steps After Testing

If this version works without crashes:
1. ✅ Gradually re-add advanced features one by one
2. ✅ Test each addition thoroughly  
3. ✅ Use simpler data types (avoid objects/complex strings)
4. ✅ Add better error handling
5. ✅ Re-implement overdue system with proper deduplication

## Version History
- v1.0.0: Basic functionality ✅
- v1.1.0: Enhanced with auto-detection ✅  
- v1.2.0: Added advanced features ❌ (bugs found)
- v1.2.0-fixed: Simplified to resolve crashes ⏳ (testing)