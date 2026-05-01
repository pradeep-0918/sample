const express = require("express");
const cors  = require("cors");
const mongoose = require("mongoose");
const app = express();
const urlRouter = require("./routes/url");
require("dotenv").config();
app.use(cors());
app.use(cors({
    origin: process.env.FRONTEND_URL,
}));
app.use(express.json());
app.use("/api",urlRouter);
app.use("/",urlRouter);
mongoose.connect(process.env.MONGO_URL).then(() => console.log("Connected to mongodb"));
app.listen(process.env.PORT, () => console.log(`Server is running on port ${process.env.PORT}`));
