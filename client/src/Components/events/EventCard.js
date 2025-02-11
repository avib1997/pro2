//client/src/Components/events/EventCard.js
import React from 'react'
import { Grid, Card, CardContent, Typography, CardActions, IconButton, Tooltip } from '@mui/material'
import { Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material'

const formatDate = date => {
  if (!date) return 'תאריך לא זמין'
  const formattedDate = new Date(date).toLocaleDateString('he-IL')
  return isNaN(new Date(date)) ? 'תאריך לא חוקי' : formattedDate
}

const EventCard = ({ event, onSelect, onDelete }) => (
  <Grid item xs={12} sm={6} md={4}>
    <Card
      onClick={onSelect}
      sx={{
        cursor: 'pointer',
        borderRadius: '20px',
        transition: '0.3s ease-in-out',
        boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)',
        '&:hover': {
          transform: 'scale(1.05)',
          boxShadow: '0px 6px 15px rgba(0, 0, 0, 0.3)'
        },
        background: 'linear-gradient(135deg, #1B263B, #415A77)',
        color: '#E0E1DD'
      }}
    >
      <CardContent
        sx={{
          alignItems: 'center',
          textAlign: 'center'
        }}
      >
        <Typography
          sx={{
            fontWeight: 'bold',
            color: '#E0E1DD',
            fontSize: '1rem'
          }}
        >
          ה{event.TypeOfEvent} של
        </Typography>
        <Typography
          sx={{
            fontWeight: 'bold',
            color: '#E0E1DD',
            fontSize: '1.5rem'
          }}
        >
          {event.TypeOfEvent !== 'חתונה' ? event.NameOfGroom : `${event.NameOfGroom} ו${event.NameOfBride}`}
        </Typography>
        {/* <Typography variant="h5">{event.TypeOfEvent}</Typography> */}
        {/* <Typography variant="body1">📅 תאריך: {formatDate(event.DateOfEvent)}</Typography> */}
        <Typography variant="body1">📌 מספר אירוע: {event.Event_number}</Typography>
      </CardContent>
      <CardContent
        sx={{
          alignItems: 'center',
          textAlign: 'center',
          justifyContent: 'space-between',
          background: 'rgba(255, 255, 255, 0.1)',
          height: '30px'
        }}
      >
        <Typography
          sx={{
            fontWeight: 'bold',
            color: '#E0E1DD',
            fontSize: '1rem'
          }}
        >
          לפרטים לחץ כאן
        </Typography>
      </CardContent>
      {/* <CardActions sx={{ justifyContent: 'space-between', background: 'rgba(255, 255, 255, 0.1)', height: '35px' }}>
        <Tooltip title="ערוך אירוע">
          <IconButton
            onClick={e => {
              e.stopPropagation()
              onSelect()
            }}
            sx={{ color: '#F0A500' }}
          >
            <EditIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="מחק אירוע">
          <IconButton
            onClick={e => {
              e.stopPropagation()
              onDelete(event._id)
            }}
            sx={{ color: '#E63946' }}
          >
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      </CardActions> */}
    </Card>
  </Grid>
)

export default EventCard
