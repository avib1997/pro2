// קובץ: src/Pages/History.js

import {
  LocalAtm as AtmIcon,
  Mic as AudioIcon,
  CreditCard as CreditCardIcon,
  GetApp as GetAppIcon,
  Image as ImageIcon,
  KeyboardArrowDown as KeyboardArrowDownIcon,
  KeyboardArrowUp as KeyboardArrowUpIcon,
  AttachMoney as MoneyIcon,
  Payment as PaymentIcon,
  Print as PrintIcon,
  VideoLibrary as VideoIcon,
  AccountBalanceWallet as WalletIcon
} from "@mui/icons-material";
import {
  Alert,
  Box,
  Collapse,
  Container,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";
import axios from "axios";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import React, { useContext, useEffect, useState } from "react";
import { Context } from "../App";
import Navbar from "../Components/Navbar/Navbar";

function CollapsibleRow(props) {
  const { row, isOpen, onToggle } = props;

  // פונקציה להחזיר את האייקון והשם המתאימים לאמצעי התשלום
  const getPaymentIconAndName = (method) => {
    let icon;
    let name;
    switch (method) {
      case "PayPal":
        icon = (
          <PaymentIcon
            sx={{ color: "#3b7bbf", marginRight: 0.5, paddingLeft: 1 }}
          />
        );
        name = "PayPal";
        break;
      case "PayBox":
        icon = (
          <WalletIcon
            sx={{ color: "#d81b60", marginRight: 0.5, paddingLeft: 1 }}
          />
        );
        name = "PayBox";
        break;
      case "Bit":
        icon = (
          <AtmIcon
            sx={{ color: "#4caf50", marginRight: 0.5, paddingLeft: 1 }}
          />
        );
        name = "Bit";
        break;
      case "אשראי":
        icon = (
          <CreditCardIcon
            sx={{ color: "#F0A500", marginRight: 0.5, paddingLeft: 1 }}
          />
        );
        name = "אשראי";
        break;
      default:
        icon = (
          <MoneyIcon
            sx={{ color: "#F0A500", marginRight: 0.5, paddingLeft: 1 }}
          />
        );
        name = "מזומן";
        break;
    }
    return (
      <Box display="flex" alignItems="center" justifyContent="center">
        {icon}
        <Typography variant="body2" sx={{ color: "#E0E1DD" }}>
          {name}
        </Typography>
      </Box>
    );
  };

  // פונקציה להחזיר את האייקונים של הקבצים המצורפים
  const getAttachmentIcons = (attachments) => {
    const icons = [];
    if (attachments.includes("תמונה")) {
      icons.push(
        <ImageIcon key="image" sx={{ color: "#F0A500", marginLeft: 1 }} />
      );
    }
    if (attachments.includes("וידאו")) {
      icons.push(
        <VideoIcon key="video" sx={{ color: "#F0A500", marginLeft: 1 }} />
      );
    }
    if (attachments.includes("הקלטה")) {
      icons.push(
        <AudioIcon key="audio" sx={{ color: "#F0A500", marginLeft: 1 }} />
      );
    }
    return icons;
  };

  return (
    <>
      <TableRow
        hover
        onClick={onToggle}
        sx={{
          cursor: "pointer",
          "&:hover": {
            backgroundColor: "#2E3B55",
            backgroundImage:
              "linear-gradient(90deg, rgba(255, 215, 0, 0.1), rgba(192, 192, 192, 0.1))",
            transition: "background 0.5s ease",
          },
        }}
      >
        <TableCell
          align="center"
          sx={{
            color: "#E0E1DD",
            fontWeight: "bold",
            textShadow: "1px 1px silver",
          }}
        >
          {row.name}
        </TableCell>
        <TableCell
          align="center"
          sx={{
            color: "#E0E1DD",
            fontWeight: "bold",
            textShadow: "1px 1px silver",
          }}
        >
          {row.gift} ₪
        </TableCell>
        <TableCell align="center">
          {getPaymentIconAndName(row.paymentMethod)}
        </TableCell>
        <TableCell align="center">
          {getAttachmentIcons(row.attachments)}
        </TableCell>
        <TableCell
          align="center"
          sx={{
            color: "#E0E1DD",
            fontWeight: "bold",
            textShadow: "1px 1px silver",
          }}
        >
          {row.date}
        </TableCell>
        <TableCell align="center">
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              onToggle();
            }}
            sx={{
              color: "#F0A500",
              transition: "transform 0.3s, color 0.3s",
              "&:hover": {
                transform: "scale(1.2)",
                color: "#FFD700",
              },
            }}
          >
            {isOpen ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell
          style={{ paddingBottom: 0, paddingTop: 0 }}
          colSpan={6}
          sx={{ backgroundColor: "#1B263B" }}
        >
          <Collapse in={isOpen} timeout="auto" unmountOnExit>
            <Box margin={2} textAlign="center">
              <Typography
                variant="subtitle1"
                gutterBottom
                sx={{ color: "#E0E1DD", fontWeight: "bold" }}
              >
                ברכה:
              </Typography>
              <Typography variant="body1" sx={{ color: "#E0E1DD" }}>
                {row.blessing}
              </Typography>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}

export default function History() {
  const { userId, detailsId, event } = useContext(Context);
  const [gifts, setGifts] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [openRowId, setOpenRowId] = useState(null);

  // יצירת 100 מתנות פיקטיביות
  const generateFakeData = () => {
    const names = [
      "דוד וחנה",
      "יוסי ורונית",
      "אבי ודנה",
      "מירי ורן",
      "ליאת ונועה",
      "עמית וקרן",
      "איתי וגלית",
      "תומר ושירה",
      "אורן וטל",
      "רון ודניאל",
      "שני ועידן",
      "מעיין ויובל",
      "ניר ואופיר",
      "אופק ומעיין",
      "נועם ושחר",
      "ענבל ודפנה",
      "עדי ואלה",
      "אריאל ונועה",
      "ליאור ועמית",
      "דנה ויובל",
    ];
    const blessings = [
      "מזל טוב! שתזכו לשנים רבות של אושר ואהבה.",
      "איחולים חמים לחתונה נפלאה!",
      "שפע ברכות ליום המיוחד שלכם.",
      "מאחלים לכם חיים מלאי אהבה ואושר.",
      "שתזכו לבנות בית נאמן בישראל.",
      "ברכות חמות ליום הנפלא שלכם.",
      "מזל טוב לזוג המקסים!",
      "מאחלים לכם כל טוב!",
      "שיהיה במזל!",
      "המון אושר ואהבה!",
    ];
    const paymentMethods = ["PayPal", "PayBox", "Bit", "אשראי"];
    const attachmentsOptions = ["הקלטה", "וידאו", "תמונה"];

    const fakeGifts = [];

    for (let i = 1; i <= 100; i++) {
      const name = names[Math.floor(Math.random() * names.length)];
      const gift = Math.floor(Math.random() * 500) + 50;
      const date = new Date(
        Date.now() - Math.floor(Math.random() * 10000000000)
      ).toLocaleDateString("he-IL");
      const blessing = blessings[Math.floor(Math.random() * blessings.length)];

      const paymentMethod =
        paymentMethods[Math.floor(Math.random() * paymentMethods.length)];

      const attachments = [];
      const numAttachments = Math.floor(Math.random() * 3) + 1;
      for (let j = 0; j < numAttachments; j++) {
        const attachment =
          attachmentsOptions[
            Math.floor(Math.random() * attachmentsOptions.length)
          ];
        if (!attachments.includes(attachment)) {
          attachments.push(attachment);
        }
      }

      fakeGifts.push({
        _id: i.toString(),
        name: `${name} (פקטיבי)`,
        gift,
        date,
        blessing: `${blessing} (פקטיבי)`,
        paymentMethod,
        attachments,
      });
    }

    return fakeGifts;
  };

  useEffect(() => {
    const fetchGifts = async () => {
      try {
        const response = await axios.post(
          "http://localhost:2001/api/gift/getgift",
          { giftsId: detailsId }
        );

        if (response.data && response.data.length > 0) {
          setGifts(response.data);
        } else {
          setGifts(generateFakeData());
        }
      } catch (error) {
        setGifts(generateFakeData());
        setErrorMessage("שגיאה בטעינת הנתונים מהשרת. מוצגים נתונים פיקטיביים.");
      }
    };

    fetchGifts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [detailsId]);

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();

    doc.text(`היסטוריית מתנות`, 10, 10);
    autoTable(doc, {
      startY: 20,
      head: [["שם", "סכום", "תאריך", "אמצעי תשלום", "מצורפים", "ברכה"]],
      body: gifts.map((gift) => [
        gift.name,
        `${gift.gift} ₪`,
        gift.date,
        gift.paymentMethod,
        gift.attachments.join(", "),
        gift.blessing,
      ]),
    });

    doc.save("gifts_history.pdf");
  };

  return (
    <Box
      sx={{
        position: "relative",
        minHeight: "850vh",
        direction: "rtl",
        paddingTop: "120px", // התאמה לבר ניווט קבוע
      }}
    >
      <Navbar
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          zIndex: 1000,
        }}
      />

      {/* רקע עם אנימציה זזה */}
      <Box
        sx={{
          position: "fixed",
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

      {/* אנימציית מטבעות נופלים */}
      <Box
        className="coin-animation"
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
          zIndex: -1,
        }}
      />

      <Container
        maxWidth="lg"
        sx={{
          marginTop: "20px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          fontFamily: "Poppins, sans-serif",
          color: "#E0E1DD",
        }}
      >
        <Typography
          variant="h3"
          gutterBottom
          align="center"
          sx={{
            fontWeight: "bold",
            marginBottom: "20px",
            textShadow: "2px 2px silver",
            color: "#E0E1DD",
            animation: "textGlow 2s ease-in-out infinite",
          }}
        >
          היסטוריית מתנות
        </Typography>

        {errorMessage && (
          <Alert severity="warning" sx={{ marginBottom: "20px" }}>
            {errorMessage}
          </Alert>
        )}

        <Box sx={{ width: "100%", position: "relative" }}>
          <Box sx={{ position: "absolute", left: 0, top: -50 }}>
            <Tooltip title="הדפס">
              <IconButton
                onClick={handlePrint}
                sx={{
                  color: "#F0A500",
                  transition: "transform 0.3s, color 0.3s",
                  "&:hover": {
                    transform: "scale(1.2)",
                    color: "#FFD700",
                  },
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
                  transition: "transform 0.3s, color 0.3s",
                  "&:hover": {
                    transform: "scale(1.2)",
                    color: "#FFD700",
                  },
                }}
              >
                <GetAppIcon />
              </IconButton>
            </Tooltip>
          </Box>

          <TableContainer
            component={Paper}
            sx={{
              borderRadius: "15px",
              backgroundColor: "#1B263B",
              boxShadow: "0px 8px 24px rgba(0, 0, 0, 0.5)",
              overflow: "hidden",
              animation: "fadeIn 1s ease",
            }}
          >
            <Table dir="rtl">
              <TableHead>
                <TableRow sx={{ backgroundColor: "#0D1B2A" }}>
                  <TableCell
                    sx={{
                      color: "#F0A500",
                      fontWeight: "bold",
                      textShadow: "1px 1px silver",
                    }}
                    align="center"
                  >
                    שם
                  </TableCell>
                  <TableCell
                    sx={{
                      color: "#F0A500",
                      fontWeight: "bold",
                      textShadow: "1px 1px silver",
                    }}
                    align="center"
                  >
                    סכום
                  </TableCell>
                  <TableCell
                    sx={{
                      color: "#F0A500",
                      fontWeight: "bold",
                      textShadow: "1px 1px silver",
                    }}
                    align="center"
                  >
                    אמצעי תשלום
                  </TableCell>
                  <TableCell
                    sx={{
                      color: "#F0A500",
                      fontWeight: "bold",
                      textShadow: "1px 1px silver",
                    }}
                    align="center"
                  >
                    מצורפים
                  </TableCell>
                  <TableCell
                    sx={{
                      color: "#F0A500",
                      fontWeight: "bold",
                      textShadow: "1px 1px silver",
                    }}
                    align="center"
                  >
                    תאריך
                  </TableCell>
                  <TableCell align="center"></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {gifts.length > 0 ? (
                  gifts.map((row) => (
                    <CollapsibleRow
                      key={row._id}
                      row={row}
                      isOpen={openRowId === row._id}
                      onToggle={() =>
                        setOpenRowId(openRowId === row._id ? null : row._id)
                      }
                    />
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      align="center"
                      sx={{ color: "#E0E1DD" }}
                    >
                      אין נתונים להצגה
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Container>

      <style>
        {`
          @keyframes animateBg {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
          @keyframes textGlow {
            0%, 100% {
              text-shadow: 0 0 10px silver, 0 0 20px silver, 0 0 30px gold, 0 0 40px gold;
            }
            50% {
              text-shadow: 0 0 20px silver, 0 0 30px gold, 0 0 40px gold, 0 0 50px gold;
            }
          }
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          /* אנימציית מטבעות נופלים */
          .coin-animation {
            background-image: none; /* הוסר רקע תמונה */
          }
          @media print {
            body {
              visibility: hidden;
            }
            .MuiPaper-root {
              visibility: visible;
            }
          }
        `}
      </style>
    </Box>
  );
}
