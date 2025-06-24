const express = require('express');
const router = express.Router();
const newsletterController = require('../controllers/newsletterController');
const { authenticateToken, requireRole } = require('../middleware/auth');

// Subscribe to newsletter
router.post('/subscribe', newsletterController.subscribe);

// Unsubscribe from newsletter
router.post('/unsubscribe', newsletterController.unsubscribe);

// Update newsletter preferences
router.put('/:email/preferences', newsletterController.updatePreferences);

// Get newsletter templates (admin only)
router.get('/templates', authenticateToken, requireRole(['admin']), newsletterController.getTemplates);

// Send newsletter (admin only)
router.post('/send', authenticateToken, requireRole(['admin']), newsletterController.sendNewsletter);

// Get newsletter statistics (admin only)
router.get('/stats', authenticateToken, requireRole(['admin']), newsletterController.getStats);

module.exports = router; 