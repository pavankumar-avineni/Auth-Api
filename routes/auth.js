// 1. Import required things
const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User.js");
const limiter = require("../middleware/rateLimiter");
const { body, validationResult } = require("express-validator");


// 2. Create router
const router = express.Router();


// ================== REGISTER ==================
router.post(
  "/register",
  limiter, // rate limiter (recommended)
  [
    body("name").notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("Valid email required"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters")
  ],
  async (req, res) => {

    // ✅ CHECK VALIDATION RESULT
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Get data
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const newUser = new User({
      name: name,
      email: email,
      password: hashedPassword,
      role: req.body.role || "user"
    });

    // Save user
    await newUser.save();

    // Response
    res.json({
      message: "User registered successfully"
    });
  }
);



// ================== LOGIN ==================
router.post(
  "/login",
  limiter,
  [
    body("email").isEmail().withMessage("Valid email required"),
    body("password").notEmpty().withMessage("Password is required")
  ],
  async (req, res) => {

    // ✅ CHECK VALIDATION RESULT
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const email = req.body.email;
    const password = req.body.password;

    const user = await User.findOne({ email: email });
    if (user == null) {
      return res.json({ message: "User not found" });
    }

    const passwordMatched = await bcrypt.compare(password, user.password);
    if (!passwordMatched) {
      return res.json({ message: "Wrong password" });
    }

    const token = jwt.sign(
      {
        userId: user._id,
        role: user.role
      },
      process.env.JWT_SECRET
    );

    res.json({
      message: "Login successful",
      token: token
    });
  }
);



// 13. Export router
module.exports = router;
