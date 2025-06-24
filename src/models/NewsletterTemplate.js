const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const NewsletterTemplate = sequelize.define('NewsletterTemplate', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  subject: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  htmlContent: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  textContent: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  variables: {
    type: DataTypes.JSON,
    defaultValue: {
      user: ['firstName', 'lastName', 'email'],
      content: ['articles', 'categories', 'trending'],
      system: ['date', 'unsubscribeUrl']
    }
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  isDefault: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  category: {
    type: DataTypes.STRING,
    allowNull: true
  },
  frequency: {
    type: DataTypes.ENUM('daily', 'weekly', 'monthly', 'on-demand'),
    defaultValue: 'daily'
  },
  createdBy: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'User',
      key: 'id'
    }
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  }
});

module.exports = NewsletterTemplate; 