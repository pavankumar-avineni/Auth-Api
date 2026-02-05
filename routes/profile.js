const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");
const upload = require("../middleware/upload");
const cloudinary = require("../config/cloudinary");
const User = require("../models/User");


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
  upload.single("profileImage"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      // Upload to Cloudinary
      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "profile-images" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        stream.end(req.file.buffer);
      });

      // Save image data in MongoDB
      const user = await User.findByIdAndUpdate(
        req.userId,
        {
          profileImage: result.secure_url,
          profileImageId: result.public_id
        },
        { new: true }
      );

      res.json({
        message: "Profile image uploaded successfully",
        profileImage: user.profileImage
      });

    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);


module.exports = router;