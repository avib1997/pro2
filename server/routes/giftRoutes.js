//server/routes/giftRoutes.js
const express = require('express')
const router = express.Router()
const giftService = require('../services/giftService')
const { fixHebrewText } = require('../fixHebrew.js')

//router.post('/addGift', authJWT, async (req, res) => {
router.post('/addGift', async (req, res) => {
  console.log(fixHebrewText('📩 נתונים שהתקבלו:'), req.body) // ✅ הדפסת הנתונים שהתקבלו
  try {
    if (req.body.userid_gift) {
      const newGift = await giftService.addgift(req.body)
      console.log(fixHebrewText('✅ מתנה נשמרה:'), newGift) // ✅ הדפסת המתנה שנשמרה
      return res.status(200).send({ message: fixHebrewText('✅ מתנה נוספה בהצלחה'), gift: newGift })
    } else {
      const newGift = await giftService.addgiftG(req.body)
      console.log(fixHebrewText('✅ מתנה כללית נשמרה:'), newGift) // ✅ הדפסת המתנה שנשמרה
      return res.status(200).send({ message: fixHebrewText('✅ מתנה כללית נוספה בהצלחה'), gift: newGift })
    }
  } catch (error) {
    console.error(fixHebrewText('❌ שגיאה בהוספת המתנה:'), error) // ✅ הדפסת השגיאה
    return res.status(500).send({ error: fixHebrewText(`❌ שגיאה בהוספת המתנה:`) + `${error.message}` })
  }
})

router.post('/getgift', async (req, res) => {
  try {
    const gifts = await giftService.getgift(req.body)
    return res.status(200).send(gifts)
  } catch (error) {
    return res.status(500).send({ error: fixHebrewText('שגיאה בעת בקשת המתנות') })
  }
})

// ראוט בדיקה
router.get('/test', (req, res) => {
  res.json({ message: 'Gift routes are working!' })
})

router.get('/getAllGifts', async (req, res) => {
  try {
    const gifts = await giftService.getAllGifts(req.body)
    return res.status(200).send(gifts)
  } catch (error) {
    return res.status(500).send({ error: fixHebrewText('שגיאה בעת בקשת המתנות') })
  }
})

// routes/giftRoutes.js
router.get('/getGiftFile/:giftId/:fileType', async (req, res) => {
  try {
    const { giftId, fileType } = req.params // fileType יכול להיות imageFile/videoFile/audioFile
    const gift = await giftController.readById(giftId)
    if (!gift) return res.status(404).send('Gift not found')

    const fileBuffer = gift[fileType] // נניח gift.imageFile
    if (!fileBuffer) return res.status(404).send('No file found for this gift')

    // אם זה תמונה, אפשר לשלוח עם content-type בהתאם
    // כאן דוגמה בלי זיהוי מלא, בהנחה תמונה png:
    res.set('Content-Type', 'image/png')
    res.send(fileBuffer)
  } catch (err) {
    res.status(500).send('Error retrieving file')
  }
})

module.exports = router
