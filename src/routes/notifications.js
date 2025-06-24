const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const { authenticateToken } = require('../middleware/auth');

router.get('/', authenticateToken, notificationController.getNotifications);
router.put('/settings', authenticateToken, notificationController.manageSettings);
router.post('/register-device', authenticateToken, notificationController.registerDevice);

module.exports = router; 