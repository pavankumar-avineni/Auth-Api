process.on("unhandledRejection", (reason) => {
  console.error("UNHANDLED REJECTION:", reason);
});

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/auth");
const fileRoutes = require("./routes/files");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./swagger/swagger");

// ✅ CREATE APP FIRST
const app = express();

// ✅ THEN USE MIDDLEWARE
app.use(cors());
app.use(express.json());

// ✅ ROUTES
app.use("/api", authRoutes);
app.use("/api", fileRoutes);

// ✅ SWAGGER
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// ✅ DB CONNECT
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));



app.use((err, req, res, next) => {
  console.error("ERROR:", err);

  res.status(500).json({
    message: err.message || "Internal Server Error"
  });
});

  



// ✅ START SERVER
app.listen(process.env.PORT || 3000, () => {
  console.log(`Server running on port ${process.env.PORT || 3000}`);
  console.log(`Swagger: http://localhost:3000/api-docs`);
});
