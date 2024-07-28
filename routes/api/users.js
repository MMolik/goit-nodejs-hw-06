const express = require('express');
const router = express.Router();
const verificationController = require('../../controllers/verificationController'); // Poprawne ścieżki

// Trasy do obsługi rejestracji, logowania i weryfikacji e-maila
router.post('/signup', verificationController.signup);
router.post('/login', verificationController.login);
router.post('/resend-verification-email', verificationController.resendVerificationEmail); // Dodaj tę linię
router.get('/verify/:token', verificationController.verifyEmail); // Ta linia jest kluczowa
router.get('/current', verificationController.getCurrent);

module.exports = router;
