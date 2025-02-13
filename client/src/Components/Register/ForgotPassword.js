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
      const response = await axios.put('http://localhost:2001/api/users/reset-password', { email, newPassword })
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
    <Dialog open={open} onClose={handleClose} dir="rtl">
      <DialogTitle>איפוס סיסמה</DialogTitle>
      <DialogContent>
        {errorMessage && <Typography color="error">{errorMessage}</Typography>}
        <TextField label="אימייל" type="email" fullWidth margin="dense" value={email} onChange={e => setEmail(e.target.value)} />
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
        />
        <TextField label="אימות סיסמה חדשה" type={showPassword ? 'text' : 'password'} fullWidth margin="dense" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="secondary">
          ביטול
        </Button>
        <Button onClick={handleResetPassword} color="primary">
          אישור
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default ForgotPassword
