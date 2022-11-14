const express = require("express");
const app = express();
const dotenv = require("dotenv");
dotenv.config({path : "./config.env"});
const cors = require("cors");
const fs = require("fs");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const path = require("path");
const productRoutes = require("./routes/product-route");

app.use(express.json());

app.use(cookieParser());

app.use(cors());

var accessLogStream = fs.createWriteStream(path.join("utils", 'access.log'), {
    flags : 'a'
});

app.use(morgan('dev', { stream : accessLogStream }));

app.use("/api/v1/products", productRoutes);

module.exports = app;