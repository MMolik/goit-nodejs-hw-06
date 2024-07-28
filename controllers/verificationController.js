const User = require("../models/User");
const { v4: uuidv4 } = require("uuid");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Joi = require('joi');
const { sendVerificationEmail } = require("../services/emailService");

// Walidacja danych wejściowych przy logowaniu
const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

// Funkcje kontrolera

const signup = async (req, res) => {
  const { email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already in use" });
    }

    const verificationToken = uuidv4();
    const hashedPassword = await bcrypt.hash(password, 10); // Hashowanie hasła
    const newUser = new User({ email, password: hashedPassword, verificationToken });
    await newUser.save();

    await sendVerificationEmail(email, verificationToken); // Wywołanie funkcji

    res.status(201).json({
      message: "User registered successfully. Please verify your email.",
    });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Sprawdzenie poprawności danych wejściowych
    const { error } = loginSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    // Znalezienie użytkownika w bazie danych
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Email or password is wrong' });
    }

    // Sprawdzenie, czy email został zweryfikowany
    if (!user.verify) {
      return res.status(401).json({ message: 'Email not verified' });
    }

    // Porównanie hasła
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Email or password is wrong' });
    }

    // Utworzenie tokena JWT
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Odpowiedź sukcesu
    res.status(200).json({
      token,
      user: {
        email: user.email,
        subscription: user.subscription,
      },
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
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

// Nowa funkcja do ponownego wysyłania e-maila
const resendVerificationEmail = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.verify) {
      return res.status(400).json({ message: "Email already verified" });
    }

    const verificationToken = uuidv4();
    user.verificationToken = verificationToken;
    await user.save();

    await sendVerificationEmail(email, verificationToken);

    res.status(200).json({ message: "Verification email resent successfully" });
  } catch (err) {
    console.error("Resend verification email error:", err);
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
  login, // Upewnij się, że ta linia jest dodana
  verifyEmail,
  resendVerificationEmail,
  getCurrent,
};
