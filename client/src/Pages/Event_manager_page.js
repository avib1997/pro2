//client/src/Pages/Event_manager_page.js
import React, { useEffect, useState, useContext } from 'react'
import { Box, Typography, Grid, Button } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import { Context } from '../App'
import axios from 'axios'
import EventCard from '../Components/events/EventCard'
import EventDialog from '../Components/events/EventDialog'
import AddEventDialog from '../Components/events/AddEventDialog' // דיאלוג חדש להוספת אירוע

const EventManager = () => {
  const { userId, IsEvent, setIsEvent } = useContext(Context)
  const [events, setEvents] = useState([])
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [openDialog, setOpenDialog] = useState(false)
  const [openAddEventDialog, setOpenAddEventDialog] = useState(false)

  useEffect(() => {
    axios
      .get('http://localhost:2001/api/events/getAll')
      .then(res => {
        console.log('🎉 אירועים שהתקבלו:', res.data)
        setEvents(res.data.filter(event => event.userid_event === userId))
      })
      .catch(err => console.error('❌ Error fetching events:', err))
  }, [userId, IsEvent])

  const handleEventClick = event => {
    setSelectedEvent(event)
    setOpenDialog(true)
  }

  const handleCloseDialog = () => {
    setOpenDialog(false)
    setSelectedEvent(null)
  }

  const handleDeleteEvent = eventId => {
    axios
      .delete(`http://localhost:2001/api/events/${eventId}`)
      .then(() => setEvents(prevEvents => prevEvents.filter(event => event._id !== eventId)))
      .catch(error => console.error('❌ Error deleting event:', error))
  }

  const handleAddEvent = async newEvent => {
    try {
      // קבלת הנתונים המעודכנים מהשרת אחרי הוספה
      const response = await axios.get('http://localhost:2001/api/events/getAll')
      const updatedEvents = response.data.filter(event => event.userid_event === userId)

      setEvents(updatedEvents) // עדכון ה-state עם הנתונים החדשים
    } catch (error) {
      console.error('❌ Error refreshing events:', error)
    }
  }

  return (
    <Box sx={{ minHeight: '100vh', direction: 'rtl', paddingTop: '120px', background: 'linear-gradient(135deg, #0D1B2A, #1B263B)' }}>
      <Box sx={{ textAlign: 'center', margin: '20px 0', color: '#E0E1DD' }}>
        <Typography variant="h3" sx={{ fontWeight: 'bold', textShadow: '2px 2px #000' }}>
          ניהול האירועים
        </Typography>
        <Typography variant="h6" sx={{ textShadow: '1px 1px #000' }}>
          כל האירועים שלך במקום אחד
        </Typography>
      </Box>

      <Grid container spacing={2} sx={{ padding: '0 20px' }}>
        {events.length === 0 ? (
          <Typography sx={{ textAlign: 'center', color: '#E0E1DD', width: '100%' }}>אין אירועים להצגה</Typography>
        ) : (
          events.map(event => <EventCard key={event._id} event={event} onSelect={() => handleEventClick(event)} onDelete={handleDeleteEvent} />)
        )}

        {/* כפתור הוספת אירוע */}
        <Grid item xs={12} sm={6} md={4}>
          <Button
            onClick={() => setOpenAddEventDialog(true)}
            sx={{
              width: '100%',
              height: '150px',
              background: 'linear-gradient(135deg, #1B263B, #415A77)',
              color: '#E0E1DD',
              borderRadius: '20px',
              boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)',
              transition: '0.3s ease-in-out',
              '&:hover': { transform: 'scale(1.05)', boxShadow: '0px 6px 15px rgba(0, 0, 0, 0.3)' }
            }}
          >
            <AddIcon sx={{ fontSize: 40 }} />
            <Typography variant="h6">הוסף אירוע</Typography>
          </Button>
        </Grid>
      </Grid>

      {selectedEvent && <EventDialog open={openDialog} event={selectedEvent} onClose={handleCloseDialog} onDelete={handleDeleteEvent} />}
      <AddEventDialog open={openAddEventDialog} onClose={() => setOpenAddEventDialog(false)} onAdd={handleAddEvent} />
    </Box>
  )
}

export default EventManager
