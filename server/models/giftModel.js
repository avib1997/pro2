//server/models/giftModel.js
const mongoose = require('mongoose')

const giftSchema = new mongoose.Schema({
  name: { type: String, required: true }, // ✅ חובה לוודא ששדה זה מתקבל
  phone: { type: String, required: true }, // ✅ ודא שזו מחרוזת (אם נשלח מספר זה יגרום לשגיאה)
  blessing: { type: String },
  amount: { type: Number, required: true }, // ✅ סכום חייב להיות מספר
  userid_gift: { type: String },
  EventId: { type: String, required: true }, // ✅ ודא שהאירוע קיים לפני שמנסים לשמור
  toEventName: { type: String },
  entryDate: { type: Date, default: Date.now },

  // שדות חדשים לקבצים (Buffer)
  imageFile: { type: Buffer },
  videoFile: { type: Buffer },
  audioFile: { type: Buffer }
})

module.exports = mongoose.model('gift', giftSchema)
