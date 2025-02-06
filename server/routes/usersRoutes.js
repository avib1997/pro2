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
  console.log('(req.body):' + fixHebrewText(' נתוני הבקשה '), req.body)
  try {
    const newUser = await userService.register(req.body)
    console.log(fixHebrewText('משתמש חדש נוצר בהצלחה:'), newUser)
    res.send(newUser)
  } catch (err) {
    res.status(500).send({ error: err.message })
  }
})

// Get user id by email
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

// Update the isManeger field by userId
router.put('/update-manager', async (req, res) => {
  try {
    const updatedUser = await userService.updateManagerStatus(req.body.userId, req.body.isManeger)
    console.log('✅ Manager status updated:', updatedUser)
    res.json(updatedUser)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

//router.get('/', authJWT, async (req, res) => {
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

//get isManeger by userId
router.post('/isManeger', async (req, res) => {
  console.log('(req.body):' + fixHebrewText(' נתוני הבקשה '), req.body)
  try {
    const isManeger = await userService.getIsManeger(req.body)
    console.log('isManeger in user Routes:', isManeger)
    res.send(isManeger)
  } catch (err) {
    res.status(500).send({ error: err.message })
  }
})

// ראוט בדיקה
router.get('/test', (req, res) => {
  res.json({ message: 'Users routes are working!' })
})

module.exports = router
