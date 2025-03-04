//src/Pages/Details.js
import React, { useContext, useState, useEffect } from 'react'
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate'
import CheckCircleIcon from '@mui/icons-material/CheckCircle' // אייקון לסימון העלאה
import KeyboardVoiceIcon from '@mui/icons-material/KeyboardVoice'
import TheatersIcon from '@mui/icons-material/Theaters'
import { Box, Button, Container, IconButton, Link, TextField, Tooltip, Typography } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { Context } from '../App'
import sendLog from '../LogSend'
import axios from 'axios'
import { useLayoutEffect } from 'react'

const Details = () => {
  const navigate = useNavigate()
  const [eventNum, setEventNum] = useState('')
  const { eventName, setEventName, giftDetails, setGiftDetails, userId, event, eventId, setEvent, eventNumber, setEventId, setEventNumber } = useContext(Context)
  const [amount, setAmount] = useState(0)
  const [errorMessage, setErrorMessage] = useState('')
  const [file, setFile] = useState(null)

  // מצבים עבור הקבצים שהועלו
  const [uploadedImage, setUploadedImage] = useState(false)
  const [uploadedVideo, setUploadedVideo] = useState(false)
  const [uploadedAudio, setUploadedAudio] = useState(false)

  useLayoutEffect(() => {
    window.scrollTo(0, window.scrollY)
  }, [])

  useEffect(() => {
    const eventType = event.TypeOfEvent || "אירוע";
    setEventName(event.NameOfBride
      ? `${eventType} של ${event.NameOfGroom} ו${event.NameOfBride}`
      : `${eventType} של ${event.NameOfGroom}`);
    console.log('🎉 מזהה האירוע:', eventNumber)
  }, [setEventNumber, eventNumber, event])

  const handleChange = e => {
    e.preventDefault()
    const { name, value } = e.target
    setGiftDetails(prev => {
      const updatedDetails = { ...prev, [name]: value }
      const { name: n, phone, blessing, amount } = updatedDetails
      localStorage.setItem('giftDetails', JSON.stringify({ name: n, phone, blessing, amount }))
      return updatedDetails
    })
  }

  const handleClick = async e => {
    e.preventDefault()
    const errors = []

    // בדיקות אימות נתונים
    if (!giftDetails.name.trim()) {
      errors.push('יש למלא את שדה השם')
    } else if (/\d/.test(giftDetails.name)) {
      errors.push('שם לא יכול להכיל מספרים')
    }

    if (!giftDetails.phone.trim()) {
      errors.push('יש למלא את שדה הטלפון')
    } else if (!/^\d+$/.test(giftDetails.phone)) {
      errors.push('טלפון חייב להכיל רק מספרים')
    }

    if (giftDetails.blessing.trim() && /\d/.test(giftDetails.blessing)) {
      errors.push('ברכה לא יכולה להכיל מספרים')
    }

    if (!giftDetails.amount.trim()) {
      errors.push('יש למלא את שדה הסכום לתשלום')
    } else if (isNaN(giftDetails.amount)) {
      errors.push('סכום לתשלום חייב להיות מספר בלבד')
    }

    if (errors.length > 0) {
      setErrorMessage(errors.join('\n'))
      return
    }

    setErrorMessage('')

    console.log('📌 event object:', event)

    let fileDetails = null
    if (uploadedImage || uploadedVideo || uploadedAudio) {
      fileDetails = await uploadFile() // ✅ מחכים שהקובץ יעלה לפני שנמשיך
      console.log('📌 fileDetails:', fileDetails)
    }

    const fileId = fileDetails ? fileDetails.file.fileId : null
    const fileType = fileDetails ? fileDetails.file.fileType : null



    const newGift = {
      name: giftDetails.name,
      phone: giftDetails.phone,
      blessing: giftDetails.blessing,
      amount: giftDetails.amount,
      userid_gift: userId,
      EventId: eventId,
      toEventName: event.NameOfBride ? `${event.NameOfGroom} & ${event.NameOfBride}` : event.NameOfGroom || '',
      file: fileId ? { fileId, fileType } : undefined // 🔹 שמירת הקובץ רק אם קיים
    };
    console.log('eventId:', eventId);
    sendLog('success', 'pages', 200, '✅ Payment עבר לדף', 'client', '/Details_page', 'handleClick', userId, null, null);
    navigate('/Payment', { state: { newGift } });

    setGiftDetails({
      name: '',
      phone: '',
      blessing: '',
      amount: ''
    })

    localStorage.removeItem('giftDetails') // מחיקת הנתונים מה-LocalStorage
  }

  const uploadFile = async () => {
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('eventId', eventId)
      if (userId) formData.append('userId', userId)

      console.log('📌 formData:', [...formData.entries()])

      const response = await axios.post('https://easygift-server.onrender.com/api/files/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })

      console.log('✅ קובץ הועלה בהצלחה:', response.data)
      return response.data
    } catch (error) {
      console.error('❌ שגיאה בהעלאת הקובץ:', error)
      return null // ✅ אם יש שגיאה, נחזיר null ולא undefined
    }
  }

  const handleImageUpload = e => {
    e.preventDefault()
    setFile(e.target.files[0])
    console.log('📸 התמונה שנבחרה:', e.target.files[0])
    const file = e.target.files[0]
    if (file && file.size <= 5 * 1024 * 1024) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setGiftDetails(prev => ({ ...prev, imageBase64: reader.result }))
      }
      reader.readAsDataURL(file)
      setUploadedImage(true)
    } else {
      alert('הקובץ גדול מדי! ניתן להעלות עד 10MB בלבד.')
    }
  }

  const handleVideoUpload = e => {
    e.preventDefault()
    setFile(e.target.files[0])
    console.log('🎥 הוידאו שנבחר:', e.target.files[0])
    const file = e.target.files[0]
    if (file && file.size <= 5 * 1024 * 1024) {
      const reader = new FileReader()
      reader.onloadend = () => {
        // reader.result יהיה "data:image/png;base64,...."
        setGiftDetails(prev => ({ ...prev, videoBase64: reader.result }))
      }
      reader.readAsDataURL(file)
      setUploadedVideo(true)
    } else {
      alert('הקובץ גדול מדי! ניתן להעלות עד 5MB בלבד.')
    }
  }

  const handleAudioUpload = e => {
    e.preventDefault()
    setFile(e.target.files[0])
    console.log('🎤 ההקלטה שנבחרה:', e.target.files[0])
    const file = e.target.files[0]
    if (file && file.size <= 5 * 1024 * 1024) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setGiftDetails(prev => ({ ...prev, videoBase64: reader.result }))
      }
      reader.readAsDataURL(file)
      setUploadedAudio(true)
    } else {
      alert('הקובץ גדול מדי! ניתן להעלות עד 10MB בלבד.')
    }
  }

  const handleClickEventNumber = async e => {
    e.preventDefault()
    console.log('🔍 בדיקת מספר אירוע:', eventNum)
    // אם לא הוזן מספר אירוע, נציג הודעת שגיאה ולא נמשיך
    if (!eventNum) {
      setErrorMessage('❌ חסר מספר אירוע')
      return
    }

    // אם כן הוזן, נבצע את הקריאה לשרת
    axios
      .post(`https://easygift-server.onrender.com/api/events/checkEventNumber`, { Event_number: eventNum })
      .then(response => {
        console.log('✅ תגובה מהשרת:', response.data)
        if (response.data && response.data._id) {
          setEvent(response.data) // שמירת האירוע בסטייט
          setEventNumber(eventNum) // שמירת ה-ID בקונטקסט
          setEventId(response.data._id) // שמירת ה-ID בסטייט
          console.log('✅ מספר האירוע נמצא:', response.data)
        } else {
          console.log('❌ מספר האירוע לא נמצא')
          setErrorMessage('❌ אירוע לא נמצא, בדוק את המספר שהוזן')
        }
      })
      .catch(error => {
        console.log('❌ שגיאה בזמן בדיקת מספר האירוע:', error)
        setErrorMessage('❌ שגיאה בחיבור לשרת, נסה שוב')
      })
    setErrorMessage('')
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

      {eventNumber ? (
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
          <Typography
            variant="h3"
            sx={{
              fontWeight: "bold",
              textShadow: "2px 2px 4px rgba(0,0,0,0.5)",
              fontFamily: "serif",
              mt: '60px',
              color: 'rgba(240, 204, 0, 0.9)',
              font: 'bold 2.5rem/3rem Poppins, sans-serif',
              fontSize: { xs: '4rem', sm: '5rem' },
              marginBottom: 4
            }}
          >
            {eventName}
          </Typography>

          <Typography
            variant="h3"
            gutterBottom
            align="center"
            sx={{
              fontWeight: 'bold',
              color: '#E0E1DD',
              mt: '14px',
              marginBottom: 4,
              fontSize: {
                xs: '2.5rem',
                sm: '3rem'
              },
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
                  value={giftDetails.name}
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
                  value={giftDetails.phone}
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
                  value={giftDetails.blessing}
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
                  <Link
                    href="https://greetier.com/wedding/wedding-greeting/"
                    style={{
                      textDecoration: 'none'
                    }}
                    target="_blank"
                    color="inherit"
                  >
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
                        <input type="file" hidden accept="image/*" onChange={handleImageUpload} />
                      </IconButton>
                    </Tooltip>
                    {uploadedImage && (
                      <CheckCircleIcon
                        sx={{
                          color: 'green',
                          fontSize: 20,
                          marginTop: -1
                        }}
                      />
                    )}
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
                        <input type="file" hidden accept="audio/*" onChange={handleVideoUpload} />
                      </IconButton>
                    </Tooltip>
                    {uploadedVideo && (
                      <CheckCircleIcon
                        sx={{
                          color: 'green',
                          fontSize: 20,
                          marginTop: -1
                        }}
                      />
                    )}
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
                        <input type="file" hidden accept="audio/*" onChange={handleAudioUpload} />
                      </IconButton>
                    </Tooltip>
                    {uploadedAudio && (
                      <CheckCircleIcon
                        sx={{
                          color: 'green',
                          fontSize: 20,
                          marginTop: -1
                        }}
                      />
                    )}
                  </Box>
                </Box>

                {errorMessage &&
                  errorMessage.split('\n').map((line, index) => (
                    <Typography
                      key={index}
                      variant="body1"
                      sx={{
                        color: 'red',
                        textAlign: 'center',
                        fontFamily: 'Poppins, sans-serif',
                        fontSize: '1.2rem',
                        fontWeight: 'bold'
                      }}
                    >
                      {line}{' '}
                      <span
                        style={{
                          display: 'inline-block',
                          animation: 'blink 1s infinite'
                        }}
                      >
                        !
                      </span>
                    </Typography>
                  ))}

                <TextField
                  onChange={handleChange}
                  name="amount"
                  value={giftDetails.amount}
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
                      width: 90,
                      height: 90,
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
                      transition: '0.3s',
                      display: 'flex', // 👈 חשוב
                      alignItems: 'center', // 👈 ממרכז את התוכן אנכית
                      justifyContent: 'center' // 👈 ממרכז את התוכן אופקית
                    }}
                    variant="contained"
                  >
                    <img
                      src={`https://logo.clearbit.com/paypal.com`}
                      alt="PayPal"
                      style={{
                        width: 50, // 👈 כוונן את הגודל כך שיתאים
                        height: 50,
                        objectFit: 'contain'
                      }}
                    />
                  </Button>

                  {/* <Button
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
                    startIcon={
                      <img
                        src={PayBoxIcon}
                        alt="PayBox"
                        style={{
                          width: 100,
                          height: 40
                        }}
                      />
                    }
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
                    startIcon={
                      <img
                        src={BitIcon}
                        alt="Bit"
                        style={{
                          width: 100,
                          height: 40
                        }}
                      />
                    }
                  ></Button> */}
                </Box>
              </Box>
            </form>
          </Box>
        </Container>
      ) : (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100vh',
            fontFamily: 'Poppins, sans-serif',
            color: '#E0E1DD'
          }}
        >
          {errorMessage && (
            <Typography
              sx={{
                color: 'red',
                marginBottom: '10px',
                fontSize: '2rem', // גודל גופן גדול יותר
                fontWeight: 'bold' // טקסט מודגש
                //textShadow: "1px 1px 2px rgba(0,0,0,0.3)", // צל קטן לטקסט (לא חובה)
              }}
            >
              {errorMessage}
            </Typography>
          )}
          <Typography
            variant="h6"
            gutterBottom
            align="center"
            sx={{
              fontWeight: 'bold',
              color: '#E0E1DD',
              marginBottom: 4,
              fontSize: {
                xs: '1.5rem',
                sm: '2rem'
              },
              fontFamily: 'Poppins, sans-serif',
              textShadow: '2px 2px #000'
            }}
          >
            יש להזין מספר אירוע
          </Typography>
          <TextField
            onChange={e => setEventNum(e.target.value)}
            value={eventNum}
            label="מספר אירוע"
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
              },
              width: '20%'
            }}
            InputProps={{
              style: { textAlign: 'right' }
            }}
            InputLabelProps={{
              style: { textAlign: 'right' }
            }}
          />
          <Button
            onClick={handleClickEventNumber}
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
          >
            הצג
          </Button>
        </Box>
      )}

      <style>
        {`
    @keyframes animateBg {
      0% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
      100% { background-position: 0% 50%; }
    }
    @keyframes blink {
      0% { transform: scale(1); }
      50% { transform: scale(1.5); }
      100% { transform: scale(1); }
    }
  `}
      </style>
    </Box>
  )
}

export default Details
