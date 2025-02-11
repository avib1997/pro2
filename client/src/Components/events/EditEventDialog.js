//client/src/Components/events/EditEventDialog.js
import React, { useState, useEffect } from 'react'
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Box, IconButton } from '@mui/material'
import axios from 'axios'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import CloseIcon from '@mui/icons-material/Close'

const EditEventDialog = ({ open, event, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    TypeOfEvent: '',
    NameOfGroom: '',
    NameOfBride: '',
    DateOfEvent: '',
    Event_number: ''
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  // עדכון הטופס עם פרטי האירוע הקיימים
  useEffect(() => {
    if (event) {
      setFormData({
        TypeOfEvent: event.TypeOfEvent || '',
        NameOfGroom: event.NameOfGroom || '',
        NameOfBride: event.NameOfBride || '',
        DateOfEvent: event.DateOfEvent ? new Date(event.DateOfEvent).toISOString().substring(0, 10) : '',
        Event_number: event.Event_number || ''
      })
      setSuccess(false)
    }
  }, [event])

  const handleChange = e => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  // קריאה לעדכון האירוע בשרת
  const handleSubmit = async () => {
    setLoading(true)
    try {
      const res = await axios.put(`http://localhost:2001/api/events/${event._id}`, formData)
      console.log('אירוע עודכן:', res.data)
      setSuccess(true)
      if (onSave) onSave(res.data)
      setTimeout(() => {
        onClose()
      }, 1500)
    } catch (error) {
      console.error('שגיאה בעדכון האירוע:', error)
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
          justifyContent: 'space-between',
          padding: '16px'
        }}
      >
        <Box>עריכת פרטי האירוע</Box>
        <IconButton onClick={onClose} sx={{ color: '#E0E1DD' }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
          <TextField
            label="סוג אירוע"
            name="TypeOfEvent"
            value={formData.TypeOfEvent}
            onChange={handleChange}
            fullWidth
            variant="filled"
            InputProps={{
              sx: {
                backgroundColor: 'rgba(255,255,255,0.1)',
                borderRadius: '8px',
                color: '#E0E1DD'
              }
            }}
            InputLabelProps={{ sx: { color: '#E0E1DD' } }}
          />
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
                borderRadius: '8px',
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
                  borderRadius: '8px',
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
                borderRadius: '8px',
                color: '#E0E1DD'
              }
            }}
            InputLabelProps={{ shrink: true, sx: { color: '#E0E1DD' } }}
          />
          <TextField
            label="מספר אירוע"
            name="Event_number"
            value={formData.Event_number}
            onChange={handleChange}
            fullWidth
            variant="filled"
            InputProps={{
              sx: {
                backgroundColor: 'rgba(255,255,255,0.1)',
                borderRadius: '8px',
                color: '#E0E1DD'
              }
            }}
            InputLabelProps={{ sx: { color: '#E0E1DD' } }}
          />
        </Box>
      </DialogContent>
      <DialogActions sx={{ justifyContent: 'space-between', padding: '16px' }}>
        <Button
          onClick={handleSubmit}
          variant="contained"
          color="primary"
          disabled={loading}
          startIcon={success ? <CheckCircleIcon sx={{ animation: 'pop 0.5s ease-in-out', fontSize: '1.8rem' }} /> : null}
          sx={{
            background: 'linear-gradient(135deg, #415A77, #1B263B)',
            color: '#E0E1DD',
            fontWeight: 'bold',
            padding: '8px 16px',
            borderRadius: '20px',
            transition: 'transform 0.3s, box-shadow 0.3s',
            '&:hover': {
              transform: 'scale(1.05)',
              boxShadow: '0px 6px 15px rgba(0, 0, 0, 0.3)'
            }
          }}
        >
          {loading ? 'שומר...' : success ? 'נשמר' : 'שמור שינויים'}
        </Button>
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
