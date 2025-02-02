
import React, { useEffect, useState, useContext } from 'react';
import { Context } from '../App';
import axios from 'axios';
import { Box, Container, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Collapse, IconButton, CircularProgress } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const GiftHistory = () => {
  const { userId , eventId} = useContext(Context);
  const [gifts, setGifts] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [expandedRows, setExpandedRows] = useState({});
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    console.log('event idddddddddddddddddd:', eventId);
    const fetchGifts = async () => {
      setLoading(true);
      try {
        const response = await axios.post('http://localhost:2001/api/users/giftsById', { _id: userId });
        const res = await axios.post('http://localhost:2001/api/gift/getgift', { _id: response.data });
        if (res.data && res.data.length > 0) {
          setGifts(res.data);
        }
      } catch (error) {
        setErrorMessage('שגיאה בטעינת הנתונים מהשרת.');
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchGifts();
    }
  }, [userId]); // רק userId נשאר בתלות


  const toggleRow = (id) => {
    setExpandedRows((prev) => ({ ...prev, [id]: !prev[id] }));
  };

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
        animation: 'animateBg 15s ease infinite'
      }}
    >
      <Container maxWidth="md" sx={{ marginTop: '20px', padding: 0, fontFamily: 'Roboto, sans-serif' }}>
        <Typography
          variant="h3"
          gutterBottom
          sx={{
            fontWeight: 'bold',
            color: '#E0E1DD',
            mt: 2,
            marginBottom: 4,
            fontSize: { xs: '2.5rem', sm: '3rem' },
            fontFamily: 'Poppins, sans-serif',
            textShadow: '2px 2px #000'
          }}
        >
          היסטוריית מתנות
        </Typography>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
            <CircularProgress color="secondary" />
          </Box>
        ) : (
          <>
            {errorMessage && <Typography sx={{ color: 'red' }}>{errorMessage}</Typography>}
            <TableContainer component={Paper} sx={{ background: '#1B263B', borderRadius: '15px', padding: '10px' }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ color: '#E0E1DD', fontWeight: 'bold' }}>#</TableCell>
                    <TableCell sx={{ color: '#E0E1DD', fontWeight: 'bold' }}></TableCell>
                    <TableCell sx={{ color: '#E0E1DD', fontWeight: 'bold' }}>שם</TableCell>
                    <TableCell sx={{ color: '#E0E1DD', fontWeight: 'bold' }}>סכום</TableCell>
                    <TableCell sx={{ color: '#E0E1DD', fontWeight: 'bold' }}>תאריך</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {gifts.map((gift, index) => (
                    <React.Fragment key={gift._id}>
                      <TableRow onClick={() => toggleRow(gift._id)} sx={{ borderBottom: '2px solid rgba(255, 255, 255, 0.2)' }}>
                        <TableCell sx={{ color: '#E0E1DD' }}>{index + 1}</TableCell>
                        <TableCell>
                          <IconButton size="small" sx={{ color: '#E0E1DD' }}>
                            <ExpandMoreIcon />
                          </IconButton>
                        </TableCell>
                        <TableCell sx={{ color: '#E0E1DD' }}>{gift.toEventName}</TableCell>
                        <TableCell sx={{ color: '#E0E1DD' }}>{gift.amount} ₪</TableCell>
                        <TableCell sx={{ color: '#E0E1DD' }}>{new Date(gift.entryDate).toLocaleDateString()}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell colSpan={5} style={{ paddingBottom: 0, paddingTop: 0 }}>
                          <Collapse in={expandedRows[gift._id]} timeout="auto" unmountOnExit>
                            <Box margin={1} sx={{ color: '#E0E1DD', textAlign: 'center', paddingTop: '10px' }}>
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
  );
};

export default GiftHistory;
