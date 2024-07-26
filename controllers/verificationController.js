const User = require("../models/User"); // Upewnij się, że ścieżka jest poprawna
const { v4: uuidv4 } = require("uuid");
const { sendVerificationEmail } = require("../services/emailService"); // Poprawiony import

// Funkcje kontrolera
const signup = async (req, res) => {
  const { email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already in use" });
    }

    const verificationToken = uuidv4();
    const newUser = new User({ email, password, verificationToken });
    await newUser.save();

    await sendVerificationEmail(email, verificationToken);

    res
      .status(201)
      .json({
        message: "User registered successfully. Please verify your email.",
      });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const login = async (req, res) => {
  // Implementacja funkcji login
};

const verifyEmail = async (req, res) => {
  const { token } = req.params;

  try {
    const user = await User.findOne({ verificationToken: token });
    if (!user) {
      return res.status(400).json({ message: "Invalid verification token" });
    }
    user.verify = true;
    delete user.verificationToken;
    await user.save();

    res.status(200).json({ message: "Email verified successfully" });
  } catch (err) {
    console.error("Verify email error:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const getCurrent = (req, res) => {
  try {
    const { email, subscription } = req.user;
    res.status(200).json({
      email,
      subscription,
    });
  } catch (err) {
    console.error("Get current user error:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = {
  signup,
  login,
  verifyEmail,
  getCurrent,
};
