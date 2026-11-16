// Public data for the website.
const settings = require('../services/settings.service');
const content = require('../services/content.service');
const works = require('../services/works.service');
const pricing = require('../services/pricing.service');
const serviceSlides = require('../services/serviceSlides.service');

// GET /api/site - everything the page frame needs in one call.
exports.site = async (req, res) => {
  const [settingsData, contentData, services] = await Promise.all([settings.get(), content.getAll(), serviceSlides.list()]);
  res.json({ success: true, data: { settings: settingsData, content: contentData, services } });
};

// GET /api/works
exports.works = async (req, res) => {
  res.json({ success: true, data: await works.list() });
};

// GET /api/pricing
exports.pricing = async (req, res) => {
  res.json({ success: true, data: await pricing.list() });
};
