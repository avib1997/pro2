import { Context } from '../App'
import React, {
  useState,
  useContext,
  useEffect
} from 'react'
import { useLocation } from 'react-router-dom'
import {
  PayPalScriptProvider,
  PayPalButtons
} from '@paypal/react-paypal-js'
import {
  Box,
  Container,
  Typography,
  Button
} from '@mui/material'
import Confetti from 'react-confetti'
import { useWindowSize } from 'react-use'
import { motion } from 'framer-motion'

const PayPalPayment = () => {
  const [amount, setAmount] = useState(0)
  const [showPayPal, setShowPayPal] =
    useState(false)
  const [paymentSuccess, setPaymentSuccess] =
    useState(false)
  const { width, height } = useWindowSize()

  // ספירה לאחור לאירוע (דוגמה):
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  })

  const { userId, enent } = useContext(Context)
  const location = useLocation()

  useEffect(() => {
    if (location.state?.amount) {
      setAmount(location.state.amount)
    }
  }, [location.state])

  // פונקציית ספירה לאחור
  useEffect(() => {
    // (דוגמה) תאריך היעד לאירוע
    const targetDate = new Date(
      '2025-12-31T00:00:00'
    )

    const interval = setInterval(() => {
      const now = new Date()
      const difference = targetDate - now

      // אם כבר עברו את התאריך - אפשר לעצור
      if (difference <= 0) {
        clearInterval(interval)
        return
      }

      const days = Math.floor(
        difference / (1000 * 60 * 60 * 24)
      )
      const hours = Math.floor(
        (difference / (1000 * 60 * 60)) % 24
      )
      const minutes = Math.floor(
        (difference / (1000 * 60)) % 60
      )
      const seconds = Math.floor(
        (difference / 1000) % 60
      )

      setTimeLeft({
        days,
        hours,
        minutes,
        seconds
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  // טיפול בתשלום מוצלח
  const handlePaymentSuccess = async details => {
    setPaymentSuccess(true)
    // כאן אפשר לשלוח בקשה לשרת ולעדכן DB וכו'
  }

  // טיפול בשגיאת תשלום
  const handlePaymentError = error => {
    console.error('❌ תשלום נכשל:', error)
    alert('❌ התשלום נכשל, אנא נסה שוב.')
  }

  return (
    <Box
      sx={{
        position: 'relative',
        minHeight: '200vh',
        direction: 'rtl',
        overflow: 'hidden' // כדי שלא יהיו גלילות מיותרות
      }}
    >
      {/* רקע אנימציה זזה */}
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          right: 0,
          width: '100%',
          height: '100%',
          zIndex: -1,
          background:
            'linear-gradient(135deg, #0D1B2A, #1B263B)',
          backgroundSize: '400% 400%',
          animation: 'animateBg 15s ease infinite'
        }}
      />

      {/* --- Hero Section עם רקע --- */}
      <Box
        sx={{
          position: 'relative',
          minHeight: '40vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundImage: `url('https://images.unsplash.com/photo-1578357078542-5ea13f5df4df')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        {/* שכבת אוברליי כדי להכהות את התמונה */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '90%',
            backgroundColor: 'rgba(0,0,0,0.4)',
            zIndex: 1
          }}
        />

        {/* טקסט ב-Hero */}
        <Box
          sx={{
            position: 'relative',
            zIndex: 2,
            textAlign: 'center',
            color: '#fff',
            p: 2
          }}
          component={motion.div}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <Typography
            variant="h6"
            sx={{
              fontWeight: 'bold',
              textShadow: '2px 2px #000',
              mb: 2
            }}
          >
            ברוכים הבאים לאירוע המרגש שלנו!
          </Typography>
          {/* ספירה לאחור */}
          <Typography
            variant="h5"
            sx={{ textShadow: '1px 1px #000' }}
          >
            האירוע יתחיל בעוד: {timeLeft.days}{' '}
            ימים, {timeLeft.hours} שעות,{' '}
            {timeLeft.minutes} דקות ו-
            {timeLeft.seconds} שניות
          </Typography>
        </Box>
      </Box>

      {/* הקונפטי יוצג רק כאשר התשלום מצליח */}
      {paymentSuccess && (
        <Confetti
          width={width}
          height={height}
          recycle={false} // יגרום לקונפטי לרדת פעם אחת ולא להתחדש
          numberOfPieces={400} // אפשר לשנות לגודל הרצוי
        />
      )}

      {/* תיבת תשלום */}
      <Container
        maxWidth="md"
        sx={{
          height: '400px',
          textAlign: 'center',
          alignItems: 'center',
          alignContent: 'center',
          mt: 0,
          py: 5,
          px: 2,
          borderRadius: '20px',
          background:
            'linear-gradient(135deg, #1B263B, #415A77)',
          boxShadow:
            '0px 8px 15px rgba(0, 0, 0, 0.1)',
          transition:
            'transform 0.3s ease, box-shadow 0.3s ease',
          '&:hover': {
            transform: 'translateY(-5px)',
            boxShadow:
              '0px 15px 20px rgba(0, 0, 0, 0.2)'
          },
          mt: 2
        }}
      >
        <Typography
          variant="h4"
          gutterBottom
          sx={{
            fontWeight: 'bold',
            color: '#E0E1DD',
            mb: 2,
            textShadow: '2px 2px #000'
          }}
        >
          תשלום באמצעות PayPal
        </Typography>
        <Typography
          variant="h6"
          sx={{
            color: '#E0E1DD',
            mb: 13,
            mt: 7,
            fontWeight: 'bold',
            fontSize: '1.5rem'
          }}
        >
          סכום לתשלום: {amount} ₪
        </Typography>
        {/* כפתור להצגת PayPal */}
        <Button
          variant="contained"
          fullWidth
          sx={{
            backgroundColor: '#F0A500',
            ':hover': {
              backgroundColor: '#FFD700'
            },
            color: '#1B263B',
            fontWeight: 'bold',
            boxShadow:
              '0px 5px 15px rgba(240, 165, 0, 0.4)',
            transition: '0.3s',
            borderRadius: 3,
            fontSize: '1.1rem'
          }}
          onClick={() => setShowPayPal(true)}
        >
          המשך לתשלום
        </Button>
        {/* אזור PayPal מוסתר עד שלוחצים על הכפתור */}
        {showPayPal && (
          
          <Box
            mt={5}
            sx={{
              width: '100%',
              maxWidth: '800px',
              display: 'flex',
              flexDirection: 'column',
              // שמירה על התוכן במרכז גם בתוך הקופסה הזאת
              justifyContent: 'center',
              alignItems: 'center',
              background:
                'linear-gradient(135deg, #2F3E4E, #4D5F6F)',
              p: 3,
              borderRadius: '20px',
              boxShadow:
                '0px 8px 15px rgba(0, 0, 0, 0.2)',
              transition:
                'transform 0.3s ease, box-shadow 0.3s ease',
              ':hover': {
                transform: 'translateY(-5px)',
                boxShadow:
                  '0px 15px 20px rgba(0, 0, 0, 0.3)'
              }
            }}
          >
            <PayPalScriptProvider
              options={{
                'client-id':
                  'YOUR_PAYPAL_CLIENT_ID'
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}
              >
                <PayPalButtons
                  style={{
                    //layout: 'vertical', // או 'vertical'
                    //color: 'gold', // אפשר 'gold' | 'blue' | 'silver' | 'white'...
                    shape: 'pill', // 'pill' או 'rect'
                    label: 'checkout', // 'checkout' | 'paypal' | 'pay'...
                    tagline: false // הסתרת/הצגת שורת טקסט מתחת לכפתור
                    //height: 50 // הגדרת גובה הכפתור
                  }}
                  createOrder={(
                    data,
                    actions
                  ) => {
                    return actions.order.create({
                      purchase_units: [
                        {
                          amount: {
                            value: amount
                          },
                          payee: {
                            email_address:
                              'receiver@example.com'
                          }
                        }
                      ]
                    })
                  }}
                  onApprove={(data, actions) => {
                    return actions.order
                      .capture()
                      .then(handlePaymentSuccess)
                  }}
                  onError={handlePaymentError}
                />
              </Box>
            </PayPalScriptProvider>
          </Box>
        )}
      </Container>

      {/* אנימציית הרקע */}
      <style>
        {`
          @keyframes animateBg {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
        `}
      </style>
    </Box>
  )
}

export default PayPalPayment
