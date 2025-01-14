const express = require("express");
const router = express.Router();
const eventLogic = require("../BL/eventLogic"); // שכבת הלוגיקה של האירועים
// const auth = require("../middlewere/auth"); // במידה ואתה משתמש במידלוור אימות (אופציונלי)

// [GET] מחזיר את כל האירועים
router.get("/getAll", async (req, res) => {
  try {
    const allEvents = await eventLogic.getAllEvents();
    res.status(200).json(allEvents);
  } catch (error) {
    console.error("[ERROR] לא ניתן להחזיר אירועים:", error.message);
    res.status(500).json({ error: "Failed to get events" });
  }
});

/**
 * [POST] /addEvent
 * תפקיד: להוסיף אירוע חדש באמצעות שכבת הלוגיקה (eventLogic).
 */
router.post("/addEvent", async (req, res) => {
  console.log("==> [INFO] התחלת עיבוד בקשה ל-addEvent", { body: req.body });
  try {
    const eventDetails = await eventLogic.addevent(req.body);
    console.log("==> [SUCCESS] אירוע נוסף בהצלחה:", eventDetails);

    return res.status(200).send({
      message: "Event added successfully",
      data: eventDetails,
    });
  } catch (error) {
    console.error("==> [ERROR] כשל בהוספת אירוע:", error.message);
    return res.status(500).send({ error: "Failed to add event" });
  }
});

/**
 * [PUT] /:eventId
 * תפקיד: לעדכן אירוע קיים לפי מזהה (eventId).
 */
router.put("/:eventId", async (req, res) => {
  console.log(
    "==> [INFO] עדכון אירוע עם ID:",
    req.params.eventId,
    "body:",
    req.body
  );
  try {
    const updatedEvent = await eventLogic.updateEvent(
      req.params.eventId,
      req.body
    );
    console.log("==> [SUCCESS] אירוע עודכן בהצלחה:", updatedEvent);
    return res.status(200).json(updatedEvent);
  } catch (error) {
    console.error("==> [ERROR] כשל בעדכון אירוע:", error.message);
    return res.status(500).json({ error: "Failed to update event" });
  }
});

/**
 * [DELETE] /:eventId
 * תפקיד: למחוק (או לבצע מחיקה רכה) אירוע לפי מזהה (eventId).
 */
router.delete("/:eventId", async (req, res) => {
  console.log("==> [INFO] מחיקת אירוע עם ID:", req.params.eventId);
  try {
    const deletedEvent = await eventLogic.deleteEvent(req.params.eventId);
    console.log("==> [SUCCESS] אירוע נמחק בהצלחה:", deletedEvent);
    return res.status(200).json(deletedEvent);
  } catch (error) {
    console.error("==> [ERROR] כשל במחיקת אירוע:", error.message);
    return res.status(500).json({ error: "Failed to delete event" });
  }
});

module.exports = router;
