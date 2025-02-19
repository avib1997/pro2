//server/models/eventModel.js
const mongoose = require('mongoose')
//server/controllers/eventcontroller/create
//server/services/eventservice/addevent
//client/src/Components/events/AddEvent/handleAddEventClick
//client/src/Components/events/AddEventDialog/handleAddEventClick
const eventSchema = new mongoose.Schema({
  NameOfGroom: { type: String, required: false },
  NameOfBride: { type: String, required: false },
  NameOfManager: { type: String, required: false },
  TypeOfEvent: { type: String, required: false },
  Event_number: { type: Number, required: true, unique: true },
  phone: { type: String, required: false },
  emailPaypal: { type: String, required: true },
  userid_event: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  DateOfEvent: { type: Date, required: false },
  giftsId: [String],
  isActive: { type: Boolean, default: true }
})

module.exports = mongoose.model('events', eventSchema)
