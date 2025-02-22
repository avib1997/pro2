//client/src/Pages/Admin.js
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Box, Typography, Paper, Grid, Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Backdrop } from '@mui/material'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import dayjs from 'dayjs'
import 'dayjs/locale/he' // לעברית, אם תרצה
import UsersTable from '../Components/AdminComponents/UsersTable'
import EventsTable from '../Components/AdminComponents/EventsTable'
import GiftsTable from '../Components/AdminComponents/GiftsTable'
dayjs.locale('he')

const Admin = () => {
  const [passcode, setPasscode] = useState('')
  const [authorized, setAuthorized] = useState(false)
  const [showError, setShowError] = useState(false)

  const handleCheckPasscode = () => {
    if (passcode === '1234') {
      setAuthorized(true)
    } else {
      setShowError(true)
    }
  }

  const [users, setUsers] = useState([])
  const [events, setEvents] = useState([])
  const [gifts, setGifts] = useState([])
  const [alerts, setAlerts] = useState([]) // אם תרצה התראות

  // דיאלוג עריכת משתמש
  const [editUserDialogOpen, setEditUserDialogOpen] = useState(false)
  const [editedUser, setEditedUser] = useState({})

  useEffect(() => {
    fetchAllData()
  }, [])

  const fetchAllData = async () => {
    try {
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
    <ThemeProvider theme={adminTheme}>
      <Box
        sx={{
          fontFamily: 'Miriam Libre, serif',
          position: 'relative',
          minHeight: '100vh',
          direction: 'rtl',
          paddingTop: '1px' // התאמה לבר ניווט קבוע
        }}
      >
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            right: 0,
            width: '100%',
            height: '100%',
            zIndex: -1,
            background: 'linear-gradient(135deg, #0D1B2A, #1B263B)',
            backgroundSize: '400% 400%',
            animation: 'animateBg 15s ease infinite',
          }}
        />

        {!authorized && (
          <Backdrop
            open={!authorized} // אם לא מאושר - פתוח
            sx={{
              borderRadius: 5,
              color: '#fff',
              zIndex: theme => theme.zIndex.drawer + 9999,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            <Typography
              variant="h2"
              sx={{
                color: '#E0E1DD',
                fontWeight: 'bold',
                mb: 1
              }}
            >
              מערכת פיקוח ובקרה
            </Typography>
            <Typography
              variant="h4"
              sx={{
                color: '#E0E1DD',
                fontWeight: 'bold',
                mb: 3
              }}
            >
              מסך ניהול ראשי
            </Typography>
            <Paper
              sx={{
                width: 500,
                p: 3,
                backgroundColor: '#2B384D',
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                alignItems: 'center',
                borderRadius: '25px'
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  color: '#E0E1DD',
                  fontWeight: 'bold'
                }}
              >
                הכנס קוד גישה:
              </Typography>
              <TextField
                type="password"
                value={passcode}
                onChange={e => setPasscode(e.target.value)}
                sx={{
                  borderRadius: 5,
                  backgroundColor: '#d1ecf1',
                  '& .MuiOutlinedInput-root': {
                    color: '#0c5460',
                    borderRadius: 5
                  },
                  '& .MuiInputLabel-root': {
                    borderRadius: 5,
                    color: '#0c5460'
                  }
                }}
              />
              {showError && (
                <Box
                  sx={{
                    mb: 1,
                    color: '#FF0000',
                    fontSize: '1rem',
                    fontWeight: 'bold',
                    p: 1,
                    borderRadius: 1,
                    textAlign: 'center' // מרכז את הטקסט אופקית
                  }}
                >
                  <div>שגיאה:</div>
                  <div>אין לך הרשאות לביצוע הפעולה</div>
                </Box>
              )}
              <Button
                variant="contained"
                onClick={handleCheckPasscode}
                sx={{
                  borderRadius: 5
                }}
              >
                אישור
              </Button>
            </Paper>
          </Backdrop>
        )}

        {authorized && (
          <>
            <Box
              sx={{
                textAlign: 'center',
                mb: 4
              }}
            >
              <Typography
                variant="h2"
                sx={{
                  mt: 10,
                  color: '#E0E1DD',
                  fontWeight: 'bold',
                  mb: 1
                }}
              >
                מערכת פיקוח ובקרה
              </Typography>
              <Typography
                variant="h4"
                sx={{
                  color: '#E0E1DD',
                  fontWeight: 'bold',
                  mb: 3
                }}
              >
                מסך ניהול ראשי
              </Typography>
              <Typography variant="h3" sx={{ fontWeight: 'bold', color: '#E0E1DD' }}>
                דף אדמין
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#E0E1DD' }}>
                ניהול משתמשים, אירועים ומתנות
              </Typography>
            </Box>

            <Grid
              container
              justifyContent="center" // מרכוז
              alignItems="center" // אופציונלי: יישור לאורך הציר האנכי
              sx={{ gap: 3 }}
            >
              <UsersTable />
              <EventsTable />
              <GiftsTable />
            </Grid>
          </>
        )}
      </Box>
    </ThemeProvider>
  )
}

export default Admin
