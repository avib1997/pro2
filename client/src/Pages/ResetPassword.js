import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, Button, TextField, Typography } from "@mui/material";

const ResetPassword = () => {
    const { token } = useParams();
    const navigate = useNavigate();
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState("");
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const res = await fetch(`http://localhost:2001/api/password/reset-password/${token}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ password, confirmPassword }),
        });
        const data = await res.json();
        setMessage(data.message);

        if (res.ok) {
            setSuccess(true); // החבא טופס לאחר הצלחה
        }
    };

    // אם הסיסמה אופסה בהצלחה, לאחר 3 שניות נעבור לדף ההתחברות
    useEffect(() => {
        if (success) {
            setTimeout(() => {
                navigate("/LoginPage"); // מעבר לדף ההתחברות
            }, 3000);
        }
    }, [success, navigate]);

    return (
        <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            height="100vh"
            sx={{
                background: "linear-gradient(135deg, #0D1B2A, #1B263B)",
                color: "white",
                textAlign: "center"
            }}
        >
            <Box
                sx={{
                    background: "rgba(255, 255, 255, 0.1)",
                    padding: "30px",
                    borderRadius: "15px",
                    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.3)",
                    width: "350px",
                    backdropFilter: "blur(10px)"
                }}
            >
                <Typography variant="h4" sx={{ marginBottom: 2, fontWeight: "bold" }}>
                    איפוס סיסמה 🔑
                </Typography>

                {!success ? (
                    <form onSubmit={handleSubmit}>
                        <TextField
                            type="password"
                            label="סיסמה חדשה"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            fullWidth
                            margin="dense"
                            sx={{ background: "rgba(255, 255, 255, 0.2)", borderRadius: "5px", input: { color: "white" } }}
                            InputLabelProps={{ style: { color: "white" } }}
                        />
                        <TextField
                            type="password"
                            label="אימות סיסמה"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            fullWidth
                            margin="dense"
                            sx={{ background: "rgba(255, 255, 255, 0.2)", borderRadius: "5px", input: { color: "white" } }}
                            InputLabelProps={{ style: { color: "white" } }}
                        />
                        <Button
                            type="submit"
                            variant="contained"
                            fullWidth
                            sx={{
                                marginTop: 2,
                                background: "#1B9AAA",
                                fontWeight: "bold",
                                "&:hover": { background: "#147A80" }
                            }}
                        >
                            אפס סיסמה
                        </Button>
                    </form>
                ) : (
                    <Typography sx={{ marginTop: 2, color: "lightgreen", fontWeight: "bold" }}>
                        ✅ הסיסמה עודכנה בהצלחה!<br />מעבר לדף ההתחברות תוך 3 שניות...
                    </Typography>
                )}

                {message && (
                    <Typography sx={{ marginTop: 2, color: "yellow", fontSize: "14px" }}>
                        {message}
                    </Typography>
                )}
            </Box>
        </Box>
    );
};

export default ResetPassword;
