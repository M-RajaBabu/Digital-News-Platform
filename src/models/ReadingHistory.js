module.exports = (sequelize, DataTypes) => {
  const ReadingHistory = sequelize.define('ReadingHistory', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    articleId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'articles',
        key: 'id'
      }
    },
    readAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    readingDuration: {
      type: DataTypes.INTEGER, // in seconds
      allowNull: true
    },
    progress: {
      type: DataTypes.FLOAT, // percentage read (0-100)
      allowNull: true
    },
    completed: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    deviceInfo: {
      type: DataTypes.JSON,
      allowNull: true
    },
    userAgent: {
      type: DataTypes.STRING,
      allowNull: true
    },
    ipAddress: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    modelName: 'readinghistories',
    tableName: 'readinghistories'
  });
  return ReadingHistory;
}; 