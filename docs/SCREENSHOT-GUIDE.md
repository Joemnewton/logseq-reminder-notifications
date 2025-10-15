# 📸 Quick Screenshot Guide

## 🎯 **How to Take Plugin Screenshots**

### **1. Desktop Notification Screenshot**

**Steps:**
1. Create a test block: `SCHEDULED: <2025-10-14 Mon 18:00> Test screenshot reminder`
2. Wait for 18:00 (or whatever time you set)
3. When the desktop notification appears, screenshot it
4. Save as `desktop-notification.png`

**Mac:** `Cmd + Shift + 4` → drag to select notification
**Windows:** `Windows + Shift + S` → select area
**Linux:** `gnome-screenshot -a` or similar

### **2. In-App Message Screenshot**

**Steps:**
1. Same test block as above
2. Screenshot the Logseq toast message (appears at top-right of Logseq)
3. Save as `in-app-message.png`

### **3. Console Output Screenshot**

**Steps:**
1. In Logseq, press `F12` to open Developer Tools
2. Go to **Console** tab
3. Type `/reminders: rescan` in Logseq and press Enter
4. Screenshot the console showing plugin debug output
5. Save as `console-output.png`

**Look for messages like:**
```
🔔 Reminder Notifications Plugin v1.2.2 loaded
🔍 Scanning for scheduled blocks...
🔍 Found 1 blocks with SCHEDULED: content
🔍 Processing block: "Test screenshot reminder"
📅 Found 1 upcoming reminders
```

### **4. Demo GIF (Optional but Impressive)**

**Steps:**
1. Use screen recorder (QuickTime on Mac, OBS Studio, etc.)
2. Record yourself:
   - Creating a scheduled block
   - Waiting for notification
   - Getting both desktop + in-app notifications
3. Convert to GIF (use online converter or ffmpeg)
4. Save as `demo.gif`

**Keep GIF under 5MB for GitHub!**

## 💾 **File Structure**

Your screenshots should be saved as:
```
screenshots/
├── desktop-notification.png
├── in-app-message.png  
├── console-output.png
└── demo.gif (optional)
```

## ✅ **After Taking Screenshots**

1. **Save files** in the `screenshots/` directory
2. **Commit and push**:
   ```bash
   git add screenshots/
   git commit -m "Add plugin screenshots"
   git push origin main
   ```
3. **Check README** - images should now display properly on GitHub!

## 🎨 **Image Tips**

- **High resolution** - Make text readable
- **Clean background** - Close other notifications/windows
- **Good timing** - Capture notifications clearly  
- **Crop appropriately** - Focus on the plugin functionality
- **Consistent style** - Similar lighting/theme across screenshots

The README.md is now ready to display your screenshots once you add the image files! 📸