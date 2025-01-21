const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv/config");
const app = express();
const router = require("./Routes");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

// DB Connection
const connect = async () => {
  try {
    await mongoose
      .connect(process.env.DB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
      .then(() => {
        console.log("DB Connected");
      });
  } catch (error) {
    console.error(err);
  }
};

connect();
module.exports = { connect };

//routes
// app.use("/", routesHandler);
// app.use("/", routesAuth);
// app.use("/", routesGift);
app.use("/api", router);

const PORT = process.env.PORT || 2001; // backend routing port
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
