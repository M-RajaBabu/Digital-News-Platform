const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Poll = sequelize.define('Poll', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  question: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  options: {
    type: DataTypes.JSON,
    allowNull: false
  },
  categoryId: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'Category',
      key: 'id'
    }
  },
  // Poll settings
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  isPublic: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  allowMultipleVotes: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  requireLogin: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  // Timing
  startDate: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  endDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  // Statistics
  totalVotes: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  uniqueVoters: {
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
  },
  // Results visibility
  showResults: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  showResultsAfterVote: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
});

module.exports = Poll; 