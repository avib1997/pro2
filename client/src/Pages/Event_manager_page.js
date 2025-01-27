import React, { useContext, useEffect, useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  IconButton,
  Tooltip,
  Slide,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import GetAppIcon from "@mui/icons-material/GetApp";
import PrintIcon from "@mui/icons-material/Print";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { Context } from "../App";
import Navbar from "../Components/Navbar/Navbar";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const Manager = () => {
  const { IsEvent, setIsEvent } = useContext(Context);
  const [openDialog, setOpenDialog] = useState(false);
  const [openAddEventDialog, setOpenAddEventDialog] = useState(false);
  const [openEditEventDialog, setOpenEditEventDialog] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [setEvent] = useState(null);
  const [events, setEvents] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const [loaded, setLoaded] = useState(false);
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);
  const { userId, event, setState } = useContext(Context);

  const [newEvent, setNewEvent] = useState({
    title: "",
    date: "",
    location: "",
    guestCount: "",
    budget: "",
    eventName: "",
    groomName: "",
    brideName: "",
    phone: "",
  });

  useEffect(() => {
    axios
      .get("http://localhost:2001/api/events/getAll")
      .then((res) => {
        setEvents(res.data.filter((event) => event.userid_event === userId));
        setLoaded(true);
      })
      .catch((err) => console.error("Error fetching events:", err));
  }, []);

  // useEffect(() => {
  //   axios
  //     .get("http://localhost:2001/api/events/getAll")
  //     .then((res) => {
  //       setEvents(res.data.filter((event) => event.userid_event === userId));
  //       setLoaded(true);
  //     })
  //     .catch((err) => console.error("Error fetching events:", err));
  // });

  const handleEventClick = (event) => {
    setSelectedEvent(event);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedEvent(null);
  };

  const handleAddEventClick = () => {
    setOpenAddEventDialog(true);
  };

  const handleAddEventClose = () => {
    setOpenAddEventDialog(false);
    setFormErrors({});
    setNewEvent({
      title: "",
      date: "",
      location: "",
      guestCount: "",
      budget: "",
      eventName: "",
      groomName: "",
      brideName: "",
      phone: "",
    });
  };

  const handleEditEventClose = () => {
    setOpenEditEventDialog(false);
    setFormErrors({});
    setSelectedEvent(null);
  };

  const handleInputChange = (field, value, isEdit = false) => {
    if (isEdit) {
      setSelectedEvent((prev) => ({ ...prev, [field]: value }));
    } else {
      setNewEvent((prev) => ({ ...prev, [field]: value }));
    }
    setFormErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const validateForm = (eventData) => {
    let errors = {};
    if (!eventData.title) errors.title = "נא לבחור סוג אירוע";
    if (!eventData.date) errors.date = "נא לבחור תאריך";
    if (!eventData.location) errors.location = "נא להזין מיקום";
    if (!eventData.guestCount) errors.guestCount = "נא להזין מספר מוזמנים";
    if (!eventData.budget) errors.budget = "נא להזין תקציב";
    if (!eventData.eventName) errors.eventName = "נא להזין שם אירוע";
    if (eventData.title === "חתונה") {
      if (!eventData.groomName) errors.groomName = "נא להזין שם החתן";
      if (!eventData.brideName) errors.brideName = "נא להזין שם הכלה";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleAddNewEvent = (e) => {
    e.preventDefault();
    if (!validateForm(newEvent)) return;

    const eventToAdd = {
      NameOfGroom: newEvent.groomName,
      NameOfBride: newEvent.brideName,
      NameOfManager: "managerName",
      TypeOfEvent: newEvent.title,
      NumOfGuests: newEvent.guestCount,
      phone: newEvent.phone,
      DateOfEvent: newEvent.date,
      userid_event: userId,
    };
    axios
      .post("http://localhost:2001/api/events/addEvent", eventToAdd)
      .then((res) => {
        setEvent(res.data);
        setShowSuccessAnimation(true);
        setTimeout(() => setShowSuccessAnimation(false), 1000);
        setOpenAddEventDialog(false);
        setNewEvent({
          title: "",
          date: "",
          location: "",
          guestCount: "",
          budget: "",
          eventName: "",
          groomName: "",
          brideName: "",
          phone: "",
        });
      })
      .catch((error) => {
        console.error("Error saving event to server:", error);
      });
  };

  const handleEditEvent = () => {
    if (!validateForm(selectedEvent)) return;
    const updatedEvent = {
      NameOfGroom: selectedEvent.groomName,
      NameOfBride: selectedEvent.brideName,
      NameOfManager: "managerName",
      TypeOfEvent: selectedEvent.title,
      NumOfGuests: selectedEvent.guestCount,
      phone: selectedEvent.phone || "050-0000000",
      DateOfEvent: selectedEvent.date,
    };
    const eventId = selectedEvent._id || selectedEvent.id;
    axios
      .put(`http://localhost:2001/api/events/${eventId}`, updatedEvent)
      .then(() => {
        const updatedEvents = events.map((ev) =>
          ev.id === selectedEvent.id || ev._id === selectedEvent._id
            ? { ...selectedEvent }
            : ev
        );
        setEvents(updatedEvents);
        setOpenEditEventDialog(false);
        setShowSuccessAnimation(true);
        setTimeout(() => setShowSuccessAnimation(false), 2000);
        setSelectedEvent(null);
      })
      .catch((error) => console.error("Error updating event:", error));
  };

  const handleDeleteEvent = (eventId) => {
    axios
      .delete(`http://localhost:2001/api/events/${eventId}`)
      .then(() => {
        const updatedEvents = events.filter(
          (e) => e.id !== eventId && e._id !== eventId
        );
        setEvents(updatedEvents);
        setShowSuccessAnimation(true);
        setTimeout(() => setShowSuccessAnimation(false), 2000);
      })
      .catch((error) => console.error("Error deleting event:", error));
  };

  const handlePrint = () => {
    window.print();
    setShowSuccessAnimation(true);
    setTimeout(() => setShowSuccessAnimation(false), 2000);
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    doc.text(
      `פרטי האירוע: ${selectedEvent.eventName || selectedEvent.title}`,
      10,
      10
    );
    autoTable(doc, {
      startY: 20,
      head: [["שם שולח", "סכום", "ברכה", "קבצים מצורפים", "אמצעי תשלום"]],
      body:
        selectedEvent.gifts?.map((gift) => [
          gift.name,
          `${gift.amount} ₪`,
          gift.blessing || "לא צורפה ברכה",
          gift.attachment || "אין",
          gift.paymentMethod,
        ]) || [],
    });
    doc.save("gifts.pdf");
    setShowSuccessAnimation(true);
    setTimeout(() => setShowSuccessAnimation(false), 2000);
  };

  if (events === null) {
    return (
      <Box
        sx={{
          position: "relative",
          minHeight: "100vh",
          direction: "rtl",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          background: "linear-gradient(135deg, #0D1B2A, #1B263B)",
        }}
      >
        <Typography variant="h5" sx={{ color: "#E0E1DD" }}>
          טוען נתונים...
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        position: "relative",
        minHeight: "200vh",
        direction: "rtl",
        paddingTop: "120px",
      }}
    >
      {/* <Navbar /> */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          right: 0,
          width: "100%",
          height: "100%",
          zIndex: -1,
          background: "linear-gradient(135deg, #0D1B2A, #1B263B)",
          backgroundSize: "400% 400%",
          animation: "animateBg 15s ease infinite",
        }}
      />
      <Box
        sx={{
          textAlign: "center",
          margin: "20px 0",
          fontFamily: "Poppins, sans-serif",
          color: "#E0E1DD",
        }}
      >
        <Typography
          variant="h3"
          gutterBottom
          sx={{
            fontWeight: "bold",
            color: "#E0E1DD",
            textShadow: "2px 2px #000",
          }}
        >
          ניהול האירועים
        </Typography>
        <Typography
          variant="h6"
          sx={{ color: "#E0E1DD", textShadow: "1px 1px #000" }}
        >
          ניהול האירועים שלך במקום אחד
        </Typography>
      </Box>
      <Grid container spacing={2} sx={{ padding: "0 20px" }}>
        {events.map((event) => (
          <Grid item xs={12} sm={6} md={4} key={event.id || event._id}>
            <Card
              onClick={() => handleEventClick(event)}
              sx={{
                boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.5)",
                transition: "0.4s",
                cursor: "pointer",
                borderRadius: "20px",
                "&:hover": {
                  boxShadow: "0px 8px 30px rgba(0, 0, 0, 0.7)",
                  transform: "scale(1.05)",
                },
                background: "linear-gradient(135deg, #1B263B, #415A77)",
              }}
            >
              <CardContent sx={{ padding: "20px" }}>
                <Typography
                  variant="h5"
                  component="div"
                  textAlign="center"
                  fontFamily="Poppins, sans-serif"
                  gutterBottom
                  sx={{
                    color: "#E0E1DD",
                    fontWeight: "bold",
                    textShadow: "1px 1px #000",
                  }}
                >
                  {event.eventName || event.title}
                </Typography>
                <Typography
                  variant="body1"
                  color="#E0E1DD"
                  textAlign="center"
                  sx={{ textShadow: "1px 1px #000" }}
                >
                  תאריך: {event.date || event.DateOfEvent}
                </Typography>
                <Typography
                  variant="body1"
                  color="#E0E1DD"
                  textAlign="center"
                  sx={{ textShadow: "1px 1px #000" }}
                >
                  מיקום: {event.location}
                </Typography>
                <Typography
                  variant="body1"
                  color="#E0E1DD"
                  textAlign="center"
                  sx={{ textShadow: "1px 1px #000" }}
                >
                  מספר מוזמנים: {event.guestCount || event.NumOfGuests}
                </Typography>
              </CardContent>
              <CardActions
                sx={{ justifyContent: "center", padding: 0 }}
                onClick={(e) => e.stopPropagation()}
              >
                <IconButton
                  onClick={() => {
                    setSelectedEvent(event);
                    setOpenEditEventDialog(true);
                  }}
                  sx={{
                    color: "#F0A500",
                    transition: "0.3s",
                    "&:hover": { transform: "scale(1.2)" },
                  }}
                >
                  <EditIcon />
                </IconButton>
                <IconButton
                  onClick={() => handleDeleteEvent(event.id || event._id)}
                  sx={{
                    color: "#F0A500",
                    transition: "0.3s",
                    "&:hover": { transform: "scale(1.2)" },
                  }}
                >
                  <DeleteIcon />
                </IconButton>
              </CardActions>
            </Card>
          </Grid>
        ))}
        <Grid item xs={12} sm={6} md={4}>
          <Card
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "10px",
              boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.5)",
              borderRadius: "20px",
              transition: "0.4s",
              "&:hover": {
                boxShadow: "0px 8px 30px rgba(0, 0, 0, 0.7)",
                transform: "scale(1.05)",
              },
              minHeight: "200px",
              background: "linear-gradient(135deg, #415A77, #778DA9)",
            }}
          >
            <Button
              onClick={handleAddEventClick}
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                color: "#E0E1DD",
                transition: "0.3s",
                "&:hover": { transform: "scale(1.1)" },
              }}
            >
              <AddIcon sx={{ fontSize: 60 }} />
              <Typography variant="h6">הוסף אירוע</Typography>
            </Button>
          </Card>
        </Grid>
      </Grid>

      {selectedEvent && (
        <Dialog
          open={openDialog}
          onClose={handleCloseDialog}
          fullWidth
          maxWidth="md"
          dir="rtl"
          TransitionComponent={Transition}
          sx={{
            "& .MuiDialog-paper": {
              borderRadius: "20px",
              background: "linear-gradient(135deg, #0D1B2A, #1B263B)",
            },
          }}
        >
          <DialogTitle
            sx={{
              backgroundColor: "transparent",
              color: "#E0E1DD",
              position: "relative",
              textAlign: "center",
              fontWeight: "bold",
              fontSize: "2rem",
              textShadow: "2px 2px #000",
            }}
          >
            {selectedEvent.eventName || selectedEvent.title}
            <Box sx={{ position: "absolute", left: "16px", top: "8px" }}>
              <Tooltip title="הדפס">
                <IconButton
                  onClick={handlePrint}
                  sx={{
                    color: "#F0A500",
                    transition: "0.3s",
                    "&:hover": { transform: "scale(1.2)" },
                  }}
                >
                  <PrintIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="הורד כ-PDF">
                <IconButton
                  onClick={handleDownloadPDF}
                  sx={{
                    color: "#F0A500",
                    transition: "0.3s",
                    "&:hover": { transform: "scale(1.2)" },
                  }}
                >
                  <GetAppIcon />
                </IconButton>
              </Tooltip>
            </Box>
          </DialogTitle>
          <DialogContent dividers>
            <Box sx={{ textAlign: "center" }}>
              <Typography
                variant="body1"
                gutterBottom
                sx={{ color: "#E0E1DD" }}
              >
                <strong>שם האירוע:</strong> {selectedEvent.eventName}
              </Typography>
              {selectedEvent.title === "חתונה" && (
                <>
                  <Typography
                    variant="body1"
                    gutterBottom
                    sx={{ color: "#E0E1DD" }}
                  >
                    <strong>שם החתן:</strong> {selectedEvent.groomName}
                  </Typography>
                  <Typography
                    variant="body1"
                    gutterBottom
                    sx={{ color: "#E0E1DD" }}
                  >
                    <strong>שם הכלה:</strong> {selectedEvent.brideName}
                  </Typography>
                </>
              )}
              <Typography
                variant="body1"
                gutterBottom
                sx={{ color: "#E0E1DD" }}
              >
                <strong>תאריך:</strong> {selectedEvent.date}
              </Typography>
              <Typography
                variant="body1"
                gutterBottom
                sx={{ color: "#E0E1DD" }}
              >
                <strong>מיקום:</strong> {selectedEvent.location}
              </Typography>
              <Typography
                variant="body1"
                gutterBottom
                sx={{ color: "#E0E1DD" }}
              >
                <strong>מספר מוזמנים:</strong> {selectedEvent.guestCount}
              </Typography>
              <Typography
                variant="body1"
                gutterBottom
                sx={{ color: "#E0E1DD" }}
              >
                <strong>תקציב:</strong> {selectedEvent.budget} ₪
              </Typography>
            </Box>
            <Typography
              variant="h6"
              sx={{
                marginTop: "20px",
                fontWeight: "bold",
                textAlign: "center",
                color: "#E0E1DD",
                textDecoration: "underline",
              }}
            >
              רשימת המתנות שנשלחו:
            </Typography>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell align="center" sx={{ color: "#E0E1DD" }}>
                    שם שולח
                  </TableCell>
                  <TableCell align="center" sx={{ color: "#E0E1DD" }}>
                    סכום
                  </TableCell>
                  <TableCell align="center" sx={{ color: "#E0E1DD" }}>
                    ברכה
                  </TableCell>
                  <TableCell align="center" sx={{ color: "#E0E1DD" }}>
                    קבצים מצורפים
                  </TableCell>
                  <TableCell align="center" sx={{ color: "#E0E1DD" }}>
                    אמצעי תשלום
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {selectedEvent.gifts?.map((gift, index) => (
                  <TableRow
                    key={index}
                    sx={{ "&:hover": { backgroundColor: "#2E3B55" } }}
                  >
                    <TableCell align="center" sx={{ color: "#E0E1DD" }}>
                      {gift.name}
                    </TableCell>
                    <TableCell align="center" sx={{ color: "#E0E1DD" }}>
                      {gift.amount} ₪
                    </TableCell>
                    <TableCell align="center" sx={{ color: "#E0E1DD" }}>
                      {gift.blessing || "לא צורפה ברכה"}
                    </TableCell>
                    <TableCell align="center" sx={{ color: "#E0E1DD" }}>
                      {gift.attachment || "אין"}
                    </TableCell>
                    <TableCell align="center" sx={{ color: "#E0E1DD" }}>
                      {gift.paymentMethod}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={handleCloseDialog}
              sx={{
                color: "#F0A500",
                fontWeight: "bold",
                padding: "10px 20px",
                "&:hover": {
                  backgroundColor: "#F0A500",
                  color: "#1B263B",
                  boxShadow: "0px 5px 15px rgba(240, 165, 0, 0.4)",
                },
              }}
            >
              סגור
            </Button>
          </DialogActions>
        </Dialog>
      )}

      {selectedEvent && openEditEventDialog && (
        <Dialog
          open={openEditEventDialog}
          onClose={handleEditEventClose}
          fullWidth
          maxWidth="sm"
          dir="rtl"
          TransitionComponent={Transition}
          sx={{
            "& .MuiDialog-paper": {
              borderRadius: "20px",
              background: "linear-gradient(135deg, #1B263B, #415A77)",
            },
          }}
        >
          <DialogTitle
            sx={{
              textAlign: "center",
              fontWeight: "bold",
              fontSize: "2rem",
              color: "#E0E1DD",
            }}
          >
            ערוך אירוע
          </DialogTitle>
          <DialogContent>
            <FormControl fullWidth margin="normal" error={!!formErrors.title}>
              <InputLabel id="event-type-label">סוג האירוע</InputLabel>
              <Select
                labelId="event-type-label"
                value={selectedEvent.title}
                onChange={(e) =>
                  handleInputChange("title", e.target.value, true)
                }
                label="סוג האירוע"
                sx={{ color: "#E0E1DD" }}
              >
                <MenuItem value="חתונה">חתונה</MenuItem>
                <MenuItem value="בר מצווה">בר מצווה</MenuItem>
                <MenuItem value="בת מצווה">בת מצווה</MenuItem>
                <MenuItem value="ברית">ברית</MenuItem>
                <MenuItem value="יום הולדת">יום הולדת</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label="שם האירוע"
              fullWidth
              margin="normal"
              value={selectedEvent.eventName}
              onChange={(e) =>
                handleInputChange("eventName", e.target.value, true)
              }
              sx={{ color: "#E0E1DD" }}
            />
            {selectedEvent.title === "חתונה" && (
              <>
                <TextField
                  label="שם החתן"
                  fullWidth
                  margin="normal"
                  value={selectedEvent.groomName}
                  onChange={(e) =>
                    handleInputChange("groomName", e.target.value, true)
                  }
                />
                <TextField
                  label="שם הכלה"
                  fullWidth
                  margin="normal"
                  value={selectedEvent.brideName}
                  onChange={(e) =>
                    handleInputChange("brideName", e.target.value, true)
                  }
                />
              </>
            )}
            <TextField
              label="תאריך"
              type="date"
              fullWidth
              margin="normal"
              value={selectedEvent.date}
              onChange={(e) => handleInputChange("date", e.target.value, true)}
            />
            <TextField
              label="מיקום"
              fullWidth
              margin="normal"
              value={selectedEvent.location}
              onChange={(e) =>
                handleInputChange("location", e.target.value, true)
              }
            />
            <TextField
              label="מספר מוזמנים"
              type="number"
              fullWidth
              margin="normal"
              value={selectedEvent.guestCount}
              onChange={(e) =>
                handleInputChange("guestCount", e.target.value, true)
              }
            />
            <TextField
              label="תקציב"
              type="number"
              fullWidth
              margin="normal"
              value={selectedEvent.budget}
              onChange={(e) =>
                handleInputChange("budget", e.target.value, true)
              }
            />
            <TextField
              label="טלפון"
              fullWidth
              margin="normal"
              value={selectedEvent.phone || ""}
              onChange={(e) => handleInputChange("phone", e.target.value, true)}
            />
          </DialogContent>
          <DialogActions>
            <Button
              onClick={handleEditEventClose}
              sx={{
                color: "#F0A500",
                fontWeight: "bold",
                padding: "10px 20px",
                "&:hover": {
                  backgroundColor: "#F0A500",
                  color: "#1B263B",
                  boxShadow: "0px 5px 15px rgba(240, 165, 0, 0.4)",
                },
              }}
            >
              ביטול
            </Button>
            <Button
              onClick={handleEditEvent}
              sx={{
                color: "#F0A500",
                fontWeight: "bold",
                padding: "10px 20px",
                "&:hover": {
                  backgroundColor: "#F0A500",
                  color: "#1B263B",
                  boxShadow: "0px 5px 15px rgba(240, 165, 0, 0.4)",
                },
              }}
            >
              שמור שינויים
            </Button>
          </DialogActions>
        </Dialog>
      )}

      {openAddEventDialog && (
        <Dialog
          open={openAddEventDialog}
          onClose={handleAddEventClose}
          fullWidth
          maxWidth="sm"
          dir="rtl"
          TransitionComponent={Transition}
          sx={{
            "& .MuiDialog-paper": {
              borderRadius: "20px",
              background: "linear-gradient(135deg, #415A77, #778DA9)",
            },
          }}
        >
          <DialogTitle
            sx={{
              textAlign: "center",
              fontWeight: "bold",
              fontSize: "2rem",
              color: "#E0E1DD",
            }}
          >
            הוסף אירוע חדש
          </DialogTitle>
          <DialogContent>
            <FormControl fullWidth margin="normal" error={!!formErrors.title}>
              <InputLabel id="event-type-label">סוג האירוע</InputLabel>
              <Select
                labelId="event-type-label"
                value={newEvent.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                label="סוג האירוע"
              >
                <MenuItem value="חתונה">חתונה</MenuItem>
                <MenuItem value="בר מצווה">בר מצווה</MenuItem>
                <MenuItem value="בת מצווה">בת מצווה</MenuItem>
                <MenuItem value="ברית">ברית</MenuItem>
                <MenuItem value="יום הולדת">יום הולדת</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label="שם האירוע"
              fullWidth
              margin="normal"
              value={newEvent.eventName}
              onChange={(e) => handleInputChange("eventName", e.target.value)}
            />
            {newEvent.title === "חתונה" && (
              <>
                <TextField
                  label="שם החתן"
                  fullWidth
                  margin="normal"
                  value={newEvent.groomName}
                  onChange={(e) =>
                    handleInputChange("groomName", e.target.value)
                  }
                />
                <TextField
                  label="שם הכלה"
                  fullWidth
                  margin="normal"
                  value={newEvent.brideName}
                  onChange={(e) =>
                    handleInputChange("brideName", e.target.value)
                  }
                />
              </>
            )}
            <TextField
              label="תאריך"
              type="date"
              fullWidth
              margin="normal"
              value={newEvent.date}
              onChange={(e) => handleInputChange("date", e.target.value)}
            />
            <TextField
              label="מיקום"
              fullWidth
              margin="normal"
              value={newEvent.location}
              onChange={(e) => handleInputChange("location", e.target.value)}
            />
            <TextField
              label="מספר מוזמנים"
              type="number"
              fullWidth
              margin="normal"
              value={newEvent.guestCount}
              onChange={(e) => handleInputChange("guestCount", e.target.value)}
            />
            <TextField
              label="תקציב"
              type="number"
              fullWidth
              margin="normal"
              value={newEvent.budget}
              onChange={(e) => handleInputChange("budget", e.target.value)}
            />
            <TextField
              label="טלפון"
              fullWidth
              margin="normal"
              value={newEvent.phone}
              onChange={(e) => handleInputChange("phone", e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleAddEventClose} sx={{ color: "#F0A500" }}>
              ביטול
            </Button>
            <Button onClick={handleAddNewEvent} sx={{ color: "#F0A500" }}>
              הוסף אירוע
            </Button>
          </DialogActions>
        </Dialog>
      )}

      {showSuccessAnimation && !openAddEventDialog && !openEditEventDialog && (
        <Box
          sx={{
            position: "absolute",
            top: 400,
            left: 630,
            width: "30%",
            height: "10%",
            borderRadius: "30px",
            background: "rgba(255, 255, 255, 0.7)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1301,
            animation: "successAnimation 1s ease-in-out forwards",
          }}
        >
          <Typography
            variant="h2"
            sx={{
              color: "green",
              fontWeight: "bold",
              animation: "bounce 1s ease",
            }}
          >
            הצלחה!
          </Typography>
        </Box>
      )}

      <style>
        {`
        @keyframes animateBg {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @media print {
          body { visibility: hidden; }
          .MuiDialog-paper { visibility: visible; }
        }
        @keyframes successAnimation {
          0% { opacity: 0; transform: scale(0); }
          100% { opacity: 1; transform: scale(1); }
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
        `}
      </style>
    </Box>
  );
};

export default Manager;
