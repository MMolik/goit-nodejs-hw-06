const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  subscription: {
    type: String,
    enum: ["starter", "pro", "business"],
    default: "starter",
  },
  verify: { type: Boolean, default: false },
  verificationToken: { type: String, default: "" },
});

module.exports = mongoose.model("User", userSchema);
