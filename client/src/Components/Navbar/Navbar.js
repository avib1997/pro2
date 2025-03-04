//client/src/Components/Navbar/Navbar.js
import React, { useContext, useState, useEffect } from 'react'
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  MenuItem,
  Container,
  Button,
  Tooltip,
  Divider,
  Select,
  FormControl,
  InputLabel,
  InputAdornment,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField
} from '@mui/material'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import CardGiftcardIcon from '@mui/icons-material/CardGiftcard'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Context } from '../../App'
import axios from 'axios'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import CloseIcon from '@mui/icons-material/Close'
import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'
import MenuIcon from '@mui/icons-material/Menu' // אייקון המבורגר
import ModernLogo from './ModernLogo.jsx' // או הנתיב הנכון לפי מיקום הקובץ
import ModernColorfulUserIcon from './ModernColorfulUserIcon.jsx' // או הנתיב הנכון לפי מיקום הקובץ
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew' // 🔹 ייבוא האייקון

const menuBgColor = '#2B3A47' // רקע תפריט אווטאר

const pagesGuest = [
  { name: 'מתנה', path: '/Details_page' },
  { name: 'ברכות', path: '/Blessing' },
  { name: 'שאלות ותשובות', path: '/Fqa' },
  { name: 'התחברות ורישום', path: '/LoginPage' }
]

const pagesRegistered = [
  { name: 'מתנה', path: '/Details_page' },
  { name: 'ברכות', path: '/Blessing' },
  { name: 'היסטוריה', path: '/History' },
  { name: 'שאלות ותשובות', path: '/Fqa' }
]

const pagesManager = [
  { name: 'מתנה', path: '/Details_page' },
  { name: 'ברכות', path: '/Blessing' },
  { name: 'היסטוריה', path: '/History' },
  { name: 'שאלות ותשובות', path: '/Fqa' },
  {
    name: 'ניהול אירועים',
    path: '/EventManager'
  }
]

function Navbar() {
  const { event, setEvent, eventName, setEventName, isManager, userId, eventNumber, setEventNumber, userName, setUserName, userEmail, setUserId, setUserEmail, setIsManager } = useContext(Context)
  const [editUserDialogOpen, setEditUserDialogOpen] = useState(false)
  const [editedUser, setEditedUser] = useState({ fname: '', lname: '', email: '', password: '', isManager: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [userRank, setUserRank] = useState('אורח')
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false)
  const [eventNum, setEventNum] = useState('')
  const [anchorUser, setAnchorUser] = useState(null)
  const [errorMessage, setErrorMessage] = useState('') // הודעת שגיאה
  const [anchorElNav, setAnchorElNav] = useState(null)
  const [eventDialogOpen, setEventDialogOpen] = useState(false);



  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    const eventType = event.TypeOfEvent || "אירוע";
    setEventName(event.NameOfBride
    ? `${eventType} של ${event.NameOfGroom} ו${event.NameOfBride}`
    : `${eventType} של ${event.NameOfGroom}`);
    // הגדרת הדרגה
    setUserRank(isManager ? 'מנהל אירוע' : userId ? 'משתמש רשום' : 'אורח')
    console.log('📌 מצב נוכחי:')
    console.log('userId:', userId)
    console.log('eventNumber:', eventNumber)
    console.log('isManager:', isManager)
  }, [isManager, userId, eventNumber, userName, userEmail])

  const navigationPages = userId === '' ? pagesGuest : isManager ? pagesManager : pagesRegistered

  const handleNewEventNumber = () => {
    if (!eventNum || eventNum.trim() === '') {
      setEventNum('')
      setErrorMessage('❌ אנא הכנס מספר אירוע תקין')
      return
    }
    if (!eventNum || !/^[0-9]+$/.test(eventNum)) {  // בדיקה אם זה רק מספרים
      setEventNum("");
      setErrorMessage("❌ מספר האירוע חייב להכיל רק ספרות");
      return;
    }

    axios
      .post(`https://easygift-server.onrender.com/api/events/checkEventNumber`, { Event_number: eventNum })
      .then(response => {
        console.log('✅ תגובה מהשרת:', response.data)
        if (response.data && response.data._id) {
          setEvent(response.data) // שמירת האירוע ב־Context
          setEventNumber(eventNum) // שמירת מספר האירוע ב־Context
          setEventNum('') // איפוס הקלט
          setEventDialogOpen(false) // סגירת הדיאלוג
          setErrorMessage('') // איפוס הודעת השגיאה
        } else {
          setEventNum('')
          console.log('❌ מספר האירוע לא נמצא')
          setErrorMessage('אירוע לא נמצא')
        }
      })
      .catch(error => {
        console.error('❌ שגיאה בבדיקת מספר האירוע:', error)
        setErrorMessage('❌ שגיאה בחיבור לשרת, נסה שוב מאוחר יותר.')
      })
  }

  const handleCloseEventDialog = () => {
    setEventDialogOpen(false)
    setEventNum('')
    setErrorMessage('')
  }

  const handleOpenEditUserDialog = () => {
    setShowPassword(false)
    setAnchorUser(null) // נסגור את תפריט המשתמש קודם
    setEditUserDialogOpen(true) // פותחים את הדיאלוג

    try {
      const email = userEmail
      axios.post(`https://easygift-server.onrender.com/api/users/userid`, { email }).then(response => {
        console.log('response.data:', response.data)
        const user = response.data.userid[0]
        setEditedUser({
          fname: user.fname,
          lname: user.lname,
          email: user.email,
          password: user.password,
          isManager: user.isManager
        })
      })
    } catch (error) {
      console.error('שגיאה בקריאת פרטי המשתמש:', error)
    }
  }

  const handleCloseEditUserDialog = () => {
    setEditUserDialogOpen(false) // סוגרים את הדיאלוג
  }

  const handleSaveChanges = () => {
    handleCloseEditUserDialog()
    axios
      .put(`http://localhost:2001/api/users/${userId}`, editedUser)
      .then(response => {
        setUserEmail(editedUser.email)
        setIsManager(editedUser.isManager)
        setUserName(`${editedUser.fname} ${editedUser.lname}`)
      })
      .catch(err => console.error(err))
  }

  // פונקציית התנתקות
  const handleLogout = () => {
    setEventNum('')
    setUserId('')
    setUserEmail('')
    setIsManager(false)
    handleCloseUserMenu()
    setTimeout(() => navigate('/LoginPage'), 100)
  }

  const handleDeleteAccount = () => {
    try {
      axios.delete(`https://easygift-server.onrender.com/api/users/${userId}`).then(response => {
        console.log('response.data:', response.data)
        handleLogout()
      })
    } catch (error) {
      console.error('שגיאה במחיקת המשתמש:', error)
    }
    console.log('🗑️ Deleting account...')
    setConfirmDeleteOpen(false)
  }

  // ---------- חדש: תפריט המבורגר (פתיחה/סגירה) ---------- //
  const handleOpenNavMenu = event => {
    setAnchorElNav(event.currentTarget)
  }

  const handleCloseNavMenu = path => {
    setAnchorElNav(null)

    // ✅ רק אם המשתמש לחץ על "התחברות ורישום" דרך Navbar
    if (path === '/LoginPage') {
      console.log('🔹 לחיצה על התחברות ורישום מהניווט - איפוס מזהה אירוע')
      //setEventNumber('')
      setEventNum('')
    }

    navigate(path)
  }

  // פונקציה לנווט לדף הבית ולסגור את התפריט
  const handleBackToHome = () => {
    setEventNumber('')
    setEventNum('')
    setUserId('')
    setUserEmail('')
    setUserName('')
    setIsManager(false)
    handleCloseNavMenu()
    navigate('/Home')
  }

  // ---------------------- תפריט משתמש (פרופיל) ---------------------- //
  const handleOpenUserMenu = event => {
    setAnchorUser(event.currentTarget)
  }

  const handleCloseUserMenu = () => {
    setAnchorUser(null)
  }

  const navButtonStyle = {
    color: '#ECEFF1',
    margin: '15px 5px',
    fontWeight: 'bold',
    transition: '0.3s',
    whiteSpace: 'nowrap',
    fontSize: '1rem',
    px: 2, // רווח פנימי אופקי
    py: 1, // רווח פנימי אנכי
    borderRadius: '20px',
    '&.active': {
      backgroundColor: 'rgba(255,255,255,0.25)',
      color: '#1A73E8'
    }
  }

  {
    /* --- דיאלוג עריכת משתמש --- */
  }
  // ;<Dialog
  //   open={editUserDialogOpen}
  //   onClose={() => setEditUserDialogOpen(false)}
  //   dir="rtl"
  //   PaperProps={{
  //     sx: {
  //       borderRadius: '25px',
  //       backgroundColor: '#2B384D',
  //       width: 600,
  //       height: 800,
  //       padding: 2,
  //       color: '#E0E1DD'
  //     }
  //   }}
  // >
  //   <DialogTitle sx={{ textAlign: 'center', fontSize: 40 }}>עריכת משתמש</DialogTitle>
  //   {saving || canceling ? (
  //     <Box
  //       sx={{
  //         height: '100%',
  //         display: 'flex',
  //         justifyContent: 'center',
  //         alignItems: 'center',
  //         animation: `${fadeIn} 0.5s ease-in-out`
  //       }}
  //     >
  //       {saving ? (
  //         <CheckCircleIcon
  //           sx={{
  //             fontSize: 100,
  //             color: 'green',
  //             animation: `${pop} 0.5s ease`
  //           }}
  //         />
  //       ) : (
  //         <CloseIcon
  //           sx={{
  //             fontSize: 100,
  //             color: 'red',
  //             animation: `${pop} 0.5s ease`
  //           }}
  //         />
  //       )}
  //     </Box>
  //   ) : (
  //     <>
  //       <DialogContent
  //         sx={{
  //           display: 'flex',
  //           flexDirection: 'column',
  //           gap: 2,
  //           backgroundColor: '#1B263B',
  //           borderRadius: '25px',
  //           color: '#E0E1DD'
  //         }}
  //       >
  //         <TextField
  //           label="שם פרטי"
  //           value={editedUser.fname || ''}
  //           onChange={e =>
  //             setEditedUser({
  //               ...editedUser,
  //               fname: e.target.value
  //             })
  //           }
  //           inputProps={{
  //             style: { textAlign: 'right' }
  //           }}
  //           sx={{
  //             borderRadius: 5,
  //             backgroundColor: '#2B384D',
  //             mt: 4,
  //             textAlign: 'right',
  //             '& .MuiOutlinedInput-root': {
  //               color: '#E0E1DD',
  //               borderRadius: 5,
  //               '&:hover fieldset': {
  //                 borderColor: 'lightskyblue'
  //               }
  //             },
  //             '& .MuiInputLabel-root': {
  //               color: '#E0E1DD',
  //               borderRadius: 5
  //             }
  //           }}
  //         />
  //         <TextField
  //           label="שם משפחה"
  //           value={editedUser.lname || ''}
  //           onChange={e =>
  //             setEditedUser({
  //               ...editedUser,
  //               lname: e.target.value
  //             })
  //           }
  //           inputProps={{
  //             style: { textAlign: 'right' }
  //           }}
  //           sx={{
  //             borderRadius: 5,
  //             backgroundColor: '#2B384D',
  //             mt: 4,
  //             textAlign: 'right',
  //             '& .MuiOutlinedInput-root': {
  //               color: '#E0E1DD',
  //               borderRadius: 5,
  //               '&:hover fieldset': {
  //                 borderColor: 'lightskyblue'
  //               }
  //             },
  //             '& .MuiInputLabel-root': {
  //               color: '#E0E1DD',
  //               borderRadius: 5
  //             }
  //           }}
  //         />
  //         <TextField
  //           label="אימייל"
  //           value={editedUser.email || ''}
  //           onChange={e =>
  //             setEditedUser({
  //               ...editedUser,
  //               email: e.target.value
  //             })
  //           }
  //           inputProps={{
  //             style: { textAlign: 'right' }
  //           }}
  //           sx={{
  //             borderRadius: 5,
  //             backgroundColor: '#2B384D',
  //             mt: 4,
  //             textAlign: 'right',
  //             '& .MuiOutlinedInput-root': {
  //               color: '#E0E1DD',
  //               borderRadius: 5,
  //               '&:hover fieldset': {
  //                 borderColor: 'lightskyblue'
  //               }
  //             },
  //             '& .MuiInputLabel-root': {
  //               color: '#E0E1DD',
  //               borderRadius: 5
  //             }
  //           }}
  //         />
  //         <TextField
  //           label="סיסמה"
  //           value={editedUser.password || ''}
  //           onChange={e =>
  //             setEditedUser({
  //               ...editedUser,
  //               password: e.target.value
  //             })
  //           }
  //           inputProps={{
  //             style: { textAlign: 'right' }
  //           }}
  //           sx={{
  //             borderRadius: 5,
  //             backgroundColor: '#2B384D',
  //             mt: 4,
  //             textAlign: 'right',
  //             '& .MuiOutlinedInput-root': {
  //               color: '#E0E1DD',
  //               borderRadius: 5,
  //               '&:hover fieldset': {
  //                 borderColor: 'lightskyblue'
  //               }
  //             },
  //             '& .MuiInputLabel-root': {
  //               color: '#E0E1DD',
  //               borderRadius: 5
  //             }
  //           }}
  //         />
  //         <TextField
  //           label="מנהל?"
  //           value={editedUser.isManager || ''}
  //           onChange={e =>
  //             setEditedUser({
  //               ...editedUser,
  //               isManager: e.target.value
  //             })
  //           }
  //           inputProps={{
  //             style: { textAlign: 'right' }
  //           }}
  //           sx={{
  //             borderRadius: 5,
  //             backgroundColor: '#2B384D',
  //             mt: 4,
  //             textAlign: 'right',
  //             '& .MuiOutlinedInput-root': {
  //               color: '#E0E1DD',
  //               borderRadius: 5,
  //               '&:hover fieldset': {
  //                 borderColor: 'lightskyblue'
  //               }
  //             },
  //             '& .MuiInputLabel-root': {
  //               color: '#E0E1DD',
  //               borderRadius: 5
  //             }
  //           }}
  //         />
  //       </DialogContent>
  //       <DialogActions
  //         sx={{
  //           //backgroundColor: 'rgba(43,59,61,1)', // רקע דיאלוג: RGBA של #2B384D
  //           display: 'flex',
  //           justifyContent: 'center',
  //           gap: 2,
  //           margin: '10px 0'
  //         }}
  //       >
  //         <Button
  //           variant="contained"
  //           onClick={handleCancel}
  //           sx={{
  //             borderRadius: 5,
  //             margin: '0 15px',
  //             fontWeight: 'bold',
  //             fontSize: '1.1rem',
  //             backgroundColor: 'rgba(87,96,111,1)', // צבע ביטול: RGBA של #57606F
  //             color: '#E0E1DD',
  //             padding: '10px 20px',
  //             transition: 'background-color 0.3s ease, transform 0.2s ease, box-shadow 0.2s ease',
  //             boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
  //             '&:hover': {
  //               backgroundColor: 'rgba(72,81,92,1)', // גוון כהה יותר בעת ה-hover (RGBA של #48515C)
  //               transform: 'translateY(-2px)',
  //               boxShadow: '0px 6px 8px rgba(0, 0, 0, 0.15)'
  //             },
  //             '&:active': {
  //               animation: `${pulse} 0.5s ease-in-out`
  //             }
  //           }}
  //         >
  //           ביטול
  //         </Button>
  //         <Button
  //           variant="contained"
  //           onClick={handleSaveUser}
  //           sx={{
  //             borderRadius: 5,
  //             fontWeight: 'bold',
  //             fontSize: '1.1rem',
  //             backgroundColor: 'rgb(0, 139, 63)', // ירוק טבעי: RGBA של MediumSeaGreen (#3CB371)
  //             color: '#E0E1DD',
  //             padding: '10px 20px',
  //             transition: 'background-color 0.3s ease, transform 0.2s ease, box-shadow 0.2s ease',
  //             boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
  //             '&:hover': {
  //               backgroundColor: 'rgb(0, 113, 51)', // גוון כהה יותר בעת ה-hover
  //               transform: 'translateY(-2px)',
  //               boxShadow: '0px 6px 8px rgba(0, 0, 0, 0.15)'
  //             }
  //           }}
  //         >
  //           שמור
  //         </Button>
  //       </DialogActions>
  //     </>
  //   )}
  // </Dialog>

  return (
    <Box sx={{ marginBottom: 0 }} dir="rtl">
      <AppBar
        position="fixed"
        sx={{
          background: 'linear-gradient(90deg, #141E30, #243B55)',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.7)',
          minHeight: '64px'
        }}
      >
        <Container maxWidth="xxl">
          <Toolbar disableGutters sx={{ minHeight: '64px' }}>
            {/* ================= תפריט המבורגר (רק במסכים קטנים) ================= */}
            <Box sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }}>
              <IconButton size="large" aria-label="open drawer" onClick={handleOpenNavMenu} sx={{ color: '#fff' }}>
                <MenuIcon />
              </IconButton>
              {/* תפריט נפתח למסך קטן */}
              <Menu
                anchorEl={anchorElNav}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                keepMounted
                transformOrigin={{ vertical: 'top', horizontal: 'left' }}
                open={Boolean(anchorElNav)}
                onClose={handleCloseNavMenu}
                sx={{
                  display: { xs: 'block', md: 'none' },
                  '& .MuiPaper-root': {
                    backgroundColor: '#22303C'
                  }
                }}
              >
                {/* כפתור דף הבית (מוצג בתוך התפריט במובייל) */}
                <MenuItem onClick={handleBackToHome}>דף הבית</MenuItem>

                {/* כפתורי הניווט (מפות) */}
                {navigationPages.map(page => (
                  <MenuItem
                    key={page.name}
                    onClick={() => {
                      navigate(page.path)
                      handleCloseNavMenu()
                    }}
                    sx={{
                      color: location.pathname === page.path ? 'yellow' : '#fff',
                      backgroundColor: location.pathname === page.path ? 'rgba(255,255,255,0.15)' : 'transparent'
                    }}
                  >
                    {page.name}
                  </MenuItem>
                ))}
              </Menu>
            </Box>

            <Toolbar>
              <ModernLogo />
            </Toolbar>

            <Box
              sx={{
                flexGrow: 1,
                display: { xs: 'none', md: 'flex' },
                alignItems: 'center'
              }}
            >
              <Button
                onClick={handleBackToHome}
                component={Link}
                to="/Home"
                sx={{
                  ...navButtonStyle,
                  color: '#FFC107',
                  mr: 3,
                  '&:hover': {
                    backgroundColor: 'rgba(255,193,7,0.15)'
                  }
                }}
              >
                דף הבית
              </Button>
              {/* כפתורי ניווט בהתאם לניווט שנקבע */}
              {navigationPages.map(page => (
                <Button
                  key={page.name}
                  onClick={() => handleCloseNavMenu(page.path)} // ✅ מעביר את הנתיב לפונקציה
                  sx={{
                    ...navButtonStyle,
                    backgroundColor: location.pathname === page.path ? 'rgba(255, 255, 255, 0.15)' : 'rgba(255, 255, 255, 0.07)',
                    color: location.pathname === page.path ? '#74b9ff' : '#ECEFF1'
                  }}
                >
                  {page.name}
                </Button>
              ))}

              {eventNumber ? (
                <Button
                  onClick={() => setEventDialogOpen(true)}
                  sx={{
                    marginRight: '20px',
                    color: '#66BB6A',
                    ml: 0,
                    fontWeight: 'bold',
                    fontSize: '1.4rem',
                    fontFamily: 'serif',
                    whiteSpace: 'nowrap',
                    textTransform: 'none',
                    backgroundColor: 'transparent',
                    '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' }
                  }}
                >
                  מזהה אירוע: {eventNumber}
                </Button>
              ) : (
                <Button
                  onClick={() => setEventDialogOpen(true)}
                  sx={{
                    width: '20%',
                    ml: 0,
                    textAlign: 'center',
                    color: 'red',
                    fontSize: '1.2rem',
                    fontStyle: 'italic',
                    lineHeight: 1,
                    whiteSpace: 'nowrap',
                    textTransform: 'none',
                    backgroundColor: 'transparent',
                    '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' }
                  }}
                >
                  כניסה ללא מספר מזהה אירוע
                </Button>
              )}
              {/* דיאלוג הכנסת מזהה אירוע */}
              <Dialog open={eventDialogOpen} onClose={handleCloseEventDialog}>
                <DialogTitle>הכנס מזהה אירוע</DialogTitle>
                <DialogContent>
                  <TextField
                    autoFocus
                    label="מספר אירוע"
                    variant="outlined"
                    fullWidth
                    value={eventNum}
                    onChange={e => setEventNum(e.target.value)}
                    error={!!errorMessage}
                    helperText={errorMessage}
                    sx={{ mt: 2 }}
                  />
                </DialogContent>
                <DialogActions>
                  <Button onClick={handleCloseEventDialog} color="secondary">ביטול</Button>
                  <Button onClick={handleNewEventNumber} color="primary">אישור</Button>
                </DialogActions>
              </Dialog>
            </Box>
            <Box>
              <Button
                component={Link}
                to="/contact"
                sx={{
                  ...navButtonStyle,
                  color: '#FFC107',
                  marginLeft: '20px',
                  '&:hover': {
                    backgroundColor: 'rgba(255,193,7,0.15)'
                  }
                }}
              >
                צור קשר
              </Button>
            </Box>

            {/* אווטאר משתמש */}
            <Box sx={{ flexGrow: 0, ml: { xs: 0, md: 3 } }}>
              <Tooltip title="פרופיל המשתמש">
                <IconButton
                  onClick={handleOpenUserMenu}
                  sx={{
                    p: 0,
                    scale: 2,
                    color: '#fff',
                    '@media (max-width: 600px)': {
                      scale: 1.8
                    }
                  }}
                >
                  <ModernColorfulUserIcon sx={{ fontSize: 32 }} />
                </IconButton>
              </Tooltip>
              <Menu
                anchorEl={anchorUser}
                open={Boolean(anchorUser)}
                onClose={handleCloseUserMenu}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right'
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right'
                }}
                PaperProps={{
                  sx: {
                    mt: '55px',
                    backgroundColor: menuBgColor,
                    color: '#fff',
                    minWidth: 220,
                    boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
                    textAlign: 'center',
                    borderRadius: '25px'
                  }
                }}
              >
                {/* הצגה מעוצבת של השם, האימייל והדרגה */}
                <Box sx={{ p: 2, textAlign: 'center' }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                    {userName || 'אורח'}
                  </Typography>
                  {userEmail && (
                    <Typography variant="caption" sx={{ color: '#ccc' }}>
                      {userEmail}
                    </Typography>
                  )}
                  <Typography variant="caption" sx={{ display: 'block', mt: 1 }}>
                    דרגה: {userRank}
                  </Typography>
                </Box>
                <Divider sx={{ borderColor: 'rgba(255,255,255,0.2)' }} />

                {userId && (
                  <>
                    <Box sx={{ justifyItems: 'center', textAlign: 'center' }}>
                      <MenuItem
                        onClick={handleOpenEditUserDialog}
                        sx={{
                          margin: '10px 0px',
                          padding: '0px 20px',
                          borderRadius: '20px',
                          backgroundColor: 'rgba(0, 132, 255, 0.2)',
                          color: '#ECEFF1',
                          fontWeight: 'bold',
                          fontSize: '1rem',
                          '&:hover': { backgroundColor: 'rgba(255,255,255,0.15)' }
                        }}
                      >
                        הגדרות חשבון
                      </MenuItem>
                      <MenuItem
                        onClick={handleLogout}
                        sx={{
                          padding: '0px 50px',
                          borderRadius: '20px',
                          backgroundColor: 'rgba(255, 0, 0, 0.2)',
                          color: '#ECEFF1',
                          fontWeight: 'bold',
                          fontSize: '1rem',
                          '&:hover': { backgroundColor: 'rgba(255,255,255,0.15)' }
                        }}
                      >
                        התנתק
                      </MenuItem>
                    </Box>
                  </>
                )}
              </Menu>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      <Box sx={{ marginBottom: 8 }} />

      {/* =============== דיאלוג עריכת משתמש =============== */}
      <Dialog
        open={editUserDialogOpen}
        onClose={handleCloseEditUserDialog}
        dir="rtl"
        PaperProps={{
          sx: {
            borderRadius: '25px',
            backgroundColor: '#2B384D',
            width: 600,
            height: 600,
            padding: 2,
            color: '#E0E1DD'
          }
        }}
      >
        <Typography variant="h5" sx={{ textAlign: 'center', mt: 2 }}>
          עריכת משתמש
        </Typography>
        <Divider sx={{ backgroundColor: '#fff', my: 1 }} />

        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label="שם פרטי"
            variant="outlined"
            value={editedUser.fname || ''}
            onChange={e => setEditedUser({ ...editedUser, fname: e.target.value })}
            sx={{
              backgroundColor: '#22303C',
              borderRadius: '8px',
              '& .MuiOutlinedInput-root': {
                borderRadius: '8px',
                '& fieldset': { borderColor: '#E0E1DD', borderWidth: '1px' }
              },
              '& .MuiInputLabel-root': { color: '#E0E1DD' },
              '& .MuiInputBase-input': { color: '#E0E1DD' }
            }}
          />
          <TextField
            label="שם משפחה"
            variant="outlined"
            value={editedUser.lname || ''}
            onChange={e => setEditedUser({ ...editedUser, lname: e.target.value })}
            sx={{
              backgroundColor: '#22303C',
              borderRadius: '8px',
              '& .MuiOutlinedInput-root': {
                borderRadius: '8px',
                '& fieldset': { borderColor: '#E0E1DD', borderWidth: '1px' }
              },
              '& .MuiInputLabel-root': { color: '#E0E1DD' },
              '& .MuiInputBase-input': { color: '#E0E1DD' }
            }}
          />
          <TextField
            label="אימייל"
            variant="outlined"
            value={editedUser.email || ''}
            onChange={e => setEditedUser({ ...editedUser, email: e.target.value })}
            sx={{
              backgroundColor: '#22303C',
              borderRadius: '8px',
              '& .MuiOutlinedInput-root': {
                borderRadius: '8px',
                '& fieldset': { borderColor: '#E0E1DD', borderWidth: '1px' }
              },
              '& .MuiInputLabel-root': { color: '#E0E1DD' },
              '& .MuiInputBase-input': { color: '#E0E1DD' }
            }}
          />
          <TextField
            label="סיסמה"
            variant="outlined"
            type={showPassword ? 'text' : 'password'} // משנה את סוג השדה בהתאם למצב
            value={editedUser.password || ''}
            onChange={e => setEditedUser({ ...editedUser, password: e.target.value })}
            sx={{
              backgroundColor: '#22303C',
              borderRadius: '8px',
              '& .MuiOutlinedInput-root': {
                borderRadius: '8px',
                '& fieldset': { borderColor: '#E0E1DD', borderWidth: '1px' }
              },
              '& .MuiInputLabel-root': { color: '#E0E1DD' },
              '& .MuiInputBase-input': { color: '#E0E1DD' }
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword(prev => !prev)} edge="end" sx={{ color: '#E0E1DD' }}>
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              )
            }}
          />

          <FormControl fullWidth variant="outlined" sx={{ backgroundColor: '#22303C', borderRadius: '8px' }}>
            <InputLabel sx={{ color: '#E0E1DD' }}>מנהל?</InputLabel>
            <Select
              value={editedUser.isManager}
              onChange={e => setEditedUser({ ...editedUser, isManager: e.target.value })}
              label="מנהל?"
              sx={{
                borderRadius: '8px',
                '& .MuiOutlinedInput-root': {
                  borderRadius: '8px',
                  '& fieldset': { borderColor: '#E0E1DD', borderWidth: '1px' }
                },
                '& .MuiInputLabel-root': { color: '#E0E1DD' },
                '& .MuiSelect-icon': { color: '#E0E1DD' },
                '& .MuiInputBase-input': { color: '#E0E1DD' }
              }}
            >
              <MenuItem value={true}>כן</MenuItem>
              <MenuItem value={false}>לא</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>

        <Divider sx={{ backgroundColor: '#fff', mt: 1 }} />
        <DialogActions sx={{ justifyContent: 'center', mb: 2 }}>
          <Button onClick={handleCloseEditUserDialog} variant="contained" sx={{ backgroundColor: 'gray', mx: 2 }}>
            ביטול
          </Button>
          <Button onClick={handleSaveChanges} variant="contained" sx={{ backgroundColor: 'blue' }}>
            שמור
          </Button>
          <Button
            onClick={() => setConfirmDeleteOpen(true)}
            variant="contained"
            sx={{
              backgroundColor: 'red',
              ':hover': { backgroundColor: '#d32f2f' },
              mx: 2,
              marginRight: 'auto'
            }}
          >
            מחק חשבון
          </Button>
        </DialogActions>

        {/* דיאלוג אישור למחיקת החשבון */}
        <Dialog open={confirmDeleteOpen} onClose={() => setConfirmDeleteOpen(false)}>
          <DialogTitle sx={{ textAlign: 'center', fontWeight: 'bold' }}>האם אתה בטוח שאתה רוצה למחוק את החשבון?</DialogTitle>
          <DialogActions sx={{ justifyContent: 'center' }}>
            <Button onClick={() => setConfirmDeleteOpen(false)} sx={{ backgroundColor: 'gray', color: 'white' }}>
              ביטול
            </Button>
            <Button onClick={handleDeleteAccount} sx={{ backgroundColor: 'red', color: 'white', ':hover': { backgroundColor: '#d32f2f' } }}>
              כן, מחק את החשבון
            </Button>
          </DialogActions>
        </Dialog>
      </Dialog>
      <Box sx={{ marginBottom: 8 }} />
    </Box>
  )
}

export default Navbar
