/* eslint-disable no-unused-vars */
// src/Pages/Admin.js

import {
  AccessTime,
  Delete,
  Edit,
  ExitToApp,
  Login,
  People,
  Refresh,
  ReportProblem,
  WarningAmber,
} from "@mui/icons-material";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  duration,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { keyframes, styled } from "@mui/material/styles";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import advancedFormat from "dayjs/plugin/advancedFormat";
import customParseFormat from "dayjs/plugin/customParseFormat";
import isBetween from "dayjs/plugin/isBetween";
import localizedFormat from "dayjs/plugin/localizedFormat";
import weekOfYear from "dayjs/plugin/weekOfYear";
import { color, motion, transform } from "framer-motion";
import React, { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import Navbar from "../Components/Navbar/Navbar";
import shadows from "@mui/material/styles/shadows";

dayjs.extend(weekOfYear);
dayjs.extend(customParseFormat);
dayjs.extend(localizedFormat);
dayjs.extend(isBetween);
dayjs.extend(advancedFormat);
dayjs.extend(require("dayjs/plugin/advancedFormat"));

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#AA336A",
  "#9933FF",
];
const pulse = keyframes` 0% { transform: scale(1); } 50% { transform: scale(1.05); } 100% { transform: scale(1); }`;

const AnimatedCard = styled(Card)(({ theme }) => ({
  transition: "transform 0.3s, box-shadow 0.3s",
  "&:hover": {
    transform: "translateY(-10px)",
    boxShadow: theme.shadows[10],
    animation: `${pulse} 0.6s`,
  },
}));

export default function AdminDashboard() {
  const [entriesPerDate, setEntriesPerDate] = useState([]);
  const [exitsPerDate, setExitsPerDate] = useState([]);
  const [timeOnSite, setTimeOnSite] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [users, setUsers] = useState([]);
  const [events, setEvents] = useState([]);
  const [gifts, setGifts] = useState([]);
  const [filterStartDate, setFilterStartDate] = useState(null);
  const [filterEndDate, setFilterEndDate] = useState(null);
  const [openManageDialog, setOpenManageDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [editedUser, setEditedUser] = useState({
    name: "",
    role: "",
    status: "",
  });
  const [loading, setLoading] = useState({});

  useEffect(() => {
    generateEntryExitData();
    generateTimeOnSiteData();
    generateAdditionalData();
  }, []);

  const generateEntryExitData = () => {
    const data = [];
    const startYear = dayjs().year() - 1;

    for (let year = startYear; year <= dayjs().year(); year++) {
      for (let month = 1; month <= 12; month++) {
        const date = dayjs(`${year}-${month}-01`);
        const entries = Math.floor(Math.random() * 100) + 50;
        const exits = Math.floor(Math.random() * 100) + 50;
        data.push({ date: date.format("YYYY-MM"), entries, exits });
      }
    }

    setEntriesPerDate(data.map((d) => ({ date: d.date, entries: d.entries })));
    setExitsPerDate(data.map((d) => ({ date: d.date, exits: d.exits })));
  };

  const generateTimeOnSiteData = () => {
    const data = [];
    const startYear = dayjs().year() - 1;

    for (let year = startYear; year <= dayjs().year(); year++) {
      for (let month = 1; month <= 12; month++) {
        const date = dayjs(`${year}-${month}-01`);
        const duration = Math.floor(Math.random() * 170) + 80; // בין 80 ל-250 דקות
        data.push({ date: date.format("YYYY-MM"), duration });
      }
    }

    setTimeOnSite(data);
  };

  const generateAdditionalData = () => {
    setUsers([
      { id: 1, name: "משתמש1", role: "מנהל", status: "פעיל" },
      { id: 2, name: "משתמש2", role: "משתמש", status: "פעיל" },
      { id: 3, name: "משתמש3", role: "משתמש", status: "לא פעיל" },
      { id: 4, name: "משתמש4", role: "סוכן", status: "פעיל" },
      { id: 5, name: "משתמש5", role: "משתמש", status: "פעיל" },
      { id: 6, name: "משתמש6", role: "משתמש", status: "לא פעיל" },
      { id: 7, name: "משתמש7", role: "מנהל", status: "פעיל" },
      { id: 8, name: "משתמש8", role: "סוכן", status: "פעיל" },
      { id: 9, name: "משתמש9", role: "משתמש", status: "פעיל" },
      { id: 10, name: "משתמש10", role: "משתמש", status: "לא פעיל" },
    ]);
    setEvents([
      {
        id: 1,
        NameOfGroom: "מוטי",
        NameOfBride: "איילת",
        TypeOfEvent: "חתונה",
        NumOfGuests: 150,
        DateOfEvent: "2024-06-15",
      },
      {
        id: 2,
        NameOfGroom: "דוד",
        NameOfBride: "רותם",
        TypeOfEvent: "בר/בת מצווה",
        NumOfGuests: 80,
        DateOfEvent: "2024-07-20",
      },
      {
        id: 3,
        NameOfGroom: "יוסי",
        NameOfBride: "נעמי",
        TypeOfEvent: "אירוע חברה",
        NumOfGuests: 200,
        DateOfEvent: "2024-08-10",
      },
      {
        id: 4,
        NameOfGroom: "אשר",
        NameOfBride: "ליאת",
        TypeOfEvent: "חתונה",
        NumOfGuests: 120,
        DateOfEvent: "2024-09-05",
      },
      {
        id: 5,
        NameOfGroom: "רותם",
        NameOfBride: "שירה",
        TypeOfEvent: "בר/בת מצווה",
        NumOfGuests: 100,
        DateOfEvent: "2024-10-12",
      },
    ]);

    setGifts([
      {
        id: 1,
        name: "משתמש1",
        gift: 300,
        date: "2024-04-01",
        blessing: "מזל טוב! שתזכו לשנים רבות של אושר ואהבה.",
        toEventName: "מוטי & איילת",
        amount: 300,
      },
      {
        id: 2,
        name: "משתמש2",
        gift: 500,
        date: "2024-04-02",
        blessing: "איחולים חמים לחתונה נפלאה!",
        toEventName: "דוד & רותם",
        amount: 500,
      },
      {
        id: 3,
        name: "משתמש3",
        gift: 250,
        date: "2024-04-03",
        blessing: "שפע ברכות ליום המיוחד שלכם.",
        toEventName: "יוסי & נעמי",
        amount: 250,
      },
      {
        id: 4,
        name: "משתמש4",
        gift: 400,
        date: "2024-04-04",
        blessing: "שתזכו לחיים מלאי אושר ושמחה.",
        toEventName: "אשר & ליאת",
        amount: 400,
      },
      {
        id: 5,
        name: "משתמש5",
        gift: 150,
        date: "2024-04-05",
        blessing: "מזל טוב! שתזכו ליום מיוחד ומאושר.",
        toEventName: "רותם & שירה",
        amount: 150,
      },
      {
        id: 6,
        name: "משתמש6",
        gift: 350,
        date: "2024-04-06",
        blessing: "איחולים לבביים לאירוע מוצלח!",
        toEventName: "מוטי & איילת",
        amount: 350,
      },
      {
        id: 7,
        name: "משתמש7",
        gift: 450,
        date: "2024-04-07",
        blessing: "שיהיה לכם חיים מלאים באהבה ואושר.",
        toEventName: "דוד & רותם",
        amount: 450,
      },
      {
        id: 8,
        name: "משתמש8",
        gift: 200,
        date: "2024-04-08",
        blessing: "איחולים לחתונה מושלמת!",
        toEventName: "יוסי & נעמי",
        amount: 200,
      },
      {
        id: 9,
        name: "משתמש9",
        gift: 300,
        date: "2024-04-09",
        blessing: "שתזכו לשנים רבות של אהבה ואושר.",
        toEventName: "אשר & ליאת",
        amount: 300,
      },
      {
        id: 10,
        name: "משתמש10",
        gift: 100,
        date: "2024-04-10",
        blessing: "מזל טוב ליום מיוחד!",
        toEventName: "רותם & שירה",
        amount: 100,
      },
    ]);
    setAlerts([
      { id: 1, type: "חשוד", message: "כניסה מרובה בזמן קצר ממשתמש1." },
      { id: 2, type: "חריג", message: "משתמש2 ביצע יציאה בלתי צפויה." },
      { id: 3, type: "חשוד", message: "משתמש3 ביצע כניסה מיותרת." },
      { id: 4, type: "חריג", message: "משתמש4 יציאה בזמן עבודה." },
      { id: 5, type: "חשוד", message: "משתמש5 ביצע כניסה מרובה ביום." },
      { id: 6, type: "חריג", message: "משתמש6 ביצע פעולת חריגה." },
    ]);
  };

  const filteredEntryExitData = entriesPerDate
    .map((entry, index) => ({
      date: entry.date,
      entries: entry.entries,
      exits: exitsPerDate[index]?.exits || 0,
    }))
    .filter((entry) => {
      const entryDate = dayjs(entry.date);
      const isAfterStart = filterStartDate
        ? entryDate.isAfter(filterStartDate, "month") ||
          entryDate.isSame(filterStartDate, "month")
        : true;
      const isBeforeEnd = filterEndDate
        ? entryDate.isBefore(filterEndDate, "month") ||
          entryDate.isSame(filterEndDate, "month")
        : true;
      return isAfterStart && isBeforeEnd;
    });

  const handleOpenManageDialog = (user) => {
    setSelectedUser(user);
    setEditedUser({ name: user.name, role: user.role, status: user.status });
    setOpenManageDialog(true);
  };
  const handleCloseManageDialog = () => {
    setOpenManageDialog(false);
    setSelectedUser(null);
  };
  const handleSaveUser = () => {
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.id === selectedUser.id ? { ...user, ...editedUser } : user
      )
    );
    handleCloseManageDialog();
  };
  const handleDeleteUser = (userId) => {
    if (window.confirm("האם אתה בטוח שברצונך למחוק משתמש זה?")) {
      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
    }
  };
  const handleDeleteEvent = (eventId) => {
    if (window.confirm("האם אתה בטוח שברצונך למחוק אירוע זה?")) {
      setEvents((prevEvents) =>
        prevEvents.filter((event) => event.id !== eventId)
      );
    }
  };
  const handleDeleteGift = (giftId) => {
    if (window.confirm("האם אתה בטוח שברצונך למחוק מתנה זו?")) {
      setGifts((prevGifts) => prevGifts.filter((gift) => gift.id !== giftId));
    }
  };

  const handleEditEvent = (event) => {
    console.log("Editing event:", event);
  };

  const entryExitColumns = [
    { field: "date", headerName: "תאריך", width: 150 },
    { field: "entries", headerName: "כניסות", width: 130 },
    { field: "exits", headerName: "יציאות", width: 130 },
  ];
  const userColumns = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "name", headerName: "שם", width: 150 },
    { field: "role", headerName: "תפקיד", width: 130 },
    { field: "status", headerName: "סטטוס", width: 130 },
    {
      field: "actions",
      headerName: "פעולות",
      width: 150,
      renderCell: (params) => (
        <Box>
          <IconButton
            color="primary"
            onClick={() => handleOpenManageDialog(params.row)}
          >
            <Edit />
          </IconButton>
          <IconButton
            color="error"
            onClick={() => handleDeleteUser(params.row.id)}
          >
            <Delete />
          </IconButton>
        </Box>
      ),
    },
  ];
  const eventColumns = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "NameOfGroom", headerName: "שם החתן", width: 150 },
    { field: "NameOfBride", headerName: "שם הכלה", width: 150 },
    { field: "TypeOfEvent", headerName: "סוג האירוע", width: 150 },
    { field: "NumOfGuests", headerName: "מספר אורחים", width: 130 },
    { field: "DateOfEvent", headerName: "תאריך האירוע", width: 150 },
    {
      field: "actions",
      headerName: "פעולות",
      width: 150,
      renderCell: (params) => (
        <Box>
          <IconButton
            color="primary"
            onClick={() => handleEditEvent(params.row)}
          >
            <Edit />
          </IconButton>
          <IconButton
            color="error"
            onClick={() => handleDeleteEvent(params.row.id)}
          >
            <Delete />
          </IconButton>
        </Box>
      ),
    },
  ];
  const giftColumns = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "name", headerName: "שם", width: 150 },
    { field: "gift", headerName: "סכום", width: 130 },
    { field: "date", headerName: "תאריך", width: 150 },
    { field: "blessing", headerName: "ברכה", width: 200 },
    { field: "toEventName", headerName: "אירוע", width: 200 },
    {
      field: "actions",
      headerName: "פעולות",
      width: 150,
      renderCell: (params) => (
        <Box>
          <IconButton
            color="error"
            onClick={() => handleDeleteGift(params.row.id)}
          >
            <Delete />
          </IconButton>
        </Box>
      ),
    },
  ];

  const eventTypeData = events.reduce((acc, event) => {
    const found = acc.find((item) => item.TypeOfEvent === event.TypeOfEvent);
    if (found) {
      found.count += 1;
    } else {
      acc.push({ TypeOfEvent: event.TypeOfEvent, count: 1 });
    }
    return acc;
  }, []);

  const giftSumPerEvent = gifts.reduce((acc, gift) => {
    const found = acc.find((item) => item.toEventName === gift.toEventName);
    if (found) {
      found.amount += gift.amount;
    } else {
      acc.push({ toEventName: gift.toEventName, amount: gift.amount });
    }
    return acc;
  }, []);

  const handleRefresh = (dataKey) => {
    setLoading((prev) => ({ ...prev, [dataKey]: true }));
    setTimeout(() => {
      if (dataKey === "entriesExits") {
        generateEntryExitData();
      } else if (dataKey === "timeOnSite") {
        generateTimeOnSiteData();
      } else if (dataKey === "users") {
        generateAdditionalData();
      }
      setLoading((prev) => ({ ...prev, [dataKey]: false }));
    }, 2000);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div
        dir="rtl"
        style={{
          fontFamily: "Roboto, sans-serif",
          backgroundColor: "#f5f5f5",
          minHeight: "100vh",
          paddingTop: "120px", // התאמה לבר ניווט קבוע
        }}
      >
        <Navbar />
        {/* כותרת מעל הפירוט */}

        <Typography
          variant="h3"
          gutterBottom
          align="center"
          sx={{
            fontWeight: "bold",
            color: "#1976D2",
            fontSize: { xs: "2.5rem", sm: "3rem" },
            fontFamily: "Poppins, sans-serif",
            textShadow: "0 0 10px rgba(255, 255, 255, 0.7)",
            animation: "glow 2s ease-in-out infinite alternate",
          }}
        >
          דף אדמין
        </Typography>

        <Container
          maxWidth="xl"
          sx={{ paddingTop: "80px", paddingBottom: "50px" }}
        >
          <Grid container spacing={4}>
            <Grid item xs={12} md={6} lg={3}>
              <SummaryCard
                title="כניסות"
                value="120"
                subtitle="ממוצע של 5 כניסות בכל שעה"
                icon={<Login />}
                bgColor="#1976D2"
              />
            </Grid>
            <Grid item xs={12} md={6} lg={3}>
              <SummaryCard
                title="יציאות"
                value="80"
                subtitle="ממוצע של 3 יציאות בכל שעה"
                icon={<ExitToApp />}
                bgColor="#d32f2f"
              />
            </Grid>
            <Grid item xs={12} md={6} lg={3}>
              <SummaryCard
                title="זמן באתר"
                value="4 דקות"
                subtitle="ממוצע זמן שהייה: 15 דקות"
                icon={<AccessTime />}
                bgColor="#388e3c"
              />
            </Grid>
            <Grid item xs={12} md={6} lg={3}>
              <SummaryCard
                title="משתמשים פעילים"
                value="35"
                subtitle="ממוצע זמן שהייה: 10 דקות"
                icon={<People />}
                bgColor="#f57c00"
              />
            </Grid>

            <Grid item xs={14} md={12} lg={12}>
              <ChartCard title="מספר כניסות ויציאות לפי חודש מה 12 חודשים האחרונים">
                {loading.entriesExits ? (
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      height: "300px",
                    }}
                  >
                    <CircularProgress size={60} thickness={4} />
                  </Box>
                ) : (
                  <LineChart data={filteredEntryExitData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <RechartsTooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="entries"
                      stroke="#1976D2"
                      activeDot={{ r: 8 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="exits"
                      stroke="#d32f2f"
                      activeDot={{ r: 8 }}
                    />
                  </LineChart>
                )}
                <Box sx={{ textAlign: "center", marginTop: 2 }}>
                  <IconButton
                    color="primary"
                    onClick={() => handleRefresh("entriesExits")}
                    component={motion.div}
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    <Refresh fontSize="large" />
                  </IconButton>
                </Box>
              </ChartCard>
            </Grid>
            <Grid item xs={12} md={12} lg={12}>
              <ChartCard title="זמן באתר לפי תאריך (בדקות)">
                <LineChart data={timeOnSite}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <RechartsTooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="duration"
                    stroke="#388e3c"
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ChartCard>
            </Grid>

            <Grid item xs={12} md={12} lg={6}>
              <ChartCard title="מספר אירועים לפי סוג">
                <PieChart>
                  <Pie
                    data={eventTypeData}
                    dataKey="count"
                    nameKey="TypeOfEvent"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    fill="#8884d8"
                    label
                  >
                    {eventTypeData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <RechartsTooltip />
                  <Legend />
                </PieChart>
              </ChartCard>
            </Grid>
            <Grid item xs={12} md={12} lg={6}>
              <ChartCard title="סכום מתנות לפי אירוע">
                <BarChart data={giftSumPerEvent}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="toEventName" />
                  <YAxis />
                  <RechartsTooltip />
                  <Legend />
                  <Bar dataKey="amount" fill="#82ca9d" />
                </BarChart>
              </ChartCard>
            </Grid>

            <Grid item xs={12}>
              <TableCard title="כניסות ויציאות">
                <DateFilter
                  startDate={filterStartDate}
                  endDate={filterEndDate}
                  setStartDate={setFilterStartDate}
                  setEndDate={setFilterEndDate}
                  clearFilters={() => {
                    setFilterStartDate(null);
                    setFilterEndDate(null);
                  }}
                />
                <DataGrid
                  rows={filteredEntryExitData}
                  getRowId={(row) => row.date}
                  columns={entryExitColumns}
                  pageSize={5}
                  rowsPerPageOptions={[5, 10, 20]}
                  components={{ Toolbar: GridToolbar }}
                />
              </TableCard>
            </Grid>
            <Grid item xs={12} md={6} lg={6}>
              <TableCard title="התראות">
                <AlertList alerts={alerts} />
              </TableCard>
            </Grid>
            <Grid item xs={12} md={6} lg={12}>
              <TableCard title="ניהול משתמשים">
                <DataGrid
                  rows={users}
                  columns={userColumns}
                  pageSize={5}
                  rowsPerPageOptions={[5, 10, 20]}
                  components={{ Toolbar: GridToolbar }}
                />
              </TableCard>
            </Grid>
            <Grid item xs={12}>
              <TableCard title="ניהול אירועים">
                <DataGrid
                  rows={events}
                  columns={eventColumns}
                  pageSize={5}
                  rowsPerPageOptions={[5, 10, 20]}
                  components={{ Toolbar: GridToolbar }}
                />
              </TableCard>
            </Grid>
            <Grid item xs={12}>
              <TableCard title="ניהול מתנות">
                <DataGrid
                  rows={gifts}
                  columns={giftColumns}
                  pageSize={5}
                  rowsPerPageOptions={[5, 10, 20]}
                  components={{ Toolbar: GridToolbar }}
                />
              </TableCard>
            </Grid>
          </Grid>
        </Container>

        <Dialog open={openManageDialog} onClose={handleCloseManageDialog}>
          <DialogTitle>ניהול משתמש</DialogTitle>
          <DialogContent>
            <Box
              component="form"
              sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}
            >
              <TextField
                label="שם"
                value={editedUser.name}
                onChange={(e) =>
                  setEditedUser({ ...editedUser, name: e.target.value })
                }
                fullWidth
              />
              <FormControl fullWidth>
                <InputLabel>תפקיד</InputLabel>
                <Select
                  value={editedUser.role}
                  label="תפקיד"
                  onChange={(e) =>
                    setEditedUser({ ...editedUser, role: e.target.value })
                  }
                >
                  <MenuItem value="מנהל">מנהל</MenuItem>
                  <MenuItem value="משתמש">משתמש</MenuItem>
                  <MenuItem value="סוכן">סוכן</MenuItem>
                </Select>
              </FormControl>
              <FormControl fullWidth>
                <InputLabel>סטטוס</InputLabel>
                <Select
                  value={editedUser.status}
                  label="סטטוס"
                  onChange={(e) =>
                    setEditedUser({ ...editedUser, status: e.target.value })
                  }
                >
                  <MenuItem value="פעיל">פעיל</MenuItem>
                  <MenuItem value="לא פעיל">לא פעיל</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseManageDialog}>ביטול</Button>
            <Button
              onClick={handleSaveUser}
              variant="contained"
              color="primary"
            >
              שמור
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </LocalizationProvider>
  );
}

const SummaryCard = ({ title, value, subtitle, icon, bgColor }) => (
  <AnimatedCard component={motion.div} whileHover={{ scale: 1.05 }}>
    <CardHeader
      avatar={<Avatar sx={{ bgcolor: bgColor }}>{icon}</Avatar>}
      title={title}
      subheader={subtitle}
    />
    <CardContent>
      <Typography variant="h5">{value}</Typography>
    </CardContent>
  </AnimatedCard>
);

const ChartCard = ({ title, children }) => (
  <Paper
    sx={{
      padding: "20px",
      borderRadius: "15px",
      boxShadow: 3,
      backgroundColor: "#ffffff",
    }}
    component={motion.div}
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 1 }}
  >
    <Typography variant="h6" gutterBottom>
      {title}
    </Typography>
    <ResponsiveContainer width="100%" height={300}>
      {children}
    </ResponsiveContainer>
  </Paper>
);

const TableCard = ({ title, children }) => (
  <Paper
    sx={{
      padding: "20px",
      borderRadius: "15px",
      boxShadow: 3,
      backgroundColor: "#ffffff",
    }}
    component={motion.div}
    initial={{ y: 50, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    transition={{ duration: 1 }}
  >
    <Typography variant="h6" gutterBottom>
      {title}
    </Typography>
    {children}
  </Paper>
);

const AlertList = ({ alerts }) => (
  <List>
    {alerts.map((alert) => (
      <ListItem key={alert.id}>
        <ListItemIcon>
          <motion.div animate={getIconAnimation(alert.type)}>
            {alert.type === "חשוד" ? (
              <WarningAmber color="warning" />
            ) : (
              <ReportProblem color="error" />
            )}
          </motion.div>
        </ListItemIcon>
        <ListItemText primary={alert.message} />
        <Divider />
      </ListItem>
    ))}
  </List>
);

const DateFilter = ({
  startDate,
  endDate,
  setStartDate,
  setEndDate,
  clearFilters,
}) => (
  <Box sx={{ display: "flex", gap: 2, marginBottom: 2, flexWrap: "wrap" }}>
    <DatePicker
      label="מתאריך"
      value={startDate}
      onChange={(newValue) => setStartDate(newValue)}
      slots={{ textField: (params) => <TextField {...params} /> }}
    />
    <DatePicker
      label="עד תאריך"
      value={endDate}
      onChange={(newValue) => setEndDate(newValue)}
      slots={{ textField: (params) => <TextField {...params} /> }}
    />
    <Button variant="contained" color="primary" onClick={clearFilters}>
      נקה פילטרים
    </Button>
  </Box>
);

const getIconAnimation = (type) => {
  if (type === "חשוד") {
    return {
      scale: [1, 1.2, 1],
      rotate: [0, 5, -5, 0],
      transition: { duration: 1, repeat: Infinity, ease: "easeInOut" },
    };
  }
  return {
    scale: [1, 1.05, 1],
    transition: { duration: 1.5, repeat: Infinity, ease: "easeInOut" },
  };
};
