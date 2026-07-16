const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const connectDB = require("./config/dbconnect");
const cors = require("cors");
const cookieParser = require("cookie-parser");


const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


const port = process.env.PORT || 8000;

connectDB().then(() => {
    app.listen(port, () => {
        console.log(`server is running at port no ${port}`);
    });
});

