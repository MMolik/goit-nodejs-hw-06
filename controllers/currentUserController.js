// controllers/currentUserController.js
exports.getCurrent = (req, res) => {
  try {
    const { email, subscription } = req.user;

    res.status(200).json({
      email,
      subscription,
    });
  } catch (err) {
    console.error('Error fetching current user:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
