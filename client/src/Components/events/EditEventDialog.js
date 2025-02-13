//client/src/Components/events/EditEventDialog.js
import React, { useState, useEffect } from 'react'
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Typography, Button, Box, IconButton, MenuItem } from '@mui/material'
import axios from 'axios'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import CloseIcon from '@mui/icons-material/Close'
import CircularProgress from '@mui/material/CircularProgress'
import dayjs from 'dayjs'

const EditEventDialog = ({ open, event, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    TypeOfEvent: '',
    NameOfGroom: '',
    NameOfBride: '',
    DateOfEvent: '',
    NameOfManager: '',
    phone: ''
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('') // שמירת הודעת שגיאה
  const [saved, setSaved] = useState(false)

  // עדכון הטופס עם פרטי האירוע הקיימים
  useEffect(() => {
    if (event) {
      setFormData({
        TypeOfEvent: event.TypeOfEvent || '',
        NameOfGroom: event.NameOfGroom || '',
        NameOfBride: event.NameOfBride || '',
        DateOfEvent: event.DateOfEvent ? new Date(event.DateOfEvent).toISOString().substring(0, 10) : '',
        NameOfManager: event.NameOfManager || '',
        phone: event.phone || ''
      })
      setSuccess(false)
      setSaved(false)
    }
  }, [event])

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  // קריאה לעדכון האירוע בשרת
  const handleSubmit = async () => {
    if (loading) return

    const selectedDate = dayjs(formData.DateOfEvent)
    const today = dayjs().startOf('day') // תאריך היום בלי שעות ודקות

    if (selectedDate.isBefore(today)) {
      setError('תאריך האירוע לא יכול להיות בעבר. אנא בחר תאריך עתידי.')
      return
    }

    setError('') // אם אין שגיאה, איפוס ההודעה
    setLoading(true)
    setSuccess(false)

    try {
      const response = await axios.put(`http://localhost:2001/api/events/${String(event._id)}`, formData)
      // const response = await axios.put(`http://localhost:2001/api/events/${event._id}`, formData)
      onSave(response.data)
      setSuccess(true)
      setSaved(true) // ✅ הצגת אייקון אישור ✔️

      // ✅ השאר את הדיאלוג פתוח ל-2 שניות לפני סגירה

      setTimeout(() => {
        setSaved(false) // ❌ הסרת האייקון
        onClose() // ✅ סגירה רק לאחר 3 שניות
      }, 3000)
    } catch (error) {
      setError('❌ אירעה שגיאה בעת עדכון האירוע. נסה שוב.')
      console.error('Error updating event:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        sx: {
          textAlign: 'center',
          //alignItems: 'center',
          justifyContent: 'center',
          alignContent: 'center',
          background: 'linear-gradient(135deg, #1B263B, #415A77)',
          borderRadius: '20px',
          color: '#E0E1DD',
          boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.3)'
        }
      }}
    >
      <DialogTitle
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '16px'
        }}
      >
        <Box>עריכת פרטי האירוע</Box>
      </DialogTitle>

      <DialogContent sx={{ padding: '36px' }}>
        {saved ? ( // ✅ אם השמירה הצליחה, הצג אייקון ✔️
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '200px',
              animation: 'fadeIn 0.5s ease-in-out'
            }}
          >
            <CheckCircleIcon sx={{ fontSize: 100, color: 'green', animation: 'pop 0.5s ease' }} />
          </Box>
        ) : (
          <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2, direction: 'rtl' }}>
            <TextField
              select
              label="סוג האירוע"
              name="TypeOfEvent"
              value={formData.TypeOfEvent}
              onChange={handleChange}
              fullWidth
              variant="filled"
              SelectProps={{
                MenuProps: {
                  PaperProps: {
                    sx: {
                      borderRadius: '30px',
                      '& .MuiMenu-list': {
                        paddingTop: 0,
                        paddingBottom: 0
                      }
                    }
                  }
                }
              }}
              InputProps={{
                sx: {
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  borderRadius: 5,
                  color: '#E0E1DD'
                }
              }}
              InputLabelProps={{ sx: { color: '#E0E1DD' } }}
            >
              <MenuItem value="חתונה">חתונה</MenuItem>
              <MenuItem value="בר מצווה">בר מצווה</MenuItem>
              <MenuItem value="בת מצווה">בת מצווה</MenuItem>
              <MenuItem value="ברית">ברית</MenuItem>
              <MenuItem value="יום הולדת">יום הולדת</MenuItem>
            </TextField>
            <TextField
              label="שם החתן"
              name="NameOfGroom"
              value={formData.NameOfGroom}
              onChange={handleChange}
              fullWidth
              variant="filled"
              InputProps={{
                sx: {
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  borderRadius: 5,
                  color: '#E0E1DD'
                }
              }}
              InputLabelProps={{ sx: { color: '#E0E1DD' } }}
            />
            {formData.TypeOfEvent === 'חתונה' && (
              <TextField
                label="שם הכלה"
                name="NameOfBride"
                value={formData.NameOfBride}
                onChange={handleChange}
                fullWidth
                variant="filled"
                InputProps={{
                  sx: {
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    borderRadius: 5,
                    color: '#E0E1DD'
                  }
                }}
                InputLabelProps={{ sx: { color: '#E0E1DD' } }}
              />
            )}
            <TextField
              label="תאריך אירוע"
              name="DateOfEvent"
              type="date"
              value={formData.DateOfEvent}
              onChange={handleChange}
              fullWidth
              variant="filled"
              InputProps={{
                sx: {
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  borderRadius: 5,
                  color: '#E0E1DD'
                }
              }}
              InputLabelProps={{ shrink: true, sx: { color: '#E0E1DD' } }}
            />
            {error && (
              <Typography color="error" sx={{ mt: 1 }}>
                {error}
              </Typography>
            )}
            <TextField
              label="שם מנהל האירוע"
              name="NameOfManager"
              value={formData.NameOfManager}
              onChange={handleChange}
              fullWidth
              variant="filled"
              InputProps={{
                sx: {
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  borderRadius: 5,
                  color: '#E0E1DD'
                }
              }}
              InputLabelProps={{ sx: { color: '#E0E1DD' } }}
            />
            <TextField
              label="טלפון"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              fullWidth
              variant="filled"
              InputProps={{
                sx: {
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  borderRadius: 5,
                  color: '#E0E1DD'
                }
              }}
              InputLabelProps={{ sx: { color: '#E0E1DD' } }}
            />
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ justifyContent: 'space-between', padding: '16px' }}>
        {!saved && ( // ✅ כפתור שמירה יוצג רק אם השינויים עוד לא נשמרו
          <Button
            onClick={handleSubmit}
            variant="contained"
            color="primary"
            disabled={loading}
            startIcon={success ? <CheckCircleIcon sx={{ animation: 'pop 0.5s ease-in-out', fontSize: '1.8rem' }} /> : null}
            sx={{
              background: '#4CAF50',
              color: '#E0E1DD',
              fontWeight: 'bold',
              padding: '8px 16px',
              borderRadius: '20px',
              transition: 'transform 0.3s, box-shadow 0.3s',
              '&:hover': {
                backgroundColor: '#388E3C',
                transform: 'scale(1.05)',
                boxShadow: '0px 6px 15px rgba(0, 0, 0, 0.3)'
              }
            }}
          >
            {loading ? <CircularProgress size={20} sx={{ color: '#E0E1DD' }} /> : success ? 'נשמר' : 'שמור שינויים'}
          </Button>
        )}
        <IconButton onClick={onClose} sx={{ color: '#E0E1DD', marginLeft: '100px' }}>
          <CloseIcon />
        </IconButton>
      </DialogActions>

      <style>
        {`
          @keyframes pop {
            0% { transform: scale(0.5); opacity: 0; }
            50% { transform: scale(1.2); opacity: 1; }
            100% { transform: scale(1); opacity: 1; }
          }
        `}
      </style>
    </Dialog>
  )
}

export default EditEventDialog
