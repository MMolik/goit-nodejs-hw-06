const express = require('express');
const mongoose = require('mongoose');
const usersRouter = require('./routes/api/users'); // Upewnij się, że ścieżka jest poprawna
const dotenv = require('dotenv');

dotenv.config(); // Wczytaj zmienne środowiskowe z .env

const app = express();

// Middleware
app.use(express.json()); // Użyj JSON parsera dla ciał zapytań

// Routes
app.use('/api/users', usersRouter); // Użyj routera dla tras użytkowników

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(500).json({ message: 'Something broke!' });
});

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

module.exports = app;
