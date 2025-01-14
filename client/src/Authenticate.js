import axios from "axios";
import React, { useState } from "react";
import DATA from "../data";
import { Login } from "./Components/Register/Login";

export const Authenticate = (props) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [notif, setNotif] = useState({ message: "", style: "" });
  // const [isAdmin, setIsAdmin] = useState(false);
  // const [client, setClient] = useState(null);
  const localUsers = localStorage.getItem("users");

  if (!localUsers) {
    localStorage.setItem("users", JSON.stringify(DATA));
  }

  const isLoginSuccess = async (email, password) => {
    try {
      const res = await axios.post("http://localhost:2001/api/user/login", {
        email,
        password,
      });
      if (res.name === "AxiosError") throw res;
      console.log(res.data);
    } catch (error) {
      console.log(error.response.data);
    }
    return false;
  };

  const login = (username, password) => {
    if (isLoginSuccess(username, password)) {
      setIsLoggedIn(true);
    }
  };

  if (isLoggedIn) {
    return (
      <Login
        users={props.users}
        loginHandler={login}
        notif={notif}
        isLoggedIn={isLoggedIn}
      />
    );
  }
};
