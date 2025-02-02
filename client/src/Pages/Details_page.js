//src/Pages/Details.js
import React, { useContext, useState, useEffect } from 'react'
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate'
import CheckCircleIcon from '@mui/icons-material/CheckCircle' // אייקון לסימון העלאה
import KeyboardVoiceIcon from '@mui/icons-material/KeyboardVoice'
import TheatersIcon from '@mui/icons-material/Theaters'
import { Box, Button, Container, IconButton, Link, Slide, TextField, Tooltip, Typography } from '@mui/material'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { Context } from '../App'
import BitIcon from '../assets/bit.png'
import PayPalIcon from '../assets/buy-logo-small-il.png'
import PayBoxIcon from '../assets/paybox.png'
import Navbar from '../Components/Navbar/Navbar'



const Details = () => {
  const navigate = useNavigate()
  const { userId, event, eventId , setState, setEvent } = useContext(Context)
  const [inputs, setInputs] = useState({
    name: '',
    phone: '',
    blessing: '',
    amount: ''
  })
  const [amount, setAmount] = useState(0);


  // מצבים עבור הקבצים שהועלו
  const [uploadedImage, setUploadedImage] = useState(false)
  const [uploadedVideo, setUploadedVideo] = useState(false)
  const [uploadedAudio, setUploadedAudio] = useState(false)

  useEffect(() => {
    console.log('🎉 מזהה האירוע:', eventId)
  }, [eventId])

  const handleChange = e => {
    setAmount(e.target.value);
    setInputs(prevState => ({
      ...prevState,
      [e.target.name]: e.target.value
    }))
  }

  const handleClick = async e => {
    await axios.get(`http://localhost:2001/api/events/${event}`)
      .then(res => {
        setEvent(res.data)
      })
      .catch(err => {
        console.log('error in Details page in handleClick get event by id: ', err)
      })

    e.preventDefault()
    console.log('📌 event object:', event) // ✅ נבדוק אם event מוגדר

    const newGift = {
      name: inputs.name,
      phone: inputs.phone,
      blessing: inputs.blessing,
      amount: inputs.amount,
      userid_gift: userId,
      EventId: event._id,
      toEventName: event?.NameOfGroom + ' & ' + event?.NameOfBride // ✅ שימוש ב- "?" למניעת שגיאות
    }
    try {
      const response = await axios.post('http://localhost:2001/api/gift/addGift', newGift)
      console.log('✅ מתנה נוספה בהצלחה:', response.data)
    } catch (error) {
      console.error('❌ שגיאה בהוספת המתנה:', error.response?.data || error.message)
    }
    navigate("/Payment", { state: { amount } }); // שולח את הסכום לעמוד PayPalPayment

  }

  // פונקציות לטיפול בהעלאת קבצים
  const handleImageUpload = e => {
    // לוגיקה להעלאת תמונה
    setUploadedImage(true)
  }

  const handleVideoUpload = e => {
    // לוגיקה להעלאת וידאו
    setUploadedVideo(true)
  }

  const handleAudioUpload = e => {
    // לוגיקה להעלאת אודיו
    setUploadedAudio(true)
  }

  return (
    <Box
      sx={{
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

      <Container
        maxWidth="md"
        sx={{
          marginTop: '0px',
          marginBottom: '0px',
          padding: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          fontFamily: 'Roboto, sans-serif'
        }}
      >
        {/* כותרת עם רכיב HeadLine
        <HeadLine
          groom={event ? event.NameOfGroom : "מוטי"}
          bride={event ? event.NameOfBride : "איילת"}
          sx={{ marginBottom: "20px" }}
        /> */}

        {/* כותרת מעל הפירוט */}
        <Typography
          variant="h3"
          gutterBottom
          align="center"
          sx={{
            fontWeight: 'bold',
            color: '#E0E1DD',
            paddingTop: '0px',
            mt: 0,
            marginBottom: 4,
            fontSize: { xs: '2.5rem', sm: '3rem' },
            fontFamily: 'Poppins, sans-serif',
            textShadow: '2px 2px #000'
          }}
        >
          פרטי המתנה
        </Typography>

        <Box
          sx={{
            width: '100%',
            background: 'linear-gradient(135deg, #1B263B, #415A77)',
            padding: '40px',
            borderRadius: '20px',
            boxShadow: '0px 8px 15px rgba(0, 0, 0, 0.1)',
            transition: 'transform 0.3s ease, box-shadow 0.3s ease',
            '&:hover': {
              transform: 'translateY(-5px)',
              boxShadow: '0px 15px 20px rgba(0, 0, 0, 0.2)'
            },
            marginBottom: '30px'
          }}
        >
          <form>
            <Box
              display="flex"
              flexDirection="column"
              alignItems="center"
              sx={{
                fontFamily: 'Poppins, sans-serif',
                color: '#E0E1DD'
              }}
            >
              <TextField
                onChange={handleChange}
                name="name"
                value={inputs.name}
                label="שם"
                variant="outlined"
                margin="normal"
                fullWidth
                sx={{
                  backgroundColor: '#22303C',
                  borderRadius: '15px',
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '15px',
                    '& fieldset': {
                      borderColor: '#E0E1DD',
                      borderWidth: '1px'
                    },
                    '&:hover fieldset': {
                      borderColor: '#F0A500',
                      borderWidth: '2px'
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#F0A500',
                      borderWidth: '2px'
                    }
                  },
                  '& .MuiInputLabel-root': {
                    color: '#E0E1DD'
                  },
                  '& .MuiInputBase-input': {
                    color: '#E0E1DD'
                  }
                }}
                InputProps={{
                  style: { textAlign: 'right' }
                }}
                InputLabelProps={{
                  style: { textAlign: 'right' }
                }}
              />
              <TextField
                onChange={handleChange}
                name="phone"
                value={inputs.phone}
                label="טלפון"
                variant="outlined"
                margin="normal"
                fullWidth
                sx={{
                  backgroundColor: '#22303C',
                  borderRadius: '15px',
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '15px',
                    '& fieldset': {
                      borderColor: '#E0E1DD',
                      borderWidth: '1px'
                    },
                    '&:hover fieldset': {
                      borderColor: '#F0A500',
                      borderWidth: '2px'
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#F0A500',
                      borderWidth: '2px'
                    }
                  },
                  '& .MuiInputLabel-root': {
                    color: '#E0E1DD'
                  },
                  '& .MuiInputBase-input': {
                    color: '#E0E1DD'
                  }
                }}
                InputProps={{
                  style: { textAlign: 'right' }
                }}
                InputLabelProps={{
                  style: { textAlign: 'right' }
                }}
              />
              <TextField
                onChange={handleChange}
                name="blessing"
                value={inputs.blessing}
                label="ברכה"
                variant="outlined"
                multiline
                rows={4}
                margin="normal"
                fullWidth
                sx={{
                  backgroundColor: '#22303C',
                  borderRadius: '15px',
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '15px',
                    '& fieldset': {
                      borderColor: '#E0E1DD',
                      borderWidth: '1px'
                    },
                    '&:hover fieldset': {
                      borderColor: '#F0A500',
                      borderWidth: '2px'
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#F0A500',
                      borderWidth: '2px'
                    }
                  },
                  '& .MuiInputLabel-root': {
                    color: '#E0E1DD'
                  },
                  '& .MuiInputBase-input': {
                    color: '#E0E1DD'
                  }
                }}
                InputProps={{
                  style: { textAlign: 'right' }
                }}
                InputLabelProps={{
                  style: { textAlign: 'right' }
                }}
              />
              <Button
                sx={{
                  marginTop: 2,
                  marginBottom: 2,
                  borderRadius: 2,
                  color: '#F0A500',
                  '&:hover': {
                    backgroundColor: '#F0A500',
                    color: '#1B263B'
                  }
                }}
                size="small"
              >
                <Link href="https://greetier.com/wedding/wedding-greeting/" style={{ textDecoration: 'none' }} target="_blank" color="inherit">
                  רשימת ברכות כתובות
                </Link>
              </Button>
              <Box display="flex" alignItems="center" mb={2}>
                {/* כפתור העלאת תמונה */}
                <Box display="flex" flexDirection="column" alignItems="center" mr={2}>
                  <Tooltip title="העלה תמונה">
                    <IconButton
                      sx={{
                        marginBottom: 1,
                        borderRadius: 3,
                        color: '#F0A500',
                        '&:hover': {
                          color: '#FFD700'
                        }
                      }}
                      component="label"
                    >
                      <AddPhotoAlternateIcon />
                      <input type="file" hidden onChange={handleImageUpload} />
                    </IconButton>
                  </Tooltip>
                  {uploadedImage && <CheckCircleIcon sx={{ color: 'green', fontSize: 20, marginTop: -1 }} />}
                </Box>

                {/* כפתור העלאת וידאו */}
                <Box display="flex" flexDirection="column" alignItems="center" mr={2}>
                  <Tooltip title="העלה וידאו">
                    <IconButton
                      sx={{
                        marginBottom: 1,
                        borderRadius: 3,
                        color: '#F0A500',
                        '&:hover': {
                          color: '#FFD700'
                        }
                      }}
                      component="label"
                    >
                      <TheatersIcon />
                      <input type="file" hidden onChange={handleVideoUpload} />
                    </IconButton>
                  </Tooltip>
                  {uploadedVideo && <CheckCircleIcon sx={{ color: 'green', fontSize: 20, marginTop: -1 }} />}
                </Box>

                {/* כפתור העלאת הקלטה */}
                <Box display="flex" flexDirection="column" alignItems="center">
                  <Tooltip title="העלה הקלטה">
                    <IconButton
                      sx={{
                        marginBottom: 1,
                        borderRadius: 3,
                        color: '#F0A500',
                        '&:hover': {
                          color: '#FFD700'
                        }
                      }}
                      component="label"
                    >
                      <KeyboardVoiceIcon />
                      <input type="file" hidden onChange={handleAudioUpload} />
                    </IconButton>
                  </Tooltip>
                  {uploadedAudio && <CheckCircleIcon sx={{ color: 'green', fontSize: 20, marginTop: -1 }} />}
                </Box>
              </Box>
              <TextField
                onChange={handleChange}
                name="amount"
                value={inputs.amount}
                label="סכום לתשלום"
                variant="outlined"
                margin="normal"
                fullWidth
                sx={{
                  backgroundColor: '#22303C',
                  borderRadius: '15px',
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '15px',
                    '& fieldset': {
                      borderColor: '#E0E1DD',
                      borderWidth: '1px'
                    },
                    '&:hover fieldset': {
                      borderColor: '#F0A500',
                      borderWidth: '2px'
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#F0A500',
                      borderWidth: '2px'
                    }
                  },
                  '& .MuiInputLabel-root': {
                    color: '#E0E1DD'
                  },
                  '& .MuiInputBase-input': {
                    color: '#E0E1DD'
                  }
                }}
                InputProps={{
                  style: { textAlign: 'right' }
                }}
                InputLabelProps={{
                  style: { textAlign: 'right' }
                }}
              />
              <Box display="flex" justifyContent="center" alignItems="center" mt={2} mb={3}>
                <Button
                  onClick={handleClick}
                  sx={{
                    width: 150,
                    height: 50,
                    margin: 1,
                    borderRadius: 3,
                    backgroundColor: '#F0A500',
                    ':hover': {
                      backgroundColor: '#FFD700'
                    },
                    color: '#1B263B',
                    padding: '10px 20px',
                    fontSize: '1.2rem',
                    fontWeight: 'bold',
                    boxShadow: '0px 5px 15px rgba(240, 165, 0, 0.4)',
                    transition: '0.3s'
                  }}
                  variant="contained"
                  startIcon={<img src={PayPalIcon} alt="PayPal" style={{ width: 100, height: 40 }} />}
                ></Button>
                <Button
                  onClick={handleClick}
                  sx={{
                    width: 150,
                    height: 50,
                    margin: 1,
                    borderRadius: 3,
                    backgroundColor: '#F0A500',
                    ':hover': {
                      backgroundColor: '#FFD700'
                    },
                    color: '#1B263B',
                    padding: '10px 20px',
                    fontSize: '1.2rem',
                    fontWeight: 'bold',
                    boxShadow: '0px 5px 15px rgba(240, 165, 0, 0.4)',
                    transition: '0.3s'
                  }}
                  variant="contained"
                  startIcon={<img src={PayBoxIcon} alt="PayBox" style={{ width: 100, height: 40 }} />}
                ></Button>
                <Button
                  onClick={handleClick}
                  sx={{
                    width: 150,
                    height: 50,
                    margin: 1,
                    borderRadius: 3,
                    backgroundColor: '#F0A500',
                    ':hover': {
                      backgroundColor: '#FFD700'
                    },
                    color: '#1B263B',
                    padding: '10px 20px',
                    fontSize: '1.2rem',
                    fontWeight: 'bold',
                    boxShadow: '0px 5px 15px rgba(240, 165, 0, 0.4)',
                    transition: '0.3s'
                  }}
                  variant="contained"
                  startIcon={<img src={BitIcon} alt="Bit" style={{ width: 100, height: 40 }} />}
                ></Button>
              </Box>
            </Box>
          </form>
        </Box>
      </Container>

      <style>
        {`
          @keyframes animateBg {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
        `}
      </style>
      {/* Footer פשוט בתחתית העמוד */}
      <Box
        sx={{
          marginTop: 5,
          textAlign: 'center',
          py: 1.5,
          backgroundColor: 'rgba(0,0,0,0.3)',
          color: '#E0E1DD'
        }}
      >
        <Typography variant="body2" sx={{ fontSize: '0.9rem' }}>
          &copy; {new Date().getFullYear()} EASY GIFT | כל הזכויות שמורות
        </Typography>
      </Box>
    </Box>
  )
}

export default Details
