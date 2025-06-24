const FeedAlgorithm = require('../utils/feedAlgorithm');
const TrendingCalculator = require('../utils/trendingCalculator');

exports.feed = async (req, res) => {
  try {
    const userId = req.user ? req.user.id : null;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    let result;
    if (userId) {
      result = await FeedAlgorithm.getPersonalizedFeed(userId, page, limit);
    } else {
      result = await FeedAlgorithm.getDefaultFeed(page, limit);
    }
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch news feed', details: error.message });
  }
};

exports.trending = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const timeWindow = req.query.timeWindow || '24h';
    const articles = await TrendingCalculator.getTrendingArticles(limit, timeWindow);
    res.json({ articles });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch trending news', details: error.message });
  }
};

exports.breaking = async (req, res) => {
  // Breaking news logic placeholder
  res.json({ message: 'Breaking news (to be implemented)' });
}; 