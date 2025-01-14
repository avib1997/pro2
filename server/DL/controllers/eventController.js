const { eventModel } = require("../models/events");

/**
 * [R] קריאת מספר אירועים לפי פילטר (פונקציית עזר כללית)
 * @param {Object} filter - תנאי החיפוש
 * @returns {Promise<Array>} מערך אירועים
 */
async function read(filter) {
  console.log("==> [INFO] קריאת אירועים עם פילטר:", filter);
  try {
    const events = await eventModel.find(filter);
    console.log("==> [SUCCESS] נמצאו", events.length, "אירועים תואמים");
    return events;
  } catch (error) {
    console.error("==> [ERROR] בקריאת אירועים:", error.message);
    throw error;
  }
}

/**
 * [C] יצירת אירוע חדש במסד הנתונים
 * @param {Object} data - אובייקט המכיל את פרטי האירוע
 * @returns {Promise<Object>} אובייקט האירוע שנוצר
 */
async function create(data) {
  console.log("==> [INFO] התחלת יצירת אירוע חדש:", data);
  try {
    const newEvent = await eventModel.create(data);
    console.log("==> [SUCCESS] אירוע נוצר בהצלחה:", newEvent._id);
    return newEvent;
  } catch (error) {
    console.error("==> [ERROR] שגיאה ביצירת אירוע:", error.message);
    throw error;
  }
}

/**
 * [R] קריאת אירוע בודד לפי פילטר
 * @param {Object} filter - תנאי החיפוש (פילטר)
 * @param {Object} [proj] - אובייקט Projection (אופציונלי) לצמצום שדות
 * @returns {Promise<Object|null>} האירוע שנמצא או null אם לא נמצא
 */
async function readOne(filter, proj) {
  console.log("==> [INFO] חיפוש אירוע בודד לפי פילטר:", filter);
  try {
    const event = await eventModel.findOne(filter, proj);
    console.log("==> [SUCCESS] תוצאת החיפוש:", event ? event._id : "לא נמצא");
    return event;
  } catch (error) {
    console.error("==> [ERROR] שגיאה בקריאת אירוע בודד:", error.message);
    throw error;
  }
}

/**
 * [R] קריאת אירוע לפי מזהה ייחודי (ObjectId)
 * @param {String} filter - ה-ID (ObjectId) של האירוע
 * @returns {Promise<Object|null>} האירוע שנמצא או null אם לא נמצא
 */
async function readById(filter) {
  console.log("==> [INFO] קריאת אירוע לפי ID:", filter);
  try {
    const event = await eventModel.findById(filter);
    console.log("==> [SUCCESS] נמצא אירוע:", event ? event._id : "לא נמצא");
    return event;
  } catch (error) {
    console.error("==> [ERROR] שגיאה בקריאת אירוע לפי ID:", error.message);
    throw error;
  }
}

/**
 * [R] קריאת מספר אירועים לפי פילטר (כמו read, אך בשם שונה 'reade')
 * @param {Object} filter - תנאי החיפוש
 * @returns {Promise<Array>} מערך אירועים
 */
async function reade(filter) {
  console.log("==> [INFO] חיפוש אירועים עם הפילטר (reade):", filter);
  try {
    const events = await eventModel.find(filter);
    console.log(`==> [SUCCESS] נמצאו ${events.length} אירועים תואמים (reade).`);
    return events;
  } catch (error) {
    console.error("==> [ERROR] שגיאה בקריאת אירועים (reade):", error.message);
    throw error;
  }
}

/**
 * [U] עדכון אירוע(ים) לפי פילטר
 * @param {Object} filter - תנאי החיפוש
 * @param {Object} data - השינויים לעדכון
 * @returns {Promise<Object>} אובייקט התוצאה של updateOne
 */
async function update(filter, data) {
  console.log(
    "==> [INFO] עדכון אירוע(ים) עם פילטר:",
    filter,
    "ושינויים:",
    data
  );
  try {
    const result = await eventModel.updateOne(filter, data);
    console.log("==> [SUCCESS] תוצאת העדכון:", result);
    return result;
  } catch (error) {
    console.error("==> [ERROR] שגיאה בעדכון אירוע(ים):", error.message);
    throw error;
  }
}

/**
 * [D] מחיקה רכה של אירוע – מסמן isActive: false במקום למחוק בפועל
 * @param {String} _id - מזהה ה-ObjectId של האירוע
 * @returns {Promise<Object>} אובייקט התוצאה של הפעולה
 */
async function del(_id) {
  console.log("==> [INFO] מחיקה פיזית של אירוע עם מזהה:", _id);
  try {
    const result = await eventModel.deleteOne({ _id });
    console.log("==> [SUCCESS] האירוע נמחק לגמרי:", result);
    return result;
  } catch (error) {
    console.error("==> [ERROR] שגיאה במחיקה הפיזית של האירוע:", error.message);
    throw error;
  }
}

// ייצוא כל הפונקציות
module.exports = {
  read,
  create,
  readOne,
  reade,
  readById,
  update,
  del,
};
