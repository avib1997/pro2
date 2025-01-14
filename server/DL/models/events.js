const mongoose = require("mongoose");
const Schema = mongoose.Schema;

/**
 * הגדרת סכמת אירוע (eventSchema):
 * מגדיר את השדות והחוקים עבור מסמכי אירועים בבסיס הנתונים.
 */
const eventSchema = new Schema({
  NameOfGroom: { type: String, required: true }, // שם החתן
  NameOfBride: { type: String, required: true }, // שם הכלה
  NameOfManager: { type: String, required: true }, // מנהל האירוע (אולי אחד מההורים / מפיק?)
  TypeOfEvent: { type: String, required: true }, // סוג האירוע (חתונה, בר מצווה, וכו')
  NumOfGuests: { type: Number, required: true }, // מספר אורחים
  phone: { type: Number, required: true }, // מספר טלפון ליצירת קשר
  userid_event: { type: String }, // מזהה משתמש (לרוב מנהל האירוע)
  DateOfEvent: { type: Date, required: true }, // תאריך האירוע
  giftsId: [String], // רשימת מזהים של מתנות הקשורות לאירוע
});

/**
 * יצירת מודל על בסיס eventSchema
 */
const eventModel = mongoose.model("event", eventSchema);

// לוג בסיסי לצורך אימות שהמודל נטען:
console.log("==> [DEBUG] eventModel הוגדר בהצלחה.");

/**
 * ייצוא המודל לשימוש בשאר חלקי המערכת
 */
module.exports = { eventModel };
