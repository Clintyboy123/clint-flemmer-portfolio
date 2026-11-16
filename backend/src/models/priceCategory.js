// A section of the price list.
module.exports = (sequelize, DataTypes) => {
  const PriceCategory = sequelize.define(
    'PriceCategory',
    {
      slug: { type: DataTypes.STRING(80), allowNull: false, unique: true },
      name: { type: DataTypes.STRING(120), allowNull: false },
      intro: { type: DataTypes.TEXT, allowNull: false, defaultValue: '' },
      position: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false, defaultValue: 0 },
    },
    { tableName: 'price_categories' }
  );

  PriceCategory.associate = (models) => {
    PriceCategory.hasMany(models.PriceItem, { as: 'items', foreignKey: 'categoryId', onDelete: 'RESTRICT' });
  };

  return PriceCategory;
};
