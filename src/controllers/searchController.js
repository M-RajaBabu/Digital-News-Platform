const { Op } = require('sequelize');
const { Article, Category, Author } = require('../models');

exports.search = async (req, res) => {
  try {
    const { q, type = 'all', limit = 20, offset = 0 } = req.query;
    
    if (!q || q.trim().length === 0) {
      return res.status(400).json({
        error: 'Search query required',
        message: 'Please provide a search query',
        status: 400
      });
    }

    const searchQuery = q.trim();
    let results = {};

    if (type === 'all' || type === 'articles') {
      const articles = await Article.findAll({
        where: {
          [Op.or]: [
            { title: { [Op.like]: `%${searchQuery}%` } },
            { content: { [Op.like]: `%${searchQuery}%` } },
            { summary: { [Op.like]: `%${searchQuery}%` } }
          ]
        },
        limit: parseInt(limit),
        offset: parseInt(offset),
        include: [
          { model: Category, as: 'category' },
          { model: Author, as: 'authors' }
        ]
      });
      results.articles = articles;
    }

    if (type === 'all' || type === 'categories') {
      const categories = await Category.findAll({
        where: {
          [Op.or]: [
            { name: { [Op.like]: `%${searchQuery}%` } },
            { description: { [Op.like]: `%${searchQuery}%` } }
          ]
        },
        limit: parseInt(limit),
        offset: parseInt(offset)
      });
      results.categories = categories;
    }

    if (type === 'all' || type === 'authors') {
      const authors = await Author.findAll({
        where: {
          [Op.or]: [
            { pen_name: { [Op.like]: `%${searchQuery}%` } },
            { bio: { [Op.like]: `%${searchQuery}%` } },
            { specialization: { [Op.like]: `%${searchQuery}%` } }
          ]
        },
        limit: parseInt(limit),
        offset: parseInt(offset)
      });
      results.authors = authors;
    }

    res.json({
      success: true,
      query: searchQuery,
      type,
      results,
      total: Object.keys(results).reduce((sum, key) => sum + results[key].length, 0)
    });
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({
      error: 'Search failed',
      message: error.message,
      status: 500
    });
  }
}; 