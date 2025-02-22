//client/src/App.js
import { createContext, useState, useEffect } from 'react'
import React from 'react'
import Logo from './Components/Logo'
import { BrowserRouter, useLocation } from 'react-router-dom'
import MainRouter from './routes/MainRouter' // או הנתיב למקום ששמרת את הקובץ
import WhatsAppIcon from '@mui/icons-material/WhatsApp'
import { Box, IconButton, Typography } from '@mui/material'

export const Context = createContext()

function App() {
  const whatsappGroupLink = 'https://chat.whatsapp.com/KN1etpCLloyD1wbunuEwdX'
  const [IsEvent, setIsEvent] = useState(true)
  const [eventNumber, setEventNumber] = useState('') // סטייט עבור ה-ID של האירוע
  const [userName, setUserName] = useState('')
  const [userEmail, setUserEmail] = useState('')
  const [userId, setUserId] = useState('')
  const [detailsId, setDetailsId] = useState([])
  const [isEventManager, setIsEventManager] = useState(false) // הוספת סטייט למנהל אירועים
  const [state, setState] = useState()
  const [event, setEvent] = useState('')
  const [eventId, setEventId] = useState('')
  const [isManager, setIsManager] = useState(false)
  const [eventName, setEventName] = useState('')

  const getSavedGiftDetails = () => {
    try {
      const storedData = localStorage.getItem('giftDetails')
      return storedData ? JSON.parse(storedData) : { name: '', phone: '', blessing: '', amount: '' }
    } catch (error) {
      console.error('❌ שגיאה בטעינת הנתונים מ-localStorage:', error)
      return { name: '', phone: '', blessing: '', amount: '' } // החזרת נתונים ריקים במקרה של שגיאה
    }
  }
  const [giftDetails, setGiftDetails] = useState(getSavedGiftDetails)

  useEffect(() => {
    try {
      localStorage.setItem('giftDetails', JSON.stringify(giftDetails))
    } catch (error) {
      console.error('❌ שגיאה בשמירת הנתונים ל-localStorage:', error)
    }
  }, [giftDetails])

  return (
    <Context.Provider
      value={{
        giftDetails,
        setGiftDetails,
        isManager,
        setIsManager,
        isEventManager,
        setIsEventManager, // הוספת הפונקציה לקונטקסט
        IsEvent,
        setIsEvent,
        userId,
        setUserId,
        detailsId,
        setDetailsId,
        event,
        setEvent,
        state,
        setState,
        eventId,
        setEventId,
        userName,
        setUserName,
        userEmail,
        setUserEmail,
        eventNumber,
        setEventNumber,
        eventName,
        setEventName
      }}
    >
      <BrowserRouter>
        <MainRouter />

        <Box
          sx={{
            position: 'fixed',
            bottom: 36,
            left: 36,
            zIndex: 9999 // מעל כל האלמנטים
          }}
        >
          <Logo />
        </Box>
      </BrowserRouter>

      {/* Footer פשוט בתחתית העמוד */}
      <Box
        sx={{
          marginTop: 5,
          textAlign: 'center',
          py: 1.5,
          backgroundColor: 'rgba(0,0,0,0.3)',
          color: '#E0E1DD',
          direction: 'rtl' // כיוון הטקסט (מימין לשמאל)
        }}
      >
        <Typography variant="body2" sx={{ fontSize: '0.9rem' }}>
          &copy; {new Date().getFullYear()} EASY GIFT | כל הזכויות שמורות
        </Typography>
      </Box>
      <Box
        sx={{
          position: 'fixed',
          bottom: 36,
          right: 36,
          zIndex: 9999 // מעל כל האלמנטים
        }}
      >
        <IconButton
          component="a"
          href={whatsappGroupLink}
          target="_blank"
          rel="noopener noreferrer"
          sx={{
            backgroundColor: '#25D366', // צבע וואצאפ
            color: '#fff',
            '&:hover': {
              backgroundColor: '#20b558'
            },
            width: 76,
            height: 76,
            borderRadius: '50%',
            boxShadow: '0 4px 8px rgba(0,0,0,0.3)'
          }}
        >
          <WhatsAppIcon fontSize="large" />
        </IconButton>
      </Box>
    </Context.Provider>
  )
}

export default App
