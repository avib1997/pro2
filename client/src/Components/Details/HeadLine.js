// קובץ: src/Components/Details/HeadLine.js

import React from "react";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import localImage from "./images/FCE50652-AE25-4C9E-BC7D-182B49DDDC78.jpg"; // ודא שהתמונה נמצאת בתיקייה הנכונה

const HeadLine = ({ groom, bride }) => {
  const title = groom && bride ? `${groom} & ${bride}` : "ברוכים הבאים";

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      paddingLeft="10px"
      mb={4}
      sx={{
        flexDirection: { xs: "column", sm: "row" }, // התאמת כיוון עמודות במכשירים קטנים
        textAlign: { xs: "center", sm: "left" },
        gap: 6, // הגדלת המרווח בין התמונה לכותרת
      }}
    >
      <Typography
        sx={{
          fontSize: { xs: "2.5rem", sm: "3.5rem" }, // התאמת גודל הפונט
          fontFamily: "Roboto, sans-serif", // שימוש בפונט Roboto
          color: "#1976D2",
          fontWeight: "bold",
        }}
        variant="h3"
        gutterBottom
      >
        {title}
      </Typography>
      <Avatar
        sx={{
          height: { xs: 120, sm: 200 }, // גודל התמונה במכשירים שונים
          width: { xs: 120, sm: 200 },
        }}
        src={localImage}
        alt="pic"
      />
    </Box>
  );
};

export default HeadLine;
