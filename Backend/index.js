const dotenv = require("dotenv");
const express = require("express");
const connectDB = require("./config/dbconnect");
dotenv.config();

const app = express();

const port = process.env.PORT || 8000;

app.listen(port, () => {
    connectDB();
    console.log(`server is running at port no ${port}`);
});

