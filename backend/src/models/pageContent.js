// The editable copy of one page section ("home.hero", "footer", ...).
module.exports = (sequelize, DataTypes) => {
  const PageContent = sequelize.define(
    'PageContent',
    {
      key: { type: DataTypes.STRING(60), allowNull: false, unique: true },
      data: { type: DataTypes.JSON, allowNull: false },
    },
    { tableName: 'page_contents' }
  );

  return PageContent;
};
