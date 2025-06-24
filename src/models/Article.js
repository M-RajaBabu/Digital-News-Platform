module.exports = (sequelize, DataTypes) => {
  const Article = sequelize.define('Article', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    slug: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    summary: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    excerpt: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    // Media
    featuredImage: {
      type: DataTypes.STRING,
      allowNull: true
    },
    images: {
      type: DataTypes.JSON,
      defaultValue: []
    },
    videos: {
      type: DataTypes.JSON,
      defaultValue: []
    },
    // Categories and tags
    categoryId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'categories',
        key: 'id'
      }
    },
    tags: {
      type: DataTypes.JSON,
      defaultValue: []
    },
    // Article metadata
    readingTime: {
      type: DataTypes.INTEGER, // in minutes
      defaultValue: 0
    },
    wordCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    // Statistics
    viewCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    likeCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    commentCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    shareCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    bookmarkCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    // Article status and settings
    status: {
      type: DataTypes.ENUM('draft', 'published', 'archived', 'scheduled'),
      defaultValue: 'draft'
    },
    isPremium: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    isBreaking: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    isTrending: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    isFeatured: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    // Publishing
    publishedAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    scheduledAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    // SEO fields
    metaTitle: {
      type: DataTypes.STRING,
      allowNull: true
    },
    metaDescription: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    metaKeywords: {
      type: DataTypes.STRING,
      allowNull: true
    },
    // Article settings
    settings: {
      type: DataTypes.JSON,
      defaultValue: {
        allowComments: true,
        requireModeration: false,
        socialSharing: true,
        relatedArticles: true
      }
    },
    // Location and language
    language: {
      type: DataTypes.STRING,
      defaultValue: 'en'
    },
    location: {
      type: DataTypes.STRING,
      allowNull: true
    },
    // Source attribution
    source: {
      type: DataTypes.STRING,
      allowNull: true
    },
    sourceUrl: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    modelName: 'articles',
    tableName: 'articles'
  });
  return Article;
}; 