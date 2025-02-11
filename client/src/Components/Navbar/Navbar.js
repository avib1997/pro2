//client/src/Components/Navbar/Navbar.js
import React, { useContext, useState } from 'react'
import { AppBar, Box, Toolbar, IconButton, Typography, Menu, MenuItem, Container, Button, Avatar, Tooltip, Divider, styled } from '@mui/material'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import CardGiftcardIcon from '@mui/icons-material/CardGiftcard'
import { Link } from 'react-router-dom'
import { Context } from '../../App'

const menuBgColor = '#2B3A47' // רקע תפריט אווטאר

const pagesGuest = [
  { name: 'ברכות', path: '/Blessing' },
  { name: 'שאלות ותשובות', path: '/Fqa' },
  //{ name: 'התחברות ורישום', path: '/Login_page' }
  { name: 'מתנה', path: '/Details_page' }
]

const pagesRegistered = [
  { name: 'היסטוריה', path: '/History' },
  { name: 'ברכות', path: '/Blessing' },
  { name: 'שאלות ותשובות', path: '/Fqa' },
  { name: 'מתנה', path: '/Details_page' }
]

const pagesManger = [
  { name: 'ברכות', path: '/Blessing' },
  { name: 'שאלות ותשובות', path: '/Fqa' },
  {
    name: 'ניהול אירועים',
    path: '/EventManager'
  },
  { name: 'היסטוריה', path: '/History' }
]

function Navbar() {
  const { userId, eventNumber, isEventManager, setEventNumber, userName, userEmail } = useContext(Context)

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

  // בחירת דפי הניווט לפי סוג המשתמש
  let navigationPages
  // אם המשתמש אינו מחובר (userId הוא מחרוזת ריקה)
  if (userId === '') {
    navigationPages = pagesGuest // דפים לאורח
  }
  // אם המשתמש הוא מנהל אירועים
  else if (isEventManager) {
    navigationPages = pagesManger // דפים למנהל אירועים
  }
  // אם המשתמש מחובר אך אינו מנהל
  else {
    navigationPages = pagesRegistered // דפים למשתמש רגיל
  }

  const [anchorNav, setAnchorNav] = useState(null)
  const [anchorUser, setAnchorUser] = useState(null)

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
                  margin: '0 10px',
                  borderRadius: '20px',
                  color: '#FFC107',
                  fontWeight: 'bold',
                  mr: 1.5,
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
                    margin: '0 10px',
                    borderRadius: '20px',
                    my: 2,
                    color: '#ECEFF1',
                    transition: '0.3s',
                    '&:hover': {
                      backgroundColor: 'rgba(255,255,255,0.1)'
                      //boxShadow: "0 0 8px rgba(236,239,241,0.4)",
                    }
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

              {!isEventManager && ( // הצגת האלמנטים הקשורים ל-eventNumber רק אם isEventManager הוא false
                <>
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
                </>
              )}
            </Box>

            {/* אייקון/תמונת פרופיל (אווטאר) בצד שמאל - פופאפ */}
            <Box
              sx={{
                flexGrow: 0,
                ml: 3,
                alignItems: 'center', // יישור אנכי
                justifyContent: 'center' // יישור אופקי
              }}
            >
              <Tooltip title="פרופיל המשתמש">
                <IconButton
                  onClick={handleOpenUserMenu}
                  sx={{
                    p: 0,
                    scale: 2.5,
                    color: '#fff'
                  }}
                >
                  {/* אם יש תמונת פרופיל: src='url...' אחרת יופיע default */}
                  <AccountCircleIcon
                    //sx={{ color: "white" }}
                    alt="User Avatar"
                    src=""
                  />
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
                      onClick={handleCloseUserMenu}
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
                      onClick={handleCloseUserMenu}
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
      <Box sx={{ marginBottom: 8 }} />
    </Box>
  )
}

export default Navbar
