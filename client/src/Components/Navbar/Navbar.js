import React, { useContext } from "react";
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  MenuItem,
  Container,
  Button,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CardGiftcardIcon from "@mui/icons-material/CardGiftcard";
import { Link } from "react-router-dom";
import { Context } from "../../App";

const pagesG = [
  { name: "ברכות", path: "/Blessing" },
  { name: "שאלות ותשובות", path: "/Fqa" },
];

const pages = [
  { name: "היסטוריה", path: "/History" },
  { name: "ברכות", path: "/Blessing" },
  { name: "שאלות ותשובות", path: "/Fqa" },
];

const pagesA = [
  { name: "היסטוריה", path: "/History" },
  { name: "ברכות", path: "/Blessing" },
  { name: "מנהל", path: "/Admin" },
  { name: "שאלות ותשובות", path: "/Fqa" },
];

const specialButtons = [
  { name: "מתנה", path: "/Details" },
  { name: "דף הבית", path: "/Home" },
];

function Navbar() {
  const { userId, eventId, isEventManager } = useContext(Context);

  const [anchorElNav, setAnchorElNav] = React.useState(null);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  // סגנון ללוגו
  const logoStyle = {
    mr: 2,
    display: { xs: "flex", md: "flex" },
    fontFamily: "Roboto, sans-serif",
    fontWeight: 700,
    letterSpacing: ".3rem",
    color: "inherit",
    textDecoration: "none",
    textTransform: "uppercase",
    "&:hover": {
      color: "#f0f0f0",
      transition: "color 0.3s",
    },
  };

  // בחירת דפי הניווט לפי סוג המשתמש
  const navigationPages =
    userId === ""
      ? pagesG
      : userId === "639510ca81a78e56f64d392a"
      ? pagesA
      : pages;

  return (
    <Box sx={{ marginBottom: 0 }} position="relative" dir="rtl">
      <AppBar position="fixed">
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            {/* כפתורי הניווט */}
            <Box
              sx={{
                flexGrow: 1,
                display: { xs: "none", md: "flex" },
                alignItems: "center",
              }}
            >
              {/* כפתור "מתנה" */}
              <Button
                key="מתנה"
                onClick={handleCloseNavMenu}
                sx={{
                  my: 2,
                  color: "white",
                  display: "block",
                  fontSize: "1.1rem",
                  fontWeight: "bold",
                  "&:hover": {
                    backgroundColor: "rgba(255, 255, 255, 0.2)",
                  },
                }}
                component={Link}
                to="/Details"
              >
                מתנה
              </Button>

              {/* כפתור "דף הבית" */}
              <Button
                key="דף הבית"
                onClick={handleCloseNavMenu}
                sx={{
                  my: 2,
                  color: "#ffeb3b",
                  display: "block",
                  fontWeight: "bold",
                  "&:hover": {
                    backgroundColor: "rgba(255, 235, 59, 0.2)",
                  },
                }}
                component={Link}
                to="/Home"
              >
                דף הבית
              </Button>

              {/* כפתורי הניווט האחרים */}
              {navigationPages.map((page) => (
                <Button
                  key={page.name}
                  onClick={handleCloseNavMenu}
                  sx={{
                    my: 2,
                    color: "white",
                    display: "block",
                    "&:hover": {
                      backgroundColor: "rgba(255, 255, 255, 0.2)",
                    },
                  }}
                  component={Link}
                  to={page.path}
                >
                  {page.name}
                </Button>
              ))}

              {/* כפתור למעבר לדף מנהל אירועים, מוצג רק אם המשתמש הוא מנהל אירועים */}
              {isEventManager && (
                <Button
                  key="ניהול אירועים"
                  onClick={handleCloseNavMenu}
                  sx={{
                    my: 2,
                    color: "white",
                    display: "block",
                    "&:hover": {
                      backgroundColor: "rgba(255, 255, 255, 0.2)",
                    },
                  }}
                  component={Link}
                  to="/EventManager"
                >
                  ניהול אירועים
                </Button>
              )}

              {/* הצגת הודעה אם לא הוזן מספר מזהה אירוע */}
              {!eventId && (
                <Typography
                  variant="caption"
                  sx={{
                    color: "white",
                    marginLeft: 2,
                    fontSize: "0.8rem",
                    fontStyle: "italic",
                  }}
                >
                  כניסה ללא מספר מזהה אירוע
                </Typography>
              )}

              {/* הצגת מזהה אירוע אם קיים */}
              {eventId && (
                <Typography
                  sx={{
                    color: "goldenrod",
                    ml: 2,
                    fontWeight: "bold",
                    fontSize: "1rem",
                    fontFamily: "serif",
                  }}
                >
                  מזהה אירוע: {eventId}
                </Typography>
              )}
            </Box>

            {/* תפריט למובייל */}
            <Box sx={{ display: { xs: "flex", md: "none" } }}>
              <IconButton
                size="large"
                aria-label="פתיחת תפריט"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleOpenNavMenu}
                color="inherit"
              >
                <MenuIcon />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorElNav}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "left",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "left",
                }}
                open={Boolean(anchorElNav)}
                onClose={handleCloseNavMenu}
                sx={{
                  display: { xs: "block", md: "none" },
                }}
              >
                {/* כפתור "מתנה" */}
                <MenuItem key="מתנה" onClick={handleCloseNavMenu}>
                  <Typography textAlign="center">
                    <Link
                      style={{ textDecoration: "none", color: "black" }}
                      to="/Details"
                    >
                      מתנה
                    </Link>
                  </Typography>
                </MenuItem>

                {/* כפתור "דף הבית" */}
                <MenuItem key="דף הבית" onClick={handleCloseNavMenu}>
                  <Typography textAlign="center">
                    <Link
                      style={{ textDecoration: "none", color: "black" }}
                      to="/Home"
                    >
                      דף הבית
                    </Link>
                  </Typography>
                </MenuItem>

                {/* כפתורי הניווט האחרים */}
                {navigationPages.map((page) => (
                  <MenuItem key={page.name} onClick={handleCloseNavMenu}>
                    <Typography textAlign="center">
                      <Link
                        style={{ textDecoration: "none", color: "black" }}
                        to={page.path}
                      >
                        {page.name}
                      </Link>
                    </Typography>
                  </MenuItem>
                ))}

                {/* כפתור למעבר לדף מנהל אירועים, מוצג רק אם המשתמש הוא מנהל אירועים */}
                {isEventManager && (
                  <MenuItem key="ניהול אירועים" onClick={handleCloseNavMenu}>
                    <Typography textAlign="center">
                      <Link
                        style={{ textDecoration: "none", color: "black" }}
                        to="/EventManager"
                      >
                        ניהול אירועים
                      </Link>
                    </Typography>
                  </MenuItem>
                )}

                {/* הצגת הודעה אם לא הוזן מספר מזהה אירוע */}
                {!eventId && (
                  <MenuItem>
                    <Typography
                      textAlign="center"
                      variant="caption"
                      sx={{
                        color: "gray",
                        fontSize: "0.8rem",
                        fontStyle: "italic",
                      }}
                    >
                      כניסה ללא מספר מזהה אירוע
                    </Typography>
                  </MenuItem>
                )}
              </Menu>
            </Box>

            {/* לוגו בצד שמאל */}
            <CardGiftcardIcon
              fontSize="large"
              sx={{ display: { xs: "none", md: "flex" }, ml: 2 }}
            />
            <Typography
              variant="h6"
              noWrap
              component={Link}
              to="/"
              sx={logoStyle}
            >
              Easy Gift
            </Typography>
          </Toolbar>
        </Container>
      </AppBar>
    </Box>
  );
}

export default Navbar;
