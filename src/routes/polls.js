const express = require('express');
const router = express.Router();
const pollController = require('../controllers/pollController');
const { authenticateToken } = require('../middleware/auth');

router.get('/active', pollController.getActive);
router.post('/:id/vote', authenticateToken, pollController.vote);
router.get('/:id', pollController.getById);

module.exports = router; 