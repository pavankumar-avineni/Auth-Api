const express = require("express");
const mongoose = require("mongoose");
const helmet = require("helmet");
require("dotenv").config();
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./swagger");

const authRoutes = require("./routes/auth");
const profileRoutes = require("./routes/profile");

const logger = require("./middleware/logger");
const errorHandler = require("./middleware/errorHandler");

const app = express();

// 🔐 Secure headers
app.use(helmet());

// 📝 Logging
app.use(logger);

// 📦 Parse JSON
app.use(express.json());

// 🗄️ Database
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(() => console.log("MongoDB error"));

// 🚏 Routes
app.use("/api", authRoutes);
app.use("/api", profileRoutes);

// ❌ Error handler (MUST be last)
app.use(errorHandler);

// swagger
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

//file upload
app.use("/uploads", express.static("uploads"));

// 🚀 Start server
app.listen(3000, () => {
  console.log("Server running on port 3000");
});