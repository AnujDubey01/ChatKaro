const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const connectDB = require("./config/dbconnect");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const authRoutes = require("./routes/authRoutes");


const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials:true
}));
app.use("/api/v1/auth",authRoutes);


const port = process.env.PORT || 8000;

connectDB()
    .then(() => {
        app.listen(port, () => {
            console.log(`🚀 Server running on ${port}`);
        });
    })
    .catch((err) => {
        console.log(err);
    });