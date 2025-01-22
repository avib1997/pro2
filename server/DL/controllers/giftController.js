const { giftModel } = require("../models/gifts");

/**
 * [C] יצירת רשומת מתנה חדשה
 * @param {Object} data - אובייקט המכיל את פרטי המתנה החדשה
 * @returns {Promise<Object>} אובייקט המתנה שנוצר
 */
async function creat(data) {

  try {
    const newGift = await giftModel.create(data);
    return newGift;
  } catch (error) {
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

  try {
    const gift = await giftModel.findOne(filter, proj);
    return gift;
  } catch (error) {
    throw error;
  }
}

/**
 * [R] קריאת מתנה לפי מזהה ייחודי (ObjectId)
 * @param {String} filter - מזהה (ID) של המתנה לחיפוש
 * @returns {Promise<Object|null>} המתנה שנמצאה או null אם לא נמצאה
 */
async function readById(filter) {

  try {
    const gift = await giftModel.findById(filter);
    
    return gift;
  } catch (error) {
    throw error;
  }
}

/**
 * [R] קריאת מספר מתנות לפי פילטר
 * @param {Object} filter - אובייקט המציין את תנאי החיפוש
 * @returns {Promise<Array>} מערך של מתנות שנמצאו
 */
async function read(filter) {

  try {
    const gifts = await giftModel.find(filter);
    return gifts;
  } catch (error) {
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
  

  try {
    const result = await giftModel.updateOne(filter, data);
    return result;
  } catch (error) {
    throw error;
  }
}

/**
 * [D] "מחיקה רכה" של מתנה – מסמן אותה כלא פעילה (isActive: false) במקום למחוק בפועל
 * @param {String} _id - מזהה המתנה
 * @returns {Promise<Object>} אובייקט התוצאה של הפעולה
 */
async function del(_id) {

  try {
    // מגדיר את isActive: false במקום מחיקה של רשומה
    const result = await update({ _id }, { isActive: false });
    return result;
  } catch (error) {
    throw error;
  }
}

module.exports = { creat, readOne, read, readById, update, del };
