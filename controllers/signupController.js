const signup = async (req, res) => {
  const { email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already in use" });
    }

    const verificationToken = uuidv4();
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ email, password: hashedPassword, verificationToken });
    await newUser.save();

    // Generujemy link weryfikacyjny bez pełnego URL
    const verificationLink = `${process.env.BASE_URL}/api/users/verify/${verificationToken}`;
    await sendVerificationEmail(email, verificationLink);

    res.status(201).json({
      message: "User registered successfully. Please verify your email.",
    });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
