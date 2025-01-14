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
  console.log("==> [INFO] התחלת addgift עם ערכים:", giftFields);

  // בדיקת שדות חובה
  if (!giftFields.phone || !giftFields.amount) {
    console.error("==> [ERROR] חסרים phone או amount:", giftFields);
    throw { code: 400, message: "missing phone number or amount" };
  }

  let newGift;
  // יצירת מתנה חדשה
  try {
    newGift = await giftController.creat(giftFields);
    console.log("==> [SUCCESS] המתנה נוצרה בהצלחה:", newGift?._id);
  } catch (error) {
    console.error("==> [ERROR] כשל ביצירת מתנה (addgift) gift logic 1:", error);
    throw error; // מומלץ לזרוק את השגיאה אם רוצים לטפל בה ברמה גבוהה יותר
  }

  // עדכון המשתמש על-ידי הוספת ה-giftId החדש למערך ה-giftsId
  try {
    await userController.update(
      { _id: giftFields.userid_gift },
      { $push: { giftsId: newGift._id } }
    );
    console.log(
      "==> [SUCCESS] מזהה המתנה נוסף למשתמש:",
      giftFields.userid_gift
    );
  } catch (error) {
    console.error("==> [ERROR] כשל בהוספת giftId למשתמש gift logic 2:", error);
    throw error;
  }

  // עדכון האירוע על-ידי הוספת ה-giftId החדש למערך ה-giftsId
  try {
    await eventController.update(
      { _id: giftFields.toEventId },
      { $push: { giftsId: newGift._id } }
    );
    console.log("==> [SUCCESS] מזהה המתנה נוסף לאירוע:", giftFields.toEventId);
  } catch (error) {
    console.error("==> [ERROR] כשל בהוספת giftId לאירוע gift logic 3:", error);
    throw error;
  }
};

/**
 * הוספת מתנה (addgiftG) ללא עדכון המשתמש או האירוע (לדוגמה: מתנה כללית).
 * @param {Object} giftFields - אובייקט המכיל שדות למתנה (phone, amount, ועוד).
 * @throws {Object} שגיאה עם message מתאים אם חסרים phone או amount.
 */
module.exports.addgiftG = async (giftFields) => {
  console.log("==> [INFO] התחלת addgiftG עם ערכים:", giftFields);

  // בדיקת שדות חובה
  if (!giftFields.phone || !giftFields.amount) {
    console.error("==> [ERROR] חסרים phone או amount:", giftFields);
    throw { code: 400, message: "missing phone number or amount" };
  }

  let newGift;
  try {
    newGift = await giftController.creat(giftFields);
    console.log("==> [SUCCESS] המתנה נוצרה בהצלחה (addgiftG):", newGift?._id);
  } catch (error) {
    console.error(
      "==> [ERROR] כשל ביצירת מתנה (addgiftG) gift logic 1:",
      error
    );
    throw error;
  }
};

/**
 * מחזיר מערך של מתנות (gift) לפי מערך מזהים (giftsId).
 * @param {Object} giftsId - אובייקט שבו המפתח (לרוב) הוא מערך של מזהי מתנות, לדוגמה: { giftsId: [...] }.
 * @returns {Promise<Array>} מערך של מתנות (או רשומות null אם מתנה לא נמצאה).
 */
module.exports.getgift = async (giftsId) => {
  console.log("==> [INFO] התחלת getgift עם מזהי מתנות:", giftsId);

  // חילוץ ערכי המתנות מתוך אובייקט ה-giftsId
  let giftId = Object.values(giftsId);
  giftId = giftId[0];
  console.log("==> [DEBUG] giftId extracted:", giftId);

  let gift = [];
  for (let index = 0; index < giftId.length; index++) {
    const element = giftId[index];
    console.log(`==> [DEBUG] מבצע חיפוש מתנה עבור ID: ${element}`);
    gift.push(await giftController.readById(element));
  }

  console.log("==> [SUCCESS] מספר המתנות שחולצו:", gift.length);
  return gift;
};
