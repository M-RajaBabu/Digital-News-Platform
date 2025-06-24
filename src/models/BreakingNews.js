const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const BreakingNews = sequelize.define('BreakingNews', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  articleId: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'Article',
      key: 'id'
    }
  },
  priority: {
    type: DataTypes.ENUM('low', 'medium', 'high', 'critical'),
    defaultValue: 'medium'
  },
  categoryId: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'Category',
      key: 'id'
    }
  },
  location: {
    type: DataTypes.STRING,
    allowNull: true
  },
  // Timing
  expiresAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  // Push notification
  pushNotification: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  pushTitle: {
    type: DataTypes.STRING,
    allowNull: true
  },
  pushBody: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  // Statistics
  viewCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  clickCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  // Created by
  createdBy: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'User',
      key: 'id'
    }
  }
});

module.exports = BreakingNews; 