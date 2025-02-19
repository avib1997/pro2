import React, { useEffect, useState, useContext } from 'react'
import { Context } from '../App'
import axios from 'axios'
import { Box, Container, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Collapse, IconButton, CircularProgress, Button, Dialog } from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { Link } from 'react-router-dom'
import ImageIcon from '@mui/icons-material/Image'
import MicIcon from '@mui/icons-material/Mic'
import VideocamIcon from '@mui/icons-material/Videocam'
import ErrorIcon from '@mui/icons-material/Error'

const GiftHistory = () => {
  const { userId, eventId } = useContext(Context)
  const [gifts, setGifts] = useState([])
  const [errorMessage, setErrorMessage] = useState('')
  const [expandedRows, setExpandedRows] = useState({})
  const [loading, setLoading] = useState(true)
  const [openFile, setOpenFile] = useState(false)
  const [imageSrc, setImageSrc] = useState('')

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
        const response = await axios.post('http://localhost:2001/api/users/giftsById', { _id: userId })
        const res = await axios.post('http://localhost:2001/api/gift/getgift', { _id: response.data })
        console.log(res.data[0].file)

        const elapsedTime = Date.now() - startTime
        const delay = 10000 - elapsedTime
        if (delay > 0) {
          await new Promise(resolve => setTimeout(resolve, delay))
        }

        if (res.data && res.data.length > 0) {
          setGifts(res.data)
        } else {
          setErrorMessage(res.data.length === 0 ? 'אין מתנות להצגה' : 'שגיאה בקבלת המתנות')
        }
      } catch (error) {
        const elapsedTime = Date.now() - startTime
        const delay = 5000 - elapsedTime
        if (delay > 0) {
          await new Promise(resolve => setTimeout(resolve, delay))
        }
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
    const fileUrl = `http://localhost:2001/api/files/view/${fileId}`
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

      const response = await axios.get(`http://localhost:2001/api/files/download/${fileId}`, {
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
            {gifts.length > 0 && (
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
                    {gifts.map((gift, index) => (
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
                          <TableCell sx={{ color: '#E0E1DD', textAlign: 'center' }}>{index + 1}</TableCell>
                          <TableCell sx={{ color: '#E0E1DD', textAlign: 'center' }}>{gift.toEventName}</TableCell>
                          <TableCell sx={{ color: '#E0E1DD', textAlign: 'center' }}>{gift.amount} ₪</TableCell>
                          <TableCell sx={{ color: '#E0E1DD', textAlign: 'center' }}>{new Date(gift.entryDate).toLocaleDateString()}</TableCell>

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
