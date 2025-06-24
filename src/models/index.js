const { Sequelize } = require('sequelize');
const path = require('path');
const fs = require('fs');
const dbDir = path.join(__dirname, '../../database');
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: process.env.DB_PATH || path.join(dbDir, 'news_platform.db'),
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
  define: {
    timestamps: true,
    underscored: true,
    freezeTableName: false
  },
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

const DataTypes = Sequelize.DataTypes;

const User = require('./User')(sequelize, DataTypes);
const Author = require('./Author')(sequelize, DataTypes);
const Category = require('./Category')(sequelize, DataTypes);
const Article = require('./Article')(sequelize, DataTypes);
const ArticleAuthor = require('./ArticleAuthor')(sequelize, DataTypes);
const Comment = require('./Comment')(sequelize, DataTypes);
const Bookmark = require('./Bookmark')(sequelize, DataTypes);
const BookmarkCollection = require('./BookmarkCollection')(sequelize, DataTypes);
const ReadingHistory = require('./ReadingHistory')(sequelize, DataTypes);
const SubscriptionPlan = require('./SubscriptionPlan')(sequelize, DataTypes);
const EPaper = require('./EPaper');
const EPaperEdition = require('./EPaperEdition');
const Newsletter = require('./Newsletter');
const NewsletterTemplate = require('./NewsletterTemplate');

// Associations
User.hasOne(Author, { foreignKey: 'userId', as: 'authorProfile' });
User.hasMany(Comment, { foreignKey: 'userId', as: 'comments' });
User.hasMany(Bookmark, { foreignKey: 'userId', as: 'bookmarks' });
User.hasMany(BookmarkCollection, { foreignKey: 'userId', as: 'bookmarkCollections' });
User.hasMany(ReadingHistory, { foreignKey: 'userId', as: 'readingHistory' });

Author.belongsTo(User, { foreignKey: 'userId', as: 'user' });
Author.belongsToMany(Article, { through: ArticleAuthor, foreignKey: 'authorId', as: 'articles' });

Category.hasMany(Article, { foreignKey: 'categoryId', as: 'articles' });

Article.belongsTo(Category, { foreignKey: 'categoryId', as: 'category' });
Article.belongsToMany(Author, { through: ArticleAuthor, foreignKey: 'articleId', as: 'authors' });
Article.hasMany(Comment, { foreignKey: 'articleId', as: 'comments' });
Article.hasMany(Bookmark, { foreignKey: 'articleId', as: 'bookmarks' });
Article.hasMany(ReadingHistory, { foreignKey: 'articleId', as: 'readingHistory' });

ArticleAuthor.belongsTo(Article, { foreignKey: 'articleId' });
ArticleAuthor.belongsTo(Author, { foreignKey: 'authorId' });

Comment.belongsTo(User, { foreignKey: 'userId', as: 'user' });
Comment.belongsTo(Article, { foreignKey: 'articleId', as: 'article' });

Bookmark.belongsTo(User, { foreignKey: 'userId', as: 'user' });
Bookmark.belongsTo(Article, { foreignKey: 'articleId', as: 'article' });
Bookmark.belongsTo(BookmarkCollection, { foreignKey: 'collectionId', as: 'collection' });

BookmarkCollection.belongsTo(User, { foreignKey: 'userId', as: 'user' });
BookmarkCollection.hasMany(Bookmark, { foreignKey: 'collectionId', as: 'bookmarks' });

ReadingHistory.belongsTo(User, { foreignKey: 'userId', as: 'user' });
ReadingHistory.belongsTo(Article, { foreignKey: 'articleId', as: 'article' });

EPaperEdition.hasMany(EPaper, { foreignKey: 'editionId', as: 'epapers' });
EPaper.belongsTo(EPaperEdition, { foreignKey: 'editionId', as: 'edition' });

module.exports = {
  sequelize,
  Sequelize,
  User,
  Author,
  Category,
  Article,
  ArticleAuthor,
  Comment,
  Bookmark,
  BookmarkCollection,
  ReadingHistory,
  SubscriptionPlan,
  EPaper,
  EPaperEdition,
  Newsletter,
  NewsletterTemplate
}; 