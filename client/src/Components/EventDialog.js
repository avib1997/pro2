import React, { useEffect, useState } from 'react'
import { Dialog, DialogTitle, DialogContent, DialogActions, Typography, IconButton, Tooltip, Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material'
import PrintIcon from '@mui/icons-material/Print'
import GetAppIcon from '@mui/icons-material/GetApp'
import DeleteIcon from '@mui/icons-material/Delete'
import axios from 'axios'

const EventDialog = ({ open, event, onClose, onDelete }) => {
  // Local state to store gifts fetched from server
  const [gifts, setGifts] = useState([])

  useEffect(() => {
    if (!event?._id) return
    axios
      .post('http://localhost:2001/api/events/getGiftsByEvent', { EventId: event._id })
      .then(res => {
        console.log('🎁 מתנות שהתקבלו:', res.data)
        setGifts(res.data)
      })
      .catch(err => console.error('❌ Error fetching gifts:', err))
  }, [event?._id])

  return (
    console.log('🎁 מתנות שהתקבלו:', gifts),
    (
      <Dialog
        PaperProps={{
          sx: {
            backgroundColor: 'rgba(255, 255, 255, 0.1)', // הגדרת צבע רקע עם שקיפות
            borderRadius: '20px',
            boxShadow: 'none' // אם אתה רוצה להסיר הצללה
          }
        }}
        open={open}
        onClose={onClose}
        fullWidth
        maxWidth="md"
        BackdropProps={{
          sx: { backgroundColor: 'rgba(0, 0, 0, .7)' } // התאמת צבע הרקע של ה-backdrop אם נדרש
        }}
      >
        <DialogTitle
          sx={{
            textAlign: 'center',
            fontWeight: 'bold',
            fontSize: '2rem',
            color: '#E0E1DD',
            background: 'linear-gradient(135deg, #1B263B, #415A77)',
            borderTopLeftRadius: '20px',
            borderTopRightRadius: '20px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: 2
          }}
        >
          <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#E0E1DD' }}>
            ה{event.TypeOfEvent} של
          </Typography>
          <Typography variant="h3" sx={{ fontWeight: 'bold', color: '#E0E1DD' }}>
            {event.NameOfGroom} ו{event.NameOfBride}
          </Typography>
          <Typography variant="h6" sx={{ color: '#E0E1DD', fontSize: '1rem', marginTop: '4px' }}>
            <strong>מספר אירוע: {event.Event_number}</strong>
          </Typography>
        </DialogTitle>
        <DialogContent
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            background: 'linear-gradient(135deg,rgb(83, 96, 121),rgb(113, 136, 161))', // גרדיאנט כמו בתמונה
            borderBottomLeftRadius: '20px',
            borderBottomRightRadius: '20px',
            padding: 2,
            color: '#E0E1DD',
            fontWeight: 'bold'
          }}
        >
          <Typography textAlign="center" variant="subtitle1" sx={{ color: '#E0E1DD', fontSize: '1rem', marginTop: '10px' }}>
            <strong>תאריך: </strong>
            {new Date(event.DateOfEvent).toLocaleDateString('he-IL')} 📅
          </Typography>
          {/* <Typography textAlign="center">
        <strong>מספר אירוע:</strong> {event.Event_number}
      </Typography> */}
          <Typography variant="h6" sx={{ textAlign: 'center', marginTop: 2 }}>
            🎁 :מתנות שהתקבלו
          </Typography>
          {gifts?.length ? (
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell align="center">שם שולח</TableCell>
                  <TableCell align="center">סכום</TableCell>
                  <TableCell align="center">ברכה</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {gifts.map((gift, index) => (
                  <TableRow key={index}>
                    <TableCell align="center">{gift.name}</TableCell>
                    <TableCell align="center">{gift.amount} ₪</TableCell>
                    <TableCell align="center">{gift.blessing || 'לא צורפה ברכה'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <Typography variant="body1" sx={{ textAlign: 'center', marginTop: '10px', color: '#1B263B' }}>
              אין מתנות לאירוע זה.
            </Typography>
          )}
        </DialogContent>
        {/* <DialogActions>
      <Tooltip title="הדפס">
        <IconButton>
          <PrintIcon />
        </IconButton>
      </Tooltip>
      <Tooltip title="הורד PDF">
        <IconButton>
          <GetAppIcon />
        </IconButton>
      </Tooltip>
      <Tooltip title="מחק אירוע">
        <IconButton onClick={() => onDelete(event._id)}>
          <DeleteIcon />
        </IconButton>
      </Tooltip>
    </DialogActions> */}
      </Dialog>
    )
  )
}

export default EventDialog
