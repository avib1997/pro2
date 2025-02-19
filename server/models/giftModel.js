const mongoose = require('mongoose');

const giftSchema = new mongoose.Schema({
  name: { type: String, required: true }, // ✅ חובה לוודא ששדה זה מתקבל
  phone: { type: String, required: true }, // ✅ ודא שזו מחרוזת (אם נשלח מספר זה יגרום לשגיאה)
  blessing: { type: String },
  amount: { type: Number, required: true }, // ✅ סכום חייב להיות מספר
  userid_gift: { type: String , ref: 'user'},
  EventId: { type: String, required: true, ref: 'events'}, // ✅ ודא שהאירוע קיים לפני שמנסים לשמור
  toEventName: { type: String },
  entryDate: { type: Date, default: Date.now },

  // 🔹 שמירת פרטי הקובץ שמצורף למתנה
  file: {
    fileId: { type: mongoose.Schema.Types.ObjectId, ref: 'files' }, // 🔗 קשר לקובץ
    fileType: { type: String } // סוג הקובץ (image, video, audio וכו')
  }
});

module.exports = mongoose.model('gift', giftSchema);
