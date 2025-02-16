//client/src/routes/MainRouter.jsx
import React, { useEffect } from 'react'
import { useLocation, Route, Routes } from 'react-router-dom'
import AddEvent from '../Components/events/AddEvent'
import Admin from '../Pages/Admin'
import Blessing from '../Pages/Blessing_page'
import Details_page from '../Pages/Details_page'
import Manager from '../Pages/Event_manager_page'
import Fqa from '../Pages/Fqa'
import History from '../Pages/History'
import Home from '../Pages/Home'
import LoginPage from '../Pages/Login_page'
import Payment from '../Pages/Payment'
import TheEnd from '../Pages/TheEnd'
import Navbar from '../Components/Navbar/Navbar'
import ContactPage from '../Pages/ContactPage'
import GlobalStyles from '@mui/material/GlobalStyles'
import Test from '../Pages/test'

function MainRouter() {
  const location = useLocation()

  function ScrollToTopOnRouteChange() {
    const { pathname } = useLocation()

    useEffect(() => {
      window.scrollTo(0, 0)
    }, [pathname])

    return null
  }

  console.log('location.pathname =', location.pathname)

  const shouldHideNavbar =
    location.pathname === '/' || location.pathname === '/LoginPage' || location.pathname === '/Home' || location.pathname === '/ManagerSignup' || location.pathname.startsWith('/admin')

  return (
    <>
      {/* אם לא נמצאים בנתיבים שאנחנו רוצים להסתיר - מציגים Navbar */}
      {!shouldHideNavbar && <Navbar />}
      <>
        <GlobalStyles
          styles={{
            html: {
              scrollbarWidth: 'none',
              '-ms-overflow-style': 'none'
            },
            'html::-webkit-scrollbar': {
              display: 'none'
            }
          }}
        />
        <ScrollToTopOnRouteChange />
        <Routes>
          <Route element={<Home />} path="/"></Route>
          <Route element={<LoginPage />} path="/LoginPage"></Route>
          <Route element={<Home />} path="/Home"></Route>
          <Route element={<Admin />} path="/Admin"></Route>
          <Route element={<Details_page />} path="/Details_page"></Route>
          <Route element={<Payment />} path="/Payment"></Route>
          <Route element={<History />} path="/History"></Route>
          <Route element={<Manager />} path="/EventManager"></Route>
          <Route element={<AddEvent />} path="/AddEvent"></Route>
          <Route element={<Blessing />} path="/Blessing"></Route>
          <Route element={<Fqa />} path="/Fqa"></Route>
          <Route element={<ContactPage />} path="/contact" />
          <Route element={<TheEnd />} path="/TheEnd"></Route>
          <Route element={<Test />} path="/Test"></Route>
        </Routes>
      </>
    </>
  )
}

export default MainRouter
