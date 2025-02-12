//server/models/logs.js

const mongoose = require('mongoose')

const logSchema = new mongoose.Schema({
  level: { type: String, enum: ['success', 'error', 'debug'], required: true },
  category: { type: String, enum: ['user', 'gift', 'event', 'general', 'pages'], required: true },
  code: { type: Number, required: false }, // Error code
  message: { type: String, required: false },
  serverOrClient: { type: String, enum: ['server', 'client'], required: true },
  URL: { type: String, required: true }, // URL of the page
  func: { type: String, required: true }, // Which function created this log
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Optional user ID
  giftId: { type: mongoose.Schema.Types.ObjectId, ref: 'gift' }, // Optional gift ID
  eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'events' }, // Optional event ID
  meta: { type: Object, default: {} }, // Additional details
  timestamp: { type: Date, default: Date.now }
})

const Log = mongoose.model('Logs', logSchema)
module.exports = Log

/*
messages:
  - '❌ Error getting event:'
  - '✅ תשלום הצליח!'
  - '✅ העסקה הושלמה בהצלחה על ידי '
  - '❌ שגיאה בהוספת המתנה:'
  - '❌ שגיאה במחיקת הנתונים:'
  - '📝 req.body log:'
  - '❌ Missing required fields'
  - '❌ Invalid log level'
  - '✅ Log sent successfully:'
  - '❌ Error sending log:'
  - '✅ Log saved successfully'
  - '❌ Error saving log'
  - '❌ Missing userId'
  - '❌ User not found'
  - '❌ Missing required fields'
  - '❌ Missing user fields'
  - '❌ שגיאה במחיקת הנתונים.'
  - '❌ שגיאה בהוספת המתנה:'
  - '✅ מתנה נוספה בהצלחה:'
  - '❌ תשלום נכשל:'
  - '❌ התשלום נכשל, אנא נסה שוב.'
  - '❌ שגיאה בהוספת המתנה:'
  - '❌ שגיאה במחיקת הנתונים:'
  - '✅ כל הנתונים נמחקו בהצלחה מכל האוספים!'
  - '❌ שגיאה במחיקת הנתונים:'
  - '❌ Error saving log:'
  - '❌ Error saving log'
  - '❌ Missing userId'
  - '❌ User not found'
  - '❌ Missing required fields'
  - '❌ Missing user fields'
*/
