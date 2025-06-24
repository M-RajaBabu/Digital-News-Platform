module.exports = (sequelize, DataTypes) => {
  const ArticleAuthor = sequelize.define('ArticleAuthor', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    articleId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'articles',
        key: 'id'
      }
    },
    authorId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'authors',
        key: 'id'
      }
    },
    role: {
      type: DataTypes.STRING,
      defaultValue: 'author'
    },
    order: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    }
  }, {
    modelName: 'articleauthors',
    tableName: 'articleauthors'
  });
  return ArticleAuthor;
}; 