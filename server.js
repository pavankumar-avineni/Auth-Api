const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

const authRoutes = require("./routes/auth");
const profileRoutes = require("./routes/profile");

const limiter = require("./middleware/rateLimiter");
//app.use(limiter);


const app = express();
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(() => console.log("MongoDB error"));

app.use("/api", authRoutes);
//app.use(limiter);
app.use("/api", profileRoutes);

app.listen(3000, () => {
  console.log("Server started on port 3000");
});
