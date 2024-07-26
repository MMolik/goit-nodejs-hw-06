const express = require('express');
const router = express.Router();
const verificationController = require('../../controllers/verificationController'); // Poprawne ścieżki

router.post('/signup', verificationController.signup);
router.post('/login', verificationController.login);
router.get('/verify/:token', verificationController.verifyEmail);
router.get('/current', verificationController.getCurrent);

module.exports = router;
