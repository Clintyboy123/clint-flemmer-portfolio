// The validated fields of a request, ready to save.
// Same as matchedData(req), but keeps fields deliberately set to null (e.g. "remove the video")
// and leaves out fields that were not sent at all (so an update only changes what was sent).
const { matchedData } = require('express-validator');

module.exports = (req, locations = ['body']) =>
  Object.fromEntries(
    Object.entries(matchedData(req, { includeOptionals: true, locations })).filter(([, value]) => value !== undefined)
  );
