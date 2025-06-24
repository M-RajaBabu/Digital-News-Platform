const Joi = require('joi');

const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    
    if (error) {
      const errorMessage = error.details.map(detail => detail.message).join(', ');
      return res.status(400).json({
        error: 'Validation error',
        message: errorMessage,
        status: 400
      });
    }
    
    next();
  };
};

const validateQuery = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.query);
    
    if (error) {
      const errorMessage = error.details.map(detail => detail.message).join(', ');
      return res.status(400).json({
        error: 'Query validation error',
        message: errorMessage,
        status: 400
      });
    }
    
    next();
  };
};

const validateParams = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.params);
    
    if (error) {
      const errorMessage = error.details.map(detail => detail.message).join(', ');
      return res.status(400).json({
        error: 'Parameter validation error',
        message: errorMessage,
        status: 400
      });
    }
    
    next();
  };
};

// Common validation schemas
const schemas = {
  // User registration
  register: Joi.object({
    email: Joi.string().email().required(),
    username: Joi.string().alphanum().min(3).max(30).required(),
    password: Joi.string().min(6).required(),
    firstName: Joi.string().min(2).max(50).required(),
    lastName: Joi.string().min(2).max(50).required(),
    dateOfBirth: Joi.date().optional(),
    phone: Joi.string().optional(),
    location: Joi.string().optional()
  }),

  // User login
  login: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
  }),

  // Article creation
  createArticle: Joi.object({
    title: Joi.string().min(10).max(200).required(),
    summary: Joi.string().max(500).optional(),
    content: Joi.string().min(100).required(),
    categoryId: Joi.string().uuid().required(),
    tags: Joi.array().items(Joi.string()).optional(),
    isPremium: Joi.boolean().optional(),
    isBreaking: Joi.boolean().optional(),
    featuredImage: Joi.string().uri().optional(),
    images: Joi.array().items(Joi.string().uri()).optional(),
    videos: Joi.array().items(Joi.string().uri()).optional(),
    language: Joi.string().length(2).optional(),
    location: Joi.string().optional(),
    source: Joi.string().optional(),
    sourceUrl: Joi.string().uri().optional()
  }),

  // Article update
  updateArticle: Joi.object({
    title: Joi.string().min(10).max(200).optional(),
    summary: Joi.string().max(500).optional(),
    content: Joi.string().min(100).optional(),
    categoryId: Joi.string().uuid().optional(),
    tags: Joi.array().items(Joi.string()).optional(),
    isPremium: Joi.boolean().optional(),
    isBreaking: Joi.boolean().optional(),
    featuredImage: Joi.string().uri().optional(),
    images: Joi.array().items(Joi.string().uri()).optional(),
    videos: Joi.array().items(Joi.string().uri()).optional(),
    language: Joi.string().length(2).optional(),
    location: Joi.string().optional(),
    source: Joi.string().optional(),
    sourceUrl: Joi.string().uri().optional()
  }),

  // Comment creation
  createComment: Joi.object({
    content: Joi.string().min(1).max(1000).required(),
    parentId: Joi.string().uuid().optional()
  }),

  // Bookmark creation
  createBookmark: Joi.object({
    collectionId: Joi.string().uuid().optional(),
    notes: Joi.string().max(500).optional(),
    tags: Joi.array().items(Joi.string()).optional(),
    isPublic: Joi.boolean().optional()
  }),

  // Bookmark collection creation
  createBookmarkCollection: Joi.object({
    name: Joi.string().min(1).max(100).required(),
    description: Joi.string().max(500).optional(),
    color: Joi.string().pattern(/^#[0-9A-F]{6}$/i).optional(),
    icon: Joi.string().optional(),
    isPublic: Joi.boolean().optional()
  }),

  // Poll creation
  createPoll: Joi.object({
    question: Joi.string().min(5).max(200).required(),
    description: Joi.string().max(500).optional(),
    options: Joi.array().items(Joi.string().min(1).max(100)).min(2).max(10).required(),
    categoryId: Joi.string().uuid().optional(),
    isPublic: Joi.boolean().optional(),
    allowMultipleVotes: Joi.boolean().optional(),
    requireLogin: Joi.boolean().optional(),
    endDate: Joi.date().greater('now').optional(),
    showResults: Joi.boolean().optional(),
    showResultsAfterVote: Joi.boolean().optional()
  }),

  // Poll vote
  pollVote: Joi.object({
    optionIndex: Joi.number().integer().min(0).required()
  }),

  // Breaking news creation
  createBreakingNews: Joi.object({
    title: Joi.string().min(5).max(200).required(),
    content: Joi.string().min(10).max(1000).required(),
    articleId: Joi.string().uuid().optional(),
    categoryId: Joi.string().uuid().optional(),
    priority: Joi.string().valid('low', 'medium', 'high', 'critical').optional(),
    location: Joi.string().optional(),
    expiresAt: Joi.date().greater('now').optional(),
    pushNotification: Joi.boolean().optional(),
    pushTitle: Joi.string().max(100).optional(),
    pushBody: Joi.string().max(200).optional()
  }),

  // User preferences update
  updatePreferences: Joi.object({
    categories: Joi.array().items(Joi.string().uuid()).optional(),
    authors: Joi.array().items(Joi.string().uuid()).optional(),
    language: Joi.string().length(2).optional(),
    timezone: Joi.string().optional(),
    emailNotifications: Joi.boolean().optional(),
    pushNotifications: Joi.boolean().optional(),
    newsletter: Joi.boolean().optional()
  }),

  // Search query
  searchQuery: Joi.object({
    q: Joi.string().min(1).max(100).required(),
    category: Joi.string().uuid().optional(),
    author: Joi.string().uuid().optional(),
    dateFrom: Joi.date().optional(),
    dateTo: Joi.date().optional(),
    sortBy: Joi.string().valid('relevance', 'date', 'views', 'title').optional(),
    order: Joi.string().valid('asc', 'desc').optional(),
    page: Joi.number().integer().min(1).optional(),
    limit: Joi.number().integer().min(1).max(100).optional()
  }),

  // Pagination
  pagination: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(10),
    sortBy: Joi.string().optional(),
    order: Joi.string().valid('asc', 'desc').default('desc')
  }),

  // UUID parameter
  uuidParam: Joi.object({
    id: Joi.string().uuid().required()
  }),

  // Slug parameter
  slugParam: Joi.object({
    slug: Joi.string().min(1).required()
  })
};

module.exports = {
  validate,
  validateQuery,
  validateParams,
  schemas
}; 