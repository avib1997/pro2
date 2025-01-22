import { createContext, useState } from "react";
import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import CoupleNames from "./Components/Details/Couple_names";
import AddEvent from "./Components/Manager/AddEvent";
import Admin from "./Pages/Admin";
import Blessing from "./Pages/Blessing_page";
import DetailsPage from "./Pages/Details_page";
import Manager from "./Pages/Event_manager_page";
import Fqa from "./Pages/Fqa";
import History from "./Pages/History";
import Home from "./Pages/Home";
import LoginPage from "./Pages/Login_page";
import ManagerSignup from "./Pages/ManagerSignup"; // ייבוא הדף
import Payment from "./Pages/Payment";
import TheEnd from "./Pages/TheEnd";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import {
  Avatar,
  Box,
  Button,
  Container,
  Paper,
  TextField,
  Typography,
  IconButton,
} from "@mui/material";
import ContactPage from "./Pages/ContactPage"; // <-- מייבאים את עמוד יצירת הקשר

export const Context = createContext();

function App() {
  const whatsappGroupLink = "https://chat.whatsapp.com/KN1etpCLloyD1wbunuEwdX";
  const [IsEvent, setIsEvent] = useState(true);
  const [eventId, setEventNumber] = useState(""); // סטייט עבור ה-ID של האירוע
  const [userId, setUserId] = useState("");
  const [detailsId, setDetailsId] = useState([]);
  const [isEventManager, setIsEventManager] = useState(false); // הוספת סטייט למנהל אירועים
  const [state, setState] = useState();
  const [event, setEvent] = useState("");
  return (
    <div>
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
        }}
      >
        <BrowserRouter>
          <Routes>
            <Route element={<LoginPage />} path="/"></Route>
            <Route element={<LoginPage />} path="/LoginPage"></Route>
            <Route element={<Home />} path="/Home"></Route>
            <Route element={<Admin />} path="/Admin"></Route>
            <Route element={<DetailsPage />} path="/Details"></Route>
            <Route element={<Payment />} path="/Payment"></Route>
            <Route element={<Admin />} path="/Admin"></Route>
            <Route element={<History />} path="/History"></Route>
            <Route element={<CoupleNames />} path="/CoupleNames"></Route>
            <Route element={<Manager />} path="/EventManager"></Route>
            <Route element={<ManagerSignup />} path="/ManagerSignup" />{" "}
            {/* הוספת הנתיב */}
            <Route element={<AddEvent />} path="/AddEvent"></Route>
            <Route element={<Blessing />} path="/Blessing"></Route>
            <Route element={<Fqa />} path="/Fqa"></Route>
            <Route path="/contact" element={<ContactPage />} />
            <Route element={<TheEnd />} path="/TheEnd"></Route>
          </Routes>
        </BrowserRouter>
      </Context.Provider>
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
    </div>
  );
}

export default App;
