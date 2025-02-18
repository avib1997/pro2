const express = require('express');
const router = express.Router();
const User = require('../../models/userModel'); // מודל המשתמשים
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
require('dotenv').config();

// שליחת מייל עם קישור לאיפוס סיסמה
router.post('/forgot-password', async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: 'משתמש לא נמצא' });

        // יצירת טוקן חד-פעמי (בתוקף של שעה)
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // יצירת קישור לאיפוס הסיסמה
        const resetLink = `http://localhost:3000/reset-password/${token}`;

        // הגדרת nodemailer לשליחת מייל
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        // שליחת המייל
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'איפוס סיסמה',
            text: `לחץ על הקישור כדי לאפס את הסיסמה: ${resetLink}`
        };

        await transporter.sendMail(mailOptions);

        res.json({ message: 'מייל איפוס נשלח בהצלחה' });
    } catch (error) {
        res.status(500).json({ message: 'שגיאה בשליחת המייל', error });
    }
});

module.exports = router;
