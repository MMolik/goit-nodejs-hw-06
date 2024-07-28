const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const { error } = loginSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Email or password is wrong' });
    }

    if (!user.verify) {
      return res.status(401).json({ message: 'Email not verified' });
    }

    // Porównanie hasła
    const isMatch = await bcrypt.compare(password, user.password);

    // Debugowanie
    console.log('Input password:', password);
    console.log('Stored hashed password:', user.password);
    console.log('Password match:', isMatch);

    if (!isMatch) {
      return res.status(401).json({ message: 'Email or password is wrong' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

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
