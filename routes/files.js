const express = require("express");
const upload = require("../middleware/upload");
const auth = require("../middleware/authMiddleware");
const cloudinary = require("../config/cloudinary");
const File = require("../models/file");

const router = express.Router();

/**
 * @swagger
 * /api/files:
 *   get:
 *     summary: List files (paginated)
 *     tags: [Files]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of files
 */
router.post("/files/upload", auth, upload.single("file"), async (req, res) => {
  const result = await new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream((err, result) => {
      if (err) reject(err);
      else resolve(result);
    }).end(req.file.buffer);
  });

  const file = await File.create({
    user: req.userId,
    fileUrl: result.secure_url,
    publicId: result.public_id,
    fileType: req.file.mimetype,
    fileSize: req.file.size
  });

  res.json(file);
});

/**
 * @swagger
 * /api/files:
 *   get:
 *     summary: List files
 */
router.get("/files", auth, async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 5;
  const skip = (page - 1) * limit;

  const files = await File.find({ user: req.userId })
    .skip(skip)
    .limit(limit);

  res.json(files);
});

/**
 * @swagger
 * /api/files/{id}/download:
 *   get:
 *     summary: Download file
 *     tags: [Files]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       302:
 *         description: Redirect to file
 */
router.get("/files/:id/download", auth, async (req, res, next) => {
  try {
    const file = await File.findOne({
      _id: req.params.id,
      user: req.userId
    });

    if (!file) {
      return res.status(404).json({ message: "File not found" });
    }

    res.redirect(file.fileUrl);
  } catch (err) {
    next(err);
  }
});

/**
 * @swagger
 * /api/files/upload:
 *   post:
 *     summary: Upload file
 *     tags: [Files]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: File uploaded successfully
 */
router.post(
  "/files/upload",
  auth,
  upload.single("file"),
  async (req, res, next) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      const uploadResult = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "uploads" },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          }
        );
        stream.end(req.file.buffer);
      });

      const file = await File.create({
        user: req.userId,
        fileUrl: uploadResult.secure_url,
        publicId: uploadResult.public_id,
        fileType: req.file.mimetype,
        fileSize: req.file.size
      });

      res.json(file);

    } catch (error) {
      next(error); // ✅ VERY IMPORTANT
    }
  }
);


module.exports = router;
