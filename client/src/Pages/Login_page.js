import React, {
  useState,
  useContext
} from 'react'
import {
  useNavigate,
  useLocation
} from 'react-router-dom'
import {
  Box,
  Button,
  Link as MuiLink,
  Typography,
  Divider
} from '@mui/material'
import { Link } from 'react-router-dom'
import localImage from '../assets/ben-white-vJz7tkHncFk-unsplash.jpg'
import { Context } from '../App' // או היכן שהקונטקסט מיוצא
import StarIcon from '@mui/icons-material/Star'
import FavoriteIcon from '@mui/icons-material/Favorite'
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents'

import Manager from '../Components/Register/Event_manager'
import Login from '../Components/Register/Login'
import Signup from '../Components/Register/Singup'

const LoginPage = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { eventId, setEventNumber } =
    useContext(Context) // נקרא את ערך ה-eventId
  const [IsLogin, setIsLogin] = useState(true)
  const [IsSignup, setIsSignup] = useState(false)
  const [IsManager, setIsManager] =
    useState(false)
  const [errorMessage, setErrorMessage] =
    useState('') // מצב לשגיאות

  React.useEffect(() => {
    const params = new URLSearchParams(
      location.search
    )
    const userType = params.get('userType')

    if (userType === 'manager') {
      setIsLogin(false)
      setIsSignup(false)
      setIsManager(true)
    }
  }, [location.search])

  const handleBackHome = () => {
    setEventNumber('')
  }

  const handleChange = e => {
    setErrorMessage('')
    setIsLogin(false)
    setIsSignup(false)
    setIsManager(false)
    switch (e.target.name) {
      case 'Login':
        setIsLogin(true)
        break
      case 'Signup':
        setIsSignup(true)
        break
      case 'Event':
        setIsManager(true)
        break
      default:
        break
    }
  }

  const handleGuestContinue = () => {
    if (!eventId) {
      setErrorMessage(
        'מספר אירוע נדרש כדי להמשיך כאורח. חזור לדף הבית למלא מספר אירוע.'
      )
      return
    }
    navigate('/Details_page')
  }

  // שימוש ב-useEffect לשמירה על ההודעה
  // React.useEffect(() => {
  //   if (!eventId) {
  //     setErrorMessage(
  //       'מספר אירוע נדרש כדי להמשיך כאורח. חזור לדף הבית למלא מספר אירוע.'
  //     )
  //   }
  // }, [eventId])

  return (
    <Box
      sx={{
        position: 'relative',
        minHeight: '90vh', // גובה מסך כמעט מלא
        direction: 'rtl',
        paddingTop: '80px',
        paddingBottom: '120px', // מעט יותר מקום לתוכן תחתון (footer)
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
          background:
            'linear-gradient(135deg, #0D1B2A, #1B263B)',
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
          top: '15px',
          left: '85%',
          //transform: "translateX(100%)",
          backgroundColor: '#1E90FF',
          color: '#fff',
          padding: '10px 20px',
          borderRadius: '30px',
          fontSize: '1rem',
          fontWeight: 'bold',
          '&:hover': {
            backgroundColor: '#187bcd',
            boxShadow:
              '0px 8px 15px rgba(0, 0, 0, 0.3)'
          },
          zIndex: 2
        }}
      >
        חזרה לדף הבית
      </Button>
      {/* כותרת */}
      <Box
        sx={{
          textAlign: 'center',
          margin: '0px',
          color: '#E0E1DD',
          fontFamily: 'Poppins, sans-serif'
        }}
      >
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
            marginBottom: 4
          }}
        >
          דף התחברות ורישום ל-EASY GIFT
        </Typography>
      </Box>
      {/* בלוק "למה לבחור ב-EASY GIFT?" מעל הטופס */}
      <Box
        sx={{
          maxWidth: 900,
          margin: 'auto',
          marginTop: 2,
          marginBottom: 2,
          padding: 2,
          textAlign: 'center',
          color: '#E0E1DD'
        }}
      >
        <Typography
          variant="h5"
          sx={{ mb: 2, fontWeight: 'bold' }}
        >
          למה לבחור ב-EASY GIFT?
        </Typography>
        <Typography
          variant="h6"
          sx={{
            color: '#FFF',
            marginBottom: '20px'
          }}
        >
          מספר אירוע: {eventId || 'לא הוזן'}{' '}
        </Typography>
        {/* <Typography
          variant="h3"
          gutterBottom
          sx={{
            fontWeight: "bold",
            color: "#E0E1DD",
            textShadow: "2px 2px #000",
            marginBottom: 1,
          }}
        >
          ברוכים הבאים - אירוע #{eventId}
        </Typography> */}
        <Box
          display="flex"
          flexDirection={{
            xs: 'column',
            sm: 'row'
          }}
          justifyContent="space-around"
          alignItems="center"
          gap={2}
        >
          {/* כרטיסון ראשון */}
          <Box
            sx={{
              backgroundColor:
                'rgba(255, 255, 255, 0.1)',
              padding: 2,
              borderRadius: 4,
              width: { xs: '100%', sm: '30%' },
              transition: '0.3s',
              '&:hover': {
                transform: 'scale(1.05)',
                backgroundColor:
                  'rgba(255, 255, 255, 0.2)'
              }
            }}
          >
            <StarIcon
              sx={{
                fontSize: 40,
                color: '#FFD700'
              }}
            />
            <Typography
              variant="h6"
              sx={{
                mt: 1,
                mb: 0.5,
                fontWeight: 'bold'
              }}
            >
              קל לשימוש
            </Typography>
            <Typography variant="body1">
              ממשק פשוט ונוח שמאפשר לך להתחבר,
              להירשם ולנהל אירועים בקלות.
            </Typography>
          </Box>

          {/* כרטיסון שני */}
          <Box
            sx={{
              backgroundColor:
                'rgba(255, 255, 255, 0.1)',
              padding: 2,
              borderRadius: 4,
              width: { xs: '100%', sm: '30%' },
              transition: '0.3s',
              '&:hover': {
                transform: 'scale(1.05)',
                backgroundColor:
                  'rgba(255, 255, 255, 0.2)'
              }
            }}
          >
            <FavoriteIcon
              sx={{ fontSize: 40, color: 'red' }}
            />
            <Typography
              variant="h6"
              sx={{
                mt: 1,
                mb: 0.5,
                fontWeight: 'bold'
              }}
            >
              חוויה אישית
            </Typography>
            <Typography variant="body1">
              אפליקציה בנויה בקפידה, מעניקה חוויה
              מותאמת אישית לכל משתמש.
            </Typography>
          </Box>

          {/* כרטיסון שלישי */}
          <Box
            sx={{
              backgroundColor:
                'rgba(255, 255, 255, 0.1)',
              padding: 2,
              borderRadius: 4,
              width: { xs: '100%', sm: '30%' },
              transition: '0.3s',
              '&:hover': {
                transform: 'scale(1.05)',
                backgroundColor:
                  'rgba(255, 255, 255, 0.2)'
              }
            }}
          >
            <EmojiEventsIcon
              sx={{
                fontSize: 40,
                color: '#FFC107'
              }}
            />
            <Typography
              variant="h6"
              sx={{
                mt: 1,
                mb: 0.5,
                fontWeight: 'bold'
              }}
            >
              ניהול אירועים
            </Typography>
            <Typography variant="body1">
              מערכת חכמה לניהול האירועים שלך,
              שעובדת ביעילות ומקצרת תהליכים.
            </Typography>
          </Box>
        </Box>
      </Box>
      <Divider
        sx={{
          maxWidth: 700,
          margin: 'auto',
          my: 3
        }}
      />
      {/* במקום "קובייה אחת" גדולה רק לטופס, ניצור 2 עמודות: 
          מצד אחד תוכן ויזואלי/תדמיתי, ומצד שני הטופס */}
      <form>
        <Box
          display="flex"
          flexDirection={{
            xs: 'column',
            md: 'row'
          }}
          width={{ xs: '90%', md: '80%' }}
          margin="auto"
          borderRadius={2}
          boxShadow="0px 8px 16px rgba(0, 0, 0, 0.5)"
          sx={{
            background:
              'linear-gradient(135deg, #1B263B, #415A77)',
            transition:
              'transform 0.3s, box-shadow 0.3s',
            '&:hover': {
              transform: 'scale(1.02)',
              boxShadow:
                '0px 12px 24px rgba(0, 0, 0, 0.7)'
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
              backgroundColor:
                'rgba(255, 255, 255, 0.07)',
              borderRadius: {
                xs: '0px',
                md: '2px 0 0 2px'
              }
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
              הצטרפו לאלפי משתמשים שכבר נהנים
              מניהול אירועים פשוט, ברור ומפנק!{' '}
              <br />
              בין אם אתם מתכננים מסיבה קטנה או
              אירוע גדול, EASY GIFT כאן להפוך את
              החוויה לקלה ונוחה.
            </Typography>
            {/* אפשר להחליף את ה-"תוכן" כאן בתמונה או כל דבר אחר */}
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
                  borderRadius: '8px',
                  boxShadow:
                    '0 4px 8px rgba(0,0,0,0.3)'
                }}
              />
            </Box>
          </Box>

          {/* עמודה 2: טופס ההתחברות/הרשמה */}
          <Box
            flex={1}
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            p={{ xs: 2, md: 4 }}
          >
            {/* כפתורי ניווט ראשיים */}
            <Box
              display="flex"
              flexDirection="row"
              justifyContent="space-between"
              width="100%"
              marginBottom={3}
            >
              <Button
                onClick={handleChange}
                name="Login"
                sx={{
                  margin: 1,
                  borderRadius: 3,
                  backgroundColor: '#1976D2',
                  color: '#fff',
                  '&:hover': {
                    backgroundColor: '#115293'
                  },
                  flex: 1,
                  marginRight: 0.5,
                  fontWeight: 'bold',
                  transition: '0.3s',
                  '&:hover': {
                    transform: 'scale(1.05)'
                  }
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
                  borderRadius: 3,
                  backgroundColor: '#4CAF50',
                  color: '#fff',
                  '&:hover': {
                    backgroundColor: '#388E3C'
                  },
                  flex: 1,
                  marginLeft: 0.5,
                  fontWeight: 'bold',
                  transition: '0.3s',
                  '&:hover': {
                    transform: 'scale(1.05)'
                  }
                }}
                variant="contained"
              >
                הרשמה
              </Button>

              <Button
                onClick={handleChange}
                name="Event"
                sx={{
                  margin: 1,
                  borderRadius: 3,
                  backgroundColor: '#FF9800',
                  color: '#fff',
                  '&:hover': {
                    backgroundColor: '#F57C00'
                  },
                  flex: 1,
                  marginLeft: 0.5,
                  fontWeight: 'bold',
                  transition: '0.3s',
                  '&:hover': {
                    transform: 'scale(1.05)'
                  }
                }}
                variant="contained"
              >
                מנהל אירועים
              </Button>
            </Box>
            <Typography
              variant="h8"
              sx={{ color: '#FFF' }}
            >
              מספר אירוע: {eventId || 'לא הוזן'}{' '}
            </Typography>
            {/* הצגת הטפסים בהתאם לבחירה */}
            {IsLogin && <Login />}
            {IsSignup && <Signup />}
            {IsManager && <Manager />}

            {/* קישור "המשך כאורח" בתחתית העמודה */}
            <Box
              display="flex"
              flexDirection="column"
              alignItems="center"
              marginTop={2}
              width="100%"
            >
              <Typography
                align="center"
                sx={{
                  marginTop: '10px',
                  fontSize: '1.2rem',
                  fontWeight: 'bold',
                  color: '#E0E1DD',
                  textShadow: '1px 1px #000'
                }}
              >
                {errorMessage && (
                  <Typography
                    sx={{
                      width: '330px',
                      lineHeight: 1,
                      color: 'red',
                      marginBottom: '10px',
                      fontSize: '20px', // גודל גופן גדול יותר
                      fontWeight: 'bold' // טקסט מודגש
                      //textShadow: "1px 1px 2px rgba(0,0,0,0.3)", // צל קטן לטקסט (לא חובה)
                    }}
                  >
                    {errorMessage}
                  </Typography>
                )}
                <Typography
                  variant="body1"
                  sx={{
                    color: '#FFF',
                    fontWeight: 'bold',
                    mb: 2
                  }}
                >
                  מספר אירוע:{' '}
                  {eventId || 'לא הוזן'}
                </Typography>
                <MuiLink
                  component="button"
                  onClick={handleGuestContinue}
                  underline="hover"
                  type="button"
                  sx={{
                    color: '#F0A500',
                    cursor: 'pointer',
                    '&:hover': {
                      textDecoration: 'underline',
                      color: '#F0C040'
                    },
                    fontSize: '1.2rem'
                  }}
                >
                  המשך כאורח
                </MuiLink>
              </Typography>
            </Box>
          </Box>
        </Box>
      </form>

      {/* Footer פשוט בתחתית העמוד */}
      {/* <Box
        sx={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: '100%',
          textAlign: 'center',
          py: 1.5,
          backgroundColor: 'rgba(0,0,0,0.3)',
          color: '#E0E1DD'
        }}
      >
        <Typography
          variant="body2"
          sx={{ fontSize: '0.9rem' }}
        >
          &copy; {new Date().getFullYear()} EASY
          GIFT | כל הזכויות שמורות
        </Typography>
      </Box> */}
      {/* סגנון CSS לאנימציית הרקע */}
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
