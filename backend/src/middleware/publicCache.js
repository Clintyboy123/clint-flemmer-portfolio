// Lets browsers and the VPS Nginx reuse public data for a minute, so a busy page does not hit the database
// on every view. Admin changes show up on the public site within that minute.
module.exports = (req, res, next) => {
  res.set('Cache-Control', 'public, max-age=60');
  next();
};
