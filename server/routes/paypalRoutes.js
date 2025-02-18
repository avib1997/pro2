const express = require("express");
const paypal = require("../paypalConfig"); // מייבא את ההגדרות של PayPal
const router = express.Router();

// יצירת תשלום ב-PayPal
router.post("/create-paypal-payment", (req, res) => {
    const { amount, email } = req.body; // מקבלים סכום ואימייל של בעל האירוע
    console.log('amount', amount)
    const paymentData = {

        intent: "sale",
        payer: { payment_method: "paypal" },
        redirect_urls: {
            return_url: "http://localhost:3000/payment-success", // דף הצלחה
            cancel_url: "http://localhost:3000/payment-cancel", // דף ביטול
        },
        transactions: [
            {
                amount: { total: amount, currency: "USD" },
                payee: { email }, // האימייל של בעל האירוע שמקבל את הכסף
                description: "Payment for event gift",
            },
        ],
    };

    paypal.payment.create(paymentData, (error, payment) => {
        if (error) {
            console.error("PayPal error:", error);
            res.status(500).json({ error: error.message });
        } else {
            // מוצא את הקישור שבו המשתמש צריך לאשר את התשלום
            const approvalUrl = payment.links.find((link) => link.rel === "approval_url");
            res.json({ approvalUrl: approvalUrl.href });
        }
    });
});

module.exports = router;
