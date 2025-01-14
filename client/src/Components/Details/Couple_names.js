import React, { useState } from "react";
import { Box, Button, TextField, Typography } from "@mui/material";

const Couple_names = () => {
  const [input, setInput] = useState({
    NameOfGroom: "",
    NameOfBride: "",
    NameOfManager: "",
    TypeOfEvent: "",
    NumOfGuests:"",
    phone:"",
    DateOfEvent:"",
  });
  const handelchange = (e) => {
    setInput((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const handelSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <div>
      <form onSubmit={handelSubmit}>
        <Box
          display="flex"
          flexDirection={"column"}
          alignItems="center"
          justifyContent={"center"}
          margin="auto"
        >
          <Typography variant="h2" padding={3} textAlign="center">
            new event
          </Typography>

          <TextField
            onChange={handelchange}
            name="NameOfGroom"
            value={input.NameOfGroom}
            margin="normal"
            type={"text"}
            variant="outlined"
            placeholder="Name Of Groom"
            label="Name Of Groom"
          />
          <TextField
            onChange={handelchange}
            name="NameOfBride"
            value={input.NameOfBride}
            margin="normal"
            type={"text"}
            variant="outlined"
            placeholder="Name Of Bride"
            label="Name Of Bride"
          />
          <TextField
            onChange={handelchange}
            name="NameOfManager"
            value={input.NameOfManager}
            margin="normal"
            type={"text"}
            variant="outlined"
            placeholder="Name Of Manager"
            label="Name Of Manager"
          />

          <TextField
            onChange={handelchange}
            name="TypeOfEvent"
            value={input.TypeOfEvent}
            margin="normal"
            type={"taxt"}
            variant="outlined"
            placeholder="Type Of Event"
            label="Type Of Event"
          />
          <TextField
            onChange={handelchange}
            name="NumOfGuests"
            value={input.NumOfGuests}
            margin="normal"
            type={"number"}
            variant="outlined"
            placeholder="Num Of Guests"
            label="Num Of Guests"
          />
          <TextField
            onChange={handelchange}
            name="phone"
            value={input.phone}
            margin="normal"
            type={"number"}
            variant="outlined"
            placeholder="phone"
            label="phone"
          />
          <TextField
            onChange={handelchange}
            name="DateOfEvent"
            value={input.DateOfEvent}
            margin="normal"
            type={"date"}
            variant="outlined"
            placeholder="Date Of Event"
            // label="Date Of Event"
          />
          <Button
            type="submit"
            sx={{ margin: 3, borderRadius: 3 }}
            variant="contained"
            size="large"
          >
            Add
          </Button>
        </Box>
      </form>
    </div>
  );
};

export default Couple_names;