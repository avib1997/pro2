const express = require("express");
const router = express.Router();
const eventLogic = require("../BL/eventLogic"); // שכבת הלוגיקה של האירועים
// const auth = require("../middlewere/auth"); // במידה ואתה משתמש במידלוור אימות (אופציונלי)


router.post("/EventNumber", async (req, res) => {
  try {
    const { EventNumber } = req.body; // קבלת EventNumber מה-body
    const eventNumber = await eventLogic.getEventNumber(EventNumber);
    res.status(200).json(eventNumber);
  } catch (error) {
    console.error("Error in /EventNumber:", error);
    res.status(500).json({ error: "Failed to get event number" });
  }
});

// [GET] מחזיר את כל האירועים
router.get("/getAll", async (req, res) => {
  try {
    const allEvents = await eventLogic.getAllEvents();
    res.status(200).json(allEvents);
  } catch (error) {
    res.status(500).json({ error: "Failed to get events" });
  }
});

/**
 * [POST] /addEvent
 * תפקיד: להוסיף אירוע חדש באמצעות שכבת הלוגיקה (eventLogic).
 */
router.post("/addEvent", async (req, res) => {
  try {
    const eventDetails = await eventLogic.addevent(req.body);

    return res.status(200).send({
      message: "Event added successfully",
      data: eventDetails,
    });
  } catch (error) {
    return res.status(500).send({ error: "Failed to add event" });
  }
});

/**
 * [PUT] /:eventId
 * תפקיד: לעדכן אירוע קיים לפי מזהה (eventId).
 */
router.put("/:eventId", async (req, res) => {
  
  try {
    const updatedEvent = await eventLogic.updateEvent(
      req.params.eventId,
      req.body
    );
    return res.status(200).json(updatedEvent);
  } catch (error) {
    return res.status(500).json({ error: "Failed to update event" });
  }
});

/**
 * [DELETE] /:eventId
 * תפקיד: למחוק (או לבצע מחיקה רכה) אירוע לפי מזהה (eventId).
 */
router.delete("/:eventId", async (req, res) => {
  try {
    const deletedEvent = await eventLogic.deleteEvent(req.params.eventId);
    return res.status(200).json(deletedEvent);
  } catch (error) {
    return res.status(500).json({ error: "Failed to delete event" });
  }
});

module.exports = router;
