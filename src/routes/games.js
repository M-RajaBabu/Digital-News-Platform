const express = require('express');
const router = express.Router();
const gamesController = require('../controllers/gamesController');
const { authenticateToken } = require('../middleware/auth');

// Get available games
router.get('/', gamesController.getGames);

// Get specific game
router.get('/:id', gamesController.getGame);

// Get crossword puzzles
router.get('/crosswords', gamesController.getCrosswords);

// Get specific crossword
router.get('/crosswords/:id', gamesController.getCrossword);

// Submit crossword solution (requires authentication)
router.post('/crosswords/:id/solve', authenticateToken, gamesController.submitCrosswordSolution);

module.exports = router; 