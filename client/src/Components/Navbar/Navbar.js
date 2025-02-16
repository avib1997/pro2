//client/src/Components/Navbar/Navbar.js
import React, { useContext, useState } from 'react'
import { AppBar, Box, Toolbar, IconButton, Typography, Menu, MenuItem, Container, Button, Avatar, Tooltip, Divider, styled } from '@mui/material'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import CardGiftcardIcon from '@mui/icons-material/CardGiftcard'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Context } from '../../App'
import axios from 'axios'
//import { useSnackbar } from 'notistack'
//import { fadeIn, pop, pulse } from '../../styles/animations'
import { Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import CloseIcon from '@mui/icons-material/Close'

const menuBgColor = '#2B3A47' // רקע תפריט אווטאר

const pagesGuest = [
  { name: 'מתנה', path: '/Details_page' },
  { name: 'ברכות', path: '/Blessing' },
  { name: 'שאלות ותשובות', path: '/Fqa' },
  { name: 'התחברות ורישום', path: '/Login_page' }
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
  const { isManager, userId, eventNumber, isEventManager, setEventNumber, userName, userEmail, setUserId, setUserEmail, setIsEventManager } = useContext(Context)
  const location = useLocation() // קבלת הנתיב הנוכחי
  const navigate = useNavigate()
  const [editUserDialogOpen, setEditUserDialogOpen] = useState(false)
  const [editedUser, setEditedUser] = useState({ fname: '', lname: '', email: '', password: '', isManager: '' })

  const [anchorNav, setAnchorNav] = useState(null)
  const [anchorUser, setAnchorUser] = useState(null)

  let navigationPages = userId === '' ? pagesGuest : isEventManager ? pagesManager : pagesRegistered

  // הגדרת הדרגה
  let userRank = 'אורח'
  if (isEventManager) {
    userRank = 'מנהל אירוע'
  } else if (userId) {
    userRank = 'משתמש רשום'
  }

  // סגנון ללוגו
  const logoStyle = {
    mr: 2,
    ml: 10,
    display: { xs: 'flex', md: 'flex' },
    fontFamily: 'Roboto, sans-serif',
    fontWeight: 700,
    letterSpacing: '.3rem',
    color: 'inherit',
    textDecoration: 'none',
    textTransform: 'uppercase',
    '&:hover': {
      color: '#f0f0f0',
      transition: 'color 0.3s'
    }
  }

  // פונקציות לפתיחת וסגירת הדיאלוג
  const handleOpenEditUserDialog = () => {
    setAnchorUser(null) // נסגור את תפריט המשתמש קודם
    setEditUserDialogOpen(true) // פותחים את הדיאלוג
  }
  const handleCloseEditUserDialog = () => {
    setEditUserDialogOpen(false) // סוגרים את הדיאלוג
  }

  // פונקציית התנתקות
  const handleLogout = () => {
    // איפוס כל הפרטים מה-context
    setUserId('')
    setUserEmail('')
    setEventNumber('')
    setIsEventManager(false)
    // אפשר לאפס גם פרטים נוספים בהתאם למבנה הפרויקט שלך

    // סוגרים תפריט
    handleCloseUserMenu()

    // מעבירים את המשתמש לדף ההתחברות
    navigate('/LoginPage')
  }

  const handleOpenNavMenu = event => {
    setAnchorNav(event.currentTarget)
  }
  const handleBackToHome = () => {
    setEventNumber('')
    setAnchorNav(null)
  }

  const handleOpenUserMenu = event => {
    setAnchorUser(event.currentTarget)
  }
  const handleCloseUserMenu = () => {
    setAnchorUser(null)
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
          // גרדיאנט כהה אופקי
          background: 'linear-gradient(90deg, #141E30, #243B55)',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.7)'
        }}
      >
        <Container maxWidth="xxl">
          <Toolbar disableGutters>
            {/* כפתורי הניווט */}
            <Box
              sx={{
                flexGrow: 1,
                display: {
                  xs: 'none',
                  md: 'flex'
                },
                alignItems: 'center'
              }}
            >
              {/* כפתור "דף הבית" */}
              <Button
                onClick={handleBackToHome}
                component={Link}
                to="/Home"
                sx={{
                  my: 2,
                  margin: '0px',
                  borderRadius: '20px',
                  color: '#FFC107',
                  fontWeight: 'bold',
                  mr: 3,
                  transition: '0.3s',
                  '&:hover': {
                    backgroundColor: 'rgba(255,193,7,0.15)'
                    //boxShadow: "0 0 8px rgba(255,193,7,0.5)",
                  }
                }}
              >
                דף הבית
              </Button>
              {/* כפתורי ניווט בהתאם לניווט שנקבע */}
              {navigationPages.map(page => (
                <Button
                  key={page.name}
                  component={Link}
                  to={page.path}
                  sx={{
                    backgroundColor: location.pathname === page.path ? 'rgba(255, 255, 255, 0.15)' : 'rgba(255, 255, 255, 0.07)',
                    margin: '2px',
                    padding: '5px 15px',
                    borderRadius: '20px',
                    my: 2,
                    color: location.pathname === page.path ? 'skyblue' : '#ECEFF1',
                    fontWeight: location.pathname === page.path ? 'bold' : 'normal',
                    transition: '0.3s',
                    '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' }
                  }}
                >
                  {page.name}
                </Button>
              ))}
              {/* כפתור בולט להוספה */}
              <Button
                onClick={handleBackToHome}
                component={Link}
                to="/LoginPage"
                sx={{
                  my: 2,
                  mr: 1.5,
                  color: '#fff',
                  backgroundColor: 'rgba(255,255,255,0.1)', // צבע כתום בולט
                  fontSize: '1.1rem',
                  fontWeight: 'bold',
                  borderRadius: '20px',
                  px: 3,
                  py: 1,
                  transition: '0.3s',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    transform: 'scale(1.1)'
                  }
                }}
              >
                התחברות ורישום
              </Button>
              {/* {!isEventManager && ( // הצגת האלמנטים הקשורים ל-eventNumber רק אם isEventManager הוא false */}
              {/* <> */}
              {/* אם אין eventNumber */}
              {!eventNumber && (
                <Box
                  sx={{
                    width: '20%',
                    mr: 5,
                    textAlign: 'center'
                  }}
                >
                  <Typography
                    variant="caption"
                    sx={{
                      color: 'red',
                      fontSize: '1.2rem',
                      fontStyle: 'italic',
                      marginRight: '0px',
                      lineHeight: 1
                    }}
                  >
                    כניסה ללא מספר מזהה אירוע
                  </Typography>
                </Box>
              )}

              {/* אם יש eventNumber */}
              {eventNumber && (
                <Typography
                  sx={{
                    color: 'goldenrod',
                    ml: 2,
                    fontWeight: 'bold',
                    fontSize: '1.4rem',
                    fontFamily: 'serif',
                    marginRight: '200px'
                  }}
                >
                  מזהה אירוע: {eventNumber}
                </Typography>
              )}
              {/* </> */}
              {/* )} */}
            </Box>

            {/* אווטאר משתמש */}
            <Box sx={{ flexGrow: 0, ml: 3 }}>
              <Tooltip title="פרופיל המשתמש">
                <IconButton
                  onClick={handleOpenUserMenu}
                  sx={{
                    p: 0,
                    scale: 2.5,
                    color: '#fff'
                  }}
                >
                  <AccountCircleIcon />
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
                    mt: '45px',
                    backgroundColor: menuBgColor,
                    color: '#fff',
                    minWidth: 220,
                    boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                    borderRadius: 2,
                    textAlign: 'center',
                    alignItems: 'center',
                    justifyContent: 'center' // יישור אופקי
                  }
                }}
              >
                {/* הצגה מעוצבת של השם, האימייל והדרגה */}
                <Box
                  sx={{
                    p: 2,
                    textAlign: 'center',
                    justifyContent: 'center', // יישור אופקי
                    alignItems: 'center' // יישור אנכי
                  }}
                >
                  <Typography
                    variant="subtitle1"
                    sx={{
                      justifyContent: 'center',
                      fontWeight: 'bold'
                    }}
                  >
                    {userName || 'אורח'}
                  </Typography>
                  {userEmail && (
                    <Typography
                      variant="caption"
                      sx={{
                        justifyContent: 'center',
                        color: '#ccc'
                      }}
                    >
                      {userEmail}
                    </Typography>
                  )}
                  <Typography
                    variant="caption"
                    sx={{
                      display: 'block',
                      mt: 1
                    }}
                  >
                    דרגה: {userRank}
                  </Typography>
                </Box>
                <Divider
                  sx={{
                    borderColor: 'rgba(255,255,255,0.2)'
                  }}
                />

                {/* אפשרות 1: הגדרות פרופיל, התנתקות וכו' */}
                {userId && (
                  <>
                    <MenuItem
                      onClick={handleOpenEditUserDialog}
                      sx={{
                        color: '#ECEFF1',
                        fontWeight: 'bold',
                        fontSize: '1rem',
                        textAlign: 'center',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      הגדרות חשבון
                    </MenuItem>
                    <MenuItem
                      onClick={handleLogout}
                      sx={{
                        color: '#ECEFF1',
                        fontWeight: 'bold',
                        fontSize: '1rem',
                        textAlign: 'center',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      התנתק
                    </MenuItem>
                  </>
                )}
              </Menu>
            </Box>

            {/* לוגו בצד שמאל */}
            <CardGiftcardIcon
              fontSize="large"
              sx={{
                display: {
                  xs: 'none',
                  md: 'flex'
                },
                ml: 2,
                mr: 10
              }}
            />
            <Typography variant="h6" noWrap component={Link} to="/" sx={logoStyle}>
              Easy Gift
            </Typography>
          </Toolbar>
        </Container>
      </AppBar>

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

        <DialogContent
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 2
            //height: '100%',
            //overflowY: 'auto', // אם צריך גלילה
          }}
        >
          {/* כאן מוסיפים TextField-ים לפרטי המשתמש (fname, lname, email, password וכו') */}
          <TextField
            label="שם פרטי"
            variant="outlined"
            // value={editedUser.fname || ''}
            // onChange={(e) => setEditedUser({ ...editedUser, fname: e.target.value })}
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
            // value={editedUser.email || ''}
            // onChange={(e) => setEditedUser({ ...editedUser, email: e.target.value })}
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
            // value={editedUser.password || ''}
            // onChange={(e) => setEditedUser({ ...editedUser, password: e.target.value })}
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
            label="מנהל?"
            variant="outlined"
            // value={editedUser.isManager || ''}
            // onChange={(e) => setEditedUser({ ...editedUser, isManager: e.target.value })}
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

          {/* ...שדות נוספים לעריכה... */}
        </DialogContent>

        <Divider sx={{ backgroundColor: '#fff', mt: 1 }} />
        <DialogActions sx={{ justifyContent: 'center', mb: 2 }}>
          <Button onClick={handleCloseEditUserDialog} variant="contained" sx={{ backgroundColor: 'gray', mx: 2 }}>
            ביטול
          </Button>
          <Button
            onClick={() => {
              // שמירה/שליחה לשרת וכו'...
              // לאחר מכן סגירה
              handleCloseEditUserDialog()
            }}
            variant="contained"
            sx={{ backgroundColor: 'blue' }}
          >
            שמור
          </Button>
        </DialogActions>
      </Dialog>
      <Box sx={{ marginBottom: 8 }} />
    </Box>
  )
}

export default Navbar
