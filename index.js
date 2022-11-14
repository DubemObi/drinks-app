const mongoose = require("mongoose");
const express = require("express");
const fs = require("fs");
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });
const cookieParser = require("cookie-parser");
const authRoute = require("./Routes/authRoute");
const userRoute = require("./Routes/userRoute");

const app = express();
const PORT = 2050;
app.use(express.json());

app.use(cookieParser());
app.use("/api/v1/auths", authRoute);
app.use("/api/v1/users", userRoute);

mongoose.connect(process.env.mongoDB).then(() => {
  console.log("Connected to Database");
});
app.listen(PORT, () => {
  console.log("App is running on port " + PORT);
});
