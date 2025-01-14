import { Box, Typography } from "@mui/material";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import React from "react";

const createData = (name, number, sum, blessing, image, video) => {
  return { name, number, sum, blessing, image, video };
};

const rows = [
  createData("Marilyn Monroe", 1, 300, "hi", "yes", "no"),
  createData("Donald Trump", 3, 400, "hi", "yes", "no"),
  createData("Albert Enstein", 1, 120, "hi", "yes", "no"),
  createData("Michael Jackson", 2, 300, "hi", "no", "yes"),
  createData("Charlie Chaplin", 1, 1000, "hi", "no", "yes"),
  createData("Abraham Lincoln", 1, 160, "hi", "no", "yes"),
  createData("John Lennon", 1, 170, "hi", "yes", "no"),
  createData("Leonardo Da Vinci", 1, 200, "hi", "no", "yes"),
  createData("Christopher Columbus", 1, 100, "hi", "no", "yes"),
  createData("J.K. Rowling", 5, 1600, "hi", "no", "yes"),
];

const Admin = () => {
  let sumOfGifts = 0;
  rows.forEach((x) => {
    sumOfGifts += x.sum;
  });
  return (
    <div>
      <Typography
        variant="h2"
        padding={3}
        textAlign="center"
        margin="auto"
        marginTop={5}
      >
        Eazy Gift
      </Typography>
      <form>
        <Box
          display="flex"
          flexDirection={"column"}
          maxWidth={800}
          alignItems="center"
          justifyContent={"center"}
          margin="auto"
          marginTop={5}
          padding={3}
          borderRadius={5}
          boxShadow={"5px 5px 10px #ccc"}
          backgroundColor="#f0f0f5"
          sx={{
            ":hover": {
              boxShadow: "10px 10px 20px #ccc",
            },
          }}
        >
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>Guests</TableCell>
                  <TableCell align="right">Number</TableCell>
                  <TableCell align="right">Sum</TableCell>
                  <TableCell align="right">Blessing</TableCell>
                  <TableCell align="right">Image</TableCell>
                  <TableCell align="right">Video</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row) => (
                  <TableRow
                    key={row.name}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      {row.name}
                    </TableCell>
                    <TableCell align="right">{row.number}</TableCell>
                    <TableCell align="right">{row.sum}</TableCell>
                    <TableCell align="right">{row.blessing}</TableCell>
                    <TableCell align="right">{row.image}</TableCell>
                    <TableCell align="right">{row.video}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <div>
            <h1 style={{ color: "#00008B", fontFamily: "Comic Sans MS" }}>
              Total all gifts: {sumOfGifts}
            </h1>
          </div>
        </Box>
      </form>
    </div>
  );
};

export default Admin;
