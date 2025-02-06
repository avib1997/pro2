// File: src/Pages/ContactPage.js

import React, { useState } from 'react'
import axios from 'axios'
import { Box, Typography, TextField, Button, IconButton, Divider } from '@mui/material'

// אייקונים
import WhatsAppIcon from '@mui/icons-material/WhatsApp'
import FacebookIcon from '@mui/icons-material/Facebook'
import InstagramIcon from '@mui/icons-material/Instagram'
import MailOutlineIcon from '@mui/icons-material/MailOutline'
import LocalPhoneIcon from '@mui/icons-material/LocalPhone'

function ContactPage() {
  // State עבור שדות הטופס
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  })

  // טיפול בשינוי ערכי הטופס
  const handleChange = e => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  // שליחה דמה לקונסול
  const handleSendToConsole = () => {
    console.log('Data from contact form:', formData)
    alert('הנתונים הודפסו בקונסול!\n(פתח/י את כלי המפתחים >> Console)')
  }

  // שליחה אמיתית לשרת
  const handleSendToServer = async () => {
    try {
      console.log('Data would be sent to server:', formData)
      await axios.post('http://localhost:4000/api/contact', formData)
      alert('נשלח לשרת בהצלחה!')
    } catch (error) {
      console.error('Error sending to server:', error)
      alert('אירעה שגיאה בעת שליחה לשרת')
    }
  }

  return (
    <Box
      sx={{
        minHeight: '90vh',
        direction: 'rtl',
        paddingTop: '80px',
        paddingBottom: '120px',
        position: 'relative',
        overflowX: 'hidden'
      }}
    >
      {/* רקע גרדיאנט */}
      <Box
        sx={{
          position: 'absolute',
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

      <Typography
        variant="h3"
        align="center"
        sx={{
          fontWeight: 'bold',
          color: '#E0E1DD',
          textShadow: '2px 2px #000',
          marginBottom: 4,
          fontFamily: 'Poppins, sans-serif'
        }}
      >
        צרו קשר
      </Typography>

      {/* "קונטיינר" 2 עמודות: שמאלית - מידע ואייקונים, ימנית - טופס */}
      <Box
        display="flex"
        flexDirection={{ xs: 'column', md: 'row' }}
        width={{ xs: '90%', md: '80%' }}
        margin="auto"
        borderRadius={2}
        boxShadow="0px 8px 16px rgba(0, 0, 0, 0.5)"
        sx={{
          background: 'rgba(255, 255, 255, 0.07)',
          transition: 'transform 0.3s, box-shadow 0.3s',
          '&:hover': {
            transform: 'scale(1.02)',
            boxShadow: '0px 12px 24px rgba(0, 0, 0, 0.7)'
          }
        }}
      >
        {/* עמודה 1: מידע ואייקונים */}
        <Box
          flex={1}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            p: { xs: 2, md: 4 }
          }}
        >
          <Typography
            variant="h5"
            sx={{
              color: '#FCECDD',
              fontWeight: 'bold',
              mb: 2,
              textAlign: 'center',
              textShadow: '1px 1px #000'
            }}
          >
            דרכי יצירת קשר
          </Typography>

          <Typography
            variant="body1"
            sx={{
              color: '#E0E1DD',
              mb: 2,
              textAlign: 'center',
              lineHeight: 1.8,
              fontSize: '1.1rem'
            }}
          >
            לכל שאלה או בעיה, ניתן לפנות אלינו בערוצי וואצאפ, פייסבוק, אינסטגרם, אימייל או טלפון. אנו כאן כדי לעזור ולשמוע את המשוב שלכם.
          </Typography>

          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              gap: 2,
              mt: 2
            }}
          >
            {/* וואצאפ */}
            <IconButton
              component="a"
              href="https://chat.whatsapp.com/KN1etpCLloyD1wbunuEwdX"
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                color: '#25D366',
                fontSize: '2rem'
              }}
            >
              <WhatsAppIcon fontSize="large" />
            </IconButton>

            {/* פייסבוק */}
            <IconButton
              component="a"
              href="https://www.facebook.com/profile.php?id=100022433382128"
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                color: '#1877F2',
                fontSize: '2rem'
              }}
            >
              <FacebookIcon fontSize="large" />
            </IconButton>

            {/* אינסטגרם */}
            <IconButton
              component="a"
              href="https://www.instagram.com/avi_brod"
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                color: '#E4405F',
                fontSize: '2rem'
              }}
            >
              <InstagramIcon fontSize="large" />
            </IconButton>

            {/* מייל (mailto) */}
            <IconButton
              component="a"
              href="mailto:avib660@gmail.com"
              sx={{
                color: '#E0E1DD',
                fontSize: '2rem'
              }}
            >
              <MailOutlineIcon fontSize="large" />
            </IconButton>

            {/* טלפון (tel) */}
            <IconButton
              component="a"
              href="tel:0545665166"
              sx={{
                color: '#E0E1DD',
                fontSize: '2rem'
              }}
            >
              <LocalPhoneIcon fontSize="large" />
            </IconButton>
          </Box>
        </Box>

        {/* עמודה 2: הטופס */}
        <Box
          flex={1}
          p={{ xs: 2, md: 4 }}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center'
          }}
        >
          <Typography variant="h5" sx={{ color: '#F0A500', marginBottom: 2, textAlign: 'center' }}>
            נשמח לשמוע מכם!
          </Typography>

          <TextField
            label="שם מלא"
            variant="outlined"
            name="name"
            value={formData.name}
            onChange={handleChange}
            fullWidth
            sx={{
              mb: 2,
              backgroundColor: '#f5f5f5', // רקע בהיר לשדה
              '& .MuiInputBase-input': { color: '#333' } // טקסט כהה
            }}
          />
          <TextField
            label="אימייל"
            variant="outlined"
            name="email"
            value={formData.email}
            onChange={handleChange}
            fullWidth
            sx={{
              mb: 2,
              backgroundColor: '#f5f5f5',
              '& .MuiInputBase-input': { color: '#333' }
            }}
          />
          <TextField
            label="טלפון"
            variant="outlined"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            fullWidth
            sx={{
              mb: 2,
              backgroundColor: '#f5f5f5',
              '& .MuiInputBase-input': { color: '#333' }
            }}
          />
          <TextField
            label="הודעה"
            variant="outlined"
            name="message"
            value={formData.message}
            onChange={handleChange}
            fullWidth
            multiline
            rows={4}
            sx={{
              mb: 2,
              backgroundColor: '#f5f5f5',
              '& .MuiInputBase-input': { color: '#333' }
            }}
          />

          {/* כפתורי שליחה */}
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mt: 3 }}>
            {/* <Button
              variant="contained"
              color="primary"
              onClick={handleSendToConsole}
            >
              שמירה בקונסול
            </Button>
            <Button
              variant="contained"
              color="success"
              onClick={handleSendToServer}
            >
              שליחה לשרת
            </Button> */}
            <Button variant="contained" color="primary" onClick={handleSendToConsole}>
              שלח
            </Button>
          </Box>
        </Box>
      </Box>

      {/* מפריד קטן */}
      <Divider sx={{ maxWidth: 700, margin: '40px auto' }} />

      {/* אנימציית הרקע */}
      <style>
        {`
          @keyframes animateBg {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
        `}
      </style>
    </Box>
  )
}

export default ContactPage
