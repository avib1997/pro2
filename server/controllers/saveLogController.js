//server/controllers/saveLogController.js
const Log = require('../models/logs') // ייבוא המודל של הלוגים

// פונקציה לשמירת לוגים
const saveLog = async (level, category, code, message, serverOrClient, URL, func, userId, giftId, eventId, meta = {}) => {
  try {
    const logEntry = new Log({ level, category, code, message, serverOrClient, URL, func, userId, giftId, eventId, meta })
    await logEntry.save()
    console.log('✅ Log saved successfully:', message)
  } catch (error) {
    console.error('❌ Error saving log:', error)
  }
}

module.exports = { saveLog }
