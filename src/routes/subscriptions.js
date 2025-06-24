const express = require('express');
const router = express.Router();
const subscriptionController = require('../controllers/subscriptionController');
const { authenticateToken } = require('../middleware/auth');

router.get('/plans', subscriptionController.getPlans);
router.post('/subscribe', authenticateToken, subscriptionController.subscribe);
router.get('/status', authenticateToken, subscriptionController.status);

module.exports = router; 