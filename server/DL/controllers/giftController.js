const { giftModel } = require("../models/gifts");

/**
 * [C] יצירת רשומת מתנה חדשה
 * @param {Object} data - אובייקט המכיל את פרטי המתנה החדשה
 * @returns {Promise<Object>} אובייקט המתנה שנוצר
 */
async function creat(data) {
  console.log("==> [INFO] התחלת יצירת מתנה חדשה:", data);

  try {
    const newGift = await giftModel.create(data);
    console.log("==> [SUCCESS] מתנה נוצרה בהצלחה:", newGift._id);
    return newGift;
  } catch (error) {
    console.error("==> [ERROR] שגיאה ביצירת מתנה:", error.message);
    throw error;
  }
}

/**
 * [R] קריאת רשומת מתנה אחת לפי קריטריון
 * @param {Object} filter - אובייקט המציין את תנאי החיפוש
 * @param {Object} proj - (אופציונלי) אובייקט Projection לצמצום השדות
 * @returns {Promise<Object|null>} המתנה שנמצאה או null אם לא נמצאה
 */
async function readOne(filter, proj) {
  console.log("==> [INFO] חיפוש מתנה בודדת לפי פילטר:", filter);

  try {
    const gift = await giftModel.findOne(filter, proj);
    console.log("==> [SUCCESS] תוצאת חיפוש מתנה:", gift ? gift._id : "לא נמצא");
    return gift;
  } catch (error) {
    console.error("==> [ERROR] שגיאה בקריאת מתנה בודדת:", error.message);
    throw error;
  }
}

/**
 * [R] קריאת מתנה לפי מזהה ייחודי (ObjectId)
 * @param {String} filter - מזהה (ID) של המתנה לחיפוש
 * @returns {Promise<Object|null>} המתנה שנמצאה או null אם לא נמצאה
 */
async function readById(filter) {
  console.log("==> [INFO] קריאת מתנה לפי ID:", filter);

  try {
    const gift = await giftModel.findById(filter);
    console.log(
      "==> [SUCCESS] תוצאת קריאה לפי ID:",
      gift ? gift._id : "לא נמצא"
    );
    return gift;
  } catch (error) {
    console.error("==> [ERROR] שגיאה בקריאה לפי ID:", error.message);
    throw error;
  }
}

/**
 * [R] קריאת מספר מתנות לפי פילטר
 * @param {Object} filter - אובייקט המציין את תנאי החיפוש
 * @returns {Promise<Array>} מערך של מתנות שנמצאו
 */
async function read(filter) {
  console.log("==> [INFO] חיפוש מתנות עם הפילטר:", filter);

  try {
    const gifts = await giftModel.find(filter);
    console.log(`==> [SUCCESS] נמצאו ${gifts.length} מתנות תואמות.`);
    return gifts;
  } catch (error) {
    console.error("==> [ERROR] שגיאה בקריאת מתנות:", error.message);
    throw error;
  }
}

/**
 * [U] עדכון של מתנה (או מספר מתנות) לפי פילטר
 * @param {Object} filter - אובייקט המציין את תנאי החיפוש
 * @param {Object} data - אובייקט המתאר את השינויים לעדכון
 * @returns {Promise<Object>} אובייקט התוצאה של updateOne
 */
async function update(filter, data) {
  console.log(
    "==> [INFO] עדכון מתנה(ות) עם הפילטר:",
    filter,
    "ושינויים:",
    data
  );

  try {
    const result = await giftModel.updateOne(filter, data);
    console.log("==> [SUCCESS] תוצאת העדכון:", result);
    return result;
  } catch (error) {
    console.error("==> [ERROR] שגיאה בעדכון מתנה:", error.message);
    throw error;
  }
}

/**
 * [D] "מחיקה רכה" של מתנה – מסמן אותה כלא פעילה (isActive: false) במקום למחוק בפועל
 * @param {String} _id - מזהה המתנה
 * @returns {Promise<Object>} אובייקט התוצאה של הפעולה
 */
async function del(_id) {
  console.log("==> [INFO] מחיקה רכה (סימון כלא פעילה) של מתנה עם מזהה:", _id);

  try {
    // מגדיר את isActive: false במקום מחיקה של רשומה
    const result = await update({ _id }, { isActive: false });
    console.log("==> [SUCCESS] המתנה סומנה כלא פעילה:", result);
    return result;
  } catch (error) {
    console.error("==> [ERROR] שגיאה במחיקה הרכה של המתנה:", error.message);
    throw error;
  }
}

module.exports = { creat, readOne, read, readById, update, del };
