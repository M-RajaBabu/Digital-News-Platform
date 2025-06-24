const { Article, ReadingHistory, Comment } = require('../models');
const { Op } = require('sequelize');
const moment = require('moment');

class TrendingCalculator {
  // Calculate trending score for articles
  static async calculateTrendingScore(articleId) {
    try {
      const article = await Article.findByPk(articleId);
      if (!article) return 0;

      const now = moment();
      const publishedAt = moment(article.publishedAt);
      const hoursSincePublished = now.diff(publishedAt, 'hours');

      // Get recent engagement (last 24 hours)
      const recentViews = await ReadingHistory.count({
        where: {
          articleId,
          readAt: {
            [Op.gte]: moment().subtract(24, 'hours').toDate()
          }
        }
      });

      const recentComments = await Comment.count({
        where: {
          articleId,
          createdAt: {
            [Op.gte]: moment().subtract(24, 'hours').toDate()
          },
          status: 'approved'
        }
      });

      // Calculate trending score using Reddit's hot algorithm
      const score = this.hotAlgorithm(
        article.viewCount + recentViews,
        article.commentCount + recentComments,
        hoursSincePublished
      );

      return score;
    } catch (error) {
      console.error('Trending calculation error:', error);
      return 0;
    }
  }

  // Reddit's hot algorithm for trending calculation
  static hotAlgorithm(score, comments, hours) {
    const order = Math.log10(Math.max(Math.abs(score), 1));
    const sign = score > 0 ? 1 : score < 0 ? -1 : 0;
    const seconds = hours * 3600;
    return Math.round(sign * order + seconds / 45000);
  }

  // Get trending articles
  static async getTrendingArticles(limit = 10, timeWindow = '24h') {
    try {
      const timeAgo = moment().subtract(
        timeWindow === '24h' ? 24 : 
        timeWindow === '7d' ? 168 : 
        timeWindow === '30d' ? 720 : 24, 
        'hours'
      );

      // Get articles with recent activity
      const articles = await Article.findAll({
        where: {
          status: 'published',
          publishedAt: {
            [Op.gte]: timeAgo.toDate()
          }
        },
        include: [
          {
            model: ReadingHistory,
            as: 'readingHistory',
            where: {
              readAt: {
                [Op.gte]: timeAgo.toDate()
              }
            },
            required: false
          },
          {
            model: Comment,
            as: 'comments',
            where: {
              createdAt: {
                [Op.gte]: timeAgo.toDate()
              },
              status: 'approved'
            },
            required: false
          }
        ],
        order: [
          ['viewCount', 'DESC'],
          ['commentCount', 'DESC'],
          ['publishedAt', 'DESC']
        ],
        limit: limit * 2 // Get more to filter
      });

      // Calculate trending scores
      const articlesWithScores = await Promise.all(
        articles.map(async (article) => {
          const trendingScore = await this.calculateTrendingScore(article.id);
          return {
            ...article.toJSON(),
            trendingScore
          };
        })
      );

      // Sort by trending score and return top results
      articlesWithScores.sort((a, b) => b.trendingScore - a.trendingScore);
      
      return articlesWithScores.slice(0, limit);
    } catch (error) {
      console.error('Get trending articles error:', error);
      return [];
    }
  }

  // Update trending status for articles
  static async updateTrendingStatus() {
    try {
      const trendingArticles = await this.getTrendingArticles(20);
      const trendingIds = trendingArticles.map(article => article.id);

      // Reset all trending flags
      await Article.update(
        { isTrending: false },
        { where: { isTrending: true } }
      );

      // Set trending flag for top articles
      if (trendingIds.length > 0) {
        await Article.update(
          { isTrending: true },
          { where: { id: trendingIds } }
        );
      }

      console.log(`Updated trending status for ${trendingIds.length} articles`);
    } catch (error) {
      console.error('Update trending status error:', error);
    }
  }
}

module.exports = TrendingCalculator; 