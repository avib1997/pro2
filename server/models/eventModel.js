//server/models/eventModel.js
const mongoose = require('mongoose')

const eventSchema = new mongoose.Schema({
  NameOfGroom: { type: String, required: false },
  NameOfBride: { type: String, required: false },
  NameOfManager: { type: String, required: false },
  TypeOfEvent: { type: String, required: false },
  Event_number: { type: Number, required: true, unique: true },
  phone: { type: String, required: false },
  userid_event: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true },
  DateOfEvent: { type: Date, required: false },
  giftsId: [{ type: mongoose.Schema.Types.ObjectId, ref: 'gifts' }],
  isActive: { type: Boolean, default: true }
})

module.exports = mongoose.model('events', eventSchema)
