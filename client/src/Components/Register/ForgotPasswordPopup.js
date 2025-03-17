import React, { useState, useContext, useEffect } from 'react';
import { Box, Dialog, DialogTitle, DialogContent, TextField, Button, Typography, CircularProgress } from '@mui/material';
import axios from 'axios';
import { Context } from '../../App';

const ForgotPasswordPopup = ({ open, handleClose }) => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const { userEmail } = useContext(Context);
      const [loading, setLoading] = useState(false)
    


    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true)
        //בדיקה אם המייל קיים
        try {
            const response = await axios.post('http://localhost:2001/api/users/userid', { email });
            if (response.data.userid[0].email === email) {
                console.log('response.data:', response.data)
            }
        }
        catch (error) {
            setLoading(false)
            setError('לא נמצא מייל כזה', error)
            return;
        }
        try {
            const response = await axios.post('http://localhost:2001/api/password/forgot-password', { email });
            setLoading(false)
            setMessage(response.data.message);
            setTimeout(() => {
                handleClose();
                setEmail('');
                setMessage('');
                setError('');
            }, 4000);
        } catch (error) {
            setMessage('שגיאה בשליחת המייל, נסה שנית.');
        }
    };

    const handleCloseDialog = () => {
        setLoading(false)
        setEmail('');
        setMessage('');
        setError('');
        handleClose(); // סוגר את הדיאלוג מבחוץ
    };

    return (
        <Dialog open={open} onClose={handleCloseDialog}>
            <DialogTitle>שחזור סיסמה</DialogTitle>
            <DialogContent>
                <form onSubmit={handleSubmit}>
                    <TextField
                        type="email"
                        label="דואר אלקטרוני"
                        fullWidth
                        margin="dense"
                        value={email}
                        onChange={(e) => {
                            setEmail(e.target.value);
                            setError(""); // ✅ מנקה את השגיאה כאשר המשתמש מתחיל להקליד
                            setMessage(""); // ✅ מנקה את ההודעה כאשר המשתמש מתחיל להקל
                        }}
                        required
                    />
                    <Button type="submit" variant="contained" color="primary" fullWidth sx={{ marginTop: 2 }}>
                        שלח לינק לאיפוס סיסמה
                    </Button>
                </form>
                {loading ? (
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            height: '60px'
                        }}
                    >
                        <CircularProgress color="secondary" />
                    </Box>
                ) : (
                    <Box>
                        {message && <Typography sx={{ marginTop: 2, color: "green" }}>{message}</Typography>}
                        {error && <Typography sx={{ marginTop: 2, color: "red" }}>{error}</Typography>}
                    </Box>
                )}
            </DialogContent>
        </Dialog>
    );
};

export default ForgotPasswordPopup;
