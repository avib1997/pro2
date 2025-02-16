import React, { useEffect, useState, useContext } from 'react'
import { Context } from '../App'
import axios from 'axios'
import { Box, Container, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Collapse, IconButton, CircularProgress, Button } from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { Link } from 'react-router-dom'

const GiftHistory = () => {
  const { userId, eventId } = useContext(Context)
  const [gifts, setGifts] = useState([])
  const [errorMessage, setErrorMessage] = useState('')
  const [expandedRows, setExpandedRows] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchGifts = async () => {
      setLoading(true)
      const startTime = Date.now()
      try {
        const response = await axios.post('http://localhost:2001/api/users/giftsById', { _id: userId })
        const res = await axios.post('http://localhost:2001/api/gift/getgift', { _id: response.data })

        const elapsedTime = Date.now() - startTime
        const delay = 3000 - elapsedTime
        if (delay > 0) {
          await new Promise(resolve => setTimeout(resolve, delay))
        }

        if (res.data && res.data.length > 0) {
          setGifts(res.data)
        } else {
          setErrorMessage('אין מתנות להצגה.')
        }
      } catch (error) {
        const elapsedTime = Date.now() - startTime
        const delay = 3000 - elapsedTime
        if (delay > 0) {
          await new Promise(resolve => setTimeout(resolve, delay))
        }
        setErrorMessage('שגיאה בטעינת הנתונים מהשרת.')
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
        maxWidth="md"
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
            {/* אם אין מתנות להצגה */}
            {!errorMessage && gifts.length === 0 ? (
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
            ) : (
              <TableContainer
                component={Paper}
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
                          <TableCell
                            sx={{
                              color: '#E0E1DD',
                              textAlign: 'center'
                            }}
                          >
                            {index + 1}
                          </TableCell>
                          <TableCell
                            sx={{
                              color: '#E0E1DD',
                              textAlign: 'center'
                            }}
                          >
                            {gift.toEventName}
                          </TableCell>
                          <TableCell
                            sx={{
                              color: '#E0E1DD',
                              textAlign: 'center'
                            }}
                          >
                            {gift.amount} ₪
                          </TableCell>
                          <TableCell
                            sx={{
                              color: '#E0E1DD',
                              textAlign: 'center'
                            }}
                          >
                            {new Date(gift.entryDate).toLocaleDateString()}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell colSpan={5} sx={{ p: 0 }}>
                            <Collapse in={expandedRows[gift._id]} timeout="auto" unmountOnExit>
                              <Box margin={1} sx={{ color: '#E0E1DD', textAlign: 'center', pt: 1 }}>
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
