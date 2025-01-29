import React, { useState, useContext } from 'react'
import { Box, Button, TextField, Typography, InputAdornment } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { Context } from '../../App'
// אייקונים מתאימים לשדות
import { Person as PersonIcon, PersonOutline as PersonOutlineIcon, Email as EmailIcon, Lock as LockIcon } from '@mui/icons-material'

const Signup = props => {
  const Navigate = useNavigate()
  const { userId, setUserId } = useContext(Context)
  const [input, setInput] = useState({
    fname: '',
    lname: '',
    email: '',
    password: ''
  })
  const handelchange = e => {
    setInput(prevState => ({
      ...prevState,
      [e.target.name]: e.target.value
    }))
  }

  const handeClick = e => {
    e.preventDefault()
    if (props.a === 'manager') {
      const addUserManager = {
        fname: input.fname,
        lname: input.lname,
        email: input.email,
        password: input.password
      }
      axios.post('http://localhost:2001/addUserManager', addUserManager)
      Navigate('/EventManager')
    } else {
      const newUser = {
        fname: input.fname,
        lname: input.lname,
        email: input.email,
        password: input.password
      }
      axios
        .post('http://localhost:2001/api/users/register', newUser)
        .then(function (response) {
          setUserId(response.data.user._id)
          response.data ? Navigate('/Details') : console.log('no enter for you')
        })
        .catch(function (error) {
          console.log(error)
        })
    }
  }

  return (
    <div>
      <form>
        <Box
          display="flex"
          flexDirection={'column'}
          alignItems="center"
          justifyContent={'center'}
          margin="auto"
          sx={{
            fontFamily: 'Roboto, sans-serif',
            direction: 'rtl' // הגדרת כיוון מימין לשמאל
          }}
        >
          <Typography
            variant="h2"
            padding={3}
            textAlign="center"
            sx={{ fontWeight: '600', color: '#1976D2' }} // טקסט כחול ובולט
          >
            הרשמה
          </Typography>
          <TextField
            onChange={handelchange}
            name="fname"
            value={input.fname}
            margin="normal"
            type={'text'}
            variant="outlined"
            placeholder="שם"
            label="שם"
            sx={{
              width: '300px',
              backgroundColor: '#fff',
              borderRadius: '20px', // רינוד פינות
              // עיצוב כללי של השדה
              '& .MuiOutlinedInput-root': {
                fontWeight: 600,
                borderRadius: '20px', // רינוד פינות
                '& fieldset': {
                  border: 'none' // ביטול המסגרת (outline)
                },
                // אפקט רחיפה (hover)
                '&:hover fieldset': {
                  border: 'none' // הצגת מסגרת בעת רחיפה
                },
                // אפקט כשהשדה בפוקוס (focus)
                '&.Mui-focused fieldset': {
                  border: 'none'
                },
                // הוספת פדינג פנימי כדי למנוע חפיפה
                '& .MuiOutlinedInput-input': {
                  paddingRight: '0px'
                }
              },
              '& .MuiInputLabel-root': {
                fontWeight: 600,
                //transformOrigin: "top right",
                // אפשר לכוון מיקום לייבל ב-RTL לפי הצורך
                right: 20,
                left: 'auto'
                //top: 3,
                //ransform: "translate(0, 6px) scale(3.75)",
              },
              '& .MuiInputLabel-root.Mui-focused, & .MuiInputLabel-shrink': {
                // כאן מתרחש "הציפה" למעלה
                transformOrigin: 'top right', // רק לדוגמה, אם עובדים ב־RTL
                // אפשר להוריד את ערכי ה-translateY כדי לשחק עם הגובה:
                transform: 'translate(0, .5px) scale(0.75)'
                //        ↑↑   אתה יכול להגדיל/להקטין את ה"6px" כרצונך
                // אפשר לשחק גם עם top במקום transform:
                // top: "8px"
              }
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  {/* אייקון אדם לשם פרטי */}
                  <PersonIcon sx={{ color: '#1976D2' }} />
                </InputAdornment>
              )
            }}
          />
          <TextField
            onChange={handelchange}
            name="lname"
            value={input.lname}
            margin="normal"
            type={'text'}
            variant="outlined"
            placeholder="שם משפחה"
            label="שם משפחה"
            sx={{
              width: '300px',
              backgroundColor: '#fff',
              borderRadius: '20px', // רינוד פינות
              // עיצוב כללי של השדה
              '& .MuiOutlinedInput-root': {
                fontWeight: 600,
                borderRadius: '20px', // רינוד פינות
                '& fieldset': {
                  border: 'none' // ביטול המסגרת (outline)
                },
                // אפקט רחיפה (hover)
                '&:hover fieldset': {
                  border: 'none' // הצגת מסגרת בעת רחיפה
                },
                // אפקט כשהשדה בפוקוס (focus)
                '&.Mui-focused fieldset': {
                  border: 'none'
                },
                // הוספת פדינג פנימי כדי למנוע חפיפה
                '& .MuiOutlinedInput-input': {
                  paddingRight: '0px'
                }
              },
              '& .MuiInputLabel-root': {
                fontWeight: 600,
                //transformOrigin: "top right",
                // אפשר לכוון מיקום לייבל ב-RTL לפי הצורך
                right: 20,
                left: 'auto'
                //top: 3,
                //ransform: "translate(0, 6px) scale(3.75)",
              },
              '& .MuiInputLabel-root.Mui-focused, & .MuiInputLabel-shrink': {
                // כאן מתרחש "הציפה" למעלה
                transformOrigin: 'top right', // רק לדוגמה, אם עובדים ב־RTL
                // אפשר להוריד את ערכי ה-translateY כדי לשחק עם הגובה:
                transform: 'translate(0, .5px) scale(0.75)'
                //        ↑↑   אתה יכול להגדיל/להקטין את ה"6px" כרצונך
                // אפשר לשחק גם עם top במקום transform:
                // top: "8px"
              }
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  {/* אייקון אדם אחר לשם משפחה */}
                  <PersonOutlineIcon sx={{ color: '#1976D2' }} />
                </InputAdornment>
              )
            }}
          />
          <TextField
            onChange={handelchange}
            name="email"
            value={input.email}
            margin="normal"
            type={'email'}
            variant="outlined"
            placeholder="דואר אלקטרוני"
            label="דואר אלקטרוני"
            sx={{
              width: '300px',
              backgroundColor: '#fff',
              borderRadius: '20px', // רינוד פינות
              // עיצוב כללי של השדה
              '& .MuiOutlinedInput-root': {
                fontWeight: 600,
                borderRadius: '20px', // רינוד פינות
                '& fieldset': {
                  border: 'none' // ביטול המסגרת (outline)
                },
                // אפקט רחיפה (hover)
                '&:hover fieldset': {
                  border: 'none' // הצגת מסגרת בעת רחיפה
                },
                // אפקט כשהשדה בפוקוס (focus)
                '&.Mui-focused fieldset': {
                  border: 'none'
                },
                // הוספת פדינג פנימי כדי למנוע חפיפה
                '& .MuiOutlinedInput-input': {
                  paddingRight: '0px'
                }
              },
              '& .MuiInputLabel-root': {
                fontWeight: 600,
                //transformOrigin: "top right",
                // אפשר לכוון מיקום לייבל ב-RTL לפי הצורך
                right: 20,
                left: 'auto'
                //top: 3,
                //ransform: "translate(0, 6px) scale(3.75)",
              },
              '& .MuiInputLabel-root.Mui-focused, & .MuiInputLabel-shrink': {
                // כאן מתרחש "הציפה" למעלה
                transformOrigin: 'top right', // רק לדוגמה, אם עובדים ב־RTL
                // אפשר להוריד את ערכי ה-translateY כדי לשחק עם הגובה:
                transform: 'translate(0, .5px) scale(0.75)'
                //        ↑↑   אתה יכול להגדיל/להקטין את ה"6px" כרצונך
                // אפשר לשחק גם עם top במקום transform:
                // top: "8px"
              }
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  {/* אייקון אימייל */}
                  <EmailIcon sx={{ color: '#1976D2' }} />
                </InputAdornment>
              )
            }}
          />
          <TextField
            onChange={handelchange}
            name="password"
            value={input.password}
            margin="normal"
            type={'password'}
            variant="outlined"
            placeholder="סיסמה"
            label="סיסמה"
            sx={{
              width: '300px',
              backgroundColor: '#fff',
              borderRadius: '20px', // רינוד פינות
              // עיצוב כללי של השדה
              '& .MuiOutlinedInput-root': {
                fontWeight: 600,
                borderRadius: '20px', // רינוד פינות
                '& fieldset': {
                  border: 'none' // ביטול המסגרת (outline)
                },
                // אפקט רחיפה (hover)
                '&:hover fieldset': {
                  border: 'none' // הצגת מסגרת בעת רחיפה
                },
                // אפקט כשהשדה בפוקוס (focus)
                '&.Mui-focused fieldset': {
                  border: 'none'
                },
                // הוספת פדינג פנימי כדי למנוע חפיפה
                '& .MuiOutlinedInput-input': {
                  paddingRight: '0px'
                }
              },
              '& .MuiInputLabel-root': {
                fontWeight: 600,
                //transformOrigin: "top right",
                // אפשר לכוון מיקום לייבל ב-RTL לפי הצורך
                right: 20,
                left: 'auto'
                //top: 3,
                //ransform: "translate(0, 6px) scale(3.75)",
              },
              '& .MuiInputLabel-root.Mui-focused, & .MuiInputLabel-shrink': {
                // כאן מתרחש "הציפה" למעלה
                transformOrigin: 'top right', // רק לדוגמה, אם עובדים ב־RTL
                // אפשר להוריד את ערכי ה-translateY כדי לשחק עם הגובה:
                transform: 'translate(0, .5px) scale(0.75)'
                //        ↑↑   אתה יכול להגדיל/להקטין את ה"6px" כרצונך
                // אפשר לשחק גם עם top במקום transform:
                // top: "8px"
              }
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  {/* אייקון מנעול בצבע כתום */}
                  <LockIcon sx={{ color: '#FF5722' }} />
                </InputAdornment>
              )
            }}
          />
          {/* {props.a === "manager" && <Button>change to login</Button>} */}
          <Button
            onClick={handeClick}
            type="submit"
            sx={{
              margin: 3,
              borderRadius: 3,
              fontWeight: '600', // פונט בולט
              fontFamily: 'Roboto, sans-serif',
              backgroundColor: '#1976D2', // צבע רקע כחול לכפתור
              color: 'white', // צבע טקסט לבן לכפתור
              '&:hover': {
                backgroundColor: '#115293' // גוון כחול כהה יותר בעת ריחוף
              }
            }}
            variant="contained"
            size="large"
          >
            הרשמה
          </Button>
        </Box>
      </form>
    </div>
  )
}

export default Signup
