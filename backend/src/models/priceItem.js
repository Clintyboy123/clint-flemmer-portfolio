// One row of the price list.
module.exports = (sequelize, DataTypes) => {
  const PriceItem = sequelize.define(
    'PriceItem',
    {
      categoryId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
      title: { type: DataTypes.STRING(200), allowNull: false },
      detail: { type: DataTypes.STRING(200), allowNull: false, defaultValue: '' },
      amount: { type: DataTypes.INTEGER.UNSIGNED, allowNull: true }, // whole rand; null = "Get a quote"
      isFrom: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
      position: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false, defaultValue: 0 },
    },
    { tableName: 'price_items' }
  );

  PriceItem.associate = (models) => {
    PriceItem.belongsTo(models.PriceCategory, { as: 'category', foreignKey: 'categoryId', onDelete: 'RESTRICT' });
  };

  return PriceItem;
};
