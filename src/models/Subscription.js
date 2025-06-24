const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Subscription = sequelize.define('Subscription', {
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
  planId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'SubscriptionPlan',
      key: 'id'
    }
  },
  status: {
    type: DataTypes.ENUM('active', 'cancelled', 'expired', 'pending', 'failed'),
    defaultValue: 'pending'
  },
  startDate: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  endDate: {
    type: DataTypes.DATE,
    allowNull: false
  },
  cancelledAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  // Payment information
  paymentMethod: {
    type: DataTypes.STRING,
    allowNull: true
  },
  paymentId: {
    type: DataTypes.STRING,
    allowNull: true
  },
  amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  currency: {
    type: DataTypes.STRING,
    defaultValue: 'USD'
  },
  // Auto-renewal
  autoRenew: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  nextBillingDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  // Trial information
  isTrial: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  trialEndsAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  // Cancellation
  cancellationReason: {
    type: DataTypes.STRING,
    allowNull: true
  },
  // Notes
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'Subscriptions'
});

module.exports = Subscription; 