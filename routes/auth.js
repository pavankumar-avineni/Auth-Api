// 1. Import required things
const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user.js");

// 2. Create router
const router = express.Router();


// ================== REGISTER ==================
router.post("/register", async (req, res) => {

  // 3. Get data from request body
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;

  // 4. Convert password into secret (hash)
  const hashedPassword = await bcrypt.hash(password, 10);

  // 5. Create new user
  const newUser = new User({
    name: name,
    email: email,
    password: hashedPassword
  });

  // 6. Save user to database
  await newUser.save();

  // 7. Send response
  res.json({
    message: "User registered successfully"
  });
});


// ================== LOGIN ==================
router.post("/login", async (req, res) => {

  // 8. Get login data
  const email = req.body.email;
  const password = req.body.password;

  // 9. Find user by email
  const user = await User.findOne({ email: email });

  if (user == null) {
    res.json({ message: "User not found" });
    return;
  }

  // 10. Check password
  const passwordMatched = await bcrypt.compare(password, user.password);

  if (passwordMatched == false) {
    res.json({ message: "Wrong password" });
    return;
  }

  // 11. Create token
  const token = jwt.sign(
    { userId: user._id },
    process.env.JWT_SECRET
  );

  // 12. Send response
  res.json({
    message: "Login successful",
    token: token
  });
});


// 13. Export router
module.exports = router;
