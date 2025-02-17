import React, { useState, useContext } from 'react'
import { Box, Button, TextField, Typography, InputAdornment } from '@mui/material'
import { Email as EmailIcon, Lock as LockIcon } from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { Context } from '../../App'
import sendLog from '../../LogSend'
import ForgotPassword from './ForgotPassword' // ייבוא הקומפוננטה החדשה

const Login = props => {
  const { isManager, setUserId, setDetailsId, setIsManager, setUserName, setUserEmail, setEventNumber, userId, eventNumber } = useContext(Context)
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const navigate = useNavigate()
  const [isSubmitting, setIsSubmitting] = useState(false) // מצב טעינה
  const [input, setInput] = useState({
    email: '',
    password: ''
  })

  const handleChange = e => {
    setInput(prevState => ({
      ...prevState,
      [e.target.name]: e.target.value
    }))
  }

  const validateEmail = email => {
    // בדיקה בסיסית לפורמט דוא"ל
    const re = /\S+@\S+\.\S+/
    return re.test(email)
  }

  const handleSubmit = async e => {
    e.preventDefault()
    const { email, password } = input

    // בדיקה ראשונית אם השדות מלאים
    if (!email || !password) {
      setErrorMessage('אנא מלא את כל השדות.')
      return
    }

    // בדיקה נוספת לפורמט הדוא"ל
    if (!validateEmail(email)) {
      setErrorMessage('פורמט הדוא"ל לא תקין.')
      return
    }

    setIsSubmitting(true)
    setErrorMessage('')

    try {
      const response = await axios.post('http://localhost:2001/api/users/login', {
        email,
        password
      })

      if (response.data.token) {
        setErrorMessage('')
        const userResponse = await axios.post('http://localhost:2001/api/users/userid', { email })
        if (userResponse.data && userResponse.data.userid) {
          const user = userResponse.data.userid[0]
          setUserName(`${user.fname} ${user.lname}`)
          setUserEmail(user.email)
          setUserId(user._id)
          setDetailsId(user.giftsId)
        }

        const managerResponse = await axios.post('http://localhost:2001/api/users/isManager', { _id: userResponse.data.userid[0]._id })
        setIsManager(Boolean(managerResponse.data)) // True/False
        if (eventNumber) {
          navigate('/Details_page')
        } else if (managerResponse.data) {
          navigate('/EventManager')
        } else {
          navigate('/History')
        }
      } else {
        // טיפול במקרה של שגיאה מהשרת
        if (response.data === 'not exist') {
          sendLog('error', 'user', '❌ המייל לא קיים במערכת', 'client', '/Login', 'handleSubmit', null, null, null)
          setErrorMessage('המייל לא קיים במערכת.')
        } else if (response.data === 'password not correct') {
          sendLog('error', 'user', '❌ הסיסמה שגויה', 'client', '/Login', 'handleSubmit', null, null, null)
          setErrorMessage('הסיסמה שגויה.')
        } else {
          sendLog('error', 'user', '❌ התחברות נכשלה', 'client', '/Login', 'handleSubmit', null, null, null)
          setErrorMessage(response.data || 'התחברות נכשלה. נסה שוב.')
        }
      }
    } catch (error) {
      if (error.response) {
        setErrorMessage(error.response.data || 'אירעה שגיאה. אנא נסה שוב.')
      } else {
        setErrorMessage('אירעה שגיאה. אנא נסה שוב.')
      }
    } finally {
      setIsSubmitting(false)
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
            sx={{
              fontWeight: '600',
              color: '#1976D2'
            }} // טקסט כחול ובולט
          >
            התחברות
          </Typography>

          <TextField
            onChange={handleChange}
            name="email"
            value={input.email}
            margin="normal"
            type="email"
            variant="outlined"
            placeholder="דואר אלקטרוני"
            label="דואר אלקטרוני"
            sx={{
              width: '300px',
              backgroundColor: '#fff',
              borderRadius: '20px', // רינוד פינות
              '& .MuiOutlinedInput-root': {
                fontWeight: 600,
                borderRadius: '20px', // רינוד פינות
                '& fieldset': {
                  border: 'none' // ביטול המסגרת (outline)
                },
                '&:hover fieldset': {
                  border: 'none' // הצגת מסגרת בעת רחיפה
                },
                '&.Mui-focused fieldset': {
                  border: 'none'
                },
                '& .MuiOutlinedInput-input': {
                  paddingRight: '0px'
                }
              },
              '& .MuiInputLabel-root': {
                fontWeight: 600,
                right: 20,
                left: 'auto'
              },
              '& .MuiInputLabel-root.Mui-focused, & .MuiInputLabel-shrink': {
                transformOrigin: 'top right', // רק לדוגמה, אם עובדים ב־RTL
                transform: 'translate(0, .5px) scale(0.75)'
              }
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end" sx={{ mr: 1 }}>
                  <EmailIcon sx={{ color: '#1976D2' }} />
                </InputAdornment>
              )
            }}
          />

          <TextField
            onChange={handleChange}
            name="password"
            value={input.password}
            margin="normal"
            type="password"
            variant="outlined"
            placeholder="סיסמה"
            label="סיסמה"
            sx={{
              width: '300px',
              backgroundColor: '#fff',
              borderRadius: '20px', // רינוד פינות
              '& .MuiOutlinedInput-root': {
                fontWeight: 600,
                borderRadius: '20px', // רינוד פינות
                '& fieldset': {
                  border: 'none' // ביטול המסגרת (outline)
                },
                '&:hover fieldset': {
                  border: 'none' // הצגת מסגרת בעת רחיפה
                },
                '&.Mui-focused fieldset': {
                  border: 'none'
                },
                '& .MuiOutlinedInput-input': {
                  paddingRight: '0px'
                }
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
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <LockIcon sx={{ color: '#FF5722' }} />{' '}
                </InputAdornment>
              )
            }}
          />
          {/* הצגת הודעת השגיאה אם קיימת */}
          {errorMessage && (
            <Typography variant="body2" color="error" sx={{ mb: 2, fontWeight: 'bold' }} textAlign="center" role="alert">
              {errorMessage}
            </Typography>
          )}
          <Button
            type="submit" // שינוי לטיפוס submit
            onClick={handleSubmit} // הוספת onClick
            disabled={isSubmitting}
            sx={{
              cursor: isSubmitting ? 'not-allowed' : 'pointer', // שינוי סמן העכבר בזמן טעינה
              marginTop: 2,
              marginBottom: 0,
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
            {isSubmitting ? 'מתבצע...' : 'התחברות'} {/* הצגת טקסט בזמן טעינה */}
          </Button>
          <Button onClick={() => setForgotPasswordOpen(true)} sx={{ fontWeight: '600', color: 'rgb(105, 192, 250)' }}>
            שכחתי סיסמה
          </Button>
          <ForgotPassword open={forgotPasswordOpen} handleClose={() => setForgotPasswordOpen(false)} />
        </Box>
      </form>
    </div>
  )
}

export default Login
