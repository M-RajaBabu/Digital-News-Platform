const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Newsletter = sequelize.define('Newsletter', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  firstName: {
    type: DataTypes.STRING,
    allowNull: true
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: true
  },
  preferences: {
    type: DataTypes.JSON,
    defaultValue: {
      categories: [],
      frequency: 'daily', // daily, weekly, monthly
      format: 'html', // html, text
      timezone: 'UTC'
    }
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  subscribedAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  unsubscribedAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  unsubscribeToken: {
    type: DataTypes.STRING,
    allowNull: true
  },
  lastEmailSent: {
    type: DataTypes.DATE,
    allowNull: true
  },
  emailCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  openCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  clickCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0
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

module.exports = Newsletter; 