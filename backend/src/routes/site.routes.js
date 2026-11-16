// Public data the website reads: GET /api/site, /api/works, /api/pricing.
const router = require('express').Router();
const publicCache = require('../middleware/publicCache');
const controller = require('../controllers/site.controller');

router.get('/site', publicCache, controller.site);
router.get('/works', publicCache, controller.works);
router.get('/pricing', publicCache, controller.pricing);

module.exports = router;
