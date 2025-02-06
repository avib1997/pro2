const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  fname: { type: String, required: true },
  lname: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  entryDate: { type: Date, default: Date.now },
  giftsId: [String],
  eventId: [String],
  isManeger: { type: Boolean, default: false }
})

module.exports = mongoose.model('User', userSchema) // CommonJS
