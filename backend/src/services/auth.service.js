const bcrypt = require('bcrypt');
const ApiError = require('../utils/ApiError');
const { User } = require('../models');

const COST = 12;
// Compared against when the email is unknown, so a wrong email takes as long as a wrong password
// (otherwise the response time would reveal which emails have an account).
const DUMMY_HASH = bcrypt.hashSync('not-a-real-password', COST);

exports.login = async (email, password) => {
  const user = await User.scope('withPassword').findOne({ where: { email } });
  const ok = await bcrypt.compare(password, user ? user.passwordHash : DUMMY_HASH);
  if (!user || !ok) throw new ApiError(401, 'That email and password do not match.');
  return user;
};

exports.changePassword = async (userId, currentPassword, newPassword) => {
  const user = await User.scope('withPassword').findByPk(userId);
  if (!user || !(await bcrypt.compare(currentPassword, user.passwordHash))) {
    throw new ApiError(422, 'Please check the highlighted fields.', [
      { field: 'currentPassword', message: 'Your current password is not correct' },
    ]);
  }
  // Whole seconds, because login tokens record their time in whole seconds.
  const changedAt = new Date(Math.floor(Date.now() / 1000) * 1000);
  await user.update({ passwordHash: await bcrypt.hash(newPassword, COST), passwordChangedAt: changedAt });
  return user;
};
