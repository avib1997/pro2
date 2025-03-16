const express = require('express');
const router = express.Router();
const User = require('../../models/userModel'); // ודא שהנתיב נכון
const bcrypt = require('bcrypt');

// איפוס סיסמה עם טוקן
router.post('/reset-password/:token', async (req, res) => {
    consol.log("11111",req.body);
    try {
        const { token } = req.params;
        const { password, confirmPassword } = req.body;

        if (password !== confirmPassword) {
            return res.status(400).json({ message: "הסיסמאות אינן תואמות" });
        }

        const user = await User.findOne({ resetToken: token, resetTokenExpiry: { $gt: Date.now() } });

        if (!user) {
            return res.status(400).json({ message: "טוקן לא תקין או פג תוקף" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        user.password = password;
        user.resetToken = null;
        user.resetTokenExpiry = null;
        await user.save();

        res.json({ message: "הסיסמה אופסה בהצלחה" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "שגיאת שרת" });
    }
});

router.post('/reset-password', async (req, res) => {
    consol.log("22222",req.body);
    const { email, oldPassword, newPassword } = req.body;
    try {
        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            return res.status(400).json({ message: "משתמש לא נמצא" });
        }
        //compare old password
        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "סיסמה ישנה שגויה" });
        }
        //hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword; 
        await user.save();
        res.json({ message: "הסיסמה שונתה בהצלחה" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "שגיאת שרת" });
    }
});

module.exports = router;
