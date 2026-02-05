const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  role: {
    type: String,
    default: "user"
  },
  profileImage: {
    type: String   // Cloudinary URL
  },
  profileImageId: {
    type: String   // Cloudinary public_id
  }
});

module.exports = mongoose.model("User", userSchema);
