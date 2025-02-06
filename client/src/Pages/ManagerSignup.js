//client/src/Pages/ManagerSignup.js
import { Box, Button, Container, Grid, TextField, Typography, InputAdornment, Link as MuiLink } from '@mui/material'
import React, { useContext, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Context } from '../App' // ייבוא הקונטקסט עבור ID של האירוע
import axios from 'axios' // ייבוא האקסיוס לפני שימוש בו

// אייקונים מותאמים לכל שדה
import { Person as PersonIcon, Email as EmailIcon, Phone as PhoneIcon, Info as InfoIcon } from '@mui/icons-material'

const ManagerSignup = () => {
  const { setEventNumber, eventId } = useContext(Context) // נקרא את ערך ה-eventId
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [additionalInfo, setAdditionalInfo] = useState('')

  const [submitError, setSubmitError] = useState('')
  const [errors, setErrors] = useState({})
  const [isValid, setIsValid] = useState({})
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false)
  const navigate = useNavigate()
  const [emailUser, setEmailUser] = useState('')

  // בדיקה לדוגמה
  const validateField = (field, value) => {
    const newErrors = { ...errors }
    const newValidState = { ...isValid }

    switch (field) {
      case 'name':
        if (!value) {
          newErrors.name = 'יש להזין שם מלא'
          newValidState.name = false
        } else {
          newErrors.name = 'תקין'
          newValidState.name = true
        }
        break
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!value) {
          newErrors.email = 'יש להזין כתובת אימייל'
          newValidState.email = false
        } else if (!emailRegex.test(value)) {
          newErrors.email = 'כתובת אימייל לא תקינה'
          newValidState.email = false
        } else {
          newErrors.email = 'תקין'
          newValidState.email = true
          setEmailUser(value)
        }
        break
      case 'phone':
        const phoneRegex = /^[0-9]{10}$/
        if (!value) {
          newErrors.phone = 'יש להזין מספר טלפון'
          newValidState.phone = false
        } else if (!phoneRegex.test(value)) {
          newErrors.phone = 'מספר טלפון חייב לכלול 10 ספרות'
          newValidState.phone = false
        } else {
          newErrors.phone = 'תקין'
          newValidState.phone = true
        }
        break
      case 'additionalInfo':
        if (!value) {
          newErrors.additionalInfo = 'יש להזין מידע נוסף'
          newValidState.additionalInfo = false
        } else {
          newErrors.additionalInfo = 'תקין'
          newValidState.additionalInfo = true
        }
        break
      default:
        break
    }
    setErrors(newErrors)
    setIsValid(newValidState)
  }

  const handleInputChange = (field, value) => {
    validateField(field, value)
  }

  const ifExistEmail = async () => {
    try {
      const response = await axios.post('http://localhost:2001/api/users/userid', { email: emailUser })
      console.log('response.data in ManegerSignup ifExistEmail:', response.data.userid[0]._id)
      if (response.data.userid[0]._id) {
        return response.data.userid[0]._id
      } else {
        return null
      }
    } catch (error) {
      console.log('error in ManegerSignup ifExistEmail:', error)
    }
  }

  const setAsManeger = async userId => {
    if (!userId) {
      console.log('userId is not exist')
      return
    } else {
      try {
        console.log('userId in setAsManeger:', userId)
        const response = await axios.put('http://localhost:2001/api/users/update-manager', {
          userId,
          isManeger: true // זה הערך החדש
        })
        console.log('✅ סטטוס מנהל עודכן:', response.data)
      } catch (error) {
        console.error('❌ עדכון סטטוס מנהל נכשל:', error)
      }
    }
  }

  const handleSignup = async () => {
    setEventNumber('')
    // אם הכל תקין
    const allValid = Object.values(isValid).every(v => v === true)

    if (allValid) {
      setSubmitError('')
      try {
        const userId = await ifExistEmail() // ✅ Ensure we wait for the function to return

        if (userId) {
          setAsManeger(userId)
        } else {
          console.log('❌ Email does not exist')
          // TODO: Add a user notification here
        }
      } catch (error) {
        console.error('❌ Error in ifExistEmail():', error)
      }
    } else {
      setSubmitError('יש למלא את כל השדות החובה')
    }

    setShowSuccessAnimation(true)
    setTimeout(() => {
      navigate('/LoginPage')
    }, 1000)
  }

  // פונקציית עיצוב בסיסית לשדות
  const createTextFieldSx = bgColor => ({
    width: '600px',
    maxWidth: '800px',
    backgroundColor: bgColor,
    borderRadius: '20px',
    '& .MuiOutlinedInput-root': {
      fontWeight: 600,
      borderRadius: '20px',
      '& fieldset': { border: 'none' },
      '&:hover fieldset': { border: 'none' },
      '&.Mui-focused fieldset': { border: 'none' },
      '& .MuiOutlinedInput-input': { paddingRight: '0px' }
    },
    '& .MuiInputLabel-root': {
      fontWeight: 600,
      right: 20,
      left: 'auto'
    },
    '& .MuiInputLabel-root.Mui-focused, & .MuiInputLabel-shrink': {
      transformOrigin: 'top right',
      transform: 'translate(0, .5px) scale(0.75)'
    }
  })

  return (
    <Box
      sx={{
        width: '100%',
        overscrollBehavior: 'none',
        position: 'relative',
        minHeight: '100vh',
        direction: 'rtl',
        paddingTop: '20px',
        paddingBottom: '10px',
        fontFamily: 'Roboto, sans-serif',
        overflowX: 'hidden',
        color: '#E0E1DD'
      }}
    >
      {/* רקע עם אנימציה זזה */}
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          right: 0,
          width: '100%',
          height: '100%',
          zIndex: -1,
          background: 'linear-gradient(135deg, #0D1B2A, #1B263B)',
          backgroundSize: '400% 400%',
          animation: 'animateBg 15s ease infinite'
        }}
      />

      {/* כפתור חזרה לדף הבית */}
      <Button
        component={Link}
        to="/Home"
        sx={{
          position: 'absolute',
          top: '15px',
          left: '50%',
          transform: 'translateX(-50%)',
          backgroundColor: '#1E90FF',
          color: '#fff',
          padding: '10px 20px',
          borderRadius: '30px',
          fontSize: '1.2rem',
          fontWeight: 'bold',
          '&:hover': {
            backgroundColor: '#187bcd',
            boxShadow: '0px 8px 15px rgba(0, 0, 0, 0.3)'
          },
          zIndex: 2
        }}
      >
        חזרה לדף הבית
      </Button>

      <Container
        maxWidth="xl"
        sx={{
          mt: 10,
          mb: 0,
          backgroundColor: 'rgba(255,255,255,0.07)',
          padding: '30px',
          paddingTop: '0px',
          borderRadius: '20px',
          boxShadow: '0px 5px 15px rgba(0, 0, 0, 0.3)',
          position: 'relative',
          overflow: 'hidden',
          // כיוון RTL לקונטיינר כולו:
          direction: 'rtl'
        }}
      >
        <Grid container spacing={4} justifyContent="center">
          {/* טור שמאלי: טקסט שיווקי בלי תמונה */}
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                justifyContent: 'center'
              }}
            >
              <Box
                mt={4} // רווח מעל
                sx={{
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  borderRadius: '10px',
                  padding: 3
                }}
              >
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 'bold',
                    color: '#F0F0F0',
                    mb: 2
                  }}
                >
                  למה להירשם כמנהל אירוע?
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    width: '100%',
                    color: '#E0E1DD',
                    fontSize: '1rem',
                    lineHeight: 1.8,
                    textShadow: '1px 1px #000'
                  }}
                >
                  הצטרפו למעגל מנהלי האירועים של Easy Gift ותהנו מכלים חכמים שחוסכים לכם זמן ומשאבים יקרים. במקום לבזבז שעות בחיפוש ספקים, תיאומי טלפונים ולו״ז מסורבל – Easy Gift מרכזת עבורכם את כל
                  הפתרונות במקום אחד. כך תוכלו להקדיש יותר אנרגיה לתכנון חוויות בלתי־נשכחות ופחות לטיפול בבירוקרטיה מתישה.
                  <br />
                  <br />
                  כשאתם נרשמים כמנהלי אירועים, אתם מקבלים גישה למערכת מתקדמת המאפשרת ניהול מוזמנים, תשלומים והזמנות בצורה פשוטה ויעילה, מכל מכשיר ובכל זמן. הפלטפורמה של Easy Gift מותאמת אישית
                  לצורכיכם, עם דוחות עדכניים שמציגים לכם בדיוק כמה הושקע, איפה ניתן לחסוך, ואיך למקסם את התקציב. אתם מוזמנים להצטרף אל מאות משתמשים שכבר גילו את הדרך הקלה לנהל אירועים מוצלחים – ורשמו
                  את עצמכם כמנהלי אירוע עוד היום!
                </Typography>
              </Box>
            </Box>
          </Grid>

          {/* טור ימני - טופס */}
          <Grid item xs={12} md={6}>
            <Box sx={{ textAlign: 'center', paddingTop: '20px' }}>
              <Typography
                variant="h3"
                gutterBottom
                sx={{
                  marginBottom: '30px',
                  fontWeight: 'bold',
                  color: '#1976D2',
                  textShadow: '2px 2px #000'
                }}
              >
                רישום מנהל אירוע
              </Typography>
            </Box>

            <Box display="flex" flexDirection="column" alignItems="center" gap={2} sx={{ width: '100%', maxWidth: '1000px', mx: 'auto' }}>
              {/* שם מלא */}
              <Grid item xs={12}>
                <TextField
                  label="שם מלא"
                  value={name}
                  onChange={e => {
                    setName(e.target.value)
                    handleInputChange('name', e.target.value)
                  }}
                  error={errors.name && errors.name !== 'תקין'}
                  helperText={
                    <Typography variant="caption" color={errors.name === 'תקין' ? 'green' : 'error'}>
                      {errors.name}
                    </Typography>
                  }
                  sx={createTextFieldSx('#e1f5fe')}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <PersonIcon sx={{ color: '#1976D2' }} />
                      </InputAdornment>
                    )
                  }}
                  fullWidth
                />
              </Grid>

              {/* אימייל */}
              <Grid item xs={12}>
                <TextField
                  label="אימייל"
                  value={email}
                  onChange={e => {
                    setEmail(e.target.value)
                    handleInputChange('email', e.target.value)
                  }}
                  error={errors.email && errors.email !== 'תקין'}
                  helperText={
                    <Typography variant="caption" color={errors.email === 'תקין' ? 'green' : 'error'}>
                      {errors.email}
                    </Typography>
                  }
                  sx={createTextFieldSx('#e8f5e9')}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <EmailIcon sx={{ color: '#388E3C' }} />
                      </InputAdornment>
                    )
                  }}
                  fullWidth
                />
              </Grid>

              {/* מספר טלפון */}
              <Grid item xs={12}>
                <TextField
                  label="מספר טלפון"
                  value={phone}
                  onChange={e => {
                    setPhone(e.target.value)
                    handleInputChange('phone', e.target.value)
                  }}
                  error={errors.phone && errors.phone !== 'תקין'}
                  helperText={
                    <Typography variant="caption" color={errors.phone === 'תקין' ? 'green' : 'error'}>
                      {errors.phone}
                    </Typography>
                  }
                  sx={createTextFieldSx('#fff3e0')}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <PhoneIcon sx={{ color: '#FB8C00' }} />
                      </InputAdornment>
                    )
                  }}
                  fullWidth
                />
              </Grid>

              {/* מידע נוסף */}
              <Grid item xs={12}>
                <TextField
                  label="מידע נוסף"
                  value={additionalInfo}
                  onChange={e => {
                    setAdditionalInfo(e.target.value)
                    handleInputChange('additionalInfo', e.target.value)
                  }}
                  error={errors.additionalInfo && errors.additionalInfo !== 'תקין'}
                  helperText={
                    <Typography variant="caption" color={errors.additionalInfo === 'תקין' ? 'green' : 'error'}>
                      {errors.additionalInfo}
                    </Typography>
                  }
                  sx={createTextFieldSx('#f3e5f5')}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <InfoIcon sx={{ color: '#7B1FA2' }} />
                      </InputAdornment>
                    )
                  }}
                  fullWidth
                />
              </Grid>

              {/* כפתור רישום */}
              <Grid item xs={12}>
                <Button
                  variant="contained"
                  type="submit"
                  onClick={handleSignup}
                  sx={{
                    width: '100%',
                    paddingLeft: '80px',
                    paddingRight: '80px',
                    marginTop: '0px',
                    borderRadius: '30px',
                    backgroundColor: '#1976D2',
                    color: '#fff',
                    fontWeight: 'bold',
                    fontSize: '1.5rem',
                    py: 0,
                    '&:hover': {
                      backgroundColor: '#115293'
                    }
                  }}
                >
                  רישום
                </Button>
              </Grid>
              {submitError && (
                <Typography
                  variant="body1"
                  sx={{
                    color: 'red',
                    mt: 1,
                    fontWeight: 'bold'
                  }}
                >
                  {submitError}
                </Typography>
              )}
            </Box>
          </Grid>
        </Grid>
      </Container>
      {/* Footer פשוט בתחתית העמוד */}
      <Box
        sx={{
          marginTop: 5,
          textAlign: 'center',
          py: 1.5,
          backgroundColor: 'rgba(0,0,0,0.3)',
          color: '#E0E1DD'
        }}
      >
        <Typography variant="body2" sx={{ fontSize: '0.9rem' }}>
          &copy; {new Date().getFullYear()} EASY GIFT | כל הזכויות שמורות
        </Typography>
      </Box>

      {/* הצלחה - אנימציית אוברלי */}
      {showSuccessAnimation && (
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'rgba(255, 255, 255, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 3,
            animation: 'successAnimation 1s ease-in-out forwards'
          }}
        >
          <Typography
            variant="h2"
            sx={{
              color: 'green',
              fontWeight: 'bold',
              animation: 'bounce 1s ease'
            }}
          >
            הצלחה!
          </Typography>
        </Box>
      )}

      {/* אנימציית הרקע */}
      <style>
        {`
          @keyframes animateBg {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
          @keyframes successAnimation {
            0% { opacity: 0; transform: scale(0); }
            100% { opacity: 1; transform: scale(1); }
          }
          @keyframes bounce {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-20px); }
          }
        `}
      </style>
    </Box>
  )
}

export default ManagerSignup
