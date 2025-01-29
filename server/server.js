//server/server.js
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const morgan = require('morgan') // לוודא שהתקנת עם npm install morgan
const dotenv = require('dotenv')
const router = require('./routes')

dotenv.config()

const app = express()

// Middlewares
app.use(express.json())
app.use(cors())
app.use(morgan('dev'))

// DB Connection
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

// Routes - חיבור כל הנתיבים
app.use('/api', router)

// דף שגיאה לנתיבים לא מוכרים
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' })
})

// הפעלת השרת
const PORT = process.env.PORT || 2001
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`))
