const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');
const { authenticateToken } = require('../middleware/auth');

router.post('/', authenticateToken, commentController.post);
router.post('/:id/vote', authenticateToken, commentController.vote);
router.post('/:id/moderate', authenticateToken, commentController.moderate);
router.get('/', commentController.get);

module.exports = router; 