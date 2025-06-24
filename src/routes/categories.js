const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');

router.get('/', categoryController.list);
router.get('/:id/articles', categoryController.articlesByCategory);
router.get('/:id', categoryController.getById);

module.exports = router; 