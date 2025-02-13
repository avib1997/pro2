import React, { useEffect, useState, useRef, useContext } from 'react'
import { Box, Button, CircularProgress, Dialog, DialogTitle, DialogContent, DialogActions, Typography, Table, TableHead, TableRow, TableCell, TableBody, IconButton, Tooltip } from '@mui/material'
import PrintIcon from '@mui/icons-material/Print'
import GetAppIcon from '@mui/icons-material/GetApp'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import axios from 'axios'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import sendLog from '../../LogSend'
import { Context } from '../../App'

const EventDialog = ({ open, event, onClose, onDelete, onEdit }) => {
  const { userId, eventId } = useContext(Context)
  const [gifts, setGifts] = useState([])
  const [loading, setLoading] = useState(true)
  const printRef = useRef()

  useEffect(() => {
    const fetchGifts = async () => {
      if (!event?._id) return
      setLoading(true)
      try {
        const res = await axios.post('http://localhost:2001/api/events/getGiftsByEvent', { EventId: event._id })
        console.log('🎁 מתנות שהתקבלו:', res.data)
        setGifts(res.data)
      } catch (error) {
        console.error('❌ Error fetching gifts:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchGifts()
  }, [event?._id])

  const totalAmount = gifts.reduce((sum, gift) => sum + (gift.amount || 0), 0)

  const handlePrint = () => {
    const printContent = document.getElementById('pdf-content')
    const WinPrint = window.open('', '', 'width=900,height=650')
    WinPrint.document.write(`
      <html dir="rtl">
        <head>
          <title>הדפסה</title>
          <style>
            body { font-family: 'Arial', sans-serif; margin: 20px; }
          </style>
        </head>
        <body>${printContent.innerHTML}</body>
      </html>
    `)
    WinPrint.document.close()
    WinPrint.focus()
    WinPrint.print()
    WinPrint.close()
  }

  const handleDownloadPdf = async () => {
    // שימוש ב-html2canvas ליצירת תמונה מהאלמנט ולאחר מכן הוספת התמונה ל-PDF
    const element = printRef.current
    if (!element) return
    const canvas = await html2canvas(element, { useCORS: true, scrollY: -window.scrollY })
    const imgData = canvas.toDataURL('image/png')
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    })
    const imgProps = pdf.getImageProperties(imgData)
    const pdfWidth = pdf.internal.pageSize.getWidth()
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight)
    // שימו לב: כדי שהתמיכה בעברית תהיה מלאה, יש להוסיף ל-jsPDF פונט תומך עברית.
    pdf.save(`אירוע_${event.Event_number}.pdf`)
  }

  // קריאה לפונקציית עריכה שמופעלת מההורה
  const handleEdit = () => {
    onEdit(event)
  }

  // פונקציה למחיקת האירוע – מבצעת קריאה לשרת ואז מפעילה את onDelete עם מזהה האירוע
  const handleDelete = async () => {
    console.log('🗑 eventId במחיקת אירוע:', eventId)
    if (!window.confirm('האם אתה בטוח שברצונך למחוק את האירוע?')) return
    try {
      await axios.delete(`http://localhost:2001/api/events/${eventId}`)
      onDelete(event._id)
      onClose()
    } catch (error) {
      console.error('❌ Error deleting event:', error)
      //sendLog('error', 'event', 500, 'Error deleting event', 'client', 'http://localhost:3000/events', 'handleDelete', null, event._id, error)
    }
  }

  return (
    <Dialog
      PaperProps={{
        sx: {
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '20px',
          boxShadow: 'none'
          //direction: 'rtl'
        }
      }}
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="md"
      BackdropProps={{
        sx: {
          backgroundColor: 'rgba(0, 0, 0, .7)'
        }
      }}
    >
      <div ref={printRef}>
        <DialogTitle
          sx={{
            textAlign: 'center',
            fontWeight: 'bold',
            fontSize: '2rem',
            color: '#E0E1DD',
            background: 'linear-gradient(135deg, #1B263B, #415A77)',
            borderTopLeftRadius: '20px',
            borderTopRightRadius: '20px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: 2
          }}
        >
          <Typography
            variant="h4"
            sx={{
              fontWeight: 'bold',
              color: '#E0E1DD'
            }}
          >
            ה{event.TypeOfEvent} של
          </Typography>
          <Typography
            variant="h3"
            sx={{
              fontWeight: 'bold',
              color: '#E0E1DD'
            }}
          >
            {event.TypeOfEvent !== 'חתונה' ? event.NameOfGroom : `${event.NameOfGroom} ו${event.NameOfBride}`}
          </Typography>
          <Typography
            variant="h6"
            sx={{
              color: '#E0E1DD',
              fontSize: '1rem',
              marginTop: '4px'
            }}
          >
            <strong>מספר אירוע: {event.Event_number}</strong>
          </Typography>
        </DialogTitle>
        <DialogContent
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            background: 'linear-gradient(135deg,rgb(83, 96, 121),rgb(113, 136, 161))',
            borderBottomLeftRadius: '20px',
            borderBottomRightRadius: '20px',
            padding: 2,
            color: '#E0E1DD',
            fontWeight: 'bold'
          }}
        >
          <Typography
            textAlign="center"
            variant="subtitle1"
            sx={{
              color: '#E0E1DD',
              fontSize: '1rem',
              marginTop: '10px'
            }}
          >
            <strong>תאריך: </strong>
            {new Date(event.DateOfEvent).toLocaleDateString('he-IL')} 📅
          </Typography>
          <Typography
            variant="h6"
            sx={{
              textAlign: 'center',
              marginTop: 2
            }}
          >
            🎁 :מתנות שהתקבלו (סה"כ {totalAmount.toLocaleString()} ₪)
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
          ) : gifts?.length ? (
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell align="center">שם שולח</TableCell>
                  <TableCell align="center">סכום</TableCell>
                  <TableCell align="center">ברכה</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {gifts.map((gift, index) => (
                  <TableRow key={index}>
                    <TableCell align="center">{gift.name}</TableCell>
                    <TableCell align="center">{gift.amount} ₪</TableCell>
                    <TableCell align="center">{gift.blessing || 'לא צורפה ברכה'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <Typography
              variant="body1"
              sx={{
                textAlign: 'center',
                marginTop: '10px',
                color: 'red',
                fontWeight: 'bold'
              }}
            >
              אין מתנות לאירוע זה
            </Typography>
          )}
        </DialogContent>
      </div>
      <DialogActions
        sx={{
          display: 'flex',
          justifyContent: 'center',
          gap: 2,
          padding: 2,
          background: 'linear-gradient(135deg, #1B263B, #415A77)',
          borderBottomLeftRadius: '20px',
          borderBottomRightRadius: '20px'
        }}
      >
        <Box>
          <Tooltip title="ערוך אירוע">
            <IconButton onClick={handleEdit}>
              <EditIcon sx={{ color: '#E0E1DD' }} />
            </IconButton>
          </Tooltip>
          <Tooltip title="הדפס">
            <IconButton onClick={handlePrint}>
              <PrintIcon sx={{ color: '#E0E1DD' }} />
            </IconButton>
          </Tooltip>
          <Tooltip title="הורד PDF">
            <IconButton onClick={handleDownloadPdf}>
              <GetAppIcon sx={{ color: '#E0E1DD' }} />
            </IconButton>
          </Tooltip>
          <Tooltip title="מחק אירוע">
            <IconButton onClick={handleDelete}>
              <DeleteIcon sx={{ color: '#E0E1DD' }} />
            </IconButton>
          </Tooltip>
        </Box>
        <Button onClick={onClose} variant="outlined" color="secondary">
          סגור
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default EventDialog
