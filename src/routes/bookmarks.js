const express = require('express');
const router = express.Router();
const bookmarkController = require('../controllers/bookmarkController');
const { authenticateToken } = require('../middleware/auth');

router.post('/', authenticateToken, bookmarkController.add);
router.delete('/:id', authenticateToken, bookmarkController.remove);
router.get('/', authenticateToken, bookmarkController.get);

module.exports = router; 