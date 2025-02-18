import { Avatar, Box, Button, Container, Paper, TextField, Typography, Link as MuiLink } from '@mui/material'
import Grid2 from '@mui/material/Unstable_Grid2' // ייבוא נכון של Grid2
import React, { useContext, useState } from 'react'
import { useInView } from 'react-intersection-observer'
import { Link } from 'react-router-dom'
import { Context } from '../App' // ייבוא הקונטקסט עבור ID של האירוע
import profilePic1 from '../assets/profile1.jpg' // תמונת אבי
import profilePic2 from '../assets/profile2.jpg' // תמונת מוטי
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import sendLog from '../LogSend'

const Home = () => {

  const navigate = useNavigate()
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
      .post(`http://localhost:2001/api/events/checkEventNumber`, { Event_number: EventNum })
      .then(response => {
        if (response.data && response.data._id) {
          setEvent(response.data._id) // שמירת האירוע בסטייט
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
    // if (!isGuestClicked) {
    //   setIsGuestClicked(true)
    //   setErrorMessage('יש להזין מספר אירוע כדי להמשיך כאורח.')
    //   return
    // }

    if (!EventNum.trim()) {
      setErrorMessage('יש להזין מספר אירוע כדי להמשיך כאורח.')
      return
    }

    axios
      .post(`http://localhost:2001/api/events/checkEventNumber`, { Event_number: EventNum })
      .then(response => {
        if (response.data && response.data._id) {
          setEvent(response.data._id)
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
          padding: '100px 0',
          textAlign: 'center',
          fontFamily: 'Poppins, sans-serif'
        }}
      >
        <Container sx={{ justifyItems: 'center' }}>
          <Typography
            ref={titleRef}
            variant="h2"
            sx={{
              fontSize: '4rem',
              color: '#F9A826',
              marginBottom: '20px',
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
              fontSize: '1.5rem',
              color: '#fff',
              marginBottom: '40px',
              opacity: textInView ? 1 : 0,
              transform: textInView ? 'translateY(0)' : 'translateY(-50px)',
              transition: 'all 0.7s ease-out'
            }}
          >
            גלו את הדרך הטובה ביותר לנהל את האירועים והמתנות שלכם. פשוט, יעיל ואלגנטי.
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
          {/* הצגת הודעת שגיאה מעל השדה, אם קיימת */}
          {errorMessage && (
            <Typography
              sx={{
                width: '500px',
                color: 'rgba(255, 87, 34, 1)',
                marginBottom: '10px',
                fontSize: '1.2rem', // גודל גופן גדול יותר
                fontWeight: 'bold', // טקסט מודגש
                backgroundColor: 'rgba(255, 87, 34, 0.2)' // רקע חלבי עם צבע חזק
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
              width: '500px',
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
              padding: '5px 40px',
              borderRadius: '15px',
              opacity: buttonInView ? 1 : 0,
              transform: buttonInView ? 'translateY(0)' : 'translateY(-50px)',
              transition: 'all 0.7s ease-out',
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

          <Typography
            sx={{
              fontSize: '0.9rem',
              color: '#fff',
              marginTop: '20px',
              opacity: inputInView ? 1 : 0,
              transform: inputInView ? 'translateY(0)' : 'translateY(-50px)',
              transition: 'all 0.7s ease-out'
            }}
          >
            כניסה ללא אירוע - לחץ כאן:{' '}
          </Typography>
          {/* כפתור חדש לכניסת מנהלי אירועים (בלי מספר אירוע) */}
          <Button
            sx={{
              backgroundColor: '#2196F3',
              color: '#fff',
              fontSize: '1rem',
              padding: '10px 20px',
              borderRadius: '30px',
              marginTop: '10px',
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
            כניסה ללא אירוע
          </Button>

          {/* טקסט קטן מעל קישור לרישום מנהל אירוע */}
          <Typography
            sx={{
              fontSize: '0.9rem',
              color: '#fff',
              marginTop: '20px',
              opacity: inputInView ? 1 : 0,
              transform: inputInView ? 'translateY(0)' : 'translateY(-50px)',
              transition: 'all 0.7s ease-out'
            }}
          >
            רוצה להירשם כמנהל אירוע? לחץ כאן:
          </Typography>

          {/* קישור לרישום מנהל אירוע */}
          <Button
            sx={{
              backgroundColor: '#4CAF50', // צבע רקע ירוק
              color: '#fff',
              fontSize: '1rem',
              padding: '10px 20px',
              borderRadius: '30px',
              marginTop: '10px',
              opacity: inputInView ? 1 : 0,
              transform: inputInView ? 'translateY(0)' : 'translateY(-50px)',
              transition: 'all 0.7s ease-out',
              '&:hover': {
                backgroundColor: '#388E3C',
                boxShadow: '0px 5px 10px rgba(0, 0, 0, 0.3)'
              }
            }}
            component={Link}
            to="/LoginPage?userType=manager"
          >
            רישום מנהל אירוע
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
      <Container
        style={{
          marginTop: '100px',
          textAlign: 'right'
        }}
      >
        <Box
          component={Paper}
          elevation={4}
          p={3}
          ref={ref2}
          sx={{
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
            <Grid2 item>
              <Avatar alt="Avi Brodetsky" src={profilePic1} sx={{ width: 200, height: 200 }} />
              <Typography align="center" variant="h4" sx={{ marginTop: '10px' }}>
                אבי ברודצקי
              </Typography>
            </Grid2>
            <Grid2 item>
              <Avatar alt="Moti Brodetsky" src={profilePic2} sx={{ width: 200, height: 200 }} />
              <Typography align="center" variant="h4" sx={{ marginTop: '10px' }}>
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
            אבי ומוטי ברודצקי, יזמים ואחים, קיבלו השראה מאביהם, מפתח תוכנה במשך 25 שנים. עם תשוקה לתחום וליצירת פתרון טכנולוגי חכם, הם הביאו לעולם את Easy Gift. הם שמו להם למטרה ליצור מערכת שתעזור
            למארגני אירועים לנהל את האירועים שלהם בצורה הכי פשוטה, תוך שמירה על כל הפרטים החשובים – מתשלומים ועד ניהול מוזמנים.
          </Typography>
        </Box>
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
                ? `המערכת Easy Gift נבנתה מתוך הבנה שישנם פערים רבים בתחום ניהול האירועים. אחת הבעיות המרכזיות היא המורכבות שבניהול התשלומים והקשר בין המוזמנים לבין המארגנים. המערכת נועדה לפתור את הבעיה הזו ולהציע פלטפורמה אינטואיטיבית שיכולה לאפשר למארגנים לנהל את כל האספקטים של האירוע בצורה חלקה – החל מניהול המוזמנים ועד תזרים התשלומים. עם Easy Gift, הכל פשוט יותר, וכל מארגן יכול להתמקד באירוע עצמו ולא בפרטים הטכניים.`
                : index === 1
                  ? `Easy Gift מציעה מגוון יתרונות שמבליטים אותה בשוק. קודם כל, מדובר במערכת שפותחה עם דגש חזק על אבטחה. כל פרט נשמר באופן מאובטח, כך שהמשתמשים יכולים להרגיש בטוחים כשמשתמשים במערכת. בנוסף, הממשק פשוט מאוד לשימוש, ומאפשר לכל משתמש – גם אם הוא לא טכנולוגי – לנהל את האירוע שלו בצורה מקצועית ומסודרת. ישנם עוד יתרונות רבים במערכת, כגון התאמה אישית של ניהול האירועים, ותמיכה מלאה במכשירים ניידים – כך שניתן לנהל את הכל מכל מקום.`
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
