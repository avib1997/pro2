//server/routes/giftRoutes.js
const express = require('express')
const router = express.Router()
const giftService = require('../services/giftService')

router.post('/addGift', async (req, res) => {
  console.log('📩 נתונים שהתקבלו:', req.body) // ✅ הדפסת הנתונים שהתקבלו
  try {
    if (req.body.userid_gift) {
      const newGift = await giftService.addgift(req.body)
      console.log('✅ מתנה נשמרה:', newGift) // ✅ הדפסת המתנה שנשמרה
      return res.status(200).send({ message: '✅ מתנה נוספה בהצלחה', gift: newGift })
    } else {
      const newGift = await giftService.addgiftG(req.body)
      console.log('✅ מתנה כללית נשמרה:', newGift) // ✅ הדפסת המתנה שנשמרה
      return res.status(200).send({ message: '✅ מתנה כללית נוספה בהצלחה', gift: newGift })
    }
  } catch (error) {
    console.error('❌ שגיאה בהוספת המתנה:', error) // ✅ הדפסת השגיאה
    return res.status(500).send({ error: `❌ שגיאה בהוספת המתנה: ${error.message}` })
  }
})

router.post('/getgift', async (req, res) => {
  try {
    const gifts = await giftService.getgift(req.body)
    return res.status(200).send(gifts)
  } catch (error) {
    return res.status(500).send({ error: 'שגיאה בעת בקשת המתנות' })
  }
})

module.exports = router
