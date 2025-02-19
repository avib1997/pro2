
// server/models/fileModel.js
const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
    fileId: { type: mongoose.Schema.Types.ObjectId, required: true }, // מזהה הקובץ ב-GridFS
    fileType: { type: String, required: true }, // סוג הקובץ (image, video, audio וכו')
    fileName: { type: String }, // שם הקובץ המקורי
    fileSize: { type: Number }, // גודל הקובץ בבייטים
    uploadDate: { type: Date, default: Date.now }, // תאריך העלאה
    userid_file: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // מזהה המשתמש שהעלה
    EventId: { type: mongoose.Schema.Types.ObjectId, ref: 'events', required: true },
    giftid_file: { type: mongoose.Schema.Types.ObjectId, ref: 'gift', required: false },
    // מזהה האירוע שאליו הקובץ שייך
});

module.exports = mongoose.model('files', fileSchema);
