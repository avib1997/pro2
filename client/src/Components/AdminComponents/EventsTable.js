import React, { useState, useEffect } from 'react'
import { DataGrid, GridToolbar } from '@mui/x-data-grid'
import { Box, Typography, Paper, IconButton, Grid, Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import { keyframes } from '@emotion/react'
import { createTheme } from '@mui/material/styles'
import ExpandCircleDownIcon from '@mui/icons-material/ExpandCircleDown'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import CloseIcon from '@mui/icons-material/Close'
import axios from 'axios'
import dayjs from 'dayjs'

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`

const pop = keyframes`
  0% { transform: scale(0); }
  60% { transform: scale(1.2); }
  100% { transform: scale(1); }
`

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.03); }
  100% { transform: scale(1); }
`

const EventsTable = () => {
  const [events, setEvents] = useState([])
  const [gifts, setGifts] = useState([])
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [eventDetailsDialogOpen, setEventDetailsDialogOpen] = useState(false)
  const [users, setUsers] = useState([])
  const [selectedGift, setSelectedGift] = useState(null)
  const [giftDetailsDialogOpen, setGiftDetailsDialogOpen] = useState(false)

  useEffect(() => {
    fetchAllData()
  }, [])

  const fetchAllData = async () => {
    try {
      // קריאה לשרת (החלף לכתובות המתאימות שלך)
      const [usersRes, eventsRes, giftsRes] = await Promise.all([
        axios.get('https://easygift-server.onrender.com/api/users'),
        axios.get('https://easygift-server.onrender.com/api/events/getAll'), // אירועים
        axios.get('https://easygift-server.onrender.com/api/gift/getAllGifts') // מתנות
      ])

      setUsers(usersRes.data)
      setEvents(eventsRes.data)
      setGifts(giftsRes.data)
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  const handleViewEventDetails = event => {
    setSelectedEvent(event)
    setEventDetailsDialogOpen(true)
  }

  const handleDeleteEvent = async id => {
    if (!window.confirm('למחוק את האירוע?')) return
    try {
      // await axios.delete(`/api/events/${id}`)
      axios.delete(`https://easygift-server.onrender.com/api/events/${id}`)
      setEvents(prev => prev.filter(e => e._id !== id))
    } catch (error) {
      console.error('Error deleting event:', error)
    }
  }

  // כאן מחזירים את המתנות ששייכות לאירוע שנבחר
  // const getEventGifts = eventId => {
  //   // לדוגמה, אם יש בשדה gift.eventid_gift או eventID
  //   return gifts.filter(g => g.eventID === eventId)
  // }

  const getEventGifts = eventId => {
    console.log('eventId =', eventId)
    console.log('gifts =', gifts)

    const filtered = gifts.filter(g => g.EventId === eventId)
    console.log('filtered gifts =', filtered)

    return filtered
  }

  //      טבלת אירועים
  const eventColumns = [
    {
      field: 'Event_number',
      headerName: 'מספר אירוע',
      // width: 150,
      flex: 1.5,
      headerAlign: 'center',
      align: 'center'
    },
    {
      field: '_id',
      headerName: 'מזהה אירוע',
      // width: 200,
      flex: 2,
      headerAlign: 'center',
      align: 'center'
    },
    {
      field: 'NameOfGroom',
      headerName: 'שם החתן',
      // width: 170,
      flex: 1.7,
      headerAlign: 'center',
      align: 'center'
    },
    {
      field: 'NameOfBride',
      headerName: 'שם הכלה',
      // width: 170,
      flex: 1.7,
      headerAlign: 'center',
      align: 'center'
    },
    {
      field: 'TypeOfEvent',
      headerName: 'סוג אירוע',
      // width: 120,
      flex: 1.2,
      headerAlign: 'center',
      align: 'center'
    },
    {
      field: 'DateOfEvent',
      headerName: 'תאריך האירוע',
      // width: 200, 
      flex: 2,
      headerAlign: 'center',
      align: 'center',
      renderCell: params => dayjs(params.row.DateOfEvent).format('DD/MM/YYYY HH:mm')
    },
    {
      field: 'actions',
      headerName: 'פעולות',
      // width: 100,
      flex: 1,
      headerAlign: 'center',
      align: 'center',
      renderCell: params => (
        <IconButton color="error" onClick={() => handleDeleteEvent(params.row._id)}>
          <DeleteIcon />
        </IconButton>
      )
    },
    {
      field: 'more info',
      headerName: 'מידע נוסף',
      width: 200,
      headerAlign: 'center',
      align: 'center',
      renderCell: params => (
        <Box sx={{ display: 'flex', gap: 1 }}>
          <IconButton color="inherit" onClick={() => handleViewEventDetails(params.row)}>
            פירוט מלא <ExpandCircleDownIcon />
          </IconButton>
        </Box>
      )
    }
  ]

  const eventGiftsColumns = [
    {
      field: '_id',
      headerName: 'מזהה מתנה',
      width: 200,
      headerAlign: 'center',
      align: 'center'
    },
    {
      field: 'name',
      headerName: 'שם נותן המתנה',
      width: 170,
      headerAlign: 'center',
      align: 'center'
    },
    {
      field: 'phone',
      headerName: 'טלפון',
      width: 170,
      headerAlign: 'center',
      align: 'center'
    },
    {
      field: 'amount',
      headerName: 'סכום',
      width: 70,
      headerAlign: 'center',
      align: 'center'
    },
    {
      field: 'toEventName',
      headerName: 'לאירוע',
      width: 200,
      headerAlign: 'center',
      align: 'center'
    },
    {
      field: 'entryDate',
      headerName: 'תאריך נתינה',
      width: 200,
      headerAlign: 'center',
      align: 'center',
      renderCell: params => dayjs(params.row.entryDate).format('DD/MM/YYYY HH:mm')
    }
  ]

  const adminTheme = createTheme({
    typography: {
      fontFamily: 'Miriam Libre, serif',
      h1: { fontWeight: 700 },
      h2: { fontWeight: 700 },
      h3: { fontWeight: 700 },
      // תוכל לעדכן גם עבור טקסט רגיל:
      body1: { fontWeight: 400 }, // רגיל
      body2: { fontWeight: 400 }
    }
  })

  return (
    <>
      <Grid
        container
        justifyContent="center" // מרכוז
        alignItems="center" // אופציונלי: יישור לאורך הציר האנכי
        spacing={3}
        sx={{ px: 3, width: '100%' }}
      >
        {/* --- טבלת אירועים --- */}
        <Grid item lg={10}>
          <Paper
            sx={{
              p: 2,
              backgroundColor: '#2B384D',
              direction: 'rtl',
              borderRadius: '25px',
              color: '#E0E1DD'
            }}
          >
            <Typography
              variant="h5"
              sx={{
                mb: 2,
                color: '#FAF9F6',
                fontWeight: 'bold',
                textAlign: 'center',
                fontSize: 46
              }}
            >
              אירועים
            </Typography>
            <Box
              sx={{
                height: 500,
                overflowX: 'auto',
                '& .MuiDataGrid-root': {
                  direction: 'rtl'
                }
              }}
            >
              <DataGrid
                rows={events}
                getRowId={row => row._id}
                columns={eventColumns}
                pageSize={5}
                rowsPerPageOptions={[5, 10, 20]}
                components={{
                  Toolbar: GridToolbar
                }}
                sx={{
                  '& .MuiTablePagination-root': {
                    color: 'white'
                  },
                  scrollbarWidth: 'none',
                  '-ms-overflow-style': 'none',
                  '&::-webkit-scrollbar': {
                    display: 'none'
                  },
                  '& .MuiDataGrid-virtualScroller': {
                    scrollbarWidth: 'none',
                    '-ms-overflow-style': 'none',
                    '&::-webkit-scrollbar': {
                      display: 'none'
                    }
                  },
                  borderRadius: 5,
                  color: '#E0E1DD',
                  backgroundColor: '#0D1B2A',
                  // כותרת טבלה
                  '& .MuiDataGrid-columnHeaders': {
                    backgroundColor: '#1B263B'
                  },
                  '& .MuiDataGrid-columnHeaderTitle': {
                    color: '#1B263B',
                    fontWeight: 'bold',
                    fontSize: 26
                  }
                }}
              />
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* ============ דיאלוג פרטי אירוע מלאים ============ */}
      <Dialog
        open={eventDetailsDialogOpen}
        onClose={() => setEventDetailsDialogOpen(false)}
        fullWidth
        maxWidth="lg"
        dir="rtl"
        PaperProps={{
          sx: {
            borderRadius: '25px' // ערך מותאם אישית
          }
        }}
      >
        <DialogTitle
          sx={{
            backgroundColor: '#1B263B',
            color: '#FAF9F6',
            textAlign: 'center'
          }}
        >
          פרטים מלאים על האירוע
        </DialogTitle>
        {selectedEvent && (
          <DialogContent
            sx={{
              backgroundColor: '#2B384D',
              textAlign: 'center'
            }}
          >
            {/* פרטי אירוע כלליים */}
            <Box
              sx={{
                color: '#E0E1DD',
                mb: 3,
                fontSize: '1.1rem',
                padding: '15px'
              }}
            >
              <Typography sx={{ mb: 1 }}>
                <strong>מספר אירוע:</strong> {selectedEvent.Event_number}
              </Typography>
              <Typography sx={{ mb: 1 }}>
                <strong>מזהה אירוע:</strong> {selectedEvent._id}
              </Typography>
              <Typography sx={{ mb: 1 }}>
                <strong>שם החתן:</strong> {selectedEvent.NameOfGroom}
              </Typography>
              <Typography sx={{ mb: 1 }}>
                <strong>שם הכלה:</strong> {selectedEvent.NameOfBride}
              </Typography>
              <Typography sx={{ mb: 1 }}>
                <strong>סוג אירוע:</strong> {selectedEvent.TypeOfEvent}
              </Typography>
              <Typography sx={{ mb: 1 }}>
                <strong>תאריך:</strong> {dayjs(selectedEvent.DateOfEvent).format('DD/MM/YYYY HH:mm')}
              </Typography>
            </Box>

            {/* טבלת מתנות של האירוע */}
            <Typography variant="h6" sx={{ color: '#FAF9F6', mb: 1 }}>
              המתנות באירוע
            </Typography>
            <Box
              sx={{
                height: 250,
                '& .MuiDataGrid-root': {
                  direction: 'rtl',
                  backgroundColor: '#3E4C5E'
                }
              }}
            >
              <DataGrid
                rows={getEventGifts(selectedEvent._id)}
                getRowId={row => row._id}
                columns={eventGiftsColumns}
                pageSize={3}
                rowsPerPageOptions={[3, 5]}
                components={{
                  Toolbar: GridToolbar
                }}
                sx={{
                  '& .MuiTablePagination-root': {
                    color: 'white'
                  },
                  scrollbarWidth: 'none',
                  '-ms-overflow-style': 'none',
                  '&::-webkit-scrollbar': {
                    display: 'none'
                  },
                  '& .MuiDataGrid-virtualScroller': {
                    scrollbarWidth: 'none',
                    '-ms-overflow-style': 'none',
                    '&::-webkit-scrollbar': {
                      display: 'none'
                    }
                  },
                  color: '#E0E1DD',
                  '& .MuiDataGrid-columnHeaders': {
                    backgroundColor: '#1B263B',
                    color: '#E0E1DD'
                  }
                }}
              />
            </Box>
          </DialogContent>
        )}
        <DialogActions sx={{ backgroundColor: '#1B263B' }}>
          <Button onClick={() => setEventDetailsDialogOpen(false)} sx={{ color: '#E0E1DD' }}>
            סגור
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default EventsTable
