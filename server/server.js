//server/server.js
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const morgan = require('morgan') // לוודא שהתקנת עם npm install morgan
const dotenv = require('dotenv')
const router = require('./routes')
const jwt = require('jsonwebtoken')
const path = require('path')

dotenv.config()

const app = express()

// Middlewares
app.use(express.json())
app.use(cors())
app.use(morgan('dev'))

app.use('/api', router)

app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' })
})

app.use(express.static(path.join(__dirname, '../client/build')))

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build', 'index.html'))
})

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    console.log('✅ MongoDB Connected Successfully')
  } catch (error) {
    console.error('❌ Error Connecting to MongoDB:', error)
    process.exit(1)
  }
}
connectDB()

const PORT = process.env.PORT || 2001
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`))
