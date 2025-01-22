const eventController = require("../DL/controllers/eventController");
const userController = require("../DL/controllers/userController");

/**
 * מחזיר את כל האירועים
 * (למשל לצורך הצגת רשימת אירועים)
 */
async function getAllEvents() {
  const events = await eventController.read({});
  return events;
}

async function getEventNumber(reqNum) {
  let num = reqNum;
  const eventNumber = await eventController.readOne({Event_number : num});
  return eventNumber;
}

/**
 * יצירת אירוע חדש והוספת מזהה האירוע למשתמש (userid_event).
 * @param {Object} eventFields - אובייקט המכיל את שדות האירוע.
 * @throws {Object} אם אחד מהשדות החיוניים חסר, ייזרק אובייקט שגיאה עם code:400.
 */
async function addevent(eventFields) {
  // בדיקה אם אחד השדות החיוניים חסר/ריק
  if (
    !eventFields.NameOfGroom ||
    !eventFields.NameOfBride ||
    !eventFields.NameOfManager ||
    !eventFields.TypeOfEvent ||
    !eventFields.NumOfGuests ||
    !eventFields.phone ||
    !eventFields.DateOfEvent||
    !eventFields.userid_event
  ) {
    throw { code: 400, message: "missing data" };
  }


  //יצירת ID לאירוע למשתמש
  let number = Math.floor(Math.random() * (999 - 10 + 1)) + 10; // טווח המספרים: 10 עד 999;

  // do {
  //   number = Math.floor(Math.random() * (999 - 10 + 1)) + 10; // טווח המספרים: 10 עד 999
  //   // בדיקה ב-database אם המספר קיים
  //   const event = await eventController.read({ Event_number: number });
  //   console.log("event: ", event);
  // } while (event.length > 0); // המשך הלולאה אם המספר קיים ב-database

  eventFields.Event_number = number;

  console.log("eventFields: ", eventFields);

  // יצירת האירוע במסד הנתונים
  let newEvent = await eventController.create(eventFields);
  console.log("newEvent: ", newEvent);
  // עדכון המשתמש והוספת מזהה האירוע במערך שלו
  await userController.update(
    { _id: eventFields.userid_event },
    { $push: { eventId: newEvent._id } }
  );
  console.log(
    "eventFields.userid_event", eventFields.userid_event);

  // אפשר להחזיר את האירוע החדש, אם תרצה שהראוט ישלח את המידע חזרה ללקוח
  return newEvent;

}

/**
 * עדכון אירוע קיים (Update)
 * @param {String} eventId - מזהה האירוע (ObjectId) לעדכון
 * @param {Object} updateFields - אובייקט המכיל את השדות החדשים/המעודכנים
 */
async function updateEvent(eventId, updateFields) {

  if (!eventId) {
    throw { code: 400, message: "missing eventId" };
  }

  try {
    // קריאה לפונקציה בעזרת ה-controller (DL)
    const updated = await eventController.update(
      { _id: eventId },
      updateFields
    );
    return updated;
  } catch (error) {
    throw error;
  }
}

/**
 * מחיקת אירוע (Delete) - ניתן לבצע "מחיקה פיזית" או "מחיקה רכה" (isActive=false).
 * כאן נבצע מחיקה פיזית לדוגמה.
 * @param {String} eventId - מזהה האירוע (ObjectId) למחיקה
 */
async function deleteEvent(eventId) {

  if (!eventId) {
    throw { code: 400, message: "missing eventId" };
  }

  try {
    // אפשרות א: מחיקה פיזית
    const deleted = await eventController.deleteOne({ _id: eventId });

    // אפשרות ב: מחיקה רכה
    // const deleted = await eventController.update(
    //   { _id: eventId },
    //   { isActive: false }
    // );

    return deleted;
  } catch (error) {
    throw error;
  }
}

/** ייצוא כל הפונקציות */
module.exports = {
  getEventNumber,
  getAllEvents,
  addevent,
  updateEvent,
  deleteEvent,
};
