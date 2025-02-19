//server/routes/eventRoutes.js
const express = require('express')
const router = express.Router()
const giftService = require('../services/giftService')
const eventService = require('../services/eventService')
const eventController = require('../controllers/eventController')
const { authJWT } = require('../middleware/authMiddleware')

router.post('/getGiftsByEvent', async (req, res) => {
  try {
    const gifts = await giftService.getGiftsByEvent(req.body)
    res.status(200).json(gifts)
  } catch (error) {
    console.error('❌ Error fetching gifts by event:', error)
    res.status(500).json({ error: 'Failed to fetch gifts by event' })
  }
})

router.post('/checkEventNumber', async (req, res) => {
  try {
    const eventNumber = await eventService.checkEventNumber(req.body)
    res.status(200).json(eventNumber)
  } catch (error) {
    console.error('❌ Error checking event number:', error)
    res.status(500).json({ error: 'Failed to check event number' })
  }
})

router.get('/getAll', async (req, res) => {
  try {
    const allEvents = await eventService.getAllEvents()
    console.log('getAll events', allEvents)
    return res.status(200).json(allEvents)
  } catch (error) {
    console.error('❌ Error fetching all events:', error)
    res.status(500).json({ error: 'Failed to fetch all events' })
  }
})

router.get('/:eventId', async (req, res) => {
  try {
    const event = await eventController.readById(req.params.eventId)
    if (!event) return res.status(404).json({ error: 'Event not found' })
    res.status(200).json(event)
  } catch (error) {
    console.error('❌ Error fetching event by ID:', error)
    res.status(500).json({ error: 'Failed to fetch event' })
  }
})

//router.post('/addEvent', authJWT, async (req, res) => {
router.post('/addEvent', async (req, res) => {
  try {
    const event = await eventService.addevent(req.body)
    res.status(201).json({ message: 'Event added successfully', event })
  } catch (error) {
    console.error('❌ Error adding event:', error)
    res.status(500).json({ error: 'Failed to add event' })
  }
})

router.put('/:eventId', async (req, res) => {
  console.log(';;;;;;;;;;;;;;;;;;' , req.params.eventId)
  try {
    console.log('📌 req.params.eventId:', typeof req.params.eventId, req.params.eventId)
    const updatedEvent = await eventService.updateEvent(req.params.eventId, req.body)
    res.status(200).json(updatedEvent)
  } catch (error) {
    console.error('❌ Error updating event:', error)
    res.status(500).json({ error: 'Failed to update event' })
  }
})

router.delete('/:eventId', async (req, res) => {
  try {
    const deletedEvent = await eventService.deleteEvent(req.params.eventId)
    console.log('deletedEvent on eventRoutes delete', deletedEvent)
    res.status(200).json(deletedEvent)
  } catch (error) {
    console.error('❌ Error deleting event:', error)
    res.status(500).json({ error: 'Failed to delete event' })
  }
})

// ראוט בדיקה
router.get('/test', (req, res) => {
  res.json({ message: 'Events routes are working!' })
})

module.exports = router
