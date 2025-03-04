import { useTheme, Avatar, Box, Button, Container, Paper, TextField, Typography, Link as MuiLink } from '@mui/material'
import Grid2 from '@mui/material/Unstable_Grid2' // ייבוא נכון של Grid2
import React, { useEffect, useContext, useState } from 'react'
import { useInView } from 'react-intersection-observer'
import { Link } from 'react-router-dom'
import { Context } from '../App' // ייבוא הקונטקסט עבור ID של האירוע
import profilePic1 from '../assets/profile1.jpg' // תמונת אבי
import profilePic2 from '../assets/profile2.jpg' // תמונת מוטי
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import sendLog from '../LogSend'
import HomeLogo from '../Components/HomeComponents/HomeLogo' // ייבוא הלוגו המודרני

const Home = () => {
  const navigate = useNavigate()
  const theme = useTheme()
  const { setEventNumber, setEvent, eventId, setEventId } = useContext(Context) // נעדכן את ה-ID של האירוע בקונטקסט
  const [EventNum, setEventNum] = useState('') // ניהול הסטייט של השדה
  const [errorMessage, setErrorMessage] = useState('') // סטייט עבור הודעת השגיאה
  const [guestEventNumber, setGuestEventNumber] = useState('') // state for guest event number
  const [isGuestClicked, setIsGuestClicked] = useState(false) // state for guest click

  const { ref: titleRef, inView: titleInView } = useInView({
    triggerOnce: true
  })
  const { ref: textRef, inView: textInView } = useInView({ triggerOnce: true })
  const { ref: buttonRef, inView: buttonInView } = useInView({
    triggerOnce: true
  })
  const { ref: inputRef, inView: inputInView } = useInView({
    triggerOnce: true
  })

  const [ref1, inView1] = useInView({
    triggerOnce: true,
    threshold: 0.1
  })
  const [ref2, inView2] = useInView({
    triggerOnce: true,
    threshold: 0.1
  })
  const [ref3, inView3] = useInView({
    triggerOnce: true,
    threshold: 0.1
  })
  const [ref4, inView4] = useInView({
    triggerOnce: true,
    threshold: 0.1
  })
  const [ref5, inView5] = useInView({
    triggerOnce: true,
    threshold: 0.1
  })
  const [ref6, inView6] = useInView({
    triggerOnce: true,
    threshold: 0.1
  })
  const [ref7, inView7] = useInView({
    triggerOnce: true,
    threshold: 0.1
  })
  const [ref8, inView8] = useInView({
    triggerOnce: true,
    threshold: 0.1
  })

  useEffect(() => {
    setEventNumber('')
  }, [])

  const handleEventIdChange = e => {
    setEventNum(e.target.value)
    setErrorMessage('')
  }

  const handleStartClick = () => {
    if (!EventNum.trim()) {
      setErrorMessage('❌ חסר מספר אירוע')
      return
    }

    axios
      .post(`https://easygift-server.onrender.com/api/events/checkEventNumber`, { Event_number: EventNum })
      .then(response => {
        if (response.data && response.data._id) {
          setEvent(response.data) // שמירת האירוע בסטייט
          setEventNumber(EventNum) // שמירת ה-ID בקונטקסט
          setEventId(response.data._id) // שמירת ה-ID בסטייט
          sendLog('success', 'pages', 200, '✅ LoginPage עבר לדף', 'client', '/HomePage', 'handleStartClick', null, null, eventId)
          navigate('/LoginPage')
        } else {
          sendLog('error', 'event', 404, '❌ מספר האירוע לא נמצא', 'client', '/HomePage', 'handleStartClick', null, null, null)
          setErrorMessage('❌ אירוע לא נמצא, בדוק את המספר שהוזן')
        }
      })
      .catch(error => {
        setErrorMessage('❌ שגיאה בחיבור לשרת, נסה שוב')
      })
  }

  const handleGuestContinue = () => {
    if (!EventNum.trim()) {
      setErrorMessage('יש להזין מספר אירוע כדי להמשיך כאורח.')
      return
    }

    axios
      .post(`https://easygift-server.onrender.com/api/events/checkEventNumber`, { Event_number: EventNum })
      .then(response => {
        if (response.data && response.data._id) {
          setEvent(response.data)
          console.log('eventttt:', response.data)
          setEventNumber(EventNum)
          setEventId(response.data._id)
          navigate('/Details_page')
        } else {
          setErrorMessage('❌ אירוע לא נמצא, בדוק את המספר שהוזן')
        }
      })
      .catch(error => {
        setErrorMessage('❌ שגיאה בחיבור לשרת, נסה שוב')
      })
  }

  const cardStyles = [
    {
      backgroundColor: '#FFCDD2',
      titleColor: '#D32F2F'
    }, // צבע ראשון
    {
      backgroundColor: '#C8E6C9',
      titleColor: '#388E3C'
    }, // צבע שני
    {
      backgroundColor: '#BBDEFB',
      titleColor: '#1976D2'
    }, // צבע שלישי
    {
      backgroundColor: '#FFF9C4',
      titleColor: '#FBC02D'
    }, // צבע רביעי
    {
      backgroundColor: '#D1C4E9',
      titleColor: '#7B1FA2'
    }, // צבע חמישי
    {
      backgroundColor: '#FFCCBC',
      titleColor: '#E64A19'
    }, // צבע שישי
    {
      backgroundColor: '#E1BEE7',
      titleColor: '#8E24AA'
    }, // צבע שביעי
    {
      backgroundColor: '#B2DFDB',
      titleColor: '#00796B'
    } // צבע שמיני
  ]

  return (
    <Box dir="rtl">
      {/* חלק ראשון - ברוכים הבאים עם כפתור */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #1E3A8A, #E5E7EB)',
          color: 'white',
          padding: '10vh 0',
          textAlign: 'center',
          fontFamily: 'Poppins, sans-serif'
        }}
      >
        <HomeLogo />
        <Container maxWidth="md">
          <Typography
            ref={titleRef}
            variant="h2"
            sx={{
              fontSize: { xs: '2rem', sm: '3rem', md: '4rem' },
              color: '#F9A826',
              marginBottom: '2vh',
              opacity: titleInView ? 1 : 0,
              transform: titleInView ? 'translateY(0)' : 'translateY(-50px)',
              transition: 'all 0.7s ease-out'
            }}
          >
            ברוכים הבאים ל-Easy Gift
          </Typography>
          <Typography
            ref={textRef}
            variant="h6"
            sx={{
              fontSize: { xs: '1rem', sm: '1.5rem' },
              color: '#fff',
              marginBottom: '4vh',
              opacity: textInView ? 1 : 0,
              transform: textInView ? 'translateY(0)' : 'translateY(-50px)',
              transition: 'all 0.7s ease-out'
            }}
          >
            גלו את הדרך הטובה ביותר לנהל את האירועים והמתנות שלכם. <br /> פשוט, יעיל ואלגנטי.
          </Typography>
          <Typography
            sx={{
              fontSize: '0.9rem',
              color: '#fff',
              marginBottom: '10px',
              opacity: inputInView ? 1 : 0,
              transform: inputInView ? 'translateY(0)' : 'translateY(-50px)',
              transition: 'all 0.7s ease-out'
            }}
          >
            כניסה לאירוע - הכנס מספר אירוע:
          </Typography>
          {errorMessage && (
            <Typography
              sx={{
                width: { xs: '80vw', sm: '50vw' },
                borderRadius: '15px',
                color: 'white', // טקסט לבן
                backgroundColor: 'rgba(211, 47, 47, .6)', // רקע אדום כהה
                fontWeight: 'bold',
                marginBottom: '2vh',
                fontSize: '1rem'
              }}
            >
              {errorMessage}
            </Typography>
          )}
          <TextField
            ref={inputRef} // אפקט inputInView
            label="הכנס מספר אירוע"
            variant="filled" // בוחרים בסגנון Filled
            InputProps={{
              disableUnderline: true // מבטלים את הקו התחתון של ברירת המחדל ב־filled
            }}
            value={EventNum}
            onChange={handleEventIdChange}
            sx={{
              direction: 'rtl',
              marginBottom: '0px',
              marginLeft: '20px',
              width: { xs: '80vw', sm: '50vw' },
              backgroundColor: 'rgba(255, 255, 255, 0.3)', // רקע שקוף למחצה עם מעט חלבי
              borderRadius: '15px',
              opacity: inputInView ? 1 : 0,
              transform: inputInView ? 'translateY(0)' : 'translateY(-50px)',
              transition: 'all 0.7s ease-out', // מעבר חלק כמו הכפתור
              '& .MuiFilledInput-root': {
                borderRadius: '15px',
                backgroundColor: 'rgba(255, 255, 255, 0.3)', // רקע שקוף למחצה עם מעט חלבי
                color: '#333', // צבע טקסט כהה
                boxShadow: 'none',
                padding: '0px', // רווח פנימי
                '& input': {
                  textAlign: 'right',
                  paddingRight: '12px'
                },

                '&:hover': {
                  backgroundColor: '#f4f4f4',
                  boxShadow: '0px 8px 15px rgba(0, 0, 0, 0.1)' // צל עדין
                },
                '&.Mui-focused': {
                  backgroundColor: '#fff',
                  boxShadow: '0px 8px 15px rgba(0, 0, 0, 0.3)'
                }
              },

              '& .MuiInputLabel-root': {
                right: '20px', // הזזת הלייבל ימינה
                left: 'auto', // ביטול ערך left
                transformOrigin: 'top right',
                color: '#666',
                fontSize: '1rem'
              },
              '& .MuiInputLabel-root.Mui-focused, & .MuiInputLabel-shrink': {
                right: '20px',
                transformOrigin: 'top right',
                color: 'darkblue'
              }
            }}
          />

          <Button
            ref={buttonRef}
            onClick={handleStartClick}
            sx={{
              backgroundColor: '#F9A826',
              color: '#fff',
              fontSize: '1.2rem',
              padding: '1vh 5vw',
              borderRadius: '15px',
              opacity: buttonInView ? 1 : 0,
              transform: buttonInView ? 'translateY(0)' : 'translateY(-50px)',
              transition: 'all 0.7s ease-out',
              marginTop: '2vh',
              '&:hover': {
                backgroundColor: '#d88d1c',
                boxShadow: '0px 8px 15px rgba(0, 0, 0, 0.3)'
              }
            }}
          >
            התחלה
          </Button>

          {/* כניסת אורח */}
          <Box sx={{ textAlign: 'center', mt: 2 }}>
            {/* כפתור המשך כאורח */}
            <MuiLink
              component="button"
              onClick={handleGuestContinue}
              underline="hover"
              sx={{
                opacity: buttonInView ? 1 : 0,
                transform: buttonInView ? 'translateY(0)' : 'translateY(-50px)',
                transition: 'all 0.7s ease-out',
                color: '#F0A500',
                cursor: 'pointer',
                '&:hover': { textDecoration: 'underline', color: '#F0C040' },
                fontSize: '1.2rem'
              }}
            >
              המשך כאורח
            </MuiLink>
          </Box>

          {/* כפתור חדש לכניסת מנהלי אירועים (בלי מספר אירוע) */}
          <Button
            sx={{
              backgroundColor: '#2196F3',
              color: '#fff',
              fontSize: '1rem',
              padding: '10px 20px',
              borderRadius: '30px',
              marginTop: '30px',
              opacity: inputInView ? 1 : 0,
              transform: inputInView ? 'translateY(0)' : 'translateY(-50px)',
              transition: 'all 0.7s ease-out',
              '&:hover': {
                backgroundColor: '#1976D2',
                boxShadow: '0px 5px 10px rgba(0, 0, 0, 0.3)'
              }
            }}
            onClick={() => navigate('/LoginPage')}
          >
            התחברות/רישום
          </Button>
        </Container>
      </Box>
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
          animation: 'animateBg 15s ease infinite',
          opacity: inputInView ? 1 : 0,
          transform: inputInView ? 'translateY(0)' : 'translateY(-50px)',
          transition: 'all 0.7s ease-out'
        }}
      />
      {/* כרטיסיית המייסדים */}
      <Container maxWidth="lg" sx={{ mt: '5vh' }}>
        <Paper
          component={Paper}
          elevation={4}
          ref={ref2}
          sx={{
            textAlign: 'center',
            padding: '2vh',
            borderRadius: '50px',
            marginBottom: '50px',
            backgroundColor: cardStyles[1].backgroundColor,
            color: '#000',
            transition: 'transform 0.5s ease-in-out, box-shadow 0.3s ease-in-out',
            transform: inView2 ? 'translateY(0)' : 'translateY(50px)',
            opacity: inView2 ? 1 : 0,
            '&:hover': {
              boxShadow: '0px 10px 20px rgba(0, 0, 0, 0.2)'
            },
            fontFamily: 'Poppins, sans-serif'
          }}
        >
          <Typography
            variant="h5"
            gutterBottom
            sx={{
              color: cardStyles[1].titleColor
            }}
          >
            מייסדי המערכת
          </Typography>
          <Grid2 container spacing={20} justifyContent="center">
            <Grid2 item xs={12} sm={6} textAlign="center">
              <Avatar alt="Avi Brodetsky" src={profilePic1} sx={{ width: { xs: 100, sm: 150 }, height: { xs: 100, sm: 150 } }} />
              <Typography variant="h6" mt={1}>
                אבי ברודצקי
              </Typography>
            </Grid2>
            <Grid2 item xs={12} sm={6} textAlign="center">
              <Avatar alt="Moti Brodetsky" src={profilePic2} sx={{ width: { xs: 100, sm: 150 }, height: { xs: 100, sm: 150 } }} />
              <Typography variant="h6" mt={1}>
                מוטי ברודצקי
              </Typography>
            </Grid2>
          </Grid2>
          <Typography
            style={{
              marginTop: '20px',
              textAlign: 'center'
            }}
          >
            אבי ומוטי ברודצקי – יזמים, אחים ומהפכני טכנולוגיה. בהשראת אביהם, מפתח תוכנה בעל ניסיון של 25 שנים, הם שאפו להפוך את ניהול האירועים לחוויה חלקה, מתקדמת ומדויקת. מתוך תשוקה לחדשנות וליצירת
            פתרונות חכמים, הם פיתחו את Easy Gift – מערכת מתקדמת שמאפשרת למארגני אירועים לנהל כל פרט בקלות וביעילות, משלב התשלומים ועד לניהול מתנות, והכול בממשק אינטואיטיבי ומודרני. 🚀✨{' '}
          </Typography>
        </Paper>
      </Container>

      {/* חלק שני - כרטיסיות מידע נוספות */}
      <Container
        style={{
          marginTop: '100px',
          textAlign: 'right'
        }}
      >
        {['למה Easy Gift נבנה?', 'יתרונות המערכת', 'איך המערכת עובדת?', 'מוצר ראשון מסוגו', 'למי המערכת מתאימה?', 'שירות לקוחות ותמיכה', 'הסיפור שלנו'].map((title, index) => (
          <Box
            key={index}
            component={Paper}
            elevation={4}
            p={3}
            ref={[ref1, ref3, ref4, ref5, ref6, ref7, ref8][index]}
            sx={{
              borderRadius: '50px',
              marginBottom: '50px',
              backgroundColor: cardStyles[index].backgroundColor,
              color: '#000',
              transition: 'transform 0.5s ease-in-out, box-shadow 0.3s ease-in-out',
              transform: [inView1, inView3, inView4, inView5, inView6, inView7, inView8][index] ? 'translateY(0)' : 'translateY(50px)',
              opacity: [inView1, inView3, inView4, inView5, inView6, inView7, inView8][index] ? 1 : 0,
              '&:hover': {
                boxShadow: '0px 10px 20px rgba(0, 0, 0, 0.2)'
              },
              fontFamily: 'Poppins, sans-serif'
            }}
          >
            <Typography
              variant="h5"
              gutterBottom
              sx={{
                color: cardStyles[index].titleColor
              }}
            >
              {title}
            </Typography>
            <Typography>
              {index === 0
                ? `Easy Gift נולדה מתוך הבנה עמוקה של האתגרים בעולם ניהול האירועים. מורכבות התשלומים, חוסר הסנכרון בין המוזמנים למארגנים והצורך בפתרון נגיש ויעיל הובילו לפיתוח פלטפורמה אינטואיטיבית שמאפשרת שליטה מלאה בכל היבטי האירוע. מהניהול של המוזמנים, דרך מעקב אחר תשלומים ועד לניהול המתנות, הכל מתנהל בצורה חלקה ופשוטה. עם Easy Gift מארגני אירועים יכולים להתמקד בחוויה עצמה ולתת לטכנולוגיה לטפל בפרטים.`
                : index === 1
                ? `Easy Gift מציעה מגוון יתרונות שהופכים אותה לפתרון מוביל בתחום ניהול האירועים. המערכת פותחה עם דגש חזק על אבטחה, וכל הנתונים נשמרים באופן מאובטח כדי להבטיח למשתמשים חוויית שימוש בטוחה. הממשק נוח ואינטואיטיבי, כך שגם מי שאינו טכנולוגי יכול לנהל את האירוע שלו בצורה מקצועית ומסודרת. בנוסף, המערכת מציעה התאמה אישית לניהול אירועים ותמיכה מלאה במכשירים ניידים, מה שמאפשר שליטה וניהול מכל מקום ובכל זמן.`
                : index === 2
                ? `המערכת Easy Gift מאפשרת תהליך פשוט ומהיר לניהול האירועים שלכם. קודם כל, אתם נרשמים למערכת באמצעות מספר צעדים פשוטים. לאחר מכן, תוכלו ליצור אירוע חדש עם כל הפרטים הנדרשים – כמו שם האירוע, תאריך, שעה ומיקום. לאחר שהאירוע נוצר, תוכלו להוסיף מוזמנים, לנהל את הרשימות, ולשלוח תזכורות ותשלומים. יתרה מכך, המערכת מאפשרת למוזמנים לבצע תשלומים ישירות דרך המערכת, מה שהופך את התהליך להרבה יותר נוח ומהיר עבור כל הצדדים המעורבים.`
                : index === 3
                ? `Easy Gift הוא המערכת הראשונה בשוק שמציעה פתרון כולל לכל תהליך ניהול האירועים והתשלומים בצורה אינטואיטיבית וחדשנית. המערכת שמה לעצמה למטרה להפוך את חוויית הניהול של אירועים לפשוטה יותר, תוך שמירה על כל הפרטים החשובים בצורה מאובטחת ויעילה. הממשק המודרני והקל לשימוש מבדיל את Easy Gift ממתחרותיה בשוק. הכל נעשה בצורה אוטומטית – ממעקב אחרי התשלומים ועד ניהול המוזמנים, ואין מערכת אחרת שמציעה את אותה רמת נוחות וקלות שימוש.`
                : index === 4
                ? `Easy Gift מתאימה למגוון רחב של סוגי אירועים – חתונות, בר מצוות, ימי הולדת, מסיבות קהילה ואפילו אירועים עסקיים. כל אירוע שבו יש צורך בניהול משתתפים ותשלומים, Easy Gift מציעה פתרון מושלם לניהול כל ההיבטים של האירוע. אין זה משנה אם האירוע הוא פרטי או ציבורי, המערכת מציעה גמישות מלאה להתאים את הכלים שלה לכל צורך ייחודי של המשתמשים. בנוסף, המערכת מתאימה לכל סוגי המשתמשים – החל ממארגנים קטנים ועד מארגנים גדולים שמנהלים מאות אירועים במקביל.`
                : index === 5
                ? `שירות הלקוחות של Easy Gift הוא מהטובים בשוק. אנחנו מציעים תמיכה מקוונת 24/7, כך שכל משתמש יכול לפנות אלינו בכל זמן שצריך. צוות התמיכה המקצועי שלנו מתמחה במתן פתרונות לכל שאלה או בעיה שיכולה לעלות במהלך השימוש במערכת. בין אם מדובר בשאלה טכנית או בהתאמה אישית של האירוע – אנחנו כאן כדי לעזור. בנוסף, אנחנו מציעים הדרכות מקוונות וליווי אישי במהלך כל תהליך הקמת האירוע, כך שתמיד תדעו שיש לכם גב.`
                : `הסיפור של Easy Gift מתחיל לפני כמה שנים, כאשר אבי ומוטי זיהו את הפער בשוק ניהול האירועים. הם ראו את הצורך במערכת שתפשט את התהליך ותהפוך אותו לנגיש יותר עבור כל אחד, גם ללא ניסיון טכני. עם החזון הזה, הם יצאו לדרך ופיתחו את המערכת החדשה. הסיפור שלהם הוא סיפור של תשוקה לחדשנות וליצירת חוויות משתמש שמנגישות את הכלי למשתמשים. כל פרט במערכת נבנה עם מחשבה עמוקה כדי לתת את הפתרון הטוב ביותר לכל צורך של המשתמשים.`}
            </Typography>
          </Box>
        ))}
      </Container>
    </Box>
  )
}

export default Home
