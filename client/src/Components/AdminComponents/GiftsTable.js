import React from 'react'
import { DataGrid, GridToolbar } from '@mui/x-data-grid'
import { Box, Typography, Paper, IconButton } from '@mui/material'
import Grid from '@mui/material/Grid'
import DeleteIcon from '@mui/icons-material/Delete'
import ExpandCircleDownIcon from '@mui/icons-material/ExpandCircleDown'
import { createTheme } from '@mui/material/styles'
import { useState } from 'react'
import { keyframes } from '@mui/system'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import Button from '@mui/material/Button'
import dayjs from 'dayjs'
import axios from 'axios'
import { useEffect } from 'react'

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

const GiftsTable = () => {
  const [selectedGift, setSelectedGift] = useState(null)
  const [giftDetailsDialogOpen, setGiftDetailsDialogOpen] = useState(false)
  const [users, setUsers] = useState([])
  const [events, setEvents] = useState([])
  const [gifts, setGifts] = useState([])

  useEffect(() => {
    fetchAllData()
  }, [])

  const fetchAllData = async () => {
    try {
      // קריאה לשרת (החלף לכתובות המתאימות שלך)
      const [usersRes, eventsRes, giftsRes] = await Promise.all([
        axios.get('http://localhost:2001/api/users'),
        axios.get('http://localhost:2001/api/events/getAll'), // אירועים
        axios.get('http://localhost:2001/api/gift/getAllGifts') // מתנות
      ])

      setUsers(usersRes.data)
      setEvents(eventsRes.data)
      setGifts(giftsRes.data)
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  const handleViewGiftDetails = gift => {
    setSelectedGift(gift)
    setGiftDetailsDialogOpen(true)
  }

  const handleDeleteGift = async id => {
    if (!window.confirm('למחוק את המתנה?')) return
    try {
      // await axios.delete(`/api/gift/${id}`)
      setGifts(prev => prev.filter(g => g._id !== id))
    } catch (error) {
      console.error('Error deleting gift:', error)
    }
  }

  //      טבלת מתנות
  const giftColumns = [
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
      field: 'more info',
      headerName: 'מידע נוסף',
      width: 200,
      headerAlign: 'center',
      align: 'center',
      renderCell: params => (
        <Box sx={{ display: 'flex', gap: 1 }}>
          <IconButton color="inherit" onClick={() => handleViewGiftDetails(params.row)}>
            פירוט מלא <ExpandCircleDownIcon />
          </IconButton>
        </Box>
      )
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
        {' '}
        {/* --- טבלת מתנות --- */}
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
                fontSize: 46,
                textAlign: 'center'
              }}
            >
              מתנות
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
                rows={gifts}
                getRowId={row => row._id}
                columns={giftColumns}
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

      {/* ============ דיאלוג פרטי מתנה מלאים ============ */}
      <Dialog
        open={giftDetailsDialogOpen}
        onClose={() => setGiftDetailsDialogOpen(false)}
        fullWidth
        maxWidth="md"
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
          פרטים מלאים על המתנה
        </DialogTitle>
        {selectedGift && (
          <DialogContent
            sx={{
              backgroundColor: '#2B384D',
              textAlign: 'center'
            }}
          >
            {/* פרטי מתנה */}
            <Box
              sx={{
                color: '#E0E1DD',
                mb: 3,
                fontSize: '1.1rem',
                padding: '15px'
              }}
            >
              <Typography sx={{ mb: 1 }}>
                <strong>מזהה מתנה:</strong> {selectedGift._id}
              </Typography>
              <Typography sx={{ mb: 1 }}>
                <strong>שם נותן המתנה:</strong> {selectedGift.name}
              </Typography>
              <Typography sx={{ mb: 1 }}>
                <strong>טלפון:</strong> {selectedGift.phone}
              </Typography>
              <Typography sx={{ mb: 1 }}>
                <strong>סכום:</strong> {selectedGift.amount}
              </Typography>
              <Typography sx={{ mb: 1 }}>
                <strong>לאירוע:</strong> {selectedGift.toEventName}
              </Typography>
              <Typography sx={{ mb: 1 }}>
                <strong>תאריך נתינה:</strong> {dayjs(selectedGift.entryDate).format('DD/MM/YYYY HH:mm')}
              </Typography>
              <Typography sx={{ mb: 1 }}>
                <strong>ברכה:</strong> {selectedGift.blessing}
              </Typography>
              <Typography sx={{ mb: 1 }}>
                <strong>מספר משתמש:</strong> {selectedGift.userid_gift}
              </Typography>
              <Typography sx={{ mb: 1 }}>
                <strong>מספר אירוע:</strong> {selectedGift.EventId}
              </Typography>
            </Box>
          </DialogContent>
        )}
        <DialogActions sx={{ backgroundColor: '#1B263B' }}>
          <Button onClick={() => setGiftDetailsDialogOpen(false)} sx={{ color: '#E0E1DD' }}>
            סגור
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default GiftsTable
