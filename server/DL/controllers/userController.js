const { userModel } = require("../models/users");

/**
 * יוצר משתמש חדש במסד הנתונים.
 * @param {Object} data - אובייקט המכיל את פרטי המשתמש ליצירה.
 * @returns {Promise<Object>} אובייקט המשתמש שנוצר.
 */
async function create(data) {

  try {
    const newUser = await userModel.create(data);
    return newUser;
  } catch (error) {
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

  try {
    const user = await userModel.findOne(filter, proj);
    
    return user;
  } catch (error) {
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

  try {
    const users = await userModel.find(filter, proj);
    return users;
  } catch (error) {
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
  

  try {
    const result = await userModel.updateOne(filter, newData);
    return result;
  } catch (error) {
    throw error;
  }
}

/**
 * "מחיקה רכה" של משתמשים - במקום למחוק, מסמנים אותם כלא פעילים (isActive: false).
 * @param {Object} filter - אובייקט המכיל קריטריונים לחיפוש המשתמש.
 * @returns {Promise<Object>} אובייקט התוצאה של הפעולה.
 */
async function del(filter) {

  try {
    const result = await update(filter, { isActive: false });
    return result;
  } catch (error) {
    throw error;
  }
}

module.exports = { create, readOne, read, update, del };
