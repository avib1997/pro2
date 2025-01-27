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
  const {
    setUserId,
    setDetailsId,
    setIsEventManager,
    setUserName,
    setUserEmail,
    setEventNumber,
  } = useContext(Context);

  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false); // מצב טעינה

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

  // const handleClick = (e) => {
  //   e.preventDefault();
  //   const { email, password } = input;

  //   // בדיקה ראשונית אם השדות מלאים
  //   if (!email || !password) {
  //     setErrorMessage("אנא מלא את כל השדות.");
  //     return;
  //   }

  //   axios
  //     .post("http://localhost:2001/api/users/login", {
  //       email: email,
  //       password: password,
  //     })
  //     .then((response) => {
  //       console.log("res:", response);

  //       axios
  //         .post("http://localhost:2001/api/users/userid", { email })
  //         .then((response) => {
  //           console.log("response.data in Login:", response.data);

  //           if (
  //             response.data &&
  //             response.data.userid &&
  //             response.data.userid.length > 0
  //           ) {
  //             const user = response.data.userid[0];
  //             setUserName(user.fname + " " + user.lname);
  //             setUserEmail(user.email);
  //             setUserId(user._id);
  //             setDetailsId(response.data.userid[0].giftsId);
  //           }
  //         });

  //       if (props.a === "manager" && response.data.token) {
  //         setIsEventManager(true);
  //         setEventNumber(""); // הגדרת isEventManager ל-true
  //         navigate("/EventManager");
  //       } else if (response.data.token) {
  //         setIsEventManager(false);
  //         navigate("/Details");
  //       } else {
  //         console.log(
  //           "התחברות נכשלה:",
  //           response.data.message || "Unknown error"
  //         );
  //       }
  //     });
  // };

  const validateEmail = (email) => {
    // בדיקה בסיסית לפורמט דוא"ל
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password } = input;

    // בדיקה ראשונית אם השדות מלאים
    if (!email || !password) {
      setErrorMessage("אנא מלא את כל השדות.");
      return;
    }

    // בדיקה נוספת לפורמט הדוא"ל
    if (!validateEmail(email)) {
      setErrorMessage('פורמט הדוא"ל לא תקין.');
      return;
    }

    setIsSubmitting(true); // התחלת טעינה
    setErrorMessage(""); // איפוס הודעות שגיאה

    try {
      const response = await axios.post(
        "http://localhost:2001/api/users/login",
        {
          email,
          password,
        }
      );

      console.log("res:", response);

      if (response.data.token) {
        // איפוס הודעת השגיאה במידה ואין שגיאה
        setErrorMessage("");

        // קבלת נתוני המשתמש
        const userResponse = await axios.post(
          "http://localhost:2001/api/users/userid",
          { email }
        );
        console.log("response.data in Login:", userResponse.data);

        if (
          userResponse.data &&
          userResponse.data.userid &&
          userResponse.data.userid.length > 0
        ) {
          const user = userResponse.data.userid[0];
          setUserName(`${user.fname} ${user.lname}`);
          setUserEmail(user.email);
          setUserId(user._id);
          setDetailsId(user.giftsId);
        }

        // ניווט לפי סוג המשתמש
        if (props.a === "manager") {
          setIsEventManager(true);
          setEventNumber("");
          navigate("/EventManager");
        } else {
          setIsEventManager(false);
          navigate("/Details");
        }
      } else {
        // טיפול במקרה של שגיאה מהשרת
        if (response.data === "not exist") {
          setErrorMessage("המייל לא קיים במערכת.");
        } else if (response.data === "password not correct") {
          setErrorMessage("הסיסמה שגויה.");
        } else {
          setErrorMessage(response.data || "התחברות נכשלה. נסה שוב.");
        }
        console.log("התחברות נכשלה:", response.data);
      }
    } catch (error) {
      // טיפול בשגיאות רשת או שגיאות בלתי צפויות
      if (error.response) {
        if (error.response.data === "not exist") {
          setErrorMessage("המייל לא קיים במערכת.");
        } else if (error.response.data === "password not correct") {
          setErrorMessage("הסיסמה שגויה.");
        } else {
          setErrorMessage(error.response.data || "אירעה שגיאה. אנא נסה שוב.");
        }
      } else {
        setErrorMessage("אירעה שגיאה. אנא נסה שוב.");
      }
      console.error("Error during login:", error);
    } finally {
      setIsSubmitting(false); // סיום טעינה
    }
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
            placeholder="דואר אלקטרוני"
            label="דואר אלקטרוני"
            sx={{
              width: "300px",
              backgroundColor: "#fff",
              borderRadius: "20px", // רינוד פינות
              // עיצוב כללי של השדה
              "& .MuiOutlinedInput-root": {
                fontWeight: 600,
                borderRadius: "20px", // רינוד פינות
                "& fieldset": {
                  border: "none", // ביטול המסגרת (outline)
                },
                // אפקט רחיפה (hover)
                "&:hover fieldset": {
                  border: "none", // הצגת מסגרת בעת רחיפה
                },
                // אפקט כשהשדה בפוקוס (focus)
                "&.Mui-focused fieldset": {
                  border: "none",
                },
                // הוספת פדינג פנימי כדי למנוע חפיפה
                "& .MuiOutlinedInput-input": {
                  paddingRight: "0px",
                },
              },
              "& .MuiInputLabel-root": {
                fontWeight: 600,
                //transformOrigin: "top right",
                // אפשר לכוון מיקום לייבל ב-RTL לפי הצורך
                right: 20,
                left: "auto",
                //top: 3,
                //ransform: "translate(0, 6px) scale(3.75)",
              },
              "& .MuiInputLabel-root.Mui-focused, & .MuiInputLabel-shrink": {
                // כאן מתרחש "הציפה" למעלה
                transformOrigin: "top right", // רק לדוגמה, אם עובדים ב־RTL
                // אפשר להוריד את ערכי ה-translateY כדי לשחק עם הגובה:
                transform: "translate(0, .5px) scale(0.75)",
                //        ↑↑   אתה יכול להגדיל/להקטין את ה"6px" כרצונך
                // אפשר לשחק גם עם top במקום transform:
                // top: "8px"
              },
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end" sx={{ mr: 1 }}>
                  <EmailIcon sx={{ color: "#1976D2" }} />
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
              backgroundColor: "#fff",
              borderRadius: "20px", // רינוד פינות
              // עיצוב כללי של השדה
              "& .MuiOutlinedInput-root": {
                fontWeight: 600,
                borderRadius: "20px", // רינוד פינות
                "& fieldset": {
                  border: "none", // ביטול המסגרת (outline)
                },
                // אפקט רחיפה (hover)
                "&:hover fieldset": {
                  border: "none", // הצגת מסגרת בעת רחיפה
                },
                // אפקט כשהשדה בפוקוס (focus)
                "&.Mui-focused fieldset": {
                  border: "none",
                },
                // הוספת פדינג פנימי כדי למנוע חפיפה
                "& .MuiOutlinedInput-input": {
                  paddingRight: "0px",
                },
              },
              "& .MuiInputLabel-root": {
                fontWeight: 600,
                right: 20,
                left: "auto",
              },
              "& .MuiInputLabel-root.Mui-focused, & .MuiInputLabel-shrink": {
                transformOrigin: "top right",
                transform: "translate(0, .5px) scale(0.75)",
              },
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
          {/* הצגת הודעת השגיאה אם קיימת */}
          {errorMessage && (
            <Typography
              variant="body2"
              color="error"
              sx={{ mb: 2 }}
              textAlign="center"
              role="alert"
            >
              {errorMessage}
            </Typography>
          )}
          <Button
            type="submit" // שינוי לטיפוס submit
            onClick={handleSubmit} // הוספת onClick
            disabled={isSubmitting}
            sx={{
              cursor: isSubmitting ? "not-allowed" : "pointer", // שינוי סמן העכבר בזמן טעינה
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
          >
            {isSubmitting ? "מתבצע..." : "התחברות"} {/* הצגת טקסט בזמן טעינה */}
          </Button>
        </Box>
      </form>
    </div>
  );
};

export default Login;
