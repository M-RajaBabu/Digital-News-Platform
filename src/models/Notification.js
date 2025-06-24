const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Notification = sequelize.define('Notification', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'User',
      key: 'id'
    }
  },
  type: {
    type: DataTypes.ENUM(
      'article_published',
      'comment_reply',
      'breaking_news',
      'subscription_expiry',
      'system_announcement',
      'poll_created',
      'author_followed',
      'bookmark_shared'
    ),
    allowNull: false
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  // Related content
  relatedId: {
    type: DataTypes.UUID,
    allowNull: true
  },
  relatedType: {
    type: DataTypes.STRING,
    allowNull: true
  },
  // Notification data
  data: {
    type: DataTypes.JSON,
    defaultValue: {}
  },
  // Status
  isRead: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  isSent: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  // Timing
  readAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  sentAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  // Priority
  priority: {
    type: DataTypes.ENUM('low', 'normal', 'high', 'urgent'),
    defaultValue: 'normal'
  },
  // Delivery channels
  emailSent: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  pushSent: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  smsSent: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
});

module.exports = Notification; 