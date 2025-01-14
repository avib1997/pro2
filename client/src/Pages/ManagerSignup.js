import {
  Box,
  Button,
  Container,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
const ManagerSignup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [eventType, setEventType] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [guestCount, setGuestCount] = useState("");
  const [eventLocation, setEventLocation] = useState("");
  const [budget, setBudget] = useState("");
  const [additionalInfo, setAdditionalInfo] = useState("");
  const [cateringService, setCateringService] = useState("");
  const [eventId] = useState(Math.floor(1000 + Math.random() * 9000));
  const [errors, setErrors] = useState({});
  const [isValid, setIsValid] = useState({});
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);
  const navigate = useNavigate();
  const validateField = (field, value) => {
    const newErrors = { ...errors };
    const newValidState = { ...isValid };
    switch (field) {
      case "name":
        if (!value) {
          newErrors.name = "יש להזין שם מלא";
          newValidState.name = false;
        } else {
          newErrors.name = "תקין";
          newValidState.name = true;
        }
        break;
      case "email":
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!value) {
          newErrors.email = "יש להזין כתובת אימייל";
          newValidState.email = false;
        } else if (!emailRegex.test(value)) {
          newErrors.email = "כתובת אימייל לא תקינה";
          newValidState.email = false;
        } else {
          newErrors.email = "תקין";
          newValidState.email = true;
        }
        break;
      case "phone":
        const phoneRegex = /^[0-9]{10}$/;
        if (!value) {
          newErrors.phone = "יש להזין מספר טלפון";
          newValidState.phone = false;
        } else if (!phoneRegex.test(value)) {
          newErrors.phone = "מספר טלפון חייב לכלול 10 ספרות";
          newValidState.phone = false;
        } else {
          newErrors.phone = "תקין";
          newValidState.phone = true;
        }
        break;
      case "eventType":
        if (!value) {
          newErrors.eventType = "יש לבחור סוג אירוע";
          newValidState.eventType = false;
        } else {
          newErrors.eventType = "תקין";
          newValidState.eventType = true;
        }
        break;
      case "eventDate":
        if (!value) {
          newErrors.eventDate = "יש לבחור תאריך לאירוע";
          newValidState.eventDate = false;
        } else {
          newErrors.eventDate = "תקין";
          newValidState.eventDate = true;
        }
        break;
      case "guestCount":
        if (!value) {
          newErrors.guestCount = "יש להזין מספר מוזמנים";
          newValidState.guestCount = false;
        } else if (isNaN(value) || value <= 0) {
          newErrors.guestCount = "מספר מוזמנים חייב להיות מספר חיובי";
          newValidState.guestCount = false;
        } else {
          newErrors.guestCount = "תקין";
          newValidState.guestCount = true;
        }
        break;
      case "eventLocation":
        if (!value) {
          newErrors.eventLocation = "יש להזין כתובת לאירוע";
          newValidState.eventLocation = false;
        } else {
          newErrors.eventLocation = "תקין";
          newValidState.eventLocation = true;
        }
        break;
      case "budget":
        if (!value) {
          newErrors.budget = "יש להזין תקציב לאירוע";
          newValidState.budget = false;
        } else if (isNaN(value) || value <= 0) {
          newErrors.budget = "תקציב האירוע חייב להיות מספר חיובי";
          newValidState.budget = false;
        } else {
          newErrors.budget = "תקין";
          newValidState.budget = true;
        }
        break;
      case "cateringService":
        if (!value) {
          newErrors.cateringService = "יש להזין שירותי קייטרינג";
          newValidState.cateringService = false;
        } else {
          newErrors.cateringService = "תקין";
          newValidState.cateringService = true;
        }
        break;
      case "additionalInfo":
        if (!value) {
          newErrors.additionalInfo = "יש להזין מידע נוסף";
          newValidState.additionalInfo = false;
        } else {
          newErrors.additionalInfo = "תקין";
          newValidState.additionalInfo = true;
        }
        break;
      default:
        break;
    }
    setErrors(newErrors);
    setIsValid(newValidState);
  };
  const handleInputChange = (field, value) => {
    validateField(field, value);
  };
  const handleSignup = () => {
    const allValid = Object.values(isValid).every((v) => v === true);
    if (allValid) {
      setShowSuccessAnimation(true);
      setTimeout(() => {
        navigate("/LoginPage");
      }, 1000);
    }
  };
  return (
    <Container
      maxWidth="md"
      sx={{
        marginTop: "50px",
        textAlign: "center",
        background: "linear-gradient(135deg, #1e3a8a, #e5e7eb)",
        padding: "30px",
        borderRadius: "20px",
        boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.1)",
        position: "relative",
        overflow: "hidden",
        "@keyframes animateBg": {
          "0%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
          "100%": { backgroundPosition: "0% 50%" },
        },
        backgroundSize: "200% 200%",
        animation: "animateBg 10s ease infinite",
      }}
    >
      {" "}
      <Button
        component={Link}
        to="/Home"
        sx={{
          position: "absolute",
          top: "10px",
          left: "50%",
          transform: "translateX(-50%)",
          backgroundColor: "#1E90FF",
          color: "#fff",
          padding: "10px 20px",
          borderRadius: "30px",
          fontSize: "1.2rem",
          fontWeight: "bold",
          "&:hover": {
            backgroundColor: "#187bcd",
            boxShadow: "0px 8px 15px rgba(0, 0, 0, 0.3)",
          },
        }}
      >
        {" "}
        חזרה לדף הבית{" "}
      </Button>{" "}
      <Box
        sx={{
          padding: "30px",
          backgroundColor: "#ffffffcc",
          borderRadius: "15px",
          boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.1)",
          position: "relative",
          zIndex: 2,
          marginTop: "70px",
        }}
      >
        {" "}
        <Typography
          variant="h4"
          gutterBottom
          sx={{ marginBottom: "30px", fontWeight: "bold", color: "#1976D2" }}
        >
          {" "}
          רישום מנהל אירוע{" "}
        </Typography>{" "}
        <Grid container spacing={2}>
          {" "}
          <Grid item xs={12} sm={6}>
            {" "}
            <TextField
              label="שם מלא"
              fullWidth
              margin="normal"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                handleInputChange("name", e.target.value);
              }}
              variant="outlined"
              error={errors.name && errors.name !== "תקין"}
              helperText={
                <Typography
                  variant="caption"
                  color={errors.name === "תקין" ? "green" : "error"}
                >
                  {errors.name}
                </Typography>
              }
            />{" "}
          </Grid>{" "}
          <Grid item xs={12} sm={6}>
            {" "}
            <TextField
              label="אימייל"
              fullWidth
              margin="normal"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                handleInputChange("email", e.target.value);
              }}
              variant="outlined"
              error={errors.email && errors.email !== "תקין"}
              helperText={
                <Typography
                  variant="caption"
                  color={errors.email === "תקין" ? "green" : "error"}
                >
                  {errors.email}
                </Typography>
              }
            />{" "}
          </Grid>{" "}
          <Grid item xs={12} sm={6}>
            {" "}
            <TextField
              label="מספר טלפון"
              fullWidth
              margin="normal"
              value={phone}
              onChange={(e) => {
                setPhone(e.target.value);
                handleInputChange("phone", e.target.value);
              }}
              variant="outlined"
              error={errors.phone && errors.phone !== "תקין"}
              helperText={
                <Typography
                  variant="caption"
                  color={errors.phone === "תקין" ? "green" : "error"}
                >
                  {errors.phone}
                </Typography>
              }
            />{" "}
          </Grid>{" "}
          <Grid item xs={12} sm={6}>
            {" "}
            <FormControl fullWidth margin="normal" error={!!errors.eventType}>
              {" "}
              <InputLabel>סוג אירוע</InputLabel>{" "}
              <Select
                value={eventType}
                onChange={(e) => {
                  setEventType(e.target.value);
                  handleInputChange("eventType", e.target.value);
                }}
                label="סוג אירוע"
              >
                {" "}
                <MenuItem value="חתונה">חתונה</MenuItem>{" "}
                <MenuItem value="בר מצווה">בר מצווה</MenuItem>{" "}
                <MenuItem value="ברית/בריתה">ברית/בריתה</MenuItem>{" "}
                <MenuItem value="אירוע חברה">אירוע חברה</MenuItem>{" "}
                <MenuItem value="אחר">אחר</MenuItem>{" "}
              </Select>{" "}
              {errors.eventType && (
                <Typography
                  variant="caption"
                  color={errors.eventType === "תקין" ? "green" : "error"}
                >
                  {errors.eventType}
                </Typography>
              )}{" "}
            </FormControl>{" "}
          </Grid>{" "}
          <Grid item xs={12} sm={6}>
            {" "}
            <TextField
              label="תאריך האירוע"
              fullWidth
              margin="normal"
              type="date"
              InputLabelProps={{ shrink: true }}
              value={eventDate}
              onChange={(e) => {
                setEventDate(e.target.value);
                handleInputChange("eventDate", e.target.value);
              }}
              variant="outlined"
              error={errors.eventDate && errors.eventDate !== "תקין"}
              helperText={
                <Typography
                  variant="caption"
                  color={errors.eventDate === "תקין" ? "green" : "error"}
                >
                  {errors.eventDate}
                </Typography>
              }
            />{" "}
          </Grid>{" "}
          <Grid item xs={12} sm={6}>
            {" "}
            <TextField
              label="מספר מוזמנים"
              fullWidth
              margin="normal"
              value={guestCount}
              onChange={(e) => {
                setGuestCount(e.target.value);
                handleInputChange("guestCount", e.target.value);
              }}
              variant="outlined"
              error={errors.guestCount && errors.guestCount !== "תקין"}
              helperText={
                <Typography
                  variant="caption"
                  color={errors.guestCount === "תקין" ? "green" : "error"}
                >
                  {errors.guestCount}
                </Typography>
              }
            />{" "}
          </Grid>{" "}
          <Grid item xs={12}>
            {" "}
            <TextField
              label="כתובת מקום האירוע"
              fullWidth
              margin="normal"
              value={eventLocation}
              onChange={(e) => {
                setEventLocation(e.target.value);
                handleInputChange("eventLocation", e.target.value);
              }}
              variant="outlined"
              error={errors.eventLocation && errors.eventLocation !== "תקין"}
              helperText={
                <Typography
                  variant="caption"
                  color={errors.eventLocation === "תקין" ? "green" : "error"}
                >
                  {errors.eventLocation}
                </Typography>
              }
            />{" "}
          </Grid>{" "}
          <Grid item xs={12}>
            {" "}
            <TextField
              label="תקציב האירוע"
              fullWidth
              margin="normal"
              value={budget}
              onChange={(e) => {
                setBudget(e.target.value);
                handleInputChange("budget", e.target.value);
              }}
              variant="outlined"
              error={errors.budget && errors.budget !== "תקין"}
              helperText={
                <Typography
                  variant="caption"
                  color={errors.budget === "תקין" ? "green" : "error"}
                >
                  {errors.budget}
                </Typography>
              }
            />{" "}
          </Grid>{" "}
          <Grid item xs={12}>
            {" "}
            <TextField
              label="שירותי קייטרינג"
              fullWidth
              margin="normal"
              value={cateringService}
              onChange={(e) => {
                setCateringService(e.target.value);
                handleInputChange("cateringService", e.target.value);
              }}
              variant="outlined"
              error={
                errors.cateringService && errors.cateringService !== "תקין"
              }
              helperText={
                <Typography
                  variant="caption"
                  color={errors.cateringService === "תקין" ? "green" : "error"}
                >
                  {errors.cateringService}
                </Typography>
              }
            />{" "}
          </Grid>{" "}
          <Grid item xs={12}>
            {" "}
            <TextField
              label="מידע נוסף"
              fullWidth
              margin="normal"
              value={additionalInfo}
              onChange={(e) => {
                setAdditionalInfo(e.target.value);
                handleInputChange("additionalInfo", e.target.value);
              }}
              variant="outlined"
              error={errors.additionalInfo && errors.additionalInfo !== "תקין"}
              helperText={
                <Typography
                  variant="caption"
                  color={errors.additionalInfo === "תקין" ? "green" : "error"}
                >
                  {errors.additionalInfo}
                </Typography>
              }
            />{" "}
          </Grid>{" "}
          <Grid item xs={12}>
            {" "}
            <Typography variant="h6" gutterBottom>
              {" "}
              מזהה אירוע: {eventId}{" "}
            </Typography>{" "}
          </Grid>{" "}
          <Grid item xs={12}>
            {" "}
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={handleSignup}
              sx={{ padding: "10px 20px", fontSize: "1rem" }}
            >
              {" "}
              רישום{" "}
            </Button>{" "}
          </Grid>{" "}
        </Grid>{" "}
      </Box>{" "}
      {showSuccessAnimation && (
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(255, 255, 255, 0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 3,
            animation: "successAnimation 1s ease-in-out forwards",
          }}
        >
          {" "}
          <Typography
            variant="h2"
            sx={{
              color: "green",
              fontWeight: "bold",
              animation: "bounce 1s ease",
            }}
          >
            {" "}
            הצלחה!{" "}
          </Typography>{" "}
        </Box>
      )}{" "}
      <style>{` @keyframes successAnimation { 0% { opacity: 0; transform: scale(0); } 100% { opacity: 1; transform: scale(1); } } @keyframes bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-20px); } } `}</style>{" "}
    </Container>
  );
};
export default ManagerSignup;
