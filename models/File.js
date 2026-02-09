const mongoose = require("mongoose");

const fileSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    fileUrl: String,
    publicId: String,
    fileType: String,
    fileSize: Number
  },
  { timestamps: true }
);

module.exports = mongoose.model("File", fileSchema);
