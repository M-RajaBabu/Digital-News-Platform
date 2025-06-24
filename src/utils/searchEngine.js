const { Article, Category, Author, User } = require('../models');
const { Op } = require('sequelize');

class SearchEngine {
  // Search articles with filters
  static async searchArticles(query, filters = {}, page = 1, limit = 10) {
    try {
      const {
        category,
        author,
        dateFrom,
        dateTo,
        sortBy = 'relevance',
        order = 'desc',
        isPremium,
        isBreaking
      } = filters;

      // Build where clause
      const whereClause = {
        status: 'published',
        publishedAt: { [Op.lte]: new Date() }
      };

      // Add search terms
      if (query) {
        whereClause[Op.or] = [
          { title: { [Op.iLike]: `%${query}%` } },
          { content: { [Op.iLike]: `%${query}%` } },
          { summary: { [Op.iLike]: `%${query}%` } },
          { tags: { [Op.overlap]: [query] } }
        ];
      }

      // Add filters
      if (category) {
        whereClause.categoryId = category;
      }

      if (dateFrom) {
        whereClause.publishedAt = {
          ...whereClause.publishedAt,
          [Op.gte]: new Date(dateFrom)
        };
      }

      if (dateTo) {
        whereClause.publishedAt = {
          ...whereClause.publishedAt,
          [Op.lte]: new Date(dateTo)
        };
      }

      if (isPremium !== undefined) {
        whereClause.isPremium = isPremium;
      }

      if (isBreaking !== undefined) {
        whereClause.isBreaking = isBreaking;
      }

      // Build include clause
      const includeClause = [
        {
          model: Category,
          as: 'category'
        },
        {
          model: Author,
          as: 'authors',
          through: { attributes: [] },
          where: author ? { id: author } : undefined,
          required: !!author
        }
      ];

      // Build order clause
      let orderClause = [];
      switch (sortBy) {
        case 'relevance':
          if (query) {
            // Simple relevance scoring based on title match
            orderClause = [
              [{ title: { [Op.iLike]: `%${query}%` } }, 'DESC'],
              ['viewCount', 'DESC'],
              ['publishedAt', 'DESC']
            ];
          } else {
            orderClause = [['publishedAt', 'DESC']];
          }
          break;
        case 'date':
          orderClause = [['publishedAt', order.toUpperCase()]];
          break;
        case 'views':
          orderClause = [['viewCount', order.toUpperCase()]];
          break;
        case 'title':
          orderClause = [['title', order.toUpperCase()]];
          break;
        default:
          orderClause = [['publishedAt', 'DESC']];
      }

      // Execute query
      const articles = await Article.findAndCountAll({
        where: whereClause,
        include: includeClause,
        order: orderClause,
        limit,
        offset: (page - 1) * limit,
        distinct: true
      });

      // Calculate relevance scores for search results
      const articlesWithScores = articles.rows.map(article => {
        const relevanceScore = query ? this.calculateRelevanceScore(article, query) : 0;
        return {
          ...article.toJSON(),
          relevanceScore
        };
      });

      // Sort by relevance if searching
      if (query && sortBy === 'relevance') {
        articlesWithScores.sort((a, b) => b.relevanceScore - a.relevanceScore);
      }

      return {
        articles: articlesWithScores,
        total: articles.count,
        page,
        limit,
        totalPages: Math.ceil(articles.count / limit)
      };
    } catch (error) {
      console.error('Search error:', error);
      return {
        articles: [],
        total: 0,
        page,
        limit,
        totalPages: 0
      };
    }
  }

  // Calculate relevance score for search results
  static calculateRelevanceScore(article, query) {
    let score = 0;
    const queryLower = query.toLowerCase();

    // Title match (highest weight)
    if (article.title.toLowerCase().includes(queryLower)) {
      score += 10;
      // Exact title match gets bonus
      if (article.title.toLowerCase() === queryLower) {
        score += 5;
      }
    }

    // Summary match
    if (article.summary && article.summary.toLowerCase().includes(queryLower)) {
      score += 5;
    }

    // Content match
    if (article.content && article.content.toLowerCase().includes(queryLower)) {
      score += 2;
    }

    // Tag match
    if (article.tags && Array.isArray(article.tags)) {
      const tagMatches = article.tags.filter(tag => 
        tag.toLowerCase().includes(queryLower)
      ).length;
      score += tagMatches * 3;
    }

    // Recency bonus
    const daysSincePublished = (new Date() - new Date(article.publishedAt)) / (1000 * 60 * 60 * 24);
    if (daysSincePublished < 1) {
      score += 2;
    } else if (daysSincePublished < 7) {
      score += 1;
    }

    // Popularity bonus
    score += Math.min(article.viewCount / 100, 3);
    score += Math.min(article.commentCount / 10, 2);

    return score;
  }

  // Search categories
  static async searchCategories(query, limit = 10) {
    try {
      const categories = await Category.findAll({
        where: {
          [Op.or]: [
            { name: { [Op.iLike]: `%${query}%` } },
            { description: { [Op.iLike]: `%${query}%` } }
          ],
          isActive: true
        },
        order: [['articleCount', 'DESC']],
        limit
      });

      return categories;
    } catch (error) {
      console.error('Category search error:', error);
      return [];
    }
  }

  // Search authors
  static async searchAuthors(query, limit = 10) {
    try {
      const authors = await Author.findAll({
        where: {
          [Op.or]: [
            { penName: { [Op.iLike]: `%${query}%` } },
            { bio: { [Op.iLike]: `%${query}%` } },
            { specialization: { [Op.iLike]: `%${query}%` } }
          ],
          isActive: true
        },
        include: [
          {
            model: User,
            as: 'user',
            attributes: ['firstName', 'lastName', 'avatar']
          }
        ],
        order: [['totalArticles', 'DESC']],
        limit
      });

      return authors;
    } catch (error) {
      console.error('Author search error:', error);
      return [];
    }
  }

  // Get search suggestions
  static async getSearchSuggestions(query, limit = 5) {
    try {
      const suggestions = [];

      // Get article title suggestions
      const articleTitles = await Article.findAll({
        where: {
          title: { [Op.iLike]: `%${query}%` },
          status: 'published'
        },
        attributes: ['title'],
        order: [['viewCount', 'DESC']],
        limit: Math.ceil(limit / 2)
      });

      suggestions.push(...articleTitles.map(article => ({
        type: 'article',
        text: article.title
      })));

      // Get category suggestions
      const categories = await Category.findAll({
        where: {
          name: { [Op.iLike]: `%${query}%` },
          isActive: true
        },
        attributes: ['name'],
        order: [['articleCount', 'DESC']],
        limit: Math.ceil(limit / 2)
      });

      suggestions.push(...categories.map(category => ({
        type: 'category',
        text: category.name
      })));

      return suggestions.slice(0, limit);
    } catch (error) {
      console.error('Search suggestions error:', error);
      return [];
    }
  }
}

module.exports = SearchEngine; 