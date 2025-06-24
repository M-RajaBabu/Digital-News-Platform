const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const MediaGallery = sequelize.define('MediaGallery', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  type: {
    type: DataTypes.ENUM('image', 'video', 'audio', 'document'),
    defaultValue: 'image'
  },
  url: {
    type: DataTypes.STRING,
    allowNull: false
  },
  thumbnailUrl: {
    type: DataTypes.STRING,
    allowNull: true
  },
  // File information
  fileName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  fileSize: {
    type: DataTypes.INTEGER, // in bytes
    allowNull: true
  },
  mimeType: {
    type: DataTypes.STRING,
    allowNull: true
  },
  // Media dimensions
  width: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  height: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  duration: {
    type: DataTypes.INTEGER, // in seconds for videos/audio
    allowNull: true
  },
  // Credits and attribution
  photographer: {
    type: DataTypes.STRING,
    allowNull: true
  },
  caption: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  credits: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  source: {
    type: DataTypes.STRING,
    allowNull: true
  },
  license: {
    type: DataTypes.STRING,
    allowNull: true
  },
  // Article association
  articleId: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'Article',
      key: 'id'
    }
  },
  // Upload information
  uploadedBy: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'User',
      key: 'id'
    }
  },
  // Status and settings
  isPublic: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  isFeatured: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  // Tags and categories
  tags: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  categoryId: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'Category',
      key: 'id'
    }
  },
  // Statistics
  viewCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  downloadCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  }
});

module.exports = MediaGallery; 