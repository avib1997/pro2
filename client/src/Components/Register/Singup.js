import React, { useState, useContext, useEffect } from 'react'
import { Box, Button, TextField, Typography, InputAdornment, MenuItem } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { Context } from '../../App'
import { Person as PersonIcon, PersonOutline as PersonOutlineIcon, Email as EmailIcon, Lock as LockIcon } from '@mui/icons-material'
import sendLog from '../../LogSend'
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts'
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings'
import SecurityIcon from '@mui/icons-material/Security'

const Signup = props => {
  const Navigate = useNavigate()
  const [errors, setErrors] = useState({
    fname: '',
    lname: '',
    email: '',
    password: '',
    isManager: ''
  })
  const [isValid, setIsValid] = useState({
    fname: false,
    lname: false,
    email: false,
    password: false,
    isManager: false
  })
  const [newErrors, setNewErrors] = useState({
    fname: '',
    lname: '',
    email: '',
    password: '',
    isManager: ''
  })
  const [newValidState, setNewValidState] = useState({
    fname: false,
    lname: false,
    email: false,
    password: false,
    isManager: false
  })
  const { isEventManager, setIsEventManager, userId, setUserId, eventNumber } = useContext(Context)
  const [input, setInput] = useState({
    fname: '',
    lname: '',
    email: '',
    password: '',
    isManager: false
  })
  const handelchange = e => {
    setInput(prevState => ({
      ...prevState,
      [e.target.name]: e.target.value
    }))
  }

  // Signup.js
  useEffect(() => {
    // אם אנו מגיעים "מכוון" למנהל (למשל, באמצעות prop שהגיע מהורה)
    if (props.defaultManager === true) {
      setInput(prev => ({ ...prev, isManager: true }))
    }
  }, [props.defaultManager])

  // switch (field) {
  //   case 'name':
  //     if (!value) {
  //       newErrors.name = 'יש להזין שם מלא'
  //       newValidState.name = false
  //     } else {
  //       newErrors.name = 'תקין'
  //       newValidState.name = true
  //     }
  //     break
  //   case 'email':
  //     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  //     if (!value) {
  //       newErrors.email = 'יש להזין כתובת אימייל'
  //       newValidState.email = false
  //     } else if (!emailRegex.test(value)) {
  //       newErrors.email = 'כתובת אימייל לא תקינה'
  //       newValidState.email = false
  //     } else {
  //       newErrors.email = 'תקין'
  //       newValidState.email = true
  //       setEmailUser(value)
  //     }
  //     break
  //   case 'phone':
  //     const phoneRegex = /^[0-9]{10}$/
  //     if (!value) {
  //       newErrors.phone = 'יש להזין מספר טלפון'
  //       newValidState.phone = false
  //     } else if (!phoneRegex.test(value)) {
  //       newErrors.phone = 'מספר טלפון חייב לכלול 10 ספרות'
  //       newValidState.phone = false
  //     } else {
  //       newErrors.phone = 'תקין'
  //       newValidState.phone = true
  //     }
  //     break
  //   case 'additionalInfo':
  //     if (!value) {
  //       newErrors.additionalInfo = 'יש להזין מידע נוסף'
  //       newValidState.additionalInfo = false
  //     } else {
  //       newErrors.additionalInfo = 'תקין'
  //       newValidState.additionalInfo = true
  //     }
  //     break
  //   default:
  //     break
  // }
  // setErrors(newErrors)
  // setIsValid(newValidState)

  const handleClick = async e => {
    e.preventDefault()
    let newErrors = {}

    if (!input.fname) {
      newErrors.fname = 'יש להזין שם'
    } else if (/\d/.test(input.fname)) {
      newErrors.fname = 'אין לכתוב מספרים בשם'
    }

    if (!input.lname) {
      newErrors.lname = 'יש להזין שם משפחה'
    } else if (/\d/.test(input.lname)) {
      newErrors.lname = 'אין לכתוב מספרים בשם המשפחה'
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!input.email) {
      newErrors.email = 'יש להזין כתובת אימייל'
    } else if (!emailRegex.test(input.email)) {
      newErrors.email = 'כתובת אימייל לא תקינה'
    }

    if (!input.password) {
      newErrors.password = 'יש להזין סיסמה'
    } else if (input.password.length < 3) {
      newErrors.password = 'סיסמה חייבת להכיל לפחות 3 תווים'
    }

    // בדיקת שגיאות
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    try {
      const response = await axios.post('http://localhost:2001/api/users/register', input)
      const { user, token } = response.data

      if (token) {
        if (eventNumber) {
          Navigate('/Details_page')
        } else if (input.isManager) {
          Navigate('/EventManager')
        } else {
          Navigate('/History')
        }
      } else {
        console.log('המשתמש לא נוצר')
      }
    } catch (error) {
      if (error.response?.status === 409) {
        setErrors({ email: 'המשתמש כבר קיים' })
      } else {
        console.log('שגיאה בהרשמה')
      }
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
            sx={{ fontWeight: '600', color: '#4CAF50' }} // טקסט כחול ובולט
          >
            רישום
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
              width: '400px',
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
              width: '400px',
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
              width: '400px',
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
              width: '400px',
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
          <TextField
            select // הופך את השדה ל-Select
            onChange={handelchange}
            name="isManager"
            value={input.isManager}
            margin="normal"
            variant="outlined"
            placeholder="האם אתה רוצה להירשם כמנהל?"
            label="האם אתה רוצה להירשם כמנהל?"
            sx={{
              width: '400px',
              backgroundColor: '#fff',
              borderRadius: '20px',
              '& .MuiOutlinedInput-root': {
                fontWeight: 600,
                borderRadius: '20px',
                '& fieldset': { border: 'none' },
                '&:hover fieldset': { border: 'none' },
                '&.Mui-focused fieldset': { border: 'none' },
                '& .MuiOutlinedInput-input': { paddingRight: '0px' }
              },
              '& .MuiSelect-select': {
                textAlign: 'center',
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: '10px'
              },
              '& .MuiInputLabel-root': {
                //position: 'relative', // כדי שנוכל למרכז
                width: '100%',
                textAlign: 'center', // מלל באמצע
                transform: 'none', // ביטול האנימציה הרגילה
                left: 'auto', // שלא יתהפך ב-RTL
                right: 'auto', // שלא יתהפך ב-RTL
                fontWeight: 600
              },
              '& .MuiInputLabel-root.Mui-focused, & .MuiInputLabel-shrink': {
                // כאן אפשר לשחק עם מיקום/הצפה של הטקסט
              }
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <ManageAccountsIcon sx={{ color: 'rgba(76, 175, 80, 1)' }} />
                </InputAdornment>
              )
            }}
          >
            <MenuItem
              value={true}
              sx={{
                transition: 'transform 0.2s ease',
                textAlign: 'center',
                justifyContent: 'center',
                '&:hover': {
                  transform: 'scale(1.1)', // "קפיצה" קלה
                  backgroundColor: '#DEEFE2', // צבע רקע בהיר
                  boxShadow: '0 4px 8px rgba(0,0,0,0.2)' // צל עדין
                }
              }}
            >
              כן
            </MenuItem>
            <MenuItem
              value={false}
              sx={{
                textAlign: 'center',
                justifyContent: 'center',
                transition: 'transform 0.2s ease',
                '&:hover': {
                  transform: 'scale(1.1)',
                  backgroundColor: '#FDEDEC',
                  boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
                }
              }}
            >
              לא
            </MenuItem>
          </TextField>
          {Object.values(errors).map(
            (err, index) =>
              err && (
                <Typography key={index} variant="body2" color="error" sx={{ fontWeight: 600 }}>
                  {err}
                </Typography>
              )
          )}
          {/* {props.a === "manager" && <Button>change to login</Button>} */}
          <Button
            onClick={handleClick}
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
