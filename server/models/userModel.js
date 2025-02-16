const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  fname: { type: String, required: true },
  lname: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  entryDate: { type: Date, default: Date.now },
  giftsId: [String],
  eventId: [String],
  isManager: { type: Boolean, required: true }
})

module.exports = mongoose.model('User', userSchema) // CommonJS
