import React, { useState, useContext } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  InputAdornment,
} from "@mui/material";
import { Email as EmailIcon, Lock as LockIcon } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Context } from "../../App";

const Login = (props) => {
  const { setUserId, setDetailsId, setIsEventManager } = useContext(Context);
  const navigate = useNavigate();
  const [input, setInput] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setInput((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const handleClick = (e) => {
    e.preventDefault();
    const email = input.email;
    const password = input.password;

    axios
      .post("http://localhost:2001/api/users/login", {
        email: email,
        password: password,
      })
      .then((response) => {
        console.log("res:", response);
        axios
          .post("http://localhost:2001/api/users/userid", { email })
          .then((response) => {
            console.log("response.data in Login:", response.data);
            setUserId(response.data.userid[0]._id);
            setDetailsId(response.data.userid[0].giftsId);
          });

          if (props.a === "manager" && response.data.token) {
            setIsEventManager(true); // הגדרת isEventManager ל-true
            navigate("/EventManager");
          } else if (response.data.token) {
            setIsEventManager(false);
            navigate("/Details");
          } else {
            console.log("התחברות נכשלה:", response.data.message || "Unknown error");
          }
      });
  };

  return (
    <div>
      <form>
        <Box
          display="flex"
          flexDirection={"column"}
          alignItems="center"
          justifyContent={"center"}
          margin="auto"
          sx={{
            fontFamily: "Roboto, sans-serif",
            direction: "rtl", // הגדרת כיוון מימין לשמאל
          }}
        >
          {props.a === "manager" ? (
            <Typography
              variant="h2"
              padding={3}
              textAlign="center"
              sx={{ fontWeight: "600", color: "#1976D2" }} // טקסט כחול ובולט
            >
              התחבר כמנהל
            </Typography>
          ) : (
            <Typography
              variant="h2"
              padding={3}
              textAlign="center"
              sx={{ fontWeight: "600", color: "#1976D2" }} // טקסט כחול ובולט
            >
              התחברות
            </Typography>
          )}

          <TextField
            onChange={handleChange}
            name="email"
            value={input.email}
            margin="normal"
            type="email"
            variant="outlined"
            placeholder="אימייל"
            label="אימייל"
            sx={{
              width: "300px",
              backgroundColor: "white", // רקע לבן לשדה הקלט
              "& .MuiInputLabel-root": { fontWeight: "600" }, // תווית בולטת
              "& .MuiOutlinedInput-root": { fontWeight: "600" }, // טקסט בולט
            }}
            InputProps={{
              // העברת הסמל לצד השני
              endAdornment: (
                <InputAdornment position="end">
                  <EmailIcon sx={{ color: "#1976D2" }} />{" "}
                  {/* סמל אימייל כחול */}
                </InputAdornment>
              ),
            }}
          />

          <TextField
            onChange={handleChange}
            name="password"
            value={input.password}
            margin="normal"
            type="password"
            variant="outlined"
            placeholder="סיסמה"
            label="סיסמה"
            sx={{
              width: "300px",
              backgroundColor: "white", // רקע לבן לשדה הקלט
              "& .MuiInputLabel-root": { fontWeight: "600" }, // תווית בולטת
              "& .MuiOutlinedInput-root": { fontWeight: "600" }, // טקסט בולט
            }}
            InputProps={{
              // העברת הסמל לצד השני
              endAdornment: (
                <InputAdornment position="end">
                  <LockIcon sx={{ color: "#FF5722" }} />{" "}
                  {/* סמל מנעול בצבע כתום */}
                </InputAdornment>
              ),
            }}
          />

          <Button
            onClick={handleClick}
            sx={{
              margin: 3,
              borderRadius: 3,
              fontWeight: "600", // פונט בולט
              fontFamily: "Roboto, sans-serif",
              backgroundColor: "#1976D2", // צבע רקע כחול לכפתור
              color: "white", // צבע טקסט לבן לכפתור
              "&:hover": {
                backgroundColor: "#115293", // גוון כחול כהה יותר בעת ריחוף
              },
            }}
            variant="contained"
            size="large"
            type="submit"
          >
            התחברות
          </Button>
        </Box>
      </form>
    </div>
  );
};

export default Login;
