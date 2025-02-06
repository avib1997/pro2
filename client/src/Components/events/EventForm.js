import React from 'react'
import { Box, TextField, Button, MenuItem } from '@mui/material'

const EventForm = ({ input, handleInputChange, handleAddEventClick }) => {
  return (
    <Box
      sx={{
        maxWidth: 400,
        margin: 'auto',
        padding: 3,
        background: '#F5F5F5',
        borderRadius: 3,
        boxShadow: 3
      }}
    >
      <TextField label="שם החתן" name="NameOfGroom" value={input.NameOfGroom} onChange={handleInputChange} fullWidth margin="normal" />
      <TextField label="שם הכלה" name="NameOfBride" value={input.NameOfBride} onChange={handleInputChange} fullWidth margin="normal" />
      {/* <TextField
        label="מנהל האירוע"
        name="NameOfManager"
        value={input.NameOfManager}
        onChange={handleInputChange}
        fullWidth
        margin="normal"
      /> */}
      <TextField label="טלפון" name="phone" value={input.phone} onChange={handleInputChange} fullWidth margin="normal" />
      <TextField label="תאריך האירוע" type="date" name="DateOfEvent" value={input.DateOfEvent} onChange={handleInputChange} fullWidth margin="normal" />

      <TextField select label="סוג האירוע" name="TypeOfEvent" value={input.TypeOfEvent} onChange={handleInputChange} fullWidth margin="normal">
        <MenuItem value="חתונה">חתונה</MenuItem>
        <MenuItem value="בר מצווה">בר מצווה</MenuItem>
        <MenuItem value="בת מצווה">בת מצווה</MenuItem>
        <MenuItem value="ברית">ברית</MenuItem>
        <MenuItem value="יום הולדת">יום הולדת</MenuItem>
      </TextField>
      <Button variant="contained" color="primary" onClick={handleAddEventClick} fullWidth sx={{ marginTop: 2 }}>
        הוסף אירוע
      </Button>
    </Box>
  )
}

export default EventForm
