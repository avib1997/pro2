import React, { useState } from 'react'
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, IconButton, InputAdornment, Typography } from '@mui/material'
import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const ForgotPassword = ({ open, handleClose }) => {
  const [email, setEmail] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate()

  const handleTogglePasswordVisibility = () => {
    setShowPassword(true)
    setTimeout(() => setShowPassword(false), 3000) // מציג את הסיסמה ל-3 שניות
  }

  const handleResetPassword = async () => {
    if (!email || !newPassword || !confirmPassword) {
      setErrorMessage('אנא מלא את כל השדות.')
      return
    }
    if (newPassword !== confirmPassword) {
      setErrorMessage('הסיסמאות אינן תואמות.')
      return
    }
    if (newPassword.length < 3) {
      setErrorMessage('הסיסמה חייבת להיות לפחות 3 תווים.')
      return
    }

    try {
      const response = await axios.put('https://easygift-server.onrender.com/api/users/reset-password', { email, newPassword })
      if (response.data.success) {
        alert('הסיסמה שונתה בהצלחה!')
        handleClose()
        navigate('/login')
      } else {
        setErrorMessage(response.data.message || 'שגיאה בעדכון הסיסמה.')
      }
    } catch (error) {
      setErrorMessage('אירעה שגיאה. נסה שוב מאוחר יותר.')
      console.error('Error updating password:', error)
    }
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      dir="rtl"
      PaperProps={{
        sx: {
          borderRadius: '25px',
          backgroundColor: '#2B384D',
          width: 500,
          padding: 2,
          color: '#E0E1DD'
        }
      }}
    >
      <DialogTitle sx={{ textAlign: 'center', fontSize: 30, color: '#E0E1DD' }}>איפוס סיסמה</DialogTitle>
      <DialogContent
        sx={{
          backgroundColor: '#1B263B',
          borderRadius: '25px',
          padding: 3,
          color: '#E0E1DD'
          //paddingTop: '10px'
        }}
      >
        {errorMessage && (
          <Typography color="error" sx={{ textAlign: 'center', marginBottom: 1, marginTop: 1, fontWeight: 'bold' }}>
            {errorMessage}
          </Typography>
        )}
        <TextField
          label="אימייל"
          type="email"
          fullWidth
          margin="dense"
          value={email}
          onChange={e => setEmail(e.target.value)}
          sx={{
            backgroundColor: '#2B384D',
            borderRadius: 5,
            '& .MuiOutlinedInput-root': {
              color: '#E0E1DD',
              borderRadius: 5,
              '&:hover fieldset': { borderColor: 'lightskyblue' }
            },
            '& .MuiInputLabel-root': { color: '#E0E1DD' }
          }}
        />
        <TextField
          label="סיסמה חדשה"
          type={showPassword ? 'text' : 'password'}
          fullWidth
          margin="dense"
          value={newPassword}
          onChange={e => setNewPassword(e.target.value)}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={handleTogglePasswordVisibility}>{showPassword ? <Visibility /> : <VisibilityOff />}</IconButton>
              </InputAdornment>
            )
          }}
          sx={{
            backgroundColor: '#2B384D',
            borderRadius: 5,
            '& .MuiOutlinedInput-root': {
              color: '#E0E1DD',
              borderRadius: 5,
              '&:hover fieldset': { borderColor: 'lightskyblue' }
            },
            '& .MuiInputLabel-root': { color: '#E0E1DD' }
          }}
        />
        <TextField
          label="אימות סיסמה חדשה"
          type={showPassword ? 'text' : 'password'}
          fullWidth
          margin="dense"
          value={confirmPassword}
          onChange={e => setConfirmPassword(e.target.value)}
          sx={{
            backgroundColor: '#2B384D',
            borderRadius: 5,
            '& .MuiOutlinedInput-root': {
              color: '#E0E1DD',
              borderRadius: 5,
              '&:hover fieldset': { borderColor: 'lightskyblue' }
            },
            '& .MuiInputLabel-root': { color: '#E0E1DD' }
          }}
        />
      </DialogContent>
      <DialogActions sx={{ display: 'flex', justifyContent: 'center', gap: 2, margin: '10px 0' }}>
        <Button
          onClick={handleClose}
          sx={{
            borderRadius: 5,
            fontWeight: 'bold',
            fontSize: '1.1rem',
            backgroundColor: 'rgba(87,96,111,1)',
            color: '#E0E1DD',
            padding: '10px 20px',
            transition: 'background-color 0.3s ease, transform 0.2s ease',
            '&:hover': { backgroundColor: 'rgba(72,81,92,1)', transform: 'translateY(-2px)' }
          }}
        >
          ביטול
        </Button>
        <Button
          onClick={handleResetPassword}
          sx={{
            borderRadius: 5,
            fontWeight: 'bold',
            fontSize: '1.1rem',
            backgroundColor: 'rgb(0, 139, 63)',
            color: '#E0E1DD',
            padding: '10px 20px',
            transition: 'background-color 0.3s ease, transform 0.2s ease',
            '&:hover': { backgroundColor: 'rgb(0, 113, 51)', transform: 'translateY(-2px)' }
          }}
        >
          אישור
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default ForgotPassword
