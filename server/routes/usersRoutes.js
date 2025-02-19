//server/routes/usersRoutes.js

const express = require('express')
const router = express.Router()
const userService = require('../services/userService')
const { fixHebrewText } = require('../fixHebrew.js')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt') // אם אתה מצפין סיסמה

router.post('/login', async (req, res) => {
  console.log('(req.body):' + fixHebrewText(' נתוני הבקשה '), req.body)
  try {
    const token = await userService.login(req.body)
    console.log(fixHebrewText('טוקן נוצר בהצלחה:'), token)
    res.send({ token: token })
    // res.json({ token })
  } catch (err) {
    console.log(fixHebrewText('[ERROR] בשירות login:'), err.message)
    res.send(err.message)
    // res.status(401).json({ error: err.message })
  }
})


router.post('/register', async (req, res) => {
  console.log('(req.body):' + fixHebrewText(' נתוני הבקשה '), req.body);
  try {
    const { user, token } = await userService.register(req.body)
    console.log(fixHebrewText('✅ משתמש חדש נוצר בהצלחה:'), user)
    console.log(fixHebrewText('✅ טוקן נוצר בהצלחה:'), token)
    res.status(201).json({ user, token }) // 201 - הצלחה ביצירת משאב חדש
  } catch (err) {
    console.error('❌ Error in register route:', err.message)

    // שליחת הודעת שגיאה למשתמש עם סטטוס קוד מתאים
    if (err.message.includes('User already exists')) {
      return res.status(409).json({ error: err.message }) // 409 - Conflict
    }
    if (err.message.includes('Missing user fields')) {
      return res.status(400).json({ error: err.message }) // 400 - Bad Request
    }

    res.status(500).json({ error: '❌ Internal server error' })
  }
});


router.post('/userid', async (req, res) => {
  console.log('(req.body):' + fixHebrewText(' נתוני הבקשה '), req.body)
  try {
    const userid = await userService.getIdByEmail(req.body.email)
    console.log(fixHebrewText('מזהה המשתמש שהוחזר:'), userid)
    res.send(userid)
  } catch (err) {
    res.status(500).send({ error: err.message })
  }
})

router.get('/', async (req, res) => {
  console.log(fixHebrewText('אובייקט הבקשה (req):'), req)
  try {
    const users = await userService.getAllUsers()
    console.log(fixHebrewText('מספר המשתמשים שהוחזרו:'), users.length)
    res.send(users)
  } catch (err) {
    res.status(500).send({ message: 'somthing went wrong' })
  }
})

router.post('/giftsById', async (req, res) => {
  console.log('(req.body):' + fixHebrewText(' נתוני הבקשה '), req.body)
  try {
    const arrGifts = await userService.getGiftsById(req.body)
    console.log('arrgifts in user Routes:', arrGifts)
    res.send(arrGifts)
  } catch (err) {
    res.status(500).send({ error: err.message })
  }
})

//get isManager by userId
router.post('/isManager', async (req, res) => {
  console.log('(req.body):' + fixHebrewText(' נתוני הבקשה '), req.body)
  try {
    const isManager = await userService.getisManager(req.body)
    console.log('isManager in user Routes:', isManager)
    res.send(isManager)
  } catch (err) {
    res.status(500).send({ error: err.message })
  }
})

router.put('/:userId', async (req, res) => {
  console.log('(req.body):' + fixHebrewText(' נתוני הבקשה '), req.body)
  try {
    const updatedUser = await userService.updateUser({ _id: req.params.userId }, req.body)
    console.log('updatedUser in user Routes:', updatedUser)
    res.send(updatedUser)
  } catch (err) {
    res.status(500).send({ error: err.message })
  }
})

router.delete('/:userId', async (req, res) => {
  console.log('(req.params):' + fixHebrewText('למחיקה נתוני הבקשה '), req.params)
  try {
    const deletedUser = await userService.deleteUser(req.params.userId)
    console.log('deletedUser in user Routes:', deletedUser)
    res.send(deletedUser)
  } catch (err) {
    res.status(500).send({ error: err.message })
  }
})

// ראוט בדיקה
router.get('/test', (req, res) => {
  res.json({ message: 'Users routes are working!' })
})

module.exports = router
