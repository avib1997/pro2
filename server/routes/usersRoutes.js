//server/routes/usersRoutes.js
const express = require('express')
const router = express.Router()
const userService = require('../services/userService')

router.post('/login', async (req, res) => {
  console.log('נתוני הבקשה (req.body):', req.body)
  try {
    const token = await userService.login(req.body)
    console.log('טוקן נוצר בהצלחה:', token)
    res.send({ token: token })
  } catch (err) {
    console.log('[ERROR] בשירות login:', err.message)
    res.send(err.message)
  }
})

router.post('/register', async (req, res) => {
  console.log('נתוני הבקשה (req.body):', req.body)
  try {
    const newUser = await userService.register(req.body)
    console.log('משתמש חדש נוצר בהצלחה:', newUser)
    res.send(newUser)
  } catch (err) {
    res.status(500).send({ error: err.message })
  }
})

router.post('/userid', async (req, res) => {
  console.log('נתוני הבקשה (req.body):', req.body)
  try {
    const userid = await userService.getIdByEmail(req.body.email)
    console.log('מזהה המשתמש שהוחזר:', userid)
    res.send(userid)
  } catch (err) {
    res.status(500).send({ error: err.message })
  }
})

router.get('/', async (req, res) => {
  console.log('אובייקט הבקשה (req):', req)
  try {
    const users = await userService.getAllUsers()
    console.log('מספר המשתמשים שהוחזרו:', users.length)
    res.send(users)
  } catch (err) {
    res.status(500).send({ message: 'somthing went wrong' })
  }
})

router.post('/giftsById', async (req, res) => {
  console.log('נתוני הבקשה (req.body):', req.body)
  try {
    const arrGifts = await userService.getGiftsById(req.body)
    console.log('arrgifts in user Routes:', arrGifts)
    res.send(arrGifts)
  } catch (err) {
    res.status(500).send({ error: err.message })
  }
})

module.exports = router
