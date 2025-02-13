//server/services/eventService.js
const eventController = require('../controllers/eventController')
const userController = require('../controllers/userController')
const giftController = require('../controllers/giftController')

async function getAllEvents() {
  const events = await eventController.read({})
  return events
}

async function getEventNumber(reqNum) {
  let num = reqNum
  const eventNumber = await eventController.readOne({ Event_number: num })
  return eventNumber
}

async function addevent(eventFields) {
  if (!eventFields.NameOfGroom || !eventFields.NameOfManager || !eventFields.TypeOfEvent || !eventFields.phone || !eventFields.DateOfEvent || !eventFields.userid_event) {
    throw { code: 400, message: 'missing data' }
  }
  let number = Math.floor(Math.random() * (999 - 10 + 1)) + 10 // טווח המספרים: 10 עד 999;
  eventFields.Event_number = number
  console.log('eventFields: ', eventFields)
  let newEvent = await eventController.create(eventFields)
  console.log('newEvent: ', newEvent)
  await userController.update({ _id: eventFields.userid_event }, { $push: { eventId: newEvent._id } })
  console.log('eventFields.userid_event', eventFields.userid_event)
  return newEvent
}

async function updateEvent(eventId, updateFields) {
  if (!eventId) {
    throw { code: 400, message: 'missing eventId' }
  }
  // אם eventId מגיע כאובייקט, שלוף ממנו את ה-_id
  if (typeof eventId === 'object' && eventId._id) {
    eventId = String(eventId._id)
  }
  try {
    const updated = await eventController.update(eventId, updateFields)
    return updated
  } catch (error) {
    throw error
  }
}

async function deleteEvent(eventId) {
  if (!eventId) {
    throw { code: 400, message: 'missing eventId' }
  }
  try {
    const eventDeleted = await eventController.deleteOne({ _id: eventId })
    if (!eventDeleted) {
      throw { code: 404, message: 'error delete event' }
    }
    await userController.update({ eventId: eventId }, { $pull: { eventId: eventId } })
    console.log('✅ Event', eventId, 'deleted and removed from all users.')
    return { success: true, message: 'Event deleted and users updated successfully' }
  } catch (error) {
    console.log('❌ Error deleting event:', error)
    return { success: false, error: error.message }
  }
}

async function getGiftsByEvent(eventId) {
  if (!eventId) {
    throw { code: 400, message: 'missing eventId' }
  }
  try {
    const gifts = await giftController.read({ EventId: eventId })
    return gifts
  } catch (error) {
    throw error
  }
}

async function checkEventNumber(eventNumber) {
  if (!eventNumber) {
    throw { code: 400, message: 'missing event number' }
  }
  try {
    const eventNum = await eventController.readOne(eventNumber)
    return eventNum
  } catch (error) {
    throw error
  }
}

module.exports = {
  checkEventNumber,
  getEventNumber,
  getAllEvents,
  addevent,
  updateEvent,
  deleteEvent,
  getGiftsByEvent
}
