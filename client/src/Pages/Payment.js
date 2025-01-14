import { Box, TextField, Typography } from "@mui/material";
import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";
import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Context } from "../App";

const Pay = () => {
  const { state, setState } = useContext(Context);
  const Navigate = useNavigate();

  return (
    <div>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "left",
          "& > *": {
            m: 1,
          },
        }}
      ></Box>
      <Typography variant="h2" padding={3} textAlign="center">
        Eazy Gift
      </Typography>
      <form>
        <Box
          display="flex"
          flexDirection={"column"}
          maxWidth={500}
          alignItems="center"
          justifyContent={"center"}
          margin="auto"
          marginTop={5}
          padding={3}
          borderRadius={5}
          boxShadow={"5px 5px 10px #ccc"}
          sx={{
            ":hover": {
              boxShadow: "10px 10px 20px #ccc",
              //   "& button": { m: 1 },
            },
          }}
        >
          <Typography variant="h4" padding={3} textAlign="center">
            Payment page
          </Typography>

          <div style={{ margin: "20px" }}>
            <TextField
              name="amount"
              id="outlined-basic"
              label="Amount to pay"
              variant="outlined"
              margin="normal"
              type="number"
              value={state}
              onChange={(e) => setState(e.target.value)}
            />
            <PayPalScriptProvider
              options={{
                "client-id": "test",
                components: "buttons",
                currency: "NIS",
              }}
            >
              <PayPalButtons
                createOrder={(data, actions) => {
                  return actions.order.create({
                    purchase_units: [
                      {
                        amount: {
                          value: state,
                        },
                      },
                    ],
                  });
                }}
                amount={state}
                onApprove={function (data, actions) {
                  return actions.order.capture().then(function (details) {
                    alert(
                      "Transaction completed successfully by" +
                        details.payer.given_name
                    );
                    console.log({ details, data });
                  });
                }}
              />
            </PayPalScriptProvider>
          </div>
        </Box>
      </form>
    </div>
  );
};

export default Pay;
