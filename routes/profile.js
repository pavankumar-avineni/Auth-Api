const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const router = express.Router();

router.get(
  "/profile",
  authMiddleware,
  roleMiddleware("user"),
  (req, res) => {
    res.json({
      message: "User profile data",
      userId: req.userId
    });
  }
);

// ADMIN route
router.get(
  "/admin",
  authMiddleware,
  roleMiddleware("admin"),
  (req, res) => {
    res.json({
      message: "Admin dashboard"
    });
  }
);

module.exports = router;
