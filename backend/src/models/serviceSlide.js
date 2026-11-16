// One slide of the Services carousel on the home page.
module.exports = (sequelize, DataTypes) => {
  const ServiceSlide = sequelize.define(
    'ServiceSlide',
    {
      title: { type: DataTypes.STRING(120), allowNull: false },
      text: { type: DataTypes.TEXT, allowNull: false, defaultValue: '' },
      tags: { type: DataTypes.STRING(300), allowNull: false, defaultValue: '' },
      image: { type: DataTypes.STRING(500), allowNull: false },
      video: { type: DataTypes.STRING(500), allowNull: true },
      link: { type: DataTypes.STRING(300), allowNull: false, defaultValue: '' },
      linkLabel: { type: DataTypes.STRING(80), allowNull: false, defaultValue: '' },
      position: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false, defaultValue: 0 },
    },
    { tableName: 'service_slides' }
  );

  return ServiceSlide;
};
