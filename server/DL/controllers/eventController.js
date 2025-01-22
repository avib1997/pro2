const { eventModel } = require("../models/events");

/**
 * [R] קריאת מספר אירועים לפי פילטר (פונקציית עזר כללית)
 * @param {Object} filter - תנאי החיפוש
 * @returns {Promise<Array>} מערך אירועים
 */
async function read(filter) {
  try {
    const events = await eventModel.find(filter);
    return events;
  } catch (error) {
    throw error;
  }
}

/**
 * [C] יצירת אירוע חדש במסד הנתונים
 * @param {Object} data - אובייקט המכיל את פרטי האירוע
 * @returns {Promise<Object>} אובייקט האירוע שנוצר
 */
async function create(data) {
  try {
    const newEvent = await eventModel.create(data);
    return newEvent;
  } catch (error) {
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
  try {
    const event = await eventModel.findOne(filter, proj);
    return event;
  } catch (error) {
    throw error;
  }
}

/**
 * [R] קריאת אירוע לפי מזהה ייחודי (ObjectId)
 * @param {String} filter - ה-ID (ObjectId) של האירוע
 * @returns {Promise<Object|null>} האירוע שנמצא או null אם לא נמצא
 */
async function readById(filter) {
  try {
    const event = await eventModel.findById(filter);
    return event;
  } catch (error) {
    throw error;
  }
}

/**
 * [R] קריאת מספר אירועים לפי פילטר (כמו read, אך בשם שונה 'reade')
 * @param {Object} filter - תנאי החיפוש
 * @returns {Promise<Array>} מערך אירועים
 */
async function reade(filter) {
  try {
    const events = await eventModel.find(filter);
    return events;
  } catch (error) {
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
  
  try {
    const result = await eventModel.updateOne(filter, data);
    return result;
  } catch (error) {
    throw error;
  }
}

/**
 * [D] מחיקה רכה של אירוע – מסמן isActive: false במקום למחוק בפועל
 * @param {String} _id - מזהה ה-ObjectId של האירוע
 * @returns {Promise<Object>} אובייקט התוצאה של הפעולה
 */
async function del(_id) {
  try {
    const result = await eventModel.deleteOne({ _id });
    return result;
  } catch (error) {
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
