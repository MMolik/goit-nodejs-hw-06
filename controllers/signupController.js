const Joi = require('joi'); // Dodaj ten import

const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const { sendVerificationEmail } = require('../services/emailService'); // Import serwisu emailowego

// Walidacja danych wejściowych przy rejestracji
const signupSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

exports.signup = async (req, res) => {
  try {
    // Sprawdzenie poprawności danych wejściowych
    const { error } = signupSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    // Sprawdzenie, czy użytkownik już istnieje
    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) {
      return res.status(409).json({ message: 'Email already in use' });
    }

    // Utworzenie nowego użytkownika
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const verificationToken = uuidv4();
    
    const user = new User({
      email: req.body.email,
      password: hashedPassword,
      verificationToken,
    });

    await user.save();

    // Wysłanie emaila z odnośnikiem do weryfikacji
    await sendVerificationEmail(user.email, verificationToken);

    res.status(201).json({
      status: 'success',
      code: 201,
      message: 'User registered successfully, please check your email for verification',
    });
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
