const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");
const upload = require("../middleware/upload");

const router = express.Router();

// USER
/**
 * @swagger
 * /api/profile:
 *   get:
 *     summary: Get logged-in user profile
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile data
 *       401:
 *         description: Unauthorized (token missing or invalid)
 *       403:
 *         description: Access denied
 */

router.get("/profile", authMiddleware, roleMiddleware("user"), (req, res) => {
  res.json({
    message: "User profile",
    userId: req.userId
  });
});

// ADMIN
/**
 * @swagger
 * /api/admin:
 *   get:
 *     summary: Get admin dashboard
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Admin dashboard data
 *       401:
 *         description: Unauthorized (token missing or invalid)
 *       403:
 *         description: Access denied (not admin)
 */

router.get("/admin", authMiddleware, roleMiddleware("admin"), (req, res) => {
  res.json({
    message: "Admin dashboard"
  });
});

// Upload profile picture with error handling
router.post(
  "/profile/upload",
  authMiddleware,
  (req, res, next) => {
    upload.single("profileImage")(req, res, function (err) {
      if (err) {
        return res.status(400).json({
          message: err.message
        });
      }

      if (!req.file) {
        return res.status(400).json({
          message: "No file uploaded"
        });
      }

      res.json({
        message: "Profile image uploaded successfully",
        file: req.file
      });
    });
  }
)


module.exports = router;