/**
 * Time parsing utilities for Logseq Reminder Plugin
 * Handles both journal-style timestamps and property values
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
 * Check if a date is within the next 7 days from now
 * @param {Date} date - The date to check
 * @returns {boolean} - True if within next 7 days
 */
function isWithinNext7Days(date) {
  if (!date || !(date instanceof Date)) {
    return false;
  }

  const now = new Date();
  const sevenDaysFromNow = new Date(now.getTime() + (7 * 24 * 60 * 60 * 1000));
  
  return date >= now && date <= sevenDaysFromNow;
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

module.exports = {
  parseScheduledDateTime,
  isWithinNext7Days,
  formatDateTimeForNotification,
  getNotificationKey,
  isTimeToNotify
};