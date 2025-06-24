const express = require('express');
const router = express.Router();
const { validate, schemas } = require('../middleware/validation');
const authController = require('../controllers/authController');

// Register
router.post('/register', validate(schemas.register), authController.register);
// Login
router.post('/login', validate(schemas.login), authController.login);
// Social login (Google)
router.post('/social-login', authController.socialLogin);

module.exports = router; 