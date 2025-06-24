module.exports = (sequelize, DataTypes) => {
  const Author = sequelize.define('Author', {
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
    penName: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    bio: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    specialization: {
      type: DataTypes.STRING,
      allowNull: true
    },
    experience: {
      type: DataTypes.INTEGER, // years of experience
      allowNull: true
    },
    // Social media links
    socialLinks: {
      type: DataTypes.JSON,
      defaultValue: {
        twitter: null,
        linkedin: null,
        instagram: null,
        website: null
      }
    },
    // Verification and status
    isVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    // Statistics
    totalArticles: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    totalViews: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    totalFollowers: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    // Awards and recognition
    awards: {
      type: DataTypes.JSON,
      defaultValue: []
    },
    // Contact information
    contactEmail: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isEmail: true
      }
    },
    // Author preferences
    preferences: {
      type: DataTypes.JSON,
      defaultValue: {
        categories: [],
        writingStyle: 'neutral',
        publishSchedule: 'flexible'
      }
    }
  }, {
    modelName: 'authors',
    tableName: 'authors'
  });
  return Author;
}; 