const express = require('express');
const router = express.Router();
const epaperController = require('../controllers/epaperController');
const { authenticateToken } = require('../middleware/auth');

// Get e-paper editions
router.get('/editions', epaperController.getEditions);

// Get specific e-paper edition
router.get('/editions/:date/:city', epaperController.getEdition);

// Download e-paper (requires authentication)
router.post('/editions/:date/:city/download', authenticateToken, epaperController.downloadEdition);

module.exports = router; 