//client/src/Components/events/AddEventDialog.js
import React, { useState, useContext } from 'react'
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, MenuItem } from '@mui/material'
import { Context } from '../../App'
import axios from 'axios'

const AddEventDialog = ({ open, onClose, onAdd }) => {
  const { userId } = useContext(Context)
  const [input, setInput] = useState({
    NameOfGroom: '',
    NameOfBride: '',
    NameOfManager: '',
    Event_number: '',
    TypeOfEvent: '',
    phone: '',
    DateOfEvent: '',
    NumOfGuests: ''
  })

  const handleInputChange = e => {
    setInput(prevState => ({
      ...prevState,
      [e.target.name]: e.target.value
    }))
  }

  const handleAddEventClick = async e => {
    e.preventDefault()

    if (!input.TypeOfEvent || !input.DateOfEvent || !input.NameOfManager || !input.phone || !userId) {
      console.error('❌ Missing required fields:', input)
      alert('נא למלא את כל השדות החיוניים')
      return
    }

    const newEvent = {
      ...input,
      NameOfBride: input.TypeOfEvent === 'חתונה' ? input.NameOfBride : '',
      userid_event: userId
    }

    try {
      console.log('📡 Adding event:', newEvent)
      const response = await axios.post('http://localhost:2001/api/events/addEvent', newEvent)
      console.log('✅ Event added:', response.data)
      onAdd(response.data) // הוספת האירוע לרשימה

      // ✅ **איפוס השדות לאחר שמירה מוצלחת**
      setInput({
        NameOfGroom: '',
        NameOfBride: '',
        NameOfManager: '',
        Event_number: '', // יצירת מספר חדש
        TypeOfEvent: '',
        phone: '',
        DateOfEvent: '',
        NumOfGuests: ''
      })

      onClose() // סגירת הדיאלוג לאחר שמירה
    } catch (error) {
      console.error('❌ Error adding event:', error.response?.data || error.message)
      alert('שגיאה בהוספת אירוע, נסה שוב')
    }
  }

  // הגדרות עיצוב משותפות לכל השדות
  const commonTextFieldSX = {
    alignItems: 'center',
    width: '500px',
    textAlign: 'center',
    backgroundColor: '#778DA9',
    borderRadius: '20px',
    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
    '& .MuiOutlinedInput-root': {
      fontWeight: 600,
      borderRadius: '20px',
      marginTop: '5px',
      // הסתרת ה־legend לקבלת מסגרת שלמה
      '& .MuiOutlinedInput-notchedOutline legend': {
        display: 'none',
        border: 'none'
      },
      '&:hover .MuiOutlinedInput-notchedOutline': {
        border: '2px solid #E0E1DD'
      },
      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
        border: '2px solid #E0E1DD'
      },
      '& .MuiOutlinedInput-input': {
        paddingRight: '0px',
        textAlign: 'center'
      }
    },
    '& .MuiInputLabel-root': {
      fontWeight: 600,
      right: 20,
      left: 'auto',
      backgroundColor: '#778DA9',
      padding: '0 10px'
    },
    '& .MuiInputLabel-root.Mui-focused, & .MuiInputLabel-shrink': {
      transformOrigin: 'top right',
      transform: 'translate(0, .5px) scale(0.75)'
    }
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      sx={{
        alignItems: 'center',
        '& .MuiDialog-paper': {
          borderRadius: '20px',
          background: 'linear-gradient(135deg, #415A77, #778DA9)'
        }
      }}
    >
      <DialogTitle
        sx={{
          textAlign: 'center',
          fontWeight: 'bold',
          fontSize: '2rem',
          color: '#E0E1DD'
        }}
      >
        הוסף אירוע חדש
      </DialogTitle>
      <DialogContent
        sx={{
          textAlign: 'center',
          alignItems: 'center'
        }}
      >
        <TextField
          select
          label="סוג האירוע"
          name="TypeOfEvent"
          value={input.TypeOfEvent}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
          // הגדרות ל-dropdown (חלון האופציות) דרך SelectProps
          SelectProps={{
            MenuProps: {
              PaperProps: {
                sx: {
                  borderRadius: '30px', // פינות מעוגלות לחלון האופציות
                  // הסרת padding מיותר מלמעלה ולמטה
                  '& .MuiMenu-list': {
                    paddingTop: 0,
                    paddingBottom: 0
                  }
                }
              }
            }
          }}
          sx={{
            ...commonTextFieldSX,
            '& .MuiSelect-icon': {
              right: 'auto',
              left: 10,
              fontSize: '2rem',
              color: '#415A77'
            }
          }}
        >
          <MenuItem
            value="חתונה"
            sx={{
              textAlign: 'center',
              alignItems: 'center',
              display: 'flow', // שימוש ב-flex למרכזת התוכן
              backgroundColor: '#778DA9',
              '&:hover': {
                backgroundColor: '#E0E1DD'
              }
            }}
          >
            חתונה
          </MenuItem>
          <MenuItem
            value="בר מצווה"
            sx={{
              textAlign: 'center',
              alignItems: 'center',
              display: 'flow',
              backgroundColor: '#778DA9'
            }}
          >
            בר מצווה
          </MenuItem>
          <MenuItem
            value="בת מצווה"
            sx={{
              textAlign: 'center',
              alignItems: 'center',
              display: 'flow',
              backgroundColor: '#778DA9'
            }}
          >
            בת מצווה
          </MenuItem>
          <MenuItem
            value="ברית"
            sx={{
              textAlign: 'center',
              alignItems: 'center',
              display: 'flow',
              backgroundColor: '#778DA9'
            }}
          >
            ברית
          </MenuItem>
          <MenuItem
            value="יום הולדת"
            sx={{
              textAlign: 'center',
              alignItems: 'center',
              display: 'flow',
              backgroundColor: '#778DA9'
            }}
          >
            יום הולדת
          </MenuItem>
        </TextField>
        {input.TypeOfEvent === 'חתונה' ? (
          <>
            <TextField label="שם החתן" name="NameOfGroom" value={input.NameOfGroom} onChange={handleInputChange} fullWidth margin="normal" sx={commonTextFieldSX} />
            <TextField label="שם הכלה" name="NameOfBride" value={input.NameOfBride} onChange={handleInputChange} fullWidth margin="normal" sx={commonTextFieldSX} />
          </>
        ) : (
          <TextField label="שם" name="NameOfGroom" value={input.NameOfGroom} onChange={handleInputChange} fullWidth margin="normal" sx={commonTextFieldSX} />
        )}
        <TextField label="מנהל האירוע" name="NameOfManager" value={input.NameOfManager} onChange={handleInputChange} fullWidth margin="normal" sx={commonTextFieldSX} />
        <TextField label="טלפון" name="phone" value={input.phone} onChange={handleInputChange} fullWidth margin="normal" sx={commonTextFieldSX} />
        <TextField
          label="תאריך האירוע"
          type="date"
          name="DateOfEvent"
          value={input.DateOfEvent}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
          InputLabelProps={{
            shrink: true,
            sx: {
              fontWeight: 600,
              // במקום להשתמש בערכי העימוד מהעיצוב הכללי, כאן מגדירים ערכים שמתאימים לשדה התאריך:
              left: 10, // מזיזים את הלייבל פנימה כך שלא יתנגש עם האייקון
              right: 'auto', // מבטלים את הערך של right
              backgroundColor: '#778DA9',
              padding: '0 10px',
              // התאמה של הטרנספורם – ניתן לשחק בערכים כדי לקבל את התוצאה הרצויה
              transform: 'translate(10px, -6px) scale(0.75)'
            }
          }}
          sx={commonTextFieldSX}
        />
      </DialogContent>
      <DialogActions
        sx={{
          display: 'flex',
          justifyContent: 'center',
          gap: '20px',
          padding: '1rem'
        }}
      >
        <Button
          onClick={onClose}
          color="secondary"
          sx={{
            borderRadius: '20px',
            padding: '4px 30px',
            background: 'linear-gradient(45deg,rgb(199, 95, 98),rgb(215, 135, 113))',
            color: '#3F3D56',
            fontWeight: 'bold',
            fontSize: '1.2rem',
            boxShadow: '0 3px 5px 2px rgba(255, 105, 135, 0.1)',
            transition: 'transform 0.2s, background 0.2s',
            '&:hover': {
              transform: 'scale(1.05)'
              // background:
              //   'linear-gradient(45deg, #FAD0C4, #FF9A9E)'
            }
          }}
        >
          ביטול
        </Button>
        <Button
          onClick={handleAddEventClick}
          color="primary"
          sx={{
            borderRadius: '20px',
            padding: '4px 30px',
            background: 'linear-gradient(45deg,rgb(63, 91, 136),rgb(107, 181, 215))',
            color: '#fff',
            fontWeight: 'bold',
            fontSize: '1.2rem',
            boxShadow: '0 3px 5px 2px rgba(161, 196, 253, 0.1)',
            transition: 'transform 0.2s, background 0.2s',
            '&:hover': {
              transform: 'scale(1.05)'
              // background:
              //   'linear-gradient(45deg, #c2e9fb, #a1c4fd)'
            }
          }}
        >
          שמור
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default AddEventDialog
