import React from "react";
import { useLocation, Route, Routes } from "react-router-dom";
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
import Navbar from "./Components/Navbar/Navbar";
import ContactPage from "./Pages/ContactPage";

function MainRouter() {
  const location = useLocation();
  // רשימת הנתיבים שלא רוצים להציג בהם Navbar
  const hideNavbarOnRoutes = [
    "/",
    "/LoginPage",
    "/Home",
    "/Admin",
    "/CoupleNames",
    "/ManagerSignup",
  ];
  const shouldHideNavbar = hideNavbarOnRoutes.includes(location.pathname);

  return (
    <>
      {/* אם לא נמצאים בנתיבים שאנחנו רוצים להסתיר - מציגים Navbar */}
      {!shouldHideNavbar && <Navbar />}
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
        <Route element={<AddEvent />} path="/AddEvent"></Route>
        <Route element={<Blessing />} path="/Blessing"></Route>
        <Route element={<Fqa />} path="/Fqa"></Route>
        <Route element={<ContactPage />} path="/contact" />
        <Route element={<TheEnd />} path="/TheEnd"></Route>
      </Routes>
    </>
  );
}

export default MainRouter;
