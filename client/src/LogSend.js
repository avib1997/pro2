//client/src/LogSend.js
import axios from 'axios'
// const logSchema = new mongoose.Schema({
//   level: { type: String, enum: ['succes', 'error', 'debug'], required: true },
//   category: { type: String, enum: ['user', 'gift', 'event', 'general', 'pages'], required: true },
//   code: { type: Number, required: false }, // Error code
//   message: { type: String, required: false },
//   serverOrClient: { type: String, enum: ['server', 'client'], required: true },
//   URL: { type: String, required: true }, // URL of the page
//   func: { type: String, required: true }, // Which function created this log
//   userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Optional user ID
//   giftId: { type: mongoose.Schema.Types.ObjectId, ref: 'gift' }, // Optional gift ID
//   eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'events' }, // Optional event ID
//   meta: { type: Object, default: {} }, // Additional details
//   timestamp: { type: Date, default: Date.now }
// });

const sendLog = async (level, category, code, message, serverOrClient, URL, func, userId, giftId, eventId, meta) => {
  if (!level || !category || !serverOrClient || !URL || !func) {
    console.error('❌ Missing required fields')
    return
  } else if (!['success', 'error', 'debug'].includes(level)) {
    console.error('❌ Invalid log level')
    return
  } else if (!['user', 'gift', 'event', 'general', 'pages'].includes(category)) {
    console.error('❌ Invalid log category')
    return
  } else if (!['server', 'client'].includes(serverOrClient)) {
    console.error('❌ Invalid log service')
    return
  } else {
    try {
      const response = await axios.post('http://localhost:2001/api/addLog', {
        level,
        category,
        code,
        message,
        serverOrClient,
        URL,
        func,
        userId,
        giftId,
        eventId,
        meta
      })
      console.log('✅ Log sent successfully:', response.data)
    } catch (error) {
      console.error('❌ Error sending log:', error)
    }
  }
}

export default sendLog
