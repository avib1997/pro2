const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const jwt = require("jsonwebtoken");
const Joi = require("joi");

/**
 * הגדרת סכמה למתנות (giftSchema):
 * מגדיר את השדות והחוקים עבור מסמכי מתנה בבסיס הנתונים.
 */
const giftSchema = new Schema({
  name: { type: String }, // שם המתנה
  phone: { type: Number, required: true }, // טלפון (שדה חובה)
  blessing: { type: String }, // ברכה או הודעה המצורפת למתנה
  amount: { type: Number, required: true }, // סכום / כמות המתנה
  userid_gift: { type: String }, // מזהה המשתמש שהעניק את המתנה
  toEventId: { type: String }, // מזהה האירוע הרלוונטי
  toEventName: { type: String }, // שם האירוע
  entryDate: { type: Date, default: Date.now }, // תאריך הוספת המסמך (ברירת מחדל: תאריך נוכחי)
});

// במידה ותרצו בעתיד להוסיף פונקציה ליצירת JWT, ניתן לעשות זאת באופן הבא:
// giftSchema.method("generateAuthToken", function () {
//   const token = jwt.sign({ _id: this._id }, process.env.DB_URI);
//   return token;
// });

/**
 * יצירת מודל על בסיס ה-shema של המתנות (giftSchema).
 */
const giftModel = mongoose.model("gift", giftSchema);

console.log("==> [DEBUG] giftModel הוגדר בהצלחה עם giftSchema.");

/**
 * ייצוא המודל לשימוש בשאר חלקי האפליקציה.
 */
module.exports = { giftModel };
