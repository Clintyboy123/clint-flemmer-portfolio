// A section of the Works page.
module.exports = (sequelize, DataTypes) => {
  const WorkCategory = sequelize.define(
    'WorkCategory',
    {
      slug: { type: DataTypes.STRING(80), allowNull: false, unique: true },
      name: { type: DataTypes.STRING(120), allowNull: false },
      intro: { type: DataTypes.TEXT, allowNull: false, defaultValue: '' },
      tags: { type: DataTypes.JSON, allowNull: false, defaultValue: [] },
      layout: { type: DataTypes.ENUM('gallery', 'sites'), allowNull: false, defaultValue: 'gallery' },
      position: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false, defaultValue: 0 },
    },
    { tableName: 'work_categories' }
  );

  WorkCategory.associate = (models) => {
    WorkCategory.hasMany(models.Work, { as: 'works', foreignKey: 'categoryId', onDelete: 'RESTRICT' });
  };

  return WorkCategory;
};
