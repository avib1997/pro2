import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, TextField, Button, Typography } from '@mui/material';
import axios from 'axios';
import { Context } from '../../App';

const ForgotPasswordPopup = ({ open, handleClose }) => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const { userEmail } = useContext(Context);

    useEffect(() => {
        setEmail(userEmail);
    }, [userEmail]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('https://easygift-server.onrender.com/api/password/forgot-password', { email })
            setMessage(response.data.message);
        } catch (error) {
            setMessage('שגיאה בשליחת המייל, נסה שנית.');
        }
    };

    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>שחזור סיסמה</DialogTitle>
            <DialogContent>
                <form onSubmit={handleSubmit}>
                    <TextField
                        type="email"
                        label="דואר אלקטרוני"
                        fullWidth
                        margin="dense"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <Button type="submit" variant="contained" color="primary" fullWidth sx={{ marginTop: 2 }}>
                        שלח לינק לאיפוס סיסמה
                    </Button>
                </form>
                {message && <Typography sx={{ marginTop: 2, color: "green" }}>{message}</Typography>}
            </DialogContent>
        </Dialog>
    );
};

export default ForgotPasswordPopup;
