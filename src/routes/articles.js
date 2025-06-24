const express = require('express');
const router = express.Router();
const articleController = require('../controllers/articleController');
const { authenticateToken } = require('../middleware/auth');

router.post('/', authenticateToken, articleController.create);
router.get('/', articleController.getAll);
router.get('/:id', articleController.getById);
router.put('/:id', authenticateToken, articleController.update);
router.delete('/:id', authenticateToken, articleController.remove);
router.post('/:id/view', articleController.trackView);
router.get('/:id/comments', articleController.getComments);

module.exports = router; 