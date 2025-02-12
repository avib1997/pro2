const express = require('express')
const router = express.Router()

const giftRouter = require('./giftRoutes')
const usersRouter = require('./usersRoutes')
const eventRouter = require('./eventRoutes')

const { deleteAllEvents, deleteAllGifts, deleteAllUsers } = require('../controllers/delAll') // וודא שיש קובץ שמכיל את הפונקציות
const { saveLog } = require('../controllers/saveLogController') // ייבוא הפונקציה ששומרת לוגים

// נתיב למחיקת כל הנתונים ב-DB
router.delete('/delete-all', async (req, res) => {
  try {
    await deleteAllEvents()
    await deleteAllGifts()
    await deleteAllUsers()
    console.log('✅ כל הנתונים נמחקו בהצלחה מכל האוספים!')
    res.status(200).json({ message: 'כל הנתונים נמחקו בהצלחה!' })
  } catch (error) {
    console.error('❌ שגיאה במחיקת הנתונים:', error)
    res.status(500).json({ message: 'שגיאה במחיקת הנתונים.', error: error.message })
  }
})

router.post('/addLog', async (req, res) => {
  console.log('📝 req.body log:', req.body)
  const { level, category, code, message, serverOrClient, URL, func, userId, giftId, eventId, meta } = req.body
  console.log('level userID', userId)
  try {
    const log = await saveLog(level, category, code, message, serverOrClient, URL, func, userId, giftId, eventId, meta)
    console.log('✅ Log saved successfully')
    res.status(201).json(log)
  } catch (error) {
    console.error('❌ Error saving log:', error)
    res.status(500).json({ message: 'Error saving log', error: error.message })
  }
})

router.use('/gift', giftRouter)
router.use('/users', usersRouter)
router.use('/events', eventRouter)

module.exports = router
