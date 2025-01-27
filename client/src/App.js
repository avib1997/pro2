import { createContext, useState } from "react";
import React from "react";
import { BrowserRouter } from "react-router-dom";
import MainRouter from "./MainRouter"; // או הנתיב למקום ששמרת את הקובץ
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import { Box, IconButton } from "@mui/material";

export const Context = createContext();

function App() {
  const whatsappGroupLink = "https://chat.whatsapp.com/KN1etpCLloyD1wbunuEwdX";
  const [IsEvent, setIsEvent] = useState(true);
  const [eventId, setEventNumber] = useState(""); // סטייט עבור ה-ID של האירוע
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userId, setUserId] = useState("");
  const [detailsId, setDetailsId] = useState([]);
  const [isEventManager, setIsEventManager] = useState(false); // הוספת סטייט למנהל אירועים
  const [state, setState] = useState();
  const [event, setEvent] = useState("");

  return (
    <Context.Provider
      value={{
        isEventManager,
        setIsEventManager, // הוספת הפונקציה לקונטקסט
        IsEvent,
        setIsEvent,
        userId,
        setUserId,
        detailsId,
        setDetailsId,
        event,
        setEvent,
        state,
        setState,
        eventId,
        setEventNumber,
        userName,
        setUserName,
        userEmail,
        setUserEmail,
      }}
    >
      <BrowserRouter>
        <MainRouter />
      </BrowserRouter>

      <Box
        sx={{
          position: "fixed",
          bottom: 36,
          right: 36,
          zIndex: 9999, // מעל כל האלמנטים
        }}
      >
        <IconButton
          component="a"
          href={whatsappGroupLink}
          target="_blank"
          rel="noopener noreferrer"
          sx={{
            backgroundColor: "#25D366", // צבע וואצאפ
            color: "#fff",
            "&:hover": {
              backgroundColor: "#20b558",
            },
            width: 76,
            height: 76,
            borderRadius: "50%",
            boxShadow: "0 4px 8px rgba(0,0,0,0.3)",
          }}
        >
          <WhatsAppIcon fontSize="large" />
        </IconButton>
      </Box>
    </Context.Provider>
  );
}

export default App;
