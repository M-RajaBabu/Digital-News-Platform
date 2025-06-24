const express = require('express');
const router = express.Router();
const newsController = require('../controllers/newsController');
const { authenticateOptional } = require('../middleware/auth');

router.get('/feed', authenticateOptional, newsController.feed);
router.get('/trending', newsController.trending);
router.get('/breaking', newsController.breaking);

module.exports = router; 