//server/routes/index.js
const express = require('express')
const router = express.Router()

const giftRouter = require('./giftRoutes') // ראוטר לניהול מתנות
const usersRouter = require('./usersRoutes') // ראוטר לניהול משתמשים
const eventRouter = require('./eventRoutes') // ראוטר לניהול אירועים (שימו לב לטעות כתיב בשם הקובץ)

router.use('/gift', giftRouter)
router.use('/users', usersRouter)
router.use('/events', eventRouter)

module.exports = router
