import React, { useEffect, useState, useContext } from 'react'
import { Context } from '../App'
import axios from 'axios'
import { TextField, Box, Container, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Collapse, IconButton, CircularProgress, Button, Dialog } from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { Link } from 'react-router-dom'
import ImageIcon from '@mui/icons-material/Image'
import MicIcon from '@mui/icons-material/Mic'
import VideocamIcon from '@mui/icons-material/Videocam'
import ErrorIcon from '@mui/icons-material/Error'

const GiftHistory = () => {
  const { userId, eventId, detailsId } = useContext(Context)
  const [gifts, setGifts] = useState([])
  const [errorMessage, setErrorMessage] = useState('')
  const [expandedRows, setExpandedRows] = useState({})
  const [loading, setLoading] = useState(true)
  const [openFile, setOpenFile] = useState(false)
  const [imageSrc, setImageSrc] = useState('')
  const [searchTerm, setSearchTerm] = useState("") // 🔍 משתנה חיפוש


  // הפונקציה בוחרת איקון לפי סוג הקובץ עם הצבע המבוקש
  const getIcon = fileType => {
    switch (fileType) {
      case 'image':
        return <ImageIcon style={{ color: '#4A90E2', fontSize: '1.4rem' }} /> // כחול מודרני
      case 'audio':
        return <MicIcon style={{ color: '#2ECC71', fontSize: '1.4rem' }} /> // ירוק בהיר ונעים
      case 'video':
        return <VideocamIcon style={{ color: '#F39C12', fontSize: '1.4rem' }} /> // כתום זהוב
      default:
        return <ErrorIcon style={{ color: '#E74C3C', fontSize: '1.4rem' }} /> // אדום קלאסי
    }
  }

  useEffect(() => {
    const fetchGifts = async () => {
      setLoading(true)
      const startTime = Date.now()
      try {
        // const response = await axios.post('http://localhost:2001/api/users/giftsById', { _id: userId })
        // console.log('🎁 קיבלתי מתנות:', response.data)
        console.log('setDetailsId:', detailsId)
        const res = await axios.post('https://easygift-server.onrender.com/api/gift/getgift', { _id: detailsId })
        console.log(res.data)

        if (res.data && res.data.length > 0) {
          setGifts(res.data)
        } else {
          setErrorMessage(res.data.length === 0 ? 'אין מתנות להצגה' : 'שגיאה בקבלת המתנות')
        }
      } catch (error) {
        console.error('❌ שגיאה בקבלת המתנות:', error)
        setErrorMessage('שגיאה בקבלת המתנות')
        setErrorMessage('')
      } finally {
        setLoading(false)
      }
    }

    if (userId) {
      fetchGifts()
    }
  }, [userId]) // רק userId נשאר בתלות

  const toggleRow = id => {
    setExpandedRows(prev => ({
      ...prev,
      [id]: !prev[id]
    }))
  }

  const handleClickFile = () => {
    setOpenFile(true)
  }

  const viewFile = fileId => {
    if (!fileId) {
      console.error('❌ fileId חסר!')
      return
    }
    const fileUrl = `https://easygift-server.onrender.com/api/files/view/${fileId}`
    console.log('📂 פותח קובץ:', fileUrl)
    window.open(fileUrl, '_blank') // ✅ פותח את הקובץ בחלון חדש
  }

  const downloadFile = async fileId => {
    if (!fileId) {
      console.error('❌ fileId חסר!')
      return
    }

    try {
      console.log('📥 מוריד קובץ:', fileId)

      const response = await axios.get(`https://easygift-server.onrender.com/api/files/download/${fileId}`, {
        responseType: 'blob' // ✅ קבלת הקובץ כ-Blob
      })

      // יצירת URL זמני להורדה
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url

      // קביעת שם הקובץ
      const fileName = response.headers['content-disposition']?.split('filename=')[1] || `downloaded_file`
      link.setAttribute('download', fileName.replace(/"/g, '')) // ✅ הוספת שם לקובץ

      // סימולציה של לחיצה להורדת הקובץ
      document.body.appendChild(link)
      link.click()

      // ניקוי ה-URL הזמני
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)

      console.log('✅ הקובץ ירד בהצלחה!')
    } catch (error) {
      console.error('❌ שגיאה בהורדת הקובץ:', error)
    }
  }

  const highlightText = (text, searchTerm) => {
    if (!searchTerm) return text;
    if (!text) return ''; // מונע שגיאה במקרה של undefined/null
    const regex = new RegExp(`(${searchTerm})`, 'gi');
    return String(text).split(regex).map((part, index) =>
      regex.test(part) ? <span key={index} style={{ backgroundColor: 'yellow' }}>{part}</span> : part
    );
  };

  // 📌 סינון הנתונים לפי שם אירוע, ברכה, סכום ותאריך
  const filteredGifts = gifts.filter(gift =>
    (gift.toEventName && gift.toEventName.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (gift.blessing && gift.blessing.toLowerCase().includes(searchTerm.toLowerCase())) ||
    gift.amount.toString() === searchTerm || // חיפוש סכום מדויק
    gift.entryDate.slice(0, 10, 100).includes(searchTerm) // חיפוש תאריך בפורמט YYYY-MM-DD
  );

  return (
    <Box
      sx={{
        position: 'relative',
        minHeight: '100vh',
        direction: 'rtl',
        paddingTop: '1px',
        textAlign: 'center',
        background: 'linear-gradient(135deg, #0D1B2A, #1B263B)',
        backgroundSize: '400% 400%',
        animation: 'animateBg 15s ease infinite',
        paddingBottom: '40px'
      }}
    >
      <Container
        maxWidth="lg"
        sx={{
          marginTop: '80px',
          fontFamily: 'Poppins, sans-serif'
        }}
      >
        <Typography
          variant="h3"
          gutterBottom
          sx={{
            fontWeight: 'bold',
            color: '#E0E1DD',
            textShadow: '2px 2px #000',
            textAlign: 'center',
            mb: 2,
            fontSize: { xs: '2.5rem', sm: '3rem' }
          }}
        >
          היסטוריית מתנות
        </Typography>
        <Typography
          variant="h6"
          sx={{
            textShadow: '1px 1px #000',
            color: '#E0E1DD',
            textAlign: 'center',
            mb: 4
          }}
        >
          כל המתנות שלך במקום אחד
        </Typography>

        {loading ? (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '200px'
            }}
          >
            <CircularProgress color="secondary" />
          </Box>
        ) : (
          <>
            {errorMessage && <Typography sx={{ color: 'red', textAlign: 'center' }}>{errorMessage}</Typography>}
            {!errorMessage?.trim() && gifts.length === 0 && (
              <Typography
                variant="h6"
                sx={{
                  color: '#E0E1DD',
                  textAlign: 'center',
                  padding: '20px',
                  fontStyle: 'bold',
                  fontSize: { xs: '1.5rem', sm: '2rem' }
                }}
              >
                אופס, נראה שהמתנות לקחו הפסקת קפה! ☕<br />
                או לא הגיעו לעבודה היום!
                <br />
                בדוק שוב מאוחר יותר.
                <br />
                או אחרי שתיתן משהו , קמצן!
                <br />
                😄
              </Typography>
            )}
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: '20px', marginBottom: '20px' }}>
              <TextField
                label="חיפוש"
                variant="outlined"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                fullWidth
                sx={{
                  background: 'linear-gradient(135deg, rgb(100, 130, 160), rgb(140, 180, 220))',
                  borderRadius: '8px',
                  width: '80%', // הקטנת הרוחב
                  '& .MuiOutlinedInput-notchedOutline': {
                    border: 'none'
                  },
                  '&:before': {
                    display: 'none'
                  }
                }}
                InputLabelProps={{
                  style: { textAlign: 'right', right: 20 }, // יישור המילה "חיפוש" לימין
                }}
              />
            </Box>
            {filteredGifts.length > 0 && (
              <TableContainer
                component={Paper}
                size="lg"
                sx={{
                  textAlign: 'center',
                  background: 'linear-gradient(135deg, #1B263B, #415A77)',
                  borderRadius: '15px',
                  padding: '10px',
                  boxShadow: '0px 8px 16px rgba(0, 0, 0, 0.5)',
                  transition: 'transform 0.3s, box-shadow 0.3s',
                  '&:hover': {
                    transform: 'scale(1.02)',
                    boxShadow: '0px 12px 24px rgba(0, 0, 0, 0.7)'
                  }
                }}
              >
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ color: '#E0E1DD', fontWeight: 'bold', textAlign: 'center' }}></TableCell>
                      <TableCell sx={{ color: '#E0E1DD', fontWeight: 'bold', textAlign: 'center' }}>מתנה מספר</TableCell>
                      <TableCell sx={{ color: '#E0E1DD', fontWeight: 'bold', textAlign: 'center' }}>שם האירוע</TableCell>
                      <TableCell sx={{ color: '#E0E1DD', fontWeight: 'bold', textAlign: 'center' }}>סכום</TableCell>
                      <TableCell sx={{ color: '#E0E1DD', fontWeight: 'bold', textAlign: 'center' }}>תאריך</TableCell>
                      <TableCell sx={{ color: '#E0E1DD', fontWeight: 'bold', textAlign: 'center' }}>קובץ מצורף</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredGifts.map((gift, index) => (
                      <React.Fragment key={gift._id}>
                        <TableRow
                          onClick={() => toggleRow(gift._id)}
                          sx={{
                            cursor: 'pointer',
                            borderBottom: '2px solid rgba(255, 255, 255, 0.2)',
                            transition: 'background-color 0.3s',
                            '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.05)' }
                          }}
                        >
                          <TableCell>
                            <IconButton
                              size="small"
                              sx={{
                                color: '#E0E1DD',
                                textAlign: 'center'
                              }}
                            >
                              <ExpandMoreIcon />
                            </IconButton>
                          </TableCell>
                          <TableCell sx={{ color: '#E0E1DD', textAlign: 'center' }}>{highlightText(gift.toEventName, searchTerm)}</TableCell>
                          <TableCell sx={{ color: '#E0E1DD', textAlign: 'center' }}>{highlightText(gift.amount, searchTerm)} ₪</TableCell>
                          <TableCell sx={{ color: '#E0E1DD', textAlign: 'center' }}>{highlightText(gift.blessing, searchTerm)}</TableCell>
                          <TableCell sx={{ color: '#E0E1DD', textAlign: 'center' }}>{highlightText(new Date(gift.entryDate).toLocaleDateString(), searchTerm)}</TableCell>

                          <TableCell sx={{ textAlign: 'center', display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center' }}>
                            {getIcon(gift.file?.fileType)}
                            {gift.file && (
                              <Box sx={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <Button
                                  variant="contained"
                                  sx={{
                                    margin: '-5px 10px -5px 10px',
                                    padding: '0px',
                                    backgroundColor: 'transparent',
                                    color: 'lightskyblue',
                                    boxShadow: 'none',
                                    borderRadius: '20px',
                                    transition: 'transform 0.4s ease-in-out',
                                    '&:hover': {
                                      margin: '-5px 10px -5px 10px',
                                      padding: '0px',
                                      backgroundColor: 'rgba(0, 0, 0, 0.1)',
                                      transform: 'scale(1.2)',
                                      boxShadow: 'none'
                                    }
                                  }}
                                  onClick={() => downloadFile(gift.file.fileId)}
                                >
                                  הורד קובץ
                                </Button>
                                <Button
                                  variant="contained"
                                  sx={{
                                    margin: '-5px 10px -5px 10px',
                                    padding: '0px',
                                    backgroundColor: 'transparent',
                                    color: 'lightskyblue',
                                    boxShadow: 'none',
                                    borderRadius: '20px',
                                    transition: 'transform 0.4s ease-in-out',
                                    '&:hover': {
                                      margin: '-5px 10px -5px 10px',
                                      padding: '0px',
                                      backgroundColor: 'rgba(0, 0, 0, 0.1)',
                                      transform: 'scale(1.2)',
                                      boxShadow: 'none'
                                    }
                                  }}
                                  onClick={() => viewFile(gift.file.fileId, setImageSrc)}
                                >
                                  הצג קובץ
                                </Button>
                                {imageSrc && <img src={imageSrc} alt="Fetched File" />}
                              </Box>
                            )}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell colSpan={6} sx={{ p: 0 }}>
                            <Collapse in={expandedRows[gift._id]} timeout="auto" unmountOnExit>
                              <Box margin={2} sx={{ color: '#E0E1DD', textAlign: 'center', pt: 0 }}>
                                <Typography variant="body1">ברכה: {gift.blessing}</Typography>
                              </Box>
                            </Collapse>
                          </TableCell>
                        </TableRow>
                      </React.Fragment>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </>
        )}
      </Container>
      <Dialog open={openFile} onClose={() => setOpenFile(false)} maxWidth="md" fullWidth>
        <Box sx={{ padding: 2, textAlign: 'center' }}>
          <iframe width="100%" height="500px" title="קובץ מצורף"></iframe>
        </Box>
      </Dialog>

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

export default GiftHistory
