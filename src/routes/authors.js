const express = require('express');
const router = express.Router();
const authorController = require('../controllers/authorController');
const { authenticateToken } = require('../middleware/auth');

router.get('/', authorController.list);
router.get('/:id/articles', authorController.getArticles);
router.get('/:id', authorController.getProfile);
router.post('/:id/follow', authenticateToken, authorController.follow);

module.exports = router; 