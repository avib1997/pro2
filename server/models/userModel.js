//server/models/userModel.js
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema({
  fname: { type: String, required: true }, // שם פרטי
  lname: { type: String, required: true }, // שם משפחה
  email: { type: String, required: true, unique: true }, // אימייל (חייב להיות ייחודי)
  password: { type: String, required: true }, // סיסמה מוצפנת
  entryDate: { type: Date, default: Date.now }, // תאריך כניסה (ברירת מחדל: עכשיו)
  giftsId: [String], // מערך של מזהי מתנות
  eventId: [String] // מערך של מזהי אירועים
})

module.exports = mongoose.model('user', userSchema)
