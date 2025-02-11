import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Box, Typography, Paper, Grid, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Backdrop } from '@mui/material'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import { DataGrid, GridToolbar } from '@mui/x-data-grid'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import ExpandCircleDownIcon from '@mui/icons-material/ExpandCircleDown'
import dayjs from 'dayjs'
import 'dayjs/locale/he' // לעברית, אם תרצה
import { keyframes } from '@mui/system'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import CloseIcon from '@mui/icons-material/Close'
dayjs.locale('he')

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

const Admin = () => {
  const [canceling, setCanceling] = useState(false)
  const [saving, setSaving] = useState(false) // state למצבים בתהליך שמירה
  const [passcode, setPasscode] = useState('')
  const [authorized, setAuthorized] = useState(false)
  const [showError, setShowError] = useState(false)

  const handleSaveUser = async () => {
    // router.put('/:userId', async (req, res) => {
    //   console.log('(req.body):' + fixHebrewText(' נתוני הבקשה '), req.body)
    //   try {
    //     const updatedUser = await userService.updateUser(req.params.userId, req.body)
    //     console.log('updatedUser in user Routes:', updatedUser)
    //     res.send(updatedUser)
    //   } catch (err) {
    //     res.status(500).send({ error: err.message })
    //   }
    // })
    console.log('(editedUser._id): נתוני המשתמש שנשמרו ', editedUser._id)

    axios
      .put(`http://localhost:2001/api/users/${editedUser._id}`, editedUser)
      .then(res => {
        console.log('User updatedddddddddd:', res.data)
        // עדכון המשתמש ברשימה
        setUsers(prev => prev.map(u => (u._id === editedUser._id ? editedUser : u)))
      })
      .catch(error => console.error('Error updating user:', error))

    setSaving(true) // הפעלת מצב שמירה – תצוגת האנימציה
    // סימולציה של תהליך שמירה (2 שניות)
    setTimeout(() => {
      setSaving(false)
      setEditUserDialogOpen(false) // סוגרים את הדיאלוג לאחר התהליך
    }, 2000)
  }

  const handleCancel = () => {
    setCanceling(true)
    setTimeout(() => {
      setCanceling(false)
      setEditUserDialogOpen(false)
    }, 2000)
  }

  // פונקציה שבודקת אם הקוד נכון
  const handleCheckPasscode = () => {
    // לדוגמה: הקוד הקבוע הוא "1234"
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

  // דיאלוג פרטי משתמש מלאים
  const [userDetailsDialogOpen, setUserDetailsDialogOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)

  // דיאלוג פרטי אירוע מלאים
  const [eventDetailsDialogOpen, setEventDetailsDialogOpen] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState(null)

  // דיאלוג פרטי מתנה מלאים
  const [giftDetailsDialogOpen, setGiftDetailsDialogOpen] = useState(false)
  const [selectedGift, setSelectedGift] = useState(null)

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

  // ===============================
  //      טבלת משתמשים
  // ===============================
  // עמודות טבלת משתמשים
  const userColumns = [
    {
      field: '_id',
      headerName: 'מזהה משתמש',
      width: 200,
      headerAlign: 'center',
      align: 'center'
    },
    {
      field: 'fname',
      headerName: 'שם פרטי',
      width: 120,
      headerAlign: 'center',
      align: 'center'
    },
    {
      field: 'lname',
      headerName: 'שם משפחה',
      width: 150,
      headerAlign: 'center',
      align: 'center'
    },
    {
      field: 'email',
      headerName: 'אימייל',
      width: 230,
      headerAlign: 'center',
      align: 'center'
    },
    {
      field: 'entryDate',
      headerName: 'תאריך הצטרפות',
      width: 200,
      headerAlign: 'center',
      align: 'center',
      renderCell: params => dayjs(params.row.entryDate).format('DD/MM/YYYY HH:mm')
    },
    {
      field: 'actions',
      headerName: 'פעולות',
      width: 180,
      renderCell: params => (
        <Box sx={{ display: 'flex', gap: 1 }}>
          {/* כפתור עריכה */}
          <IconButton color="primary" onClick={() => handleEditUserClick(params.row)}>
            <EditIcon />
          </IconButton>
          {/* כפתור מחיקה */}
          <IconButton color="error" onClick={() => handleDeleteUser(params.row._id)}>
            <DeleteIcon />
          </IconButton>
        </Box>
      )
    },
    {
      field: 'more info',
      headerName: 'מידע נוסף',
      width: 200,
      renderCell: params => (
        <Box sx={{ display: 'flex', gap: 1 }}>
          <IconButton color="inherit" onClick={() => handleViewUserDetails(params.row)}>
            פירוט מלא <ExpandCircleDownIcon />
          </IconButton>
        </Box>
      )
    }
  ]

  const handleEditUserClick = rowData => {
    setEditedUser(rowData)
    setEditUserDialogOpen(true)
  }

  const handleDeleteUser = async id => {
    if (!window.confirm('למחוק את המשתמש?')) return
    try {
      // await axios.delete(`/api/users/${id}`)
      axios.delete(`http://localhost:2001/api/users/${id}`)
      // מחיקה מקומית (דוגמה)
      setUsers(prev => prev.filter(u => u._id !== id))
    } catch (error) {
      console.error('Error deleting user:', error)
    }
  }

  // ===============================
  //      פרטי משתמש מלאים
  // ===============================
  const handleViewUserDetails = user => {
    setSelectedUser(user)
    setUserDetailsDialogOpen(true)
  }

  // נסנן אירועים שנוצרו ע"י המשתמש הנבחר
  const getUserEvents = userId => {
    // אם האירוע מכיל userid_event
    return events.filter(e => e.userid_event === userId)
  }

  // נסנן מתנות של המשתמש הנבחר
  const getUserGifts = userId => {
    // אם המתנה מכילה userid_gift
    return gifts.filter(g => g.userid_gift === userId)
  }

  // עמודות לאירועים של המשתמש
  const userEventsColumns = [
    {
      field: 'Event_number',
      headerName: 'מספר אירוע',
      width: 120,
      headerAlign: 'center',
      align: 'center'
    },
    {
      field: '_id',
      headerName: 'מזהה אירוע',
      width: 200,
      headerAlign: 'center',
      align: 'center'
    },
    {
      field: 'NameOfGroom',
      headerName: 'שם החתן',
      width: 170,
      headerAlign: 'center',
      align: 'center'
    },
    {
      field: 'NameOfBride',
      headerName: 'שם הכלה',
      width: 170,
      headerAlign: 'center',
      align: 'center'
    },
    {
      field: 'TypeOfEvent',
      headerName: 'סוג אירוע',
      width: 100,
      headerAlign: 'center',
      align: 'center'
    },
    {
      field: 'DateOfEvent',
      headerName: 'תאריך',
      width: 200,
      headerAlign: 'center',
      align: 'center',
      renderCell: params => dayjs(params.row.DateOfEvent).format('DD/MM/YYYY HH:mm')
    }
  ]

  // עמודות למתנות של המשתמש
  const userGiftsColumns = [
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
      width: 60,
      headerAlign: 'center',
      align: 'center'
    },
    {
      field: 'toEventName',
      headerName: 'לאירוע',
      width: 210,
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

  // ===============================
  //      טבלת אירועים
  // ===============================
  const eventColumns = [
    {
      field: 'Event_number',
      headerName: 'מספר אירוע',
      width: 150,
      headerAlign: 'center',
      align: 'center'
    },
    {
      field: '_id',
      headerName: 'מזהה אירוע',
      width: 200,
      headerAlign: 'center',
      align: 'center'
    },
    {
      field: 'NameOfGroom',
      headerName: 'שם החתן',
      width: 170,
      headerAlign: 'center',
      align: 'center'
    },
    {
      field: 'NameOfBride',
      headerName: 'שם הכלה',
      width: 170,
      headerAlign: 'center',
      align: 'center'
    },
    {
      field: 'TypeOfEvent',
      headerName: 'סוג אירוע',
      width: 120,
      headerAlign: 'center',
      align: 'center'
    },
    {
      field: 'DateOfEvent',
      headerName: 'תאריך האירוע',
      width: 200,
      headerAlign: 'center',
      align: 'center',
      renderCell: params => dayjs(params.row.DateOfEvent).format('DD/MM/YYYY HH:mm')
    },
    {
      field: 'actions',
      headerName: 'פעולות',
      width: 100,
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

  const handleViewEventDetails = event => {
    setSelectedEvent(event)
    setEventDetailsDialogOpen(true)
  }

  const handleDeleteEvent = async id => {
    if (!window.confirm('למחוק את האירוע?')) return
    try {
      // await axios.delete(`/api/events/${id}`)
      axios.delete(`http://localhost:2001/api/events/${id}`)
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

  // ===============================
  //      טבלת מתנות
  // ===============================
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
      field: 'actions',
      headerName: 'פעולות',
      width: 100,
      headerAlign: 'center',
      align: 'center',
      renderCell: params => (
        <IconButton color="error" onClick={() => handleDeleteGift(params.row._id)}>
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
          <IconButton color="inherit" onClick={() => handleViewGiftDetails(params.row)}>
            פירוט מלא <ExpandCircleDownIcon />
          </IconButton>
        </Box>
      )
    }
  ]
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
        {/* רקע עם אנימציה זזה */}
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
        {/* Backdrop שמחשיך את המסך אם המשתמש עדיין לא הזין קוד נכון */}
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
                    //backgroundColor: '#f8d7da',
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
                  // backgroundColor: '#0c5460',
                  // color: '#E0E1DD'
                }}
              >
                אישור
              </Button>
            </Paper>
          </Backdrop>
        )}
        {/* רק אם authorized=true נציג את תוכן עמוד האדמין */}
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
              spacing={3}
              sx={{ px: 3, width: '100%' }}
            >
              {/* --- טבלת משתמשים --- */}
              <Grid item lg={10}>
                <Paper
                  sx={{
                    alignContent: 'center',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlign: 'center',
                    maxWidth: '100%',
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
                      color: '#FAF9F6', // כותרת בהירה
                      fontWeight: 'bold',
                      textAlign: 'center',
                      fontSize: 46
                    }}
                  >
                    משתמשים
                  </Typography>
                  {/* <ThemeProvider theme={theme}>
              <Box sx={{ height: 500 }}>
                <DataGrid
                  rows={users}
                  columns={userColumns}
                  pageSize={5}
                  rowsPerPageOptions={[5, 10, 20]}
                />
              </Box>
            </ThemeProvider> */}
                  {/* <ThemeProvider theme={theme}> */}
                  <Box
                    sx={{
                      height: 500,
                      // overflowX: 'auto',
                      '& .MuiDataGrid-root': {
                        direction: 'rtl'
                      }
                    }}
                  >
                    <DataGrid
                      rows={users}
                      getRowId={row => row._id}
                      columns={userColumns}
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
                        },
                        '& .MuiDataGrid-virtualScroller': {
                          scrollbarWidth: 'none',
                          '-ms-overflow-style': 'none',
                          '&::-webkit-scrollbar': {
                            display: 'none'
                          }
                        }
                      }}
                    />
                  </Box>
                  {/* </ThemeProvider> */}
                </Paper>
              </Grid>

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

            {/* --- דיאלוג עריכת משתמש --- */}
            <Dialog
              open={editUserDialogOpen}
              onClose={() => setEditUserDialogOpen(false)}
              dir="rtl"
              PaperProps={{
                sx: {
                  borderRadius: '25px',
                  backgroundColor: '#2B384D',
                  width: 600,
                  height: 800,
                  padding: 2,
                  color: '#E0E1DD'
                }
              }}
            >
              <DialogTitle sx={{ textAlign: 'center', fontSize: 40 }}>עריכת משתמש</DialogTitle>
              {saving || canceling ? (
                <Box
                  sx={{
                    height: '100%',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    animation: `${fadeIn} 0.5s ease-in-out`
                  }}
                >
                  {saving ? (
                    <CheckCircleIcon
                      sx={{
                        fontSize: 100,
                        color: 'green',
                        animation: `${pop} 0.5s ease`
                      }}
                    />
                  ) : (
                    <CloseIcon
                      sx={{
                        fontSize: 100,
                        color: 'red',
                        animation: `${pop} 0.5s ease`
                      }}
                    />
                  )}
                </Box>
              ) : (
                <>
                  <DialogContent
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 2,
                      backgroundColor: '#1B263B',
                      borderRadius: '25px',
                      color: '#E0E1DD'
                    }}
                  >
                    <TextField
                      label="שם פרטי"
                      value={editedUser.fname || ''}
                      onChange={e =>
                        setEditedUser({
                          ...editedUser,
                          fname: e.target.value
                        })
                      }
                      inputProps={{
                        style: { textAlign: 'right' }
                      }}
                      sx={{
                        borderRadius: 5,
                        backgroundColor: '#2B384D',
                        mt: 4,
                        textAlign: 'right',
                        '& .MuiOutlinedInput-root': {
                          color: '#E0E1DD',
                          borderRadius: 5,
                          '&:hover fieldset': {
                            borderColor: 'lightskyblue'
                          }
                        },
                        '& .MuiInputLabel-root': {
                          color: '#E0E1DD',
                          borderRadius: 5
                        }
                      }}
                    />
                    <TextField
                      label="שם משפחה"
                      value={editedUser.lname || ''}
                      onChange={e =>
                        setEditedUser({
                          ...editedUser,
                          lname: e.target.value
                        })
                      }
                      inputProps={{
                        style: { textAlign: 'right' }
                      }}
                      sx={{
                        borderRadius: 5,
                        backgroundColor: '#2B384D',
                        mt: 4,
                        textAlign: 'right',
                        '& .MuiOutlinedInput-root': {
                          color: '#E0E1DD',
                          borderRadius: 5,
                          '&:hover fieldset': {
                            borderColor: 'lightskyblue'
                          }
                        },
                        '& .MuiInputLabel-root': {
                          color: '#E0E1DD',
                          borderRadius: 5
                        }
                      }}
                    />
                    <TextField
                      label="אימייל"
                      value={editedUser.email || ''}
                      onChange={e =>
                        setEditedUser({
                          ...editedUser,
                          email: e.target.value
                        })
                      }
                      inputProps={{
                        style: { textAlign: 'right' }
                      }}
                      sx={{
                        borderRadius: 5,
                        backgroundColor: '#2B384D',
                        mt: 4,
                        textAlign: 'right',
                        '& .MuiOutlinedInput-root': {
                          color: '#E0E1DD',
                          borderRadius: 5,
                          '&:hover fieldset': {
                            borderColor: 'lightskyblue'
                          }
                        },
                        '& .MuiInputLabel-root': {
                          color: '#E0E1DD',
                          borderRadius: 5
                        }
                      }}
                    />
                    <TextField
                      label="סיסמה"
                      value={editedUser.password || ''}
                      onChange={e =>
                        setEditedUser({
                          ...editedUser,
                          password: e.target.value
                        })
                      }
                      inputProps={{
                        style: { textAlign: 'right' }
                      }}
                      sx={{
                        borderRadius: 5,
                        backgroundColor: '#2B384D',
                        mt: 4,
                        textAlign: 'right',
                        '& .MuiOutlinedInput-root': {
                          color: '#E0E1DD',
                          borderRadius: 5,
                          '&:hover fieldset': {
                            borderColor: 'lightskyblue'
                          }
                        },
                        '& .MuiInputLabel-root': {
                          color: '#E0E1DD',
                          borderRadius: 5
                        }
                      }}
                    />
                    <TextField
                      label="מנהל?"
                      value={editedUser.isManeger || ''}
                      onChange={e =>
                        setEditedUser({
                          ...editedUser,
                          isManeger: e.target.value
                        })
                      }
                      inputProps={{
                        style: { textAlign: 'right' }
                      }}
                      sx={{
                        borderRadius: 5,
                        backgroundColor: '#2B384D',
                        mt: 4,
                        textAlign: 'right',
                        '& .MuiOutlinedInput-root': {
                          color: '#E0E1DD',
                          borderRadius: 5,
                          '&:hover fieldset': {
                            borderColor: 'lightskyblue'
                          }
                        },
                        '& .MuiInputLabel-root': {
                          color: '#E0E1DD',
                          borderRadius: 5
                        }
                      }}
                    />
                  </DialogContent>
                  <DialogActions
                    sx={{
                      //backgroundColor: 'rgba(43,59,61,1)', // רקע דיאלוג: RGBA של #2B384D
                      display: 'flex',
                      justifyContent: 'center',
                      gap: 2,
                      margin: '10px 0'
                    }}
                  >
                    <Button
                      variant="contained"
                      onClick={handleCancel}
                      sx={{
                        borderRadius: 5,
                        margin: '0 15px',
                        fontWeight: 'bold',
                        fontSize: '1.1rem',
                        backgroundColor: 'rgba(87,96,111,1)', // צבע ביטול: RGBA של #57606F
                        color: '#E0E1DD',
                        padding: '10px 20px',
                        transition: 'background-color 0.3s ease, transform 0.2s ease, box-shadow 0.2s ease',
                        boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
                        '&:hover': {
                          backgroundColor: 'rgba(72,81,92,1)', // גוון כהה יותר בעת ה-hover (RGBA של #48515C)
                          transform: 'translateY(-2px)',
                          boxShadow: '0px 6px 8px rgba(0, 0, 0, 0.15)'
                        },
                        '&:active': {
                          animation: `${pulse} 0.5s ease-in-out`
                        }
                      }}
                    >
                      ביטול
                    </Button>
                    <Button
                      variant="contained"
                      onClick={handleSaveUser}
                      sx={{
                        borderRadius: 5,
                        fontWeight: 'bold',
                        fontSize: '1.1rem',
                        backgroundColor: 'rgb(0, 139, 63)', // ירוק טבעי: RGBA של MediumSeaGreen (#3CB371)
                        color: '#E0E1DD',
                        padding: '10px 20px',
                        transition: 'background-color 0.3s ease, transform 0.2s ease, box-shadow 0.2s ease',
                        boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
                        '&:hover': {
                          backgroundColor: 'rgb(0, 113, 51)', // גוון כהה יותר בעת ה-hover
                          transform: 'translateY(-2px)',
                          boxShadow: '0px 6px 8px rgba(0, 0, 0, 0.15)'
                        }
                      }}
                    >
                      שמור
                    </Button>
                  </DialogActions>
                </>
              )}
            </Dialog>

            {/* --- דיאלוג פרטי משתמש מלאים (כרטיסיית מידע) --- */}
            <Dialog
              open={userDetailsDialogOpen}
              onClose={() => setUserDetailsDialogOpen(false)}
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
                  alignContent: 'center',
                  justifyContent: 'center',
                  backgroundColor: '#1B263B',
                  color: '#FAF9F6',
                  textAlign: 'center'
                }}
              >
                פרטים מלאים על המשתמש
              </DialogTitle>
              {selectedUser && (
                <DialogContent
                  sx={{
                    backgroundColor: '#2B384D',
                    textAlign: 'center'
                  }}
                >
                  {/* פרטי משתמש כלליים */}
                  <Box
                    sx={{
                      color: '#E0E1DD',
                      mb: 3,
                      fontSize: '1.1rem',
                      padding: '15px'
                    }}
                  >
                    <Typography sx={{ mb: 1 }}>
                      <strong>מזהה משתמש: </strong> {selectedUser._id}
                    </Typography>
                    <Typography sx={{ mb: 1 }}>
                      <strong>שם מלא:</strong> {selectedUser.fname} {selectedUser.lname}
                    </Typography>
                    <Typography sx={{ mb: 1 }}>
                      <strong>אימייל:</strong> {selectedUser.email}
                    </Typography>
                    <Typography sx={{ mb: 1 }}>
                      <strong>סיסמה (מצופה שיהיה מוצפן):</strong> {selectedUser.password || 'לא קיים בשדה'}
                    </Typography>
                    <Typography sx={{ mb: 1 }}>
                      <strong>מנהל?</strong> {selectedUser.isManeger ? 'כן' : 'לא'}
                    </Typography>
                    <Typography sx={{ mb: 1 }}>
                      <strong>תאריך הצטרפות:</strong> {selectedUser.entryDate ? dayjs(selectedUser.entryDate).format('DD/MM/YYYY HH:mm') : 'לא קיים'}
                    </Typography>
                  </Box>

                  {/* טבלת אירועים של המשתמש */}
                  <Typography
                    variant="h6"
                    sx={{
                      color: '#FAF9F6',
                      mb: 1
                    }}
                  >
                    האירועים של המשתמש
                  </Typography>
                  <Box
                    sx={{
                      height: 250,
                      mb: 3,
                      '& .MuiDataGrid-root': {
                        direction: 'rtl',
                        backgroundColor: '#3E4C5E'
                      }
                    }}
                  >
                    <DataGrid
                      rows={getUserEvents(selectedUser._id)}
                      getRowId={row => row._id}
                      columns={userEventsColumns}
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

                  {/* טבלת מתנות של המשתמש */}
                  <Typography
                    variant="h6"
                    sx={{
                      color: '#FAF9F6',
                      mb: 1
                    }}
                  >
                    המתנות של המשתמש
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
                      rows={getUserGifts(selectedUser._id)}
                      getRowId={row => row._id}
                      columns={userGiftsColumns}
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
                <Button onClick={() => setUserDetailsDialogOpen(false)} sx={{ color: '#E0E1DD' }}>
                  סגור
                </Button>
              </DialogActions>
            </Dialog>
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
        )}
      </Box>
    </ThemeProvider>
  )
}

export default Admin
