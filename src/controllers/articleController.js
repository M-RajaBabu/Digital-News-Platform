const { Article, Category, Author, ArticleAuthor } = require('../models');

exports.create = async (req, res) => {
  res.json({ message: 'Create article (to be implemented)' });
};

exports.getAll = async (req, res) => {
  try {
    const articles = await Article.findAll({
      include: [
        {
          model: Category,
          as: 'category',
          attributes: ['id', 'name', 'slug', 'color', 'icon']
        },
        {
          model: Author,
          as: 'authors',
          through: { attributes: [] },
          attributes: ['id', 'penName', 'bio', 'specialization', 'experience']
        }
      ],
      order: [['publishedAt', 'DESC']]
    });
    res.json({ success: true, data: articles });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getById = async (req, res) => {
  res.json({ message: 'Get article by ID (to be implemented)' });
};
exports.update = async (req, res) => {
  res.json({ message: 'Update article (to be implemented)' });
};
exports.remove = async (req, res) => {
  res.json({ message: 'Delete article (to be implemented)' });
};
exports.trackView = async (req, res) => {
  res.json({ message: 'Track article view (to be implemented)' });
};
exports.getComments = async (req, res) => {
  res.json({ message: 'Get article comments (to be implemented)' });
}; 