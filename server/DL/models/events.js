const mongoose = require("mongoose");
const Schema = mongoose.Schema;

/**
 * הגדרת סכמת אירוע (eventSchema):
 * מגדיר את השדות והחוקים עבור מסמכי אירועים בבסיס הנתונים.
 */
const eventSchema = new Schema({
  NameOfGroom: { type: String, required: false }, // שם החתן
  NameOfBride: { type: String, required: false }, // שם הכלה
  NameOfManager: { type: String, required: false }, // מנהל האירוע (אולי אחד מההורים / מפיק?)
  TypeOfEvent: { type: String, required: false }, // סוג האירוע (חתונה, בר מצווה, וכו')
  NumOfGuests: { type: Number, required: false }, // מספר אורחים
  phone: { type: Number, required: false }, // מספר טלפון ליצירת קשר
  userid_event: { type: String }, // מזהה משתמש (לרוב מנהל האירוע)
  DateOfEvent: { type: Date, required: false }, // תאריך האירוע
  giftsId: [String], // רשימת מזהים של מתנות הקשורות לאירוע
  Event_number: { type: Number, required: true }, // מזהה האירוע
});

/**
 * יצירת מודל על בסיס eventSchema
 */
const eventModel = mongoose.model("event", eventSchema);

// לוג בסיסי לצורך אימות שהמודל נטען:

/**
 * ייצוא המודל לשימוש בשאר חלקי המערכת
 */
module.exports = { eventModel };
