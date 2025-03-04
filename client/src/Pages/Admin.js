//client/src/Pages/Admin.js
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Box, Typography, Paper, Grid, Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Backdrop } from '@mui/material'
import { createTheme, ThemeProvider, useTheme } from '@mui/material/styles'
import dayjs from 'dayjs'
import 'dayjs/locale/he' // לעברית, אם תרצה
import UsersTable from '../Components/AdminComponents/UsersTable'
import EventsTable from '../Components/AdminComponents/EventsTable'
import GiftsTable from '../Components/AdminComponents/GiftsTable'
dayjs.locale('he')

const Admin = () => {
  const theme = useTheme()
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
            animation: 'animateBg 15s ease infinite'
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
              alignItems: 'center',
              padding: { xs: 2, sm: 3 }
            }}
          >
            <Typography
              variant="h3"
              sx={{
                color: '#E0E1DD',
                fontWeight: 'bold',
                mb: 1,
                fontSize: { xs: '1.5rem', sm: '2rem' }
              }}
            >
              מערכת פיקוח ובקרה
            </Typography>
            <Typography
              variant="h5"
              sx={{
                color: '#E0E1DD',
                fontWeight: 'bold',
                mb: 3,
                fontSize: { xs: '1rem', sm: '1.5rem' }
              }}
            >
              מסך ניהול ראשי
            </Typography>
            <Paper
              sx={{
                width: { xs: 280, sm: 500 },
                p: { xs: 2, sm: 3 },
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
                  fontWeight: 'bold',
                  fontSize: { xs: '1rem', sm: '1.2rem' }
                }}
              >
                הכנס קוד גישה:
              </Typography>
              <TextField
                type="password"
                value={passcode}
                onChange={e => setPasscode(e.target.value)}
                sx={{
                  width: '100%',
                  borderRadius: 5,
                  backgroundColor: '#d1ecf1',
                  mt: 1,
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
                    fontSize: { xs: '0.8rem', sm: '1rem' },
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
                  mt: 2,
                  fontSize: { xs: '0.9rem', sm: '1rem' },
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
                variant="h3"
                sx={{
                  mt: { xs: 5, sm: 10 },
                  color: '#E0E1DD',
                  fontWeight: 'bold',
                  mb: 1,
                  fontSize: { xs: '1.8rem', sm: '2.5rem' }
                }}
              >
                מערכת פיקוח ובקרה
              </Typography>
              <Typography
                variant="h5"
                sx={{
                  fontSize: { xs: '1.2rem', sm: '2rem' },
                  color: '#E0E1DD',
                  fontWeight: 'bold',
                  mb: 3
                }}
              >
                מסך ניהול ראשי
              </Typography>
              <Typography variant="h4" sx={{ fontSize: { xs: '1.4rem', sm: '2rem' }, fontWeight: 'bold', color: '#E0E1DD' }}>
                דף אדמין
              </Typography>
              <Typography variant="h6" sx={{ fontSize: { xs: '1rem', sm: '1.5rem' }, fontWeight: 'bold', color: '#E0E1DD' }}>
                ניהול משתמשים, אירועים ומתנות
              </Typography>
            </Box>

            <Grid
              container
              justifyContent="center" // מרכוז
              alignItems="center" // אופציונלי: יישור לאורך הציר האנכי
              sx={{ gap: { xs: 2, sm: 3 } }}
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
