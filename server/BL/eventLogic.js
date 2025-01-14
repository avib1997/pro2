const eventController = require("../DL/controllers/eventController");
const userController = require("../DL/controllers/userController");

/**
 * מחזיר את כל האירועים
 * (למשל לצורך הצגת רשימת אירועים)
 */
async function getAllEvents() {
  console.log("==> [INFO] קריאת כל האירועים (getAllEvents)");
  const events = await eventController.read({});
  return events;
}

/**
 * יצירת אירוע חדש והוספת מזהה האירוע למשתמש (userid_event).
 * @param {Object} eventFields - אובייקט המכיל את שדות האירוע.
 * @throws {Object} אם אחד מהשדות החיוניים חסר, ייזרק אובייקט שגיאה עם code:400.
 */
async function addevent(eventFields) {
  console.log("==> [INFO] התחלת יצירת אירוע חדש:", eventFields);

  // בדיקה אם אחד השדות החיוניים חסר/ריק
  if (
    !eventFields.NameOfGroom ||
    !eventFields.NameOfBride ||
    !eventFields.NameOfManager ||
    !eventFields.TypeOfEvent ||
    !eventFields.NumOfGuests ||
    !eventFields.phone ||
    !eventFields.DateOfEvent
  ) {
    console.error("==> [ERROR] שדות חסרים ליצירת האירוע:", eventFields);
    throw { code: 400, message: "missing data" };
  }

  try {
    // יצירת האירוע במסד הנתונים
    const newEvent = await eventController.create(eventFields);
    console.log("==> [SUCCESS] אירוע חדש נוצר בהצלחה:", newEvent._id);

    // עדכון המשתמש והוספת מזהה האירוע במערך שלו
    await userController.update(
      { _id: eventFields.userid_event },
      { $push: { eventId: newEvent._id } }
    );
    console.log(
      "==> [SUCCESS] מזהה האירוע נוסף למשתמש:",
      eventFields.userid_event
    );

    // אפשר להחזיר את האירוע החדש, אם תרצה שהראוט ישלח את המידע חזרה ללקוח
    return newEvent;
  } catch (error) {
    console.error(
      "==> [ERROR] כשל ביצירת האירוע או בעדכון המשתמש:",
      error.message
    );
    throw error;
  }
}

/**
 * עדכון אירוע קיים (Update)
 * @param {String} eventId - מזהה האירוע (ObjectId) לעדכון
 * @param {Object} updateFields - אובייקט המכיל את השדות החדשים/המעודכנים
 */
async function updateEvent(eventId, updateFields) {
  console.log("==> [INFO] תחילת עדכון אירוע", { eventId }, { updateFields });

  if (!eventId) {
    console.error("==> [ERROR] לא הוזן מזהה אירוע (eventId)");
    throw { code: 400, message: "missing eventId" };
  }

  try {
    // קריאה לפונקציה בעזרת ה-controller (DL)
    const updated = await eventController.update(
      { _id: eventId },
      updateFields
    );
    console.log("==> [SUCCESS] אירוע עודכן בהצלחה:", updated);
    return updated;
  } catch (error) {
    console.error("==> [ERROR] כשל בעדכון אירוע:", error.message);
    throw error;
  }
}

/**
 * מחיקת אירוע (Delete) - ניתן לבצע "מחיקה פיזית" או "מחיקה רכה" (isActive=false).
 * כאן נבצע מחיקה פיזית לדוגמה.
 * @param {String} eventId - מזהה האירוע (ObjectId) למחיקה
 */
async function deleteEvent(eventId) {
  console.log("==> [INFO] תחילת מחיקת אירוע:", eventId);

  if (!eventId) {
    console.error("==> [ERROR] לא הוזן מזהה אירוע (eventId)");
    throw { code: 400, message: "missing eventId" };
  }

  try {
    // אפשרות א: מחיקה פיזית
    const deleted = await eventController.deleteOne({ _id: eventId });
    console.log("==> [SUCCESS] אירוע נמחק בהצלחה:", deleted);

    // אפשרות ב: מחיקה רכה
    // const deleted = await eventController.update(
    //   { _id: eventId },
    //   { isActive: false }
    // );

    return deleted;
  } catch (error) {
    console.error("==> [ERROR] כשל במחיקת אירוע:", error.message);
    throw error;
  }
}

/** ייצוא כל הפונקציות */
module.exports = {
  getAllEvents,
  addevent,
  updateEvent,
  deleteEvent,
};
