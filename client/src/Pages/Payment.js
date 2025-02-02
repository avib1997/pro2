import { useNavigate } from 'react-router-dom'
import { Context } from '../App'
import React, { useState, useContext, useEffect } from "react";
import { useLocation } from "react-router-dom"; // 
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { Container, TextField, Button, Box, Typography } from "@mui/material";

const PayPalPayment = () => {
  const [amount, setAmount] = useState(0);
  const [showPayPal, setShowPayPal] = useState(false);
  const { userId, enent } = useContext(Context);
  const location = useLocation();

  useEffect(() => {
    if (location.state?.amount) {
      setAmount(location.state.amount);
    }
  }, [location.state]);


 // פה מעדכנים את המתנה בדאטה בייס עם הפרטים של התשלום

   const handlePaymentSuccess = async (details) => {
  //   console.log("✅ תשלום הצליח!", details);
  //   alert("✅ העסקה הושלמה בהצלחה על ידי " + details.payer.name.given_name);

  //   // **שליחת הנתונים לשרת כדי לעדכן את מסד הנתונים**
  //   try {
  //     await axios.post("http://localhost:2001/api/payments/success", {
  //       transactionId: details.id,
  //       amount: details.purchase_units[0].amount.value,
  //       payerEmail: details.payer.email_address,
  //     });
  //     console.log("📌 הנתונים נשמרו במסד הנתונים.");
  //   } catch (error) {
  //     console.error("❌ שגיאה בעדכון מסד הנתונים:", error);
  //   }
   };

  const handlePaymentError = (error) => {
    console.error("❌ תשלום נכשל:", error);
    alert("❌ התשלום נכשל, אנא נסה שוב.");
  };

  return (
    <Container maxWidth="sm" sx={{ textAlign: "center", mt: 20 }}> {/* הגדל את ה-margin-top */}
      <Typography variant="h4" gutterBottom>תשלום באמצעות PayPal</Typography>
      <Typography variant="h6">סכום לתשלום: {amount} ₪</Typography>
      <Button
        variant="contained"
        color="primary"
        fullWidth
        onClick={() => setShowPayPal(true)}
      >
        המשך לתשלום
      </Button>
      {showPayPal && (
        <Box mt={5}> {/* הגדל את ה-margin-top של PayPal */}
          <PayPalScriptProvider options={{ "client-id": "YOUR_PAYPAL_CLIENT_ID" }}>
            <PayPalButtons
              createOrder={(data, actions) => {
                return actions.order.create({
                  purchase_units: [{
                    amount: { value: amount },
                    payee: { email_address: "receiver@example.com" } // כתובת האימייל של חשבון ה-PayPal שמקבל את הכסף
                  }]
                });
              }}
              onApprove={(data, actions) => {
                return actions.order.capture().then(handlePaymentSuccess);
              }}
              onError={handlePaymentError} // 📌 הוספת טיפול במקרה של שגיאה
            />
          </PayPalScriptProvider>
        </Box>
      )}
    </Container>
  );
};

export default PayPalPayment;
