import React, { useState, useContext, useEffect } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { useTheme, Box, Button, Link as MuiLink, Typography, Divider, TextField } from '@mui/material'
import localImage from '../assets/ben-white-vJz7tkHncFk-unsplash.jpg'
import { Context } from '../App' // או היכן שהקונטקסט מיוצא
import StarIcon from '@mui/icons-material/Star'
import FavoriteIcon from '@mui/icons-material/Favorite'
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents'

import Manager from '../Components/Register/Event_manager'
import Login from '../Components/Register/Login'
import Signup from '../Components/Register/Singup'
import axios from 'axios'

const LoginPage = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const theme = useTheme()
  const { eventNumber, setEventNumber } = useContext(Context) // נקרא את ערך ה-eventId
  const [IsLogin, setIsLogin] = useState(true)
  const [IsSignup, setIsSignup] = useState(false)
  const [isManager, setisManager] = useState(false)
  const [errorMessage, setErrorMessage] = useState('') // מצב לשגיאות
  const [setIsGuest] = useState(false) // האם המשתמש ממשיך כאורח
  const [isGuestClicked, setIsGuestClicked] = useState(false)

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const userType = params.get('userType')

    if (userType === 'guest') {
      setIsGuest(true)
    } else if (userType === 'manager') {
      setIsLogin(false)
      setIsSignup(true)
      setisManager(false)
    }
  }, [location.search])

  const handleBackHome = () => {
    setEventNumber('')
  }

  const handleChange = e => {
    setErrorMessage('')
    setIsLogin(false)
    setIsSignup(false)
    setisManager(false)
    switch (e.target.name) {
      case 'Login':
        setIsLogin(true)
        break
      case 'Signup':
        setIsSignup(true)
        break
      case 'Event':
        setisManager(true)
        break
      default:
        break
    }
  }

  const handleGuestContinue = () => {
    if (!eventNumber.trim()) {
      setErrorMessage('יש להזין מספר אירוע כדי להמשיך כאורח.')
      setIsGuestClicked(true) // מציג את השדה
      return
    }

    axios.post(`https://easygift-server.onrender.com/api/events/checkEventNumber`, { Event_number: eventNumber }).then(response => {
      console.log('✅ תגובה מהשרת:', response.data)
      if (response.data && response.data._id) {
        setEventNumber(eventNumber) // שמירת מספר האירוע ב־Context
        navigate('/Details_page') // ניווט לעמוד הבא
      } else {
        console.log('❌ מספר האירוע לא נמצא')
        setErrorMessage('❌ אירוע לא נמצא, בדוק את המספר שהוזן')
      }
    })
  }

  return (
    <Box
      sx={{
        position: 'relative',
        minHeight: '90vh', // גובה מסך כמעט מלא
        direction: 'rtl',
        paddingTop: '10vh',
        paddingBottom: '15vh',
        fontFamily: 'Roboto, sans-serif',
        overflowX: 'hidden' // למניעת גלילה אופקית מיותרת
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
        onClick={handleBackHome}
        component={Link}
        to="/Home"
        sx={{
          position: 'absolute',
          top: '2vh',
          left: '50%',
          backgroundColor: '#1E90FF',
          transform: 'translateX(-50%)',
          color: '#fff',
          padding: { xs: '1vh 10vw', sm: '1vh 3vw' },
          borderRadius: '30px',
          fontSize: { xs: '0.8rem', sm: '1rem' },
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
      {/* כותרת */}
      <Box textAlign="center" sx={{ mt: '5vh', color: '#E0E1DD', fontFamily: 'Poppins, sans-serif' }}>
        <Typography
          variant="h3"
          gutterBottom
          sx={{
            fontWeight: 'bold',
            color: '#E0E1DD',
            textShadow: '2px 2px #000',
            marginBottom: 1
          }}
        >
          ברוכים הבאים
        </Typography>
        <Typography
          variant="h6"
          sx={{
            color: '#E0E1DD',
            textShadow: '1px 1px #000',
            mb: '2vh'
          }}
        >
          דף התחברות ורישום ל-EASY GIFT
        </Typography>
      </Box>
      {/* בלוק "למה לבחור ב-EASY GIFT?" מעל הטופס */}
      <Box sx={{ maxWidth: '80vw', margin: 'auto', mt: '2vh', mb: '2vh', textAlign: 'center', color: '#E0E1DD' }}>
        <Typography variant="h5" sx={{ mb: '2vh', fontWeight: 'bold' }}>
          למה לבחור ב-EASY GIFT?
        </Typography>
        <Typography
          variant="h6"
          sx={{
            color: '#FFF',
            mb: '2vh'
          }}
        >
          מספר אירוע: {eventNumber || 'לא הוזן'}{' '}
        </Typography>
        <Box display="flex" flexDirection={{ xs: 'column', sm: 'row' }} justifyContent="space-around" alignItems="center" gap={2}>
          {[
            { icon: <StarIcon sx={{ fontSize: 40, color: '#FFD700' }} />, title: 'קל לשימוש', text: ' ממשק פשוט ונוח שמאפשר לך להתחבר, להירשם ולנהל אירועים בקלות.' },
            { icon: <FavoriteIcon sx={{ fontSize: 40, color: 'red' }} />, title: 'חוויה אישית', text: ' אפליקציה בנויה בקפידה, מעניקה חוויה מותאמת אישית לכל משתמש.' },
            { icon: <EmojiEventsIcon sx={{ fontSize: 40, color: '#FFC107' }} />, title: 'ניהול אירועים', text: ' מערכת חכמה לניהול האירועים שלך, שעובדת ביעילות ומקצרת תהליכים.' }
          ].map((item, index) => (
            <Box
              key={index}
              sx={{
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                padding: 2,
                borderRadius: 4,
                width: { xs: '100%', sm: '30%' },
                transition: '0.3s',
                '&:hover': { transform: 'scale(1.05)', backgroundColor: 'rgba(255, 255, 255, 0.2)' }
              }}
            >
              {item.icon}
              <Typography variant="h6" sx={{ mt: 1, fontWeight: 'bold' }}>
                {item.title}
              </Typography>
              <Typography variant="body1">{item.text}</Typography>
            </Box>
          ))}
        </Box>
      </Box>
      <Divider sx={{ maxWidth: 700, margin: 'auto', my: 3 }} />

      <form sx={{ borderRadius: 4 }} onSubmit={e => e.preventDefault()}>
        <Box
          display="flex"
          flexDirection={{
            xs: 'column',
            md: 'row'
          }}
          width={{ xs: '90%', md: '80%' }}
          margin="auto"
          boxShadow="0px 8px 16px rgba(0, 0, 0, 0.5)"
          sx={{
            borderRadius: 4,
            background: 'linear-gradient(135deg, #1B263B, #415A77)',
            transition: 'transform 0.3s, box-shadow 0.3s',
            '&:hover': {
              transform: 'scale(1.02)',
              boxShadow: '0px 12px 24px rgba(0, 0, 0, 0.7)'
            }
          }}
        >
          {/* עמודה 1: תוכן ממלא - אפשר תמונה, טקסט וכו' */}
          <Box
            flex={1}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              p: { xs: 2, md: 4 },
              backgroundColor: 'rgba(255, 255, 255, 0.07)',
              borderRadius: '20px 20px 0 0'
            }}
          >
            <Typography
              variant="h5"
              sx={{
                color: '#FCECDD',
                fontWeight: 'bold',
                mb: 2,
                textAlign: 'center',
                textShadow: '1px 1px #000'
              }}
            >
              הצטרפו לחוויה
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: '#E0E1DD',
                mb: 2,
                textAlign: 'center',
                lineHeight: 1.8
              }}
            >
              הצטרפו לאלפי משתמשים שכבר נהנים מניהול אירועים פשוט, ברור ומפנק! <br />
              בין אם אתם מתכננים מסיבה קטנה או אירוע גדול, EASY GIFT כאן להפוך את החוויה לקלה ונוחה.
            </Typography>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                mt: 2
              }}
            >
              <img
                src={localImage}
                alt="Events"
                style={{
                  maxWidth: '100%',
                  borderRadius: 15,
                  boxShadow: '0 4px 8px rgba(0,0,0,0.3)'
                }}
              />
            </Box>
          </Box>

          <Box
            flex={1}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              p: { xs: 2, md: 4 },
              alignItems: 'center'
            }}
          >
            <Box display="flex" flexDirection="row" justifyContent="space-between" width="100%" marginBottom={3}>
              <Button
                onClick={handleChange}
                name="Login"
                sx={{
                  margin: 1,
                  borderRadius: 4,
                  backgroundColor: '#1976D2',
                  color: '#fff',
                  '&:hover': {
                    backgroundColor: '#115293',
                    transform: 'scale(1.05)'
                  },
                  flex: 1,
                  marginRight: 0.5,
                  fontWeight: 'bold',
                  transition: '0.3s'
                }}
                variant="contained"
              >
                התחברות
              </Button>

              <Button
                onClick={handleChange}
                name="Signup"
                sx={{
                  margin: 1,
                  borderRadius: 4,
                  backgroundColor: '#4CAF50',
                  color: '#fff',
                  '&:hover': {
                    backgroundColor: '#388E3C',
                    transform: 'scale(1.05)'
                  },
                  flex: 1,
                  marginLeft: 0.5,
                  fontWeight: 'bold',
                  transition: '0.3s'
                }}
                variant="contained"
              >
                רישום
              </Button>
            </Box>

            <Typography variant="h8" sx={{ color: '#FFF' }}>
              מספר אירוע: {eventNumber || 'לא הוזן'}{' '}
            </Typography>

            {IsLogin && <Login />}
            {IsSignup && <Signup defaultManager={true} />}
            {isManager && <Manager />}

            <Box sx={{ textAlign: 'center', mt: 2 }}>
              {/* כפתור המשך כאורח */}
              <MuiLink
                component="button"
                onClick={handleGuestContinue}
                underline="hover"
                sx={{
                  color: '#F0A500',
                  cursor: 'pointer',
                  '&:hover': { textDecoration: 'underline', color: '#F0C040' },
                  fontSize: '1.2rem'
                }}
              >
                המשך כאורח
              </MuiLink>

              {/* הצגת שדה למספר אירוע רק אם המשתמש ניסה להמשיך ללא מספר */}
              {isGuestClicked && (
                <Box mt={2} sx={{ width: '100%', maxWidth: 300, mx: 'auto' }}>
                  <TextField
                    fullWidth
                    label="מספר אירוע"
                    variant="outlined"
                    value={eventNumber}
                    onChange={e => setEventNumber(e.target.value)}
                    sx={{
                      backgroundColor: '#22303C',
                      borderRadius: 4,
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 4,
                        '& fieldset': { borderColor: '#E0E1DD', borderWidth: '1px' },
                        '&:hover fieldset': { borderColor: '#F0A500', borderWidth: '2px' },
                        '&.Mui-focused fieldset': { borderColor: '#F0A500', borderWidth: '2px' }
                      },
                      '& .MuiInputLabel-root': { color: '#E0E1DD' },
                      '& .MuiInputBase-input': { color: '#E0E1DD' }
                    }}
                  />

                  {/* הודעת שגיאה במידה ולא הוזן מספר אירוע */}
                  {errorMessage && <Typography sx={{ color: 'red', fontSize: '0.9rem', mt: 1 }}>{errorMessage}</Typography>}

                  {/* כפתור שליחה לאחר מילוי המספר */}
                  <Button
                    onClick={handleGuestContinue}
                    sx={{
                      mt: 2,
                      backgroundColor: '#F0A500',
                      color: '#1B263B',
                      fontSize: '1rem',
                      fontWeight: 'bold',
                      padding: '8px 16px',
                      borderRadius: '20px',
                      transition: '0.3s',
                      '&:hover': { backgroundColor: '#FFD700' }
                    }}
                  >
                    שלח מספר אירוע
                  </Button>
                </Box>
              )}
            </Box>
          </Box>
        </Box>
      </form>

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

export default LoginPage
