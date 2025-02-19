//server/routes/contactRoutes.js
const express = require('express')
const router = express.Router()
const nodemailer = require('nodemailer')

// הגדרת הטרנספורטר עבור שליחת המייל
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'avib660@gmail.com', // כתובת המייל שלך
    pass: 'סיסמת_האפליקציה_שלך' // סיסמת האפליקציה של ג'ימייל (לא סיסמת החשבון)
  }
})

// נתיב API לשליחת מייל
router.post('/send-email', async (req, res) => {
  const { name, email, phone, message } = req.body

  const mailOptions = {
    from: email,
    to: 'avib660@gmail.com',
    subject: 'פנייה חדשה מהאתר',
    text: `נשלחה הודעה מהאתר\n\nשם השולח: ${name}\nאימייל: ${email}\nטלפון: ${phone}\n\nתוכן ההודעה:\n${message}`
  }

  try {
    await transporter.sendMail(mailOptions)
    res.status(200).json({ message: 'המייל נשלח בהצלחה!' })
  } catch (error) {
    console.error('Error sending email:', error)
    res.status(500).json({ message: 'שגיאה בשליחת המייל' })
  }
})

module.exports = router
