const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// [INFO] הגדרת סכמת משתמשים (Users Schema) שתייצג את מבנה המסמך בקולקציה המתאימה
const userSchema = new Schema({
  fname: { type: String, required: true }, // שם פרטי
  lname: { type: String, required: true }, // שם משפחה
  email: { type: String, required: true, unique: true }, // אימייל (חייב להיות ייחודי)
  password: { type: String, required: true }, // סיסמה מוצפנת
  entryDate: { type: Date, default: Date.now }, // תאריך כניסה (ברירת מחדל: עכשיו)
  giftsId: [String], // מערך של מזהי מתנות
  eventId: [String], // מערך של מזהי אירועים
});

// [DEBUG] הצגת הלוג (אופציונלי, למחיקה בפרודקשן)

// [INFO] יצירת מודל Mongoose על בסיס הסכמה
const userModel = mongoose.model("user", userSchema);

// [DEBUG] הצגת הלוג (אופציונלי, למחיקה בפרודקשן)

// ייצוא המודל לשימוש בקבצים אחרים
module.exports = { userModel };
