// Someone who can sign in to the admin.
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'User',
    {
      name: { type: DataTypes.STRING(120), allowNull: false },
      email: { type: DataTypes.STRING(254), allowNull: false, unique: true },
      passwordHash: { type: DataTypes.STRING(100), allowNull: false },
      passwordChangedAt: { type: DataTypes.DATE, allowNull: true },
    },
    {
      tableName: 'users',
      // The password hash is left out of every normal query, so it can never slip into a response.
      // Only the login and change-password code asks for it, with User.scope('withPassword').
      defaultScope: { attributes: { exclude: ['passwordHash'] } },
      scopes: { withPassword: {} },
    }
  );

  return User;
};
