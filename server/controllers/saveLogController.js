const mongoose = require('mongoose');
const Log = require('../models/logs'); // Import Log model

// Function to save logs
const saveLog = async (level, category, code, message, serverOrClient, URL, func, userId, giftId, eventId, meta = {}) => {
  try {
    // Validate and convert IDs only if they are valid ObjectIds, otherwise set them to null
    userId = userId ? userId : null;
    giftId = giftId ? giftId : null;
    eventId = eventId ? eventId : null;

    const logEntry = new Log({ level, category, code, message, serverOrClient, URL, func, userId, giftId, eventId, meta });

    await logEntry.save();
    console.log('✅ Log saved successfully:', message);
  } catch (error) {
    console.error('❌ Error saving log:', error);
  }
};

module.exports = { saveLog };

//server/controllers/saveLogController.js
