// A portfolio piece.
module.exports = (sequelize, DataTypes) => {
  const Work = sequelize.define(
    'Work',
    {
      categoryId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
      title: { type: DataTypes.STRING(200), allowNull: false },
      description: { type: DataTypes.TEXT, allowNull: false, defaultValue: '' },
      meta: { type: DataTypes.STRING(200), allowNull: false, defaultValue: '' },
      image: { type: DataTypes.STRING(500), allowNull: false },
      imageWidth: { type: DataTypes.INTEGER.UNSIGNED, allowNull: true },
      imageHeight: { type: DataTypes.INTEGER.UNSIGNED, allowNull: true },
      video: { type: DataTypes.STRING(500), allowNull: true }, // a playable file for the lightbox
      url: { type: DataTypes.STRING(500), allowNull: true }, // a live website
      position: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false, defaultValue: 0 },
    },
    { tableName: 'works' }
  );

  Work.associate = (models) => {
    Work.belongsTo(models.WorkCategory, { as: 'category', foreignKey: 'categoryId', onDelete: 'RESTRICT' });
  };

  return Work;
};
