//server/controllers/eventController.js
const eventModel = require('../models/eventModel')
const mongoose = require('mongoose')

async function read(filter) {
  console.log('filter:', filter)
  try {
    return await eventModel.find(filter)
  } catch (error) {
    console.error('❌ Error reading events:', error)
    throw new Error('Failed to read events')
  }
}

const readOne = async (filter = {}) => {
  console.log('filter:', filter)
  try {
    return await eventModel.findOne(filter)
  } catch (error) {
    console.error('❌ Error reading event:', error)
    throw new Error('Failed to read event')
  }
}

const readById = async id => {
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) throw new Error('Invalid ObjectId format')
    return await eventModel.findById(id)
  } catch (error) {
    console.error('❌ Error reading event by ID:', error)
    throw new Error('Failed to read event by ID')
  }
}

const create = async data => {
  try {
    const requiredFields = ['NameOfGroom', 'NameOfManager', 'TypeOfEvent', 'phone', 'DateOfEvent', 'userid_event']
    if (requiredFields.some(field => !data[field])) throw new Error('Missing required event fields')
    let isUnique = false
    let eventNumber
    while (!isUnique) {
      eventNumber = Math.floor(1000 + Math.random() * 9000)
      const existingEvent = await eventModel.findOne({ Event_number: eventNumber })
      if (!existingEvent) isUnique = true // נמצא מספר ייחודי
    }
    data.Event_number = eventNumber
    const newEvent = await eventModel.create(data)
    return newEvent
  } catch (error) {
    console.error('❌ Error creating event:', error.message)
    throw new Error(error.message)
  }
}

const update = async (id, data) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) throw new Error('Invalid ObjectId format')
    return await eventModel.findByIdAndUpdate(id, data, { new: true })
  } catch (error) {
    console.error('❌ Error updating event:', error)
    throw new Error('Failed to update event')
  }
}

const del = async id => {
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) throw new Error('Invalid ObjectId format')
    return await eventModel.findByIdAndDelete(id)
  } catch (error) {
    console.error('❌ Error deleting event:', error)
    throw new Error('Failed to delete event')
  }
}

const deleteOne = async filter => {
  try {
    return await eventModel.deleteOne(filter)
  } catch (error) {
    console.error('❌ Error deleting event:', error)
    throw new Error('Failed to delete event')
  }
}

module.exports = { read, readOne, readById, create, update, del, deleteOne }
