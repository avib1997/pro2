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
    Event_number: Math.floor(1000 + Math.random() * 9000),
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

    const newEvent = { ...input, userid_event: userId }

    try {
      const response = await axios.post('http://localhost:2001/api/events/addEvent', newEvent)
      console.log('✅ Event added:', response.data)
      onAdd(response.data) // הוספת האירוע לרשימה

      // ✅ **איפוס השדות לאחר שמירה מוצלחת**
      setInput({
        NameOfGroom: '',
        NameOfBride: '',
        NameOfManager: '',
        Event_number: Math.floor(1000 + Math.random() * 9000), // יצירת מספר חדש
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

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>הוסף אירוע חדש</DialogTitle>
      <DialogContent>
        <TextField label="שם החתן" name="NameOfGroom" value={input.NameOfGroom} onChange={handleInputChange} fullWidth margin="normal" />
        <TextField label="שם הכלה" name="NameOfBride" value={input.NameOfBride} onChange={handleInputChange} fullWidth margin="normal" />
        <TextField label="מנהל האירוע" name="NameOfManager" value={input.NameOfManager} onChange={handleInputChange} fullWidth margin="normal" />
        <TextField label="טלפון" name="phone" value={input.phone} onChange={handleInputChange} fullWidth margin="normal" />
        <TextField label="תאריך האירוע" type="date" name="DateOfEvent" value={input.DateOfEvent} onChange={handleInputChange} fullWidth margin="normal" />
        <TextField label="מספר מוזמנים" type="number" name="NumOfGuests" value={input.NumOfGuests} onChange={handleInputChange} fullWidth margin="normal" />
        <TextField select label="סוג האירוע" name="TypeOfEvent" value={input.TypeOfEvent} onChange={handleInputChange} fullWidth margin="normal">
          <MenuItem value="חתונה">חתונה</MenuItem>
          <MenuItem value="בר מצווה">בר מצווה</MenuItem>
          <MenuItem value="בת מצווה">בת מצווה</MenuItem>
          <MenuItem value="ברית">ברית</MenuItem>
          <MenuItem value="יום הולדת">יום הולדת</MenuItem>
        </TextField>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          ביטול
        </Button>
        <Button onClick={handleAddEventClick} color="primary">
          שמור
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default AddEventDialog
