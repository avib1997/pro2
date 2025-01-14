import React, { useState, useContext } from "react";
import { Box, Button, TextField, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Context } from "../../App";

const Signup = (props) => {
  const Navigate = useNavigate();
  const { userId, setUserId } = useContext(Context);
  const [input, setInput] = useState({
    fname: "",
    lname: "",
    email: "",
    password: "",
  });
  const handelchange = (e) => {
    setInput((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const handeClick = (e) => {
    e.preventDefault();
    if (props.a === "manager") {
      const addUserManager = {
        fname: input.fname,
        lname: input.lname,
        email: input.email,
        password: input.password,
      };
      axios.post("http://localhost:2001/addUserManager", addUserManager);
      Navigate("/EventManager");
    } else {
      const newUser = {
        fname: input.fname,
        lname: input.lname,
        email: input.email,
        password: input.password,
      };
      axios
        .post("http://localhost:2001/api/users/register", newUser)
        .then(function (response) {
          setUserId(response.data.user._id);
          response.data
            ? Navigate("/Details")
            : console.log("no enter for you");
        })
        .catch(function (error) {
          console.log(error);
        });
    }
  };

  return (
    <div>
      <form>
        <Box
          display="flex"
          flexDirection={"column"}
          alignItems="center"
          justifyContent={"center"}
          margin="auto"
        >
          <Typography variant="h2" padding={3} textAlign="center">
            Signup
          </Typography>
          <TextField
            onChange={handelchange}
            name="fname"
            value={input.fname}
            margin="normal"
            type={"text"}
            variant="outlined"
            placeholder="First Name"
            label="First Name"
          />
          <TextField
            onChange={handelchange}
            name="lname"
            value={input.lname}
            margin="normal"
            type={"text"}
            variant="outlined"
            placeholder="Last name"
            label="Last Name"
          />
          <TextField
            onChange={handelchange}
            name="email"
            value={input.email}
            margin="normal"
            type={"email"}
            variant="outlined"
            placeholder="Email"
            label="Email"
          />
          <TextField
            onChange={handelchange}
            name="password"
            value={input.password}
            margin="normal"
            type={"password"}
            variant="outlined"
            placeholder="Password"
            label="Password"
          />
          {/* {props.a === "manager" && <Button>change to login</Button>} */}
          <Button
            onClick={handeClick}
            type="submit"
            sx={{ margin: 3, borderRadius: 3 }}
            variant="contained"
            size="large"
          >
            Signup
          </Button>
        </Box>
      </form>
    </div>
  );
};

export default Signup;
