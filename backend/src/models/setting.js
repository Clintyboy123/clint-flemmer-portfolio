// One site-wide setting, stored as a key and a text value.
module.exports = (sequelize, DataTypes) => {
  const Setting = sequelize.define(
    'Setting',
    {
      key: { type: DataTypes.STRING(60), allowNull: false, unique: true },
      value: { type: DataTypes.TEXT, allowNull: false },
    },
    { tableName: 'settings' }
  );

  return Setting;
};
