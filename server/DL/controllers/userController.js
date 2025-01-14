const { userModel } = require("../models/users");

/**
 * יוצר משתמש חדש במסד הנתונים.
 * @param {Object} data - אובייקט המכיל את פרטי המשתמש ליצירה.
 * @returns {Promise<Object>} אובייקט המשתמש שנוצר.
 */
async function create(data) {
  console.log("==> [INFO] ביצוע יצירת משתמש חדש", { data });

  try {
    const newUser = await userModel.create(data);
    console.log("==> [SUCCESS] משתמש נוצר בהצלחה:", newUser._id);
    return newUser;
  } catch (error) {
    console.error("==> [ERROR] כשל ביצירת המשתמש:", error.message);
    throw error;
  }
}

/**
 * מחזיר משתמש בודד לפי פילטר (חיפוש) ספציפי.
 * @param {Object} filter - אובייקט המכיל קריטריונים לחיפוש.
 * @param {Object} [proj] - (אופציונלי) אובייקט Projection לצמצום השדות המוחזרים.
 * @returns {Promise<Object|null>} המשתמש שנמצא או null אם לא נמצא.
 */
async function readOne(filter, proj) {
  console.log("==> [INFO] קריאה למשתמש בודד עם הפילטר:", filter);

  try {
    const user = await userModel.findOne(filter, proj);
    console.log(
      "==> [SUCCESS] קריאת משתמש בודד הסתיימה:",
      user?._id || "לא נמצא"
    );
    return user;
  } catch (error) {
    console.error("==> [ERROR] כשל בקריאת משתמש בודד:", error.message);
    throw error;
  }
}

/**
 * מחזיר מערך של משתמשים העונים לקריטריונים מסוימים.
 * @param {Object} filter - אובייקט המכיל קריטריונים לחיפוש.
 * @param {Object} [proj] - (אופציונלי) אובייקט Projection לצמצום השדות המוחזרים.
 * @returns {Promise<Array>} מערך של משתמשים שנמצאו.
 */
async function read(filter, proj) {
  console.log("==> [INFO] קריאה למספר משתמשים עם הפילטר:", filter);

  try {
    const users = await userModel.find(filter, proj);
    console.log(`==> [SUCCESS] נמצאו ${users.length} משתמשים תואמים.`);
    return users;
  } catch (error) {
    console.error("==> [ERROR] כשל בקריאת מספר משתמשים:", error.message);
    throw error;
  }
}

/**
 * מעדכן משתמש אחד (או יותר) על-פי פילטר מוגדר.
 * @param {Object} filter - אובייקט המכיל קריטריונים לחיפוש המשתמש.
 * @param {Object} newData - אובייקט המייצג את השינויים לעדכון.
 * @returns {Promise<Object>} אובייקט התוצאה של הפעולה (למשל { nModified, ... }).
 */
async function update(filter, newData) {
  console.log(
    "==> [INFO] עדכון משתמש(ים) עם הפילטר:",
    filter,
    "ושינויים:",
    newData
  );

  try {
    const result = await userModel.updateOne(filter, newData);
    console.log("==> [SUCCESS] תוצאת העדכון:", result);
    return result;
  } catch (error) {
    console.error("==> [ERROR] כשל בעדכון משתמש(ים):", error.message);
    throw error;
  }
}

/**
 * "מחיקה רכה" של משתמשים - במקום למחוק, מסמנים אותם כלא פעילים (isActive: false).
 * @param {Object} filter - אובייקט המכיל קריטריונים לחיפוש המשתמש.
 * @returns {Promise<Object>} אובייקט התוצאה של הפעולה.
 */
async function del(filter) {
  console.log("==> [INFO] ביצוע מחיקה רכה למשתמש(ים) עם הפילטר:", filter);

  try {
    const result = await update(filter, { isActive: false });
    console.log("==> [SUCCESS] המשתמש(ים) סומנו כלא פעילים:", result);
    return result;
  } catch (error) {
    console.error("==> [ERROR] כשל במחיקה הרכה של המשתמש(ים):", error.message);
    throw error;
  }
}

module.exports = { create, readOne, read, update, del };
