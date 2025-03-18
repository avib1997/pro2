import { createContext, useState, useEffect } from 'react'
import React from 'react'
import Logo from './Components/Logo'
import { BrowserRouter } from 'react-router-dom'
import MainRouter from './routes/MainRouter'
import WhatsAppIcon from '@mui/icons-material/WhatsApp'
import { useTheme, Box, IconButton, Typography } from '@mui/material'

export const Context = createContext()

function App() {
  const theme = useTheme()
  const whatsappGroupLink = 'https://chat.whatsapp.com/KN1etpCLloyD1wbunuEwdX'

  // פונקציה לקבלת נתונים מה-localStorage
  const getLocalStorageItem = (key, defaultValue) => {
    const savedValue = localStorage.getItem(key)
    return savedValue ? JSON.parse(savedValue) : defaultValue
  }

  // אתחול ה-states מה-localStorage
  const [IsEvent, setIsEvent] = useState(getLocalStorageItem('IsEvent', true))
  const [eventNumber, setEventNumber] = useState(getLocalStorageItem('eventNumber', ''))
  const [userName, setUserName] = useState(getLocalStorageItem('userName', ''))
  const [userEmail, setUserEmail] = useState(getLocalStorageItem('userEmail', ''))
  const [userId, setUserId] = useState(getLocalStorageItem('userId', ''))
  const [detailsId, setDetailsId] = useState(getLocalStorageItem('detailsId', []))
  const [isEventManager, setIsEventManager] = useState(getLocalStorageItem('isEventManager', false))
  const [state, setState] = useState(getLocalStorageItem('state', ''))
  const [event, setEvent] = useState(getLocalStorageItem('event', ''))
  const [eventId, setEventId] = useState(getLocalStorageItem('eventId', ''))
  const [isManager, setIsManager] = useState(getLocalStorageItem('isManager', false))
  const [eventName, setEventName] = useState(getLocalStorageItem('eventName', ''))

  // שמירה אוטומטית ל-localStorage בכל שינוי בסטייטים
  useEffect(() => {
    localStorage.setItem('IsEvent', JSON.stringify(IsEvent))
    localStorage.setItem('eventNumber', JSON.stringify(eventNumber))
    localStorage.setItem('userName', JSON.stringify(userName))
    localStorage.setItem('userEmail', JSON.stringify(userEmail))
    localStorage.setItem('userId', JSON.stringify(userId))
    localStorage.setItem('detailsId', JSON.stringify(detailsId))
    localStorage.setItem('isEventManager', JSON.stringify(isEventManager))
    localStorage.setItem('state', JSON.stringify(state))
    localStorage.setItem('event', JSON.stringify(event))
    localStorage.setItem('eventId', JSON.stringify(eventId))
    localStorage.setItem('isManager', JSON.stringify(isManager))
    localStorage.setItem('eventName', JSON.stringify(eventName))
  }, [
    IsEvent, eventNumber, userName, userEmail, userId, detailsId,
    isEventManager, state, event, eventId, isManager, eventName
  ])

  return (
    <Context.Provider
      value={{
        IsEvent, setIsEvent,
        eventNumber, setEventNumber,
        userName, setUserName,
        userEmail, setUserEmail,
        userId, setUserId,
        detailsId, setDetailsId,
        isEventManager, setIsEventManager,
        state, setState,
        event, setEvent,
        eventId, setEventId,
        isManager, setIsManager,
        eventName, setEventName
      }}
    >
      <BrowserRouter>
        <MainRouter />
        <Box
          sx={{
            position: 'fixed',
            bottom: { xs: 16, sm: 36 },
            left: { xs: 16, sm: 36 },
            zIndex: 9999
          }}
        >
          <Logo />
        </Box>
      </BrowserRouter>

      {/* Footer */}
      <Box
        sx={{
          marginTop: { xs: 3, sm: 5 },
          textAlign: 'center',
          py: { xs: 1, sm: 1.5 },
          backgroundColor: 'rgba(0,0,0,0.3)',
          color: '#E0E1DD',
          direction: 'rtl'
        }}
      >
        <Typography variant="body2" sx={{ fontSize: { xs: '0.75rem', sm: '0.9rem' } }}>
          &copy; {new Date().getFullYear()} EASY GIFT | כל הזכויות שמורות
        </Typography>
      </Box>
      
      {/* כפתור וואטסאפ */}
      <Box
        sx={{
          position: 'fixed',
          bottom: { xs: 16, sm: 36 },
          right: { xs: 16, sm: 36 },
          zIndex: 9999
        }}
      >
        <IconButton
          component="a"
          href={whatsappGroupLink}
          target="_blank"
          rel="noopener noreferrer"
          sx={{
            backgroundColor: '#25D366',
            color: '#fff',
            '&:hover': {
              backgroundColor: '#20b558'
            },
            width: { xs: 56, sm: 76 },
            height: { xs: 56, sm: 76 },
            borderRadius: '50%',
            boxShadow: '0 4px 8px rgba(0,0,0,0.3)'
          }}
        >
          <WhatsAppIcon sx={{ fontSize: { xs: '1.8rem', sm: '2.5rem' } }} />
        </IconButton>
      </Box>
    </Context.Provider>
  )
}

export default App
