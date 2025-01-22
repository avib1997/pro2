const giftController = require("../DL/controllers/giftController");
const jwtFn = require("../middlewere/jwt");
const bcrypt = require("bcryptjs");
const userController = require("../DL/controllers/userController");
const eventController = require("../DL/controllers/eventController");

/**
 * הוספת מתנה (addgift) הכוללת הפניית מזהה מתנה חדש גם למשתמש (giftsId) וגם לאירוע (giftsId).
 * @param {Object} giftFields - אובייקט המכיל שדות למתנה (phone, amount, userid_gift, ועוד).
 * @throws {Object} שגיאה עם message מתאים אם חסרים phone או amount.
 */
module.exports.addgift = async (giftFields) => {

  // בדיקת שדות חובה
  if (!giftFields.phone || !giftFields.amount) {
    throw { code: 400, message: "missing phone number or amount" };
  }

  let newGift;
  // יצירת מתנה חדשה
  try {
    newGift = await giftController.creat(giftFields);
  } catch (error) {
    throw error; // מומלץ לזרוק את השגיאה אם רוצים לטפל בה ברמה גבוהה יותר
  }

  // עדכון המשתמש על-ידי הוספת ה-giftId החדש למערך ה-giftsId
  try {
    await userController.update(
      { _id: giftFields.userid_gift },
      { $push: { giftsId: newGift._id } }
    );

  } catch (error) {
    throw error;
  }

  // עדכון האירוע על-ידי הוספת ה-giftId החדש למערך ה-giftsId
  try {
    await eventController.update(
      { _id: giftFields.eventId },
      { $push: { giftsId: newGift._id } }
    );
  } catch (error) {
    throw error;
  }
};

/**
 * הוספת מתנה (addgiftG) ללא עדכון המשתמש או האירוע (לדוגמה: מתנה כללית).
 * @param {Object} giftFields - אובייקט המכיל שדות למתנה (phone, amount, ועוד).
 * @throws {Object} שגיאה עם message מתאים אם חסרים phone או amount.
 */
module.exports.addgiftG = async (giftFields) => {

  // בדיקת שדות חובה
  if (!giftFields.phone || !giftFields.amount) {
    throw { code: 400, message: "missing phone number or amount" };
  }

  let newGift;
  try {
    newGift = await giftController.creat(giftFields);
  } catch (error) {

    throw error;
  }
};

/**
 * מחזיר מערך של מתנות (gift) לפי מערך מזהים (giftsId).
 * @param {Object} giftsId - אובייקט שבו המפתח (לרוב) הוא מערך של מזהי מתנות, לדוגמה: { giftsId: [...] }.
 * @returns {Promise<Array>} מערך של מתנות (או רשומות null אם מתנה לא נמצאה).
 */
module.exports.getgift = async (giftsId) => {

  // חילוץ ערכי המתנות מתוך אובייקט ה-giftsId
  let giftId = Object.values(giftsId);
  giftId = giftId[0];

  let gift = [];
  for (let index = 0; index < giftId.length; index++) {
    const element = giftId[index];
    gift.push(await giftController.readById(element));
  }

  return gift;
};
