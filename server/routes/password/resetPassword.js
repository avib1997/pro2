const express = require('express');
const router = express.Router();
const User = require('../../models/userModel'); // ודא שהנתיב נכון
const bcrypt = require('bcrypt');

// איפוס סיסמה עם טוקן
router.post('/reset-password/:token', async (req, res) => {
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

        // const hashedPassword = await bcrypt.hash(password, 10);
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

module.exports = router;
