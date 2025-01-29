const fs = require('fs')
const path = require('path')
const morgan = require('morgan')

// תיקיית הלוגים (logs/)
const logDirectory = path.join(__dirname, '../logs')
if (!fs.existsSync(logDirectory)) fs.mkdirSync(logDirectory)

// יצירת סטרים לכתיבה ללוג
const logStream = fs.createWriteStream(path.join(logDirectory, 'server.log'), { flags: 'a' })

// Middleware של Morgan לכתיבת לוגים
const logger = morgan('combined', { stream: logStream })

module.exports = logger
