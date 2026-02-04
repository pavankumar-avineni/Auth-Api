const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");

const User = require("../models/User");
const limiter = require("../middleware/rateLimiter");

const router = express.Router();

// ================= REGISTER =================
/**
 * @swagger
 * /api/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 example: Pavan
 *               email:
 *                 type: string
 *                 example: pavan@test.com
 *               password:
 *                 type: string
 *                 example: 123456
 *               role:
 *                 type: string
 *                 example: user
 *     responses:
 *       200:
 *         description: User registered successfully
 *       400:
 *         description: Validation error
 */

router.post(
  "/register",
  limiter,
  [
    body("name").notEmpty(),
    body("email").isEmail(),
    body("password").isLength({ min: 6 })
  ],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const hashedPassword = await bcrypt.hash(req.body.password, 10);

      const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword,
        role: req.body.role || "user"
      });

      await user.save();
      res.json({ message: "User registered successfully" });

    } catch (error) {
      next(error);
    }
  }
);

// ================= LOGIN =================
/**
 * @swagger
 * /api/login:
 *   post:
 *     summary: Login user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@test.com
 *               password:
 *                 type: string
 *                 example: 123456
 *     responses:
 *       200:
 *         description: Login successful
 */
router.post(
  "/login",
  limiter,
  [
    body("email").isEmail(),
    body("password").notEmpty()
  ],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const user = await User.findOne({ email: req.body.email });
      if (!user) throw new Error("User not found");

      const match = await bcrypt.compare(req.body.password, user.password);
      if (!match) throw new Error("Wrong password");

      const token = jwt.sign(
        { userId: user._id, role: user.role },
        process.env.JWT_SECRET
      );

      res.json({ message: "Login successful", token });

    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
