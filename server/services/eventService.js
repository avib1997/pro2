//server/services/eventService.js
const eventController = require('../controllers/eventController')
const userController = require('../controllers/userController')
const giftController = require('../controllers/giftController')
const nodemailer = require('nodemailer')
require('dotenv').config()

console.log('📧 EMAIL_USER:', process.env.EMAIL_USER)
console.log('🔑 EMAIL_PASS:', process.env.EMAIL_PASS ? 'Exists' : 'Missing')

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, // יש להגדיר משתנה סביבה עם אימייל
    pass: process.env.EMAIL_PASS // יש להגדיר משתנה סביבה עם סיסמת האימייל
  }
})

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
  console.log('📌 addevent function called with:', eventFields)
  if (!eventFields.NameOfGroom || !eventFields.NameOfManager || !eventFields.TypeOfEvent || !eventFields.phone || !eventFields.DateOfEvent || !eventFields.userid_event || !eventFields.emailPaypal) {
    console.error('❌ Missing required fields:', eventFields)
    throw { code: 400, message: 'missing data' }
  }

  let number
  let isUnique = false

  // בדיקת מספר ייחודי
  while (!isUnique) {
    number = Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000 // טווח המספרים: 1000 עד 9999
    const existingEvent = await eventController.readOne({ Event_number: number })

    if (!existingEvent) {
      isUnique = true
    }
  }

  eventFields.Event_number = number
  console.log('eventFields:', eventFields)

  let newEvent = await eventController.create(eventFields)
  console.log('newEvent:', newEvent)

  await userController.update({ _id: eventFields.userid_event }, { $push: { eventId: newEvent._id } })

  console.log('eventFields.userid_event', eventFields.userid_event)
  if (!newEvent.emailPaypal) {
    console.error('❌ Email address is missing. Cannot send email.')
    return newEvent
  }
  console.log('📩 Email will be sent to:', newEvent.emailPaypal)

  // שליחת מייל עם קישור לרישום חשבון PayPal Business
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: newEvent.emailPaypal,
    subject: 'רישום לחשבון PayPal Business',
    html: `
      <h2>שלום ${newEvent.NameOfManager},</h2>
      <p>נוסף אירוע חדש במערכת שלך.</p>
      <p>כדי לקבל תשלומים, יש להירשם לחשבון PayPal Business:</p>
      <a href="https://www.paypal.com/bizsignup/" style="color:blue;">לחץ כאן לרישום</a>
      <p>בברכה,<br> צוות Easy Gift</p>
    `
  }

  try {
    console.log('📡 Attempting to send email...')

    await transporter.sendMail(mailOptions)
    console.log('✅ Email sent successfully to:', newEvent.emailPaypal)
  } catch (emailError) {
    console.error('❌ Error sending email:', emailError)
  }

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
