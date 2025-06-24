// Games and Crossword API controller

// Mock crossword data
const mockCrosswords = [
  {
    id: 'cw-001',
    title: 'Daily Crossword - March 20, 2024',
    difficulty: 'medium',
    size: '15x15',
    clues: {
      across: [
        { number: 1, clue: 'Capital of France', answer: 'PARIS', start: [0, 0] },
        { number: 5, clue: 'Large body of water', answer: 'OCEAN', start: [0, 2] }
      ],
      down: [
        { number: 1, clue: 'Planet we live on', answer: 'EARTH', start: [0, 0] },
        { number: 2, clue: 'Opposite of yes', answer: 'NO', start: [0, 1] }
      ]
    },
    publishedAt: '2024-03-20T00:00:00Z',
    isActive: true
  }
];

// Mock games data
const mockGames = [
  {
    id: 'game-001',
    title: 'Word Search',
    type: 'word_search',
    difficulty: 'easy',
    description: 'Find hidden words in the grid',
    isActive: true
  },
  {
    id: 'game-002',
    title: 'Sudoku',
    type: 'sudoku',
    difficulty: 'medium',
    description: 'Fill the grid with numbers 1-9',
    isActive: true
  }
];

// Get available games
exports.getGames = async (req, res) => {
  try {
    const { type, difficulty } = req.query;
    
    let games = mockGames;
    
    if (type) {
      games = games.filter(game => game.type === type);
    }
    
    if (difficulty) {
      games = games.filter(game => game.difficulty === difficulty);
    }

    res.json({
      success: true,
      games: games.map(game => ({
        id: game.id,
        title: game.title,
        type: game.type,
        difficulty: game.difficulty,
        description: game.description
      }))
    });
  } catch (error) {
    console.error('Get games error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to fetch games',
      status: 500
    });
  }
};

// Get specific game
exports.getGame = async (req, res) => {
  try {
    const { id } = req.params;
    
    const game = mockGames.find(g => g.id === id);
    
    if (!game) {
      return res.status(404).json({
        error: 'Not found',
        message: 'Game not found',
        status: 404
      });
    }

    res.json({
      success: true,
      game: {
        id: game.id,
        title: game.title,
        type: game.type,
        difficulty: game.difficulty,
        description: game.description,
        instructions: getGameInstructions(game.type)
      }
    });
  } catch (error) {
    console.error('Get game error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to fetch game',
      status: 500
    });
  }
};

// Get crossword puzzles
exports.getCrosswords = async (req, res) => {
  try {
    const { date, difficulty } = req.query;
    
    let crosswords = mockCrosswords;
    
    if (date) {
      crosswords = crosswords.filter(cw => 
        cw.publishedAt.startsWith(date)
      );
    }
    
    if (difficulty) {
      crosswords = crosswords.filter(cw => cw.difficulty === difficulty);
    }

    res.json({
      success: true,
      crosswords: crosswords.map(cw => ({
        id: cw.id,
        title: cw.title,
        difficulty: cw.difficulty,
        size: cw.size,
        publishedAt: cw.publishedAt
      }))
    });
  } catch (error) {
    console.error('Get crosswords error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to fetch crosswords',
      status: 500
    });
  }
};

// Get specific crossword
exports.getCrossword = async (req, res) => {
  try {
    const { id } = req.params;
    
    const crossword = mockCrosswords.find(cw => cw.id === id);
    
    if (!crossword) {
      return res.status(404).json({
        error: 'Not found',
        message: 'Crossword not found',
        status: 404
      });
    }

    res.json({
      success: true,
      crossword: {
        id: crossword.id,
        title: crossword.title,
        difficulty: crossword.difficulty,
        size: crossword.size,
        clues: crossword.clues,
        publishedAt: crossword.publishedAt
      }
    });
  } catch (error) {
    console.error('Get crossword error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to fetch crossword',
      status: 500
    });
  }
};

// Submit crossword solution
exports.submitCrosswordSolution = async (req, res) => {
  try {
    const { id } = req.params;
    const { solution } = req.body;
    const userId = req.user?.id;
    
    const crossword = mockCrosswords.find(cw => cw.id === id);
    
    if (!crossword) {
      return res.status(404).json({
        error: 'Not found',
        message: 'Crossword not found',
        status: 404
      });
    }

    // Validate solution (simplified)
    const isCorrect = validateCrosswordSolution(crossword, solution);
    
    // In a real implementation, save the user's solution
    if (userId && isCorrect) {
      // Save to user's game history
    }

    res.json({
      success: true,
      isCorrect,
      score: isCorrect ? 100 : 0,
      message: isCorrect ? 'Congratulations! Solution is correct!' : 'Try again!'
    });
  } catch (error) {
    console.error('Submit crossword solution error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to submit solution',
      status: 500
    });
  }
};

// Helper functions
function getGameInstructions(type) {
  const instructions = {
    word_search: 'Find all the hidden words in the grid. Words can be horizontal, vertical, or diagonal.',
    sudoku: 'Fill the 9x9 grid with numbers 1-9 so that each row, column, and 3x3 box contains each number exactly once.'
  };
  
  return instructions[type] || 'Follow the game rules to complete the puzzle.';
}

function validateCrosswordSolution(crossword, solution) {
  // Simplified validation - in reality, this would be more complex
  return solution && typeof solution === 'object';
} 