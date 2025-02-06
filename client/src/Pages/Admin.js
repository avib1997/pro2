import React, { useEffect, useState } from 'react'
import axios from 'axios'
import {
  Box,
  Typography,
  Paper,
  Grid,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Backdrop,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import { DataGrid, GridToolbar } from '@mui/x-data-grid'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import InfoIcon from '@mui/icons-material/Info'
import ExpandCircleDownIcon from '@mui/icons-material/ExpandCircleDown'
// פורמט לתאריך
import dayjs from 'dayjs'
import 'dayjs/locale/he' // לעברית, אם תרצה
dayjs.locale('he')

export default function Admin() {
  // --------------------------------
  // שלב 1: הוספת סטייט לקוד סודי
  // --------------------------------
  const [passcode, setPasscode] = useState('')
  const [authorized, setAuthorized] = useState(false)

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

  const [showError, setShowError] = useState(false)

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
      width: 320
    },
    {
      field: 'fname',
      headerName: 'שם פרטי',
      width: 120
    },
    {
      field: 'lname',
      headerName: 'שם משפחה',
      width: 150
    },
    {
      field: 'email',
      headerName: 'אימייל',
      width: 250
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
      // מחיקה מקומית (דוגמה)
      setUsers(prev => prev.filter(u => u._id !== id))
    } catch (error) {
      console.error('Error deleting user:', error)
    }
  }

  const handleSaveUser = async () => {
    try {
      // עדכון בשרת
      // await axios.put(`/api/users/${editedUser._id}`, editedUser)

      // עדכון מקומי (דוגמה)
      setUsers(prev => prev.map(u => (u._id === editedUser._id ? editedUser : u)))
      setEditUserDialogOpen(false)
    } catch (error) {
      console.error('Error saving user:', error)
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
      field: '_id',
      headerName: 'מזהה אירוע',
      width: 320
    },
    {
      field: 'NameOfGroom',
      headerName: 'שם החתן',
      width: 180
    },
    {
      field: 'NameOfBride',
      headerName: 'שם הכלה',
      width: 180
    },
    {
      field: 'TypeOfEvent',
      headerName: 'סוג אירוע',
      width: 120
    },
    {
      field: 'DateOfEvent',
      headerName: 'תאריך',
      width: 290
    }
  ]

  // עמודות למתנות של המשתמש
  const userGiftsColumns = [
    {
      field: '_id',
      headerName: 'מזהה מתנה',
      width: 320
    },
    {
      field: 'name',
      headerName: 'שם נותן המתנה',
      width: 180
    },
    {
      field: 'phone',
      headerName: 'טלפון',
      width: 180
    },
    {
      field: 'amount',
      headerName: 'סכום',
      width: 90
    },
    {
      field: 'toEventName',
      headerName: 'לאירוע',
      width: 200
    }
  ]

  // ===============================
  //      טבלת אירועים
  // ===============================
  const eventColumns = [
    {
      field: '_id',
      headerName: 'מזהה אירוע',
      width: 320
    },
    {
      field: 'NameOfGroom',
      headerName: 'שם החתן',
      width: 180
    },
    {
      field: 'NameOfBride',
      headerName: 'שם הכלה',
      width: 180
    },
    {
      field: 'TypeOfEvent',
      headerName: 'סוג אירוע',
      width: 130
    },
    {
      field: 'DateOfEvent',
      headerName: 'תאריך האירוע',
      width: 300
    },
    {
      field: 'actions',
      headerName: 'פעולות',
      width: 120,
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
      setEvents(prev => prev.filter(e => e._id !== id))
    } catch (error) {
      console.error('Error deleting event:', error)
    }
  }

  // כאן מחזירים את המתנות ששייכות לאירוע שנבחר
  const getEventGifts = eventId => {
    // לדוגמה, אם יש בשדה gift.eventid_gift או eventID
    return gifts.filter(g => g.eventid_gift === eventId)
  }

  const eventGiftsColumns = [
    {
      field: '_id',
      headerName: 'מזהה מתנה',
      width: 320
    },
    {
      field: 'name',
      headerName: 'שם נותן המתנה',
      width: 180
    },
    {
      field: 'phone',
      headerName: 'טלפון',
      width: 180
    },
    {
      field: 'amount',
      headerName: 'סכום',
      width: 90
    },
    {
      field: 'toEventName',
      headerName: 'לאירוע',
      width: 200
    }
  ]

  // ===============================
  //      טבלת מתנות
  // ===============================
  const giftColumns = [
    {
      field: '_id',
      headerName: 'מזהה מתנה',
      width: 320
    },
    {
      field: 'name',
      headerName: 'שם נותן המתנה',
      width: 180
    },
    {
      field: 'phone',
      headerName: 'טלפון',
      width: 200
    },
    {
      field: 'amount',
      headerName: 'סכום',
      width: 100
    },
    {
      field: 'toEventName',
      headerName: 'לאירוע',
      width: 200
    },
    {
      field: 'actions',
      headerName: 'פעולות',
      width: 120,
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

  // דוגמה ל־Theme מותאם אישית (אם תרצה להשתמש)
  const theme = createTheme({
    components: {
      MuiDataGrid: {
        styleOverrides: {
          // דוגמה: רקע כותרות
          columnHeaders: {
            backgroundColor: '#1B963B !important',
            color: '#E0E1DD'
          }
        }
      }
    }
  })

  return (
    <Box
      // כיוון מימין לשמאל
      dir="rtl"
      sx={{
        minHeight: '200vh',
        paddingTop: '120px',
        background: 'linear-gradient(135deg, #0D1B2A, #1B263B)',
        color: '#E0E1DD'
      }}
    >
      {/* Backdrop שמחשיך את המסך אם המשתמש עדיין לא הזין קוד נכון */}
      <Backdrop
        open={!authorized} // אם לא מאושר - פתוח
        sx={{
          borderRadius: 5,
          color: '#fff',
          zIndex: theme => theme.zIndex.drawer + 9999
        }}
      >
        <Paper
          sx={{
            width: 500,
            p: 3,
            backgroundColor: '#2B384D',
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            alignItems: 'center',
            borderRadius: 5
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

      {/* רק אם authorized=true נציג את תוכן עמוד האדמין */}
      {authorized && (
        <>
          <Box
            sx={{
              textAlign: 'center',
              mb: 4
            }}
          >
            <Typography variant="h3" sx={{ fontWeight: 'bold' }}>
              דף אדמין
            </Typography>
            <Typography variant="h6">ניהול משתמשים, אירועים ומתנות</Typography>
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
                  borderRadius: 5,
                  color: '#E0E1DD'
                }}
              >
                <Typography
                  variant="h5"
                  sx={{
                    mb: 2,
                    color: '#FAF9F6', // כותרת בהירה
                    fontWeight: 'bold',
                    textAlign: 'center'
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
                    overflowX: 'auto',
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
                  borderRadius: 5,
                  color: '#E0E1DD'
                }}
              >
                <Typography
                  variant="h5"
                  sx={{
                    mb: 2,
                    color: '#FAF9F6',
                    fontWeight: 'bold'
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
                  borderRadius: 5,
                  color: '#E0E1DD'
                }}
              >
                <Typography
                  variant="h5"
                  sx={{
                    mb: 2,
                    color: '#FAF9F6',
                    fontWeight: 'bold'
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
          <Dialog open={editUserDialogOpen} onClose={() => setEditUserDialogOpen(false)} dir="rtl">
            <DialogTitle>עריכת משתמש</DialogTitle>
            <DialogContent
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                backgroundColor: '#2B384D'
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
                  textAlign: 'right',
                  '& .MuiOutlinedInput-root': {
                    color: '#E0E1DD'
                  },
                  '& .MuiInputLabel-root': {
                    color: '#E0E1DD'
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
                  textAlign: 'right',
                  '& .MuiOutlinedInput-root': {
                    color: '#E0E1DD'
                  },
                  '& .MuiInputLabel-root': {
                    color: '#E0E1DD'
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
                  textAlign: 'right',
                  '& .MuiOutlinedInput-root': {
                    color: '#E0E1DD'
                  },
                  '& .MuiInputLabel-root': {
                    color: '#E0E1DD'
                  }
                }}
              />
            </DialogContent>
            <DialogActions sx={{ backgroundColor: '#2B384D' }}>
              <Button
                onClick={() => setEditUserDialogOpen(false)}
                sx={{
                  color: '#E0E1DD'
                }}
              >
                ביטול
              </Button>
              <Button variant="contained" onClick={handleSaveUser}>
                שמור
              </Button>
            </DialogActions>
          </Dialog>

          {/* --- דיאלוג פרטי משתמש מלאים (כרטיסיית מידע) --- */}
          <Dialog
            open={userDetailsDialogOpen}
            onClose={() => setUserDetailsDialogOpen(false)}
            fullWidth
            maxWidth="lg"
            dir="rtl"
            alignContent="center"
            alignItems="center"
            justifyContent="center"
            textAlign="center"
          >
            <DialogTitle
              sx={{
                alignContent: 'center',
                justifyContent: 'center',
                backgroundColor: '#1B263B',
                color: '#FAF9F6'
              }}
            >
              פרטים מלאים על המשתמש
            </DialogTitle>
            {selectedUser && (
              <DialogContent
                sx={{
                  backgroundColor: '#2B384D'
                }}
              >
                {/* פרטי משתמש כלליים */}
                <Box
                  sx={{
                    color: '#E0E1DD',
                    mb: 3,
                    fontSize: '1.1rem'
                  }}
                >
                  <Typography sx={{ mb: 1 }}>
                    <strong>מזהה משתמש:</strong> {selectedUser._id}
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
          <Dialog open={eventDetailsDialogOpen} onClose={() => setEventDetailsDialogOpen(false)} fullWidth maxWidth="lg" dir="rtl">
            <DialogTitle
              sx={{
                backgroundColor: '#1B263B',
                color: '#FAF9F6'
              }}
            >
              פרטים מלאים על האירוע
            </DialogTitle>
            {selectedEvent && (
              <DialogContent
                sx={{
                  backgroundColor: '#2B384D'
                }}
              >
                {/* פרטי אירוע כלליים */}
                <Box
                  sx={{
                    color: '#E0E1DD',
                    mb: 3,
                    fontSize: '1.1rem'
                  }}
                >
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
                    <strong>תאריך:</strong> {selectedEvent.DateOfEvent}
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
          <Dialog open={giftDetailsDialogOpen} onClose={() => setGiftDetailsDialogOpen(false)} fullWidth maxWidth="md" dir="rtl">
            <DialogTitle
              sx={{
                backgroundColor: '#1B263B',
                color: '#FAF9F6'
              }}
            >
              פרטים מלאים על המתנה
            </DialogTitle>
            {selectedGift && (
              <DialogContent
                sx={{
                  backgroundColor: '#2B384D'
                }}
              >
                {/* פרטי מתנה */}
                <Box
                  sx={{
                    color: '#E0E1DD',
                    mb: 3,
                    fontSize: '1.1rem'
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
                  {/* הוסף כאן שדות נוספים אם יש:  */}
                  {/* <Typography sx={{ mb: 1 }}>
                <strong>Another Field:</strong> {selectedGift.someField}
              </Typography> */}
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
  )
}
