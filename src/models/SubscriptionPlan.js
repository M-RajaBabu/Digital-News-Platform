module.exports = (sequelize, DataTypes) => {
  const SubscriptionPlan = sequelize.define('SubscriptionPlan', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    slug: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0.00
    },
    currency: {
      type: DataTypes.STRING,
      defaultValue: 'USD'
    },
    billingCycle: {
      type: DataTypes.ENUM('monthly', 'yearly', 'weekly', 'daily'),
      defaultValue: 'monthly'
    },
    duration: {
      type: DataTypes.INTEGER, // in days
      defaultValue: 30
    },
    features: {
      type: DataTypes.JSON,
      defaultValue: []
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    isPopular: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    sortOrder: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    maxArticlesPerDay: {
      type: DataTypes.INTEGER,
      defaultValue: -1 // -1 means unlimited
    },
    maxBookmarks: {
      type: DataTypes.INTEGER,
      defaultValue: -1 // -1 means unlimited
    },
    allowComments: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    allowPremiumContent: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    allowAdFree: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    allowOfflineReading: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  }, {
    modelName: 'subscriptionplans',
    tableName: 'subscriptionplans'
  });
  return SubscriptionPlan;
}; 