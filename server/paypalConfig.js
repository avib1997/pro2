const paypal = require("paypal-rest-sdk");
require("dotenv").config();

paypal.configure({
  mode: "sandbox", // כדי להשתמש ב-Live שים "live"
  client_id: process.env.PAYPAL_CLIENT_ID,
  client_secret: process.env.PAYPAL_SECRET,
});

module.exports = paypal;
