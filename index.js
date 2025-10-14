/**
 * Logseq Reminder Notifications Plugin
 * Provides desktop and in-app notifications for scheduled blocks
 */

/**
 * Time parsing utilities - inline for Logseq compatibility
 */

/**
 * Parse a Logseq timestamp like <2025-10-14 Tue 14:30> or property value like "2025-10-14 14:30"
 * @param {string} text - The text to parse
 * @returns {Date|null} - Parsed date or null if invalid/no time
 */
function parseScheduledDateTime(text) {
  if (!text || typeof text !== 'string') {
    return null;
  }

  // Pattern 1: Journal-style timestamp <2025-10-14 Tue 14:30>
  const journalMatch = text.match(/<(\d{4}-\d{2}-\d{2})\s+\w+\s+(\d{1,2}:\d{2})>/);
  if (journalMatch) {
    const [, datePart, timePart] = journalMatch;
    return parseDateTime(datePart, timePart);
  }

  // Pattern 2: Property value like "2025-10-14 14:30" or "2025-10-14T14:30"
  const propertyMatch = text.match(/(\d{4}-\d{2}-\d{2})[T\s](\d{1,2}:\d{2})/);
  if (propertyMatch) {
    const [, datePart, timePart] = propertyMatch;
    return parseDateTime(datePart, timePart);
  }

  // Pattern 3: ISO-like format "2025-10-14T14:30:00"
  const isoMatch = text.match(/(\d{4}-\d{2}-\d{2})T(\d{1,2}:\d{2}:\d{2})/);
  if (isoMatch) {
    const [, datePart, timePart] = isoMatch;
    return parseDateTime(datePart, timePart.substring(0, 5)); // Take only HH:MM
  }

  // No valid time pattern found
  return null;
}

/**
 * Helper to parse date and time parts into a Date object
 * @param {string} datePart - Date in YYYY-MM-DD format
 * @param {string} timePart - Time in HH:MM format
 * @returns {Date|null} - Parsed date or null if invalid
 */
function parseDateTime(datePart, timePart) {
  try {
    const [year, month, day] = datePart.split('-').map(Number);
    const [hours, minutes] = timePart.split(':').map(Number);
    
    // Validate ranges
    if (year < 1970 || month < 1 || month > 12 || day < 1 || day > 31) {
      return null;
    }
    if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
      return null;
    }

    // Create date in local timezone
    const date = new Date(year, month - 1, day, hours, minutes, 0, 0);
    
    // Check if date is valid (handles invalid dates like Feb 30)
    if (isNaN(date.getTime())) {
      return null;
    }

    return date;
  } catch (error) {
    console.warn('Failed to parse date/time:', datePart, timePart, error);
    return null;
  }
}

/**
 * Check if a date is within the next 7 days from now (including today from start of day)
 * @param {Date} date - The date to check
 * @returns {boolean} - True if within next 7 days
 */
function isWithinNext7Days(date) {
  if (!date || !(date instanceof Date)) {
    return false;
  }

  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
  const sevenDaysFromNow = new Date(startOfToday.getTime() + (7 * 24 * 60 * 60 * 1000));
  
  // Include reminders from start of today through next 7 days
  return date >= startOfToday && date <= sevenDaysFromNow;
}

/**
 * Format a date for display in notifications
 * @param {Date} date - The date to format
 * @returns {string} - Formatted date string
 */
function formatDateTimeForNotification(date) {
  if (!date || !(date instanceof Date)) {
    return 'Invalid date';
  }

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const dateOnly = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  
  const timeStr = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  
  if (dateOnly.getTime() === today.getTime()) {
    return `Today at ${timeStr}`;
  }
  
  const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);
  if (dateOnly.getTime() === tomorrow.getTime()) {
    return `Tomorrow at ${timeStr}`;
  }
  
  return date.toLocaleDateString() + ' at ' + timeStr;
}

/**
 * Generate a unique key for tracking notifications
 * @param {string} uuid - Block UUID
 * @param {Date} scheduledDate - The scheduled date
 * @returns {string} - Unique key for this notification
 */
function getNotificationKey(uuid, scheduledDate) {
  if (!uuid || !scheduledDate) {
    return null;
  }
  
  // Use date portion only to avoid multiple notifications for same block on same day
  const dateStr = scheduledDate.toLocaleDateString();
  return `${uuid}_${dateStr}`;
}

/**
 * Check if current time is at or past the scheduled time (considering lead time)
 * @param {Date} scheduledTime - When the reminder is scheduled for
 * @param {number} leadTimeMinutes - Minutes before scheduled time to notify
 * @returns {boolean} - True if it's time to notify
 */
function isTimeToNotify(scheduledTime, leadTimeMinutes = 0) {
  if (!scheduledTime || !(scheduledTime instanceof Date)) {
    return false;
  }

  const now = new Date();
  const notifyTime = new Date(scheduledTime.getTime() - (leadTimeMinutes * 60 * 1000));
  
  return now >= notifyTime;
}

// Global state
let upcomingReminders = [];
let pollInterval = null;
let dailyRescanTimeout = null;

/**
 * Main plugin initialization
 */
function main() {
  console.log('🔔 Reminder Notifications plugin starting...');

  // Request notification permission early
  requestNotificationPermission();

  // Register slash command
  logseq.Editor.registerSlashCommand('reminders: rescan', async () => {
    console.log('📋 Manual rescan triggered via slash command');
    await scanForUpcomingReminders();
    logseq.App.showMsg('Reminders rescanned!', 'success');
  });

  // Initial scan and setup - will be called when logseq.ready() fires
  console.log('📊 Logseq ready, starting initial scan...');
  scanForUpcomingReminders();
  setupPolling();
  scheduleDailyRescan();
  
  console.log('✅ Reminder Notifications plugin loaded');
}

/**
 * Request notification permission from the browser
 */
function requestNotificationPermission() {
  if (typeof Notification !== 'undefined') {
    console.log('🔔 Current notification permission:', Notification.permission);
    
    if (Notification.permission === 'default') {
      Notification.requestPermission().then(permission => {
        console.log('🔔 Notification permission after request:', permission);
      }).catch(error => {
        console.warn('⚠️ Could not request notification permission:', error);
      });
    }
  } else {
    console.warn('⚠️ Notification API not available in this browser');
  }
}

/**
 * Scan the Logseq database for scheduled blocks
 */
async function scanForUpcomingReminders() {
  try {
    console.log('🔍 Scanning for scheduled blocks...');
    
    // Clear current reminders
    upcomingReminders = [];

    // Query 1: Find blocks with SCHEDULED content
    const scheduledContentBlocks = await findBlocksWithScheduledContent();
    console.log(`🔍 Found ${scheduledContentBlocks.length} blocks with SCHEDULED: content`);
    
    // Query 2: Find blocks with scheduled property
    const scheduledPropertyBlocks = await findBlocksWithScheduledProperty();
    console.log(`🔍 Found ${scheduledPropertyBlocks.length} blocks with scheduled:: property`);
    
    // Combine and process results
    const allBlocks = [...scheduledContentBlocks, ...scheduledPropertyBlocks];
    console.log(`🔍 Total blocks to process: ${allBlocks.length}`);
    
    for (const block of allBlocks) {
      console.log(`🔍 Processing block: "${block.content.substring(0, 80)}..."`);
      const reminderData = parseBlockForReminder(block);
      if (reminderData) {
        console.log(`  ✅ Parsed time: ${reminderData.when}`);
        if (isWithinNext7Days(reminderData.when)) {
          upcomingReminders.push(reminderData);
          console.log(`  ➕ Added to upcoming reminders`);
        } else {
          console.log(`  ❌ Not within next 7 days`);
        }
      } else {
        console.log(`  ❌ Could not parse time from this block`);
      }
    }

    // Remove duplicates by UUID
    const uniqueReminders = upcomingReminders.filter((reminder, index, arr) => 
      arr.findIndex(r => r.uuid === reminder.uuid) === index
    );
    upcomingReminders = uniqueReminders;

    console.log(`📅 Found ${upcomingReminders.length} upcoming reminders`);
    
    // Log upcoming reminders for debugging
    upcomingReminders.forEach(reminder => {
      const timeStr = formatDateTimeForNotification(reminder.when);
      const nowStr = new Date().toLocaleString();
      console.log(`  - ${reminder.page}: "${reminder.content.substring(0, 50)}..." at ${timeStr}`);
      console.log(`    UUID: ${reminder.uuid}, Current time: ${nowStr}`);
    });

  } catch (error) {
    console.error('❌ Error scanning for reminders:', error);
  }
}

/**
 * Find blocks containing SCHEDULED timestamps in content
 */
async function findBlocksWithScheduledContent() {
  try {
    const query = `
      [:find ?uuid ?content ?page-name
       :where
       [?b :block/uuid ?uuid]
       [?b :block/content ?content]
       [?b :block/page ?p]
       [?p :block/name ?page-name]
       [(clojure.string/includes? ?content "SCHEDULED:")]]`;

    const result = await logseq.DB.datascriptQuery(query);
    
    return result.map(([uuid, content, pageName]) => ({
      uuid: uuid,
      content: content,
      page: pageName,
      type: 'content'
    }));
  } catch (error) {
    console.error('❌ Error querying scheduled content blocks:', error);
    return [];
  }
}

/**
 * Find blocks with scheduled property
 */
async function findBlocksWithScheduledProperty() {
  try {
    const query = `
      [:find ?uuid ?content ?page-name ?prop-value
       :where
       [?b :block/uuid ?uuid]
       [?b :block/content ?content]
       [?b :block/page ?p]
       [?p :block/name ?page-name]
       [?b :block/properties ?props]
       [(get ?props :scheduled) ?prop-value]]`;

    const result = await logseq.DB.datascriptQuery(query);
    
    return result.map(([uuid, content, pageName, propValue]) => ({
      uuid: uuid,
      content: content,
      page: pageName,
      scheduledProperty: propValue,
      type: 'property'
    }));
  } catch (error) {
    console.error('❌ Error querying scheduled property blocks:', error);
    return [];
  }
}

/**
 * Parse a block to extract reminder information
 */
function parseBlockForReminder(block) {
  try {
    let scheduledTime = null;
    
    // Try to parse from content first (SCHEDULED: format)
    if (block.type === 'content') {
      scheduledTime = parseScheduledDateTime(block.content);
    }
    
    // Try to parse from property if content parsing failed or this is a property block
    if (!scheduledTime && block.scheduledProperty) {
      scheduledTime = parseScheduledDateTime(block.scheduledProperty);
    }
    
    if (!scheduledTime) {
      return null; // No valid time found
    }

    // Get clean content for notification (remove SCHEDULED line and properties)
    let cleanContent = block.content
      .replace(/SCHEDULED:\s*<[^>]+>/g, '')  // Remove SCHEDULED timestamps
      .replace(/^\s*scheduled::\s*[^\n]+$/gm, '')  // Remove scheduled property lines
      .replace(/^\s*[\-\*]\s*/, '')  // Remove bullet points
      .trim();
    
    // If content is empty after cleanup, use a default message
    if (!cleanContent) {
      cleanContent = 'Scheduled reminder';
    }

    return {
      uuid: block.uuid,
      content: cleanContent,
      page: block.page,
      when: scheduledTime
    };
  } catch (error) {
    console.error('❌ Error parsing block for reminder:', block, error);
    return null;
  }
}

/**
 * Setup polling to check for due reminders
 */
function setupPolling() {
  // Clear existing interval
  if (pollInterval) {
    clearInterval(pollInterval);
  }

  const intervalSeconds = logseq.settings?.pollIntervalSeconds || 30;
  console.log(`⏱️ Setting up polling every ${intervalSeconds} seconds`);

  pollInterval = setInterval(() => {
    checkForDueReminders();
  }, intervalSeconds * 1000);
}

/**
 * Check if any reminders are due and send notifications
 */
async function checkForDueReminders() {
  const leadTimeMinutes = logseq.settings?.leadTimeMinutes || 0;
  const alreadyNotified = logseq.settings?.alreadyNotified || {};
  const now = new Date();
  
  console.log(`⏰ Checking reminders at ${now.toLocaleTimeString()} - Found ${upcomingReminders.length} upcoming reminders`);
  
  let hasNewNotifications = false;

  for (const reminder of upcomingReminders) {
    const isTimeForThis = isTimeToNotify(reminder.when, leadTimeMinutes);
    const notificationKey = getNotificationKey(reminder.uuid, reminder.when);
    const alreadySent = alreadyNotified[notificationKey];
    
    console.log(`  📋 "${reminder.content.substring(0, 30)}..." scheduled for ${formatDateTimeForNotification(reminder.when)}`);
    console.log(`     - Time to notify? ${isTimeForThis} (lead time: ${leadTimeMinutes}min)`);
    console.log(`     - Already notified? ${!!alreadySent}`);
    console.log(`     - Notification key: ${notificationKey}`);
    
    if (isTimeForThis) {
      if (notificationKey && !alreadySent) {
        // Send notification
        try {
          await sendNotification(reminder);
          
          // Mark as notified
          alreadyNotified[notificationKey] = new Date().toISOString();
          hasNewNotifications = true;
          
          console.log(`🔔 Notification sent for: ${reminder.content.substring(0, 50)}...`);
        } catch (error) {
          console.error('❌ Error in sendNotification:', error);
        }
      } else {
        console.log(`⚠️ Skipping notification (already sent or invalid key)`);
      }
    }
  }

  // Save updated notification status
  if (hasNewNotifications) {
    logseq.updateSettings({ alreadyNotified });
    
    // Clean up old notification records (older than 30 days)
    cleanupOldNotificationRecords();
  }
}

/**
 * Send both desktop and Logseq notifications
 */
async function sendNotification(reminder) {
  const timeStr = formatDateTimeForNotification(reminder.when);
  const title = `📅 Reminder: ${reminder.page}`;
  const message = `${reminder.content}\n\nScheduled for: ${timeStr}`;

  try {
    console.log('📢 Sending notifications...');
    
    // Logseq in-app notification
    console.log('📱 Sending Logseq in-app notification:', message);
    try {
      await logseq.App.showMsg(message, 'info', { timeout: 8000 });
      console.log('✅ Logseq notification sent successfully');
    } catch (error) {
      console.error('❌ Failed to send Logseq notification:', error);
      // Fallback: try simpler call
      try {
        await logseq.App.showMsg(message);
        console.log('✅ Logseq notification sent with fallback method');
      } catch (fallbackError) {
        console.error('❌ Fallback notification also failed:', fallbackError);
      }
    }

    // Desktop notification
    console.log('🖥️ Checking desktop notification permission:', typeof Notification !== 'undefined' ? Notification.permission : 'API not available');
    
    if (typeof Notification !== 'undefined' && Notification.permission === 'granted') {
      console.log('🖥️ Creating desktop notification');
      const notification = new Notification(title, {
        body: `${reminder.content}\n\nScheduled for: ${timeStr}`,
        icon: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDJDMTMuMSAyIDE0IDIuOSAxNCA0VjVIMTZDMTcuMSA1IDE4IDUuOSAxOCA3VjE5QzE4IDIwLjEgMTcuMSAyMSAxNiAyMUg4QzYuOSAyMSA2IDIwLjEgNiAxOVY3QzYgNS45IDYuOSA1IDggNUgxMFY0QzEwIDIuOSAxMC45IDIgMTIgMlpNMTIgNEMxMS40IDQgMTEgNC40IDExIDVIMTNDMTMgNC40IDEyLjYgNCAxMiA0Wk0xNiA3SDhWMTlIMTZWN1oiIGZpbGw9IiMzMzMiLz4KPC9zdmc+Cg==',
        tag: reminder.uuid,
        requireInteraction: true
      });
      
      console.log('✅ Desktop notification created');

      // Auto-close notification after 10 seconds
      setTimeout(() => {
        notification.close();
      }, 10000);

    } else if (typeof Notification !== 'undefined') {
      console.warn('⚠️ Desktop notifications not permitted. Current permission:', Notification.permission);
    } else {
      console.warn('⚠️ Notification API not available');
    }

  } catch (error) {
    console.error('❌ Error sending notification:', error);
  }
}

/**
 * Schedule daily rescan at configured hour
 */
function scheduleDailyRescan() {
  if (dailyRescanTimeout) {
    clearTimeout(dailyRescanTimeout);
  }

  const rescanHour = logseq.settings?.dailyRescanHour || 3;
  const now = new Date();
  const nextRescan = new Date();
  
  nextRescan.setHours(rescanHour, 0, 0, 0);
  
  // If the rescan time has already passed today, schedule for tomorrow
  if (nextRescan <= now) {
    nextRescan.setDate(nextRescan.getDate() + 1);
  }

  const msUntilRescan = nextRescan.getTime() - now.getTime();
  
  console.log(`🕐 Daily rescan scheduled for ${nextRescan.toLocaleString()}`);

  dailyRescanTimeout = setTimeout(async () => {
    console.log('🌅 Daily rescan triggered');
    await scanForUpcomingReminders();
    scheduleDailyRescan(); // Schedule next rescan
  }, msUntilRescan);
}

/**
 * Clean up old notification records to prevent memory bloat
 */
function cleanupOldNotificationRecords() {
  try {
    const alreadyNotified = logseq.settings?.alreadyNotified || {};
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const cleanedRecords = {};
    let removedCount = 0;

    for (const [key, timestamp] of Object.entries(alreadyNotified)) {
      const recordDate = new Date(timestamp);
      if (recordDate >= thirtyDaysAgo) {
        cleanedRecords[key] = timestamp;
      } else {
        removedCount++;
      }
    }

    if (removedCount > 0) {
      console.log(`🧹 Cleaned up ${removedCount} old notification records`);
      logseq.updateSettings({ alreadyNotified: cleanedRecords });
    }
  } catch (error) {
    console.error('❌ Error cleaning up notification records:', error);
  }
}

/**
 * Handle settings changes
 */
logseq.onSettingsChanged((newSettings, oldSettings) => {
  console.log('⚙️ Settings changed');
  
  // Restart polling if interval changed
  if (newSettings.pollIntervalSeconds !== oldSettings.pollIntervalSeconds) {
    console.log('🔄 Restarting polling with new interval');
    setupPolling();
  }
  
  // Reschedule daily rescan if hour changed
  if (newSettings.dailyRescanHour !== oldSettings.dailyRescanHour) {
    console.log('🔄 Rescheduling daily rescan');
    scheduleDailyRescan();
  }
});

/**
 * Cleanup on plugin unload
 */
logseq.beforeunload(() => {
  console.log('👋 Reminder Notifications plugin unloading...');
  
  if (pollInterval) {
    clearInterval(pollInterval);
  }
  
  if (dailyRescanTimeout) {
    clearTimeout(dailyRescanTimeout);
  }
});

// Start the plugin
logseq.ready(main).catch(console.error);