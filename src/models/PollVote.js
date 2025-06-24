const { DataTypes, Op } = require('sequelize');
const { sequelize } = require('../config/database');

const PollVote = sequelize.define('PollVote', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  poll_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Poll',
      key: 'id'
    },
    field: 'poll_id'
  },
  user_id: {
    type: DataTypes.UUID,
    allowNull: true, // null for anonymous votes
    references: {
      model: 'User',
      key: 'id'
    },
    field: 'user_id'
  },
  option_index: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'option_index'
  },
  // Anonymous vote tracking
  session_id: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'session_id'
  },
  ip_address: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'ip_address'
  },
  user_agent: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'user_agent'
  },
  voted_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
    field: 'voted_at'
  }
}, {
  indexes: [
    {
      unique: true,
      fields: ['poll_id', 'user_id'],
      where: {
        user_id: {
          [Op.ne]: null
        }
      }
    },
    {
      unique: true,
      fields: ['poll_id', 'session_id'],
      where: {
        session_id: {
          [Op.ne]: null
        }
      }
    }
  ]
});

module.exports = PollVote; 