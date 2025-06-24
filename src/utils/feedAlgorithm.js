const { Article, Category, ReadingHistory, User } = require('../models');
const { Op } = require('sequelize');

class FeedAlgorithm {
  // Get personalized feed for user
  static async getPersonalizedFeed(userId, page = 1, limit = 10) {
    try {
      const user = await User.findByPk(userId);
      if (!user) {
        return await this.getDefaultFeed(page, limit);
      }

      const preferences = user.preferences || {};
      const userCategories = preferences.categories || [];
      const userAuthors = preferences.authors || [];

      // Get user's reading history to understand preferences
      const readingHistory = await ReadingHistory.findAll({
        where: { userId },
        include: [{ model: Article, as: 'article' }],
        order: [['readAt', 'DESC']],
        limit: 50
      });

      // Calculate user's category preferences based on reading history
      const categoryWeights = this.calculateCategoryWeights(readingHistory);
      
      // Build query with multiple factors
      const whereClause = {
        status: 'published',
        publishedAt: { [Op.lte]: new Date() }
      };

      // Add category filter if user has preferences
      if (userCategories.length > 0) {
        whereClause.categoryId = { [Op.in]: userCategories };
      }

      const articles = await Article.findAll({
        where: whereClause,
        include: [
          {
            model: Category,
            as: 'category'
          },
          {
            model: User,
            as: 'authors',
            through: { attributes: [] }
          }
        ],
        order: [
          ['isBreaking', 'DESC'],
          ['isFeatured', 'DESC'],
          ['publishedAt', 'DESC']
        ],
        limit,
        offset: (page - 1) * limit
      });

      // Apply personalization scoring
      const personalizedArticles = articles.map(article => {
        const score = this.calculateArticleScore(article, user, categoryWeights, readingHistory);
        return { ...article.toJSON(), personalizationScore: score };
      });

      // Sort by personalization score
      personalizedArticles.sort((a, b) => b.personalizationScore - a.personalizationScore);

      return {
        articles: personalizedArticles,
        page,
        limit,
        total: await Article.count({ where: whereClause })
      };
    } catch (error) {
      console.error('Feed algorithm error:', error);
      return await this.getDefaultFeed(page, limit);
    }
  }

  // Calculate category weights based on reading history
  static calculateCategoryWeights(readingHistory) {
    const weights = {};
    
    readingHistory.forEach(record => {
      if (record.article && record.article.categoryId) {
        const categoryId = record.article.categoryId;
        weights[categoryId] = (weights[categoryId] || 0) + 1;
      }
    });

    return weights;
  }

  // Calculate article personalization score
  static calculateArticleScore(article, user, categoryWeights, readingHistory) {
    let score = 0;

    // Base score from article metrics
    score += article.viewCount * 0.1;
    score += article.likeCount * 0.2;
    score += article.commentCount * 0.15;

    // Category preference bonus
    if (categoryWeights[article.categoryId]) {
      score += categoryWeights[article.categoryId] * 0.3;
    }

    // User preference bonus
    const preferences = user.preferences || {};
    if (preferences.categories && preferences.categories.includes(article.categoryId)) {
      score += 0.5;
    }

    // Recency bonus
    const hoursSincePublished = (new Date() - new Date(article.publishedAt)) / (1000 * 60 * 60);
    if (hoursSincePublished < 24) {
      score += 0.3;
    } else if (hoursSincePublished < 168) { // 1 week
      score += 0.1;
    }

    // Breaking news bonus
    if (article.isBreaking) {
      score += 0.4;
    }

    // Featured article bonus
    if (article.isFeatured) {
      score += 0.2;
    }

    return score;
  }

  // Get default feed (for non-authenticated users)
  static async getDefaultFeed(page = 1, limit = 10) {
    const articles = await Article.findAll({
      where: {
        status: 'published',
        publishedAt: { [Op.lte]: new Date() }
      },
      include: [
        {
          model: Category,
          as: 'category'
        }
      ],
      order: [
        ['isBreaking', 'DESC'],
        ['isFeatured', 'DESC'],
        ['publishedAt', 'DESC']
      ],
      limit,
      offset: (page - 1) * limit
    });

    return {
      articles,
      page,
      limit,
      total: await Article.count({
        where: {
          status: 'published',
          publishedAt: { [Op.lte]: new Date() }
        }
      })
    };
  }
}

module.exports = FeedAlgorithm; 