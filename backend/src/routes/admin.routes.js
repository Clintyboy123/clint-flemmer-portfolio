// The admin API: /api/admin/... Every route here needs the sign-in cookie (401 without it).
// Note: the "/order" routes are listed before "/:id" so "order" is never read as an id.
const router = require('express').Router();
const { body, query, param } = require('express-validator');
const validate = require('../middleware/validate');
const { requireAuth } = require('../middleware/auth');
const { mediaUpload } = require('../middleware/upload');
const { text, link, id, bodyId, slug, bool, orderIds } = require('../middleware/rules');
const { KEYS: CONTENT_KEYS } = require('../services/content.service');
const c = require('../controllers/admin.controller');

router.use(requireAuth);

// --- Dashboard ---------------------------------------------------------------
router.get('/dashboard', c.dashboard);

// --- Settings ----------------------------------------------------------------
router.get('/settings', c.getSettings);
router.put(
  '/settings',
  validate([
    body('email').optional().isString().bail().trim()
      .custom((v) => v === '' || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)).withMessage('Enter a valid email address, or leave it empty')
      .isLength({ max: 254 }),
    text('whatsapp', 40, { label: 'WhatsApp number' })
      .matches(/^[0-9+()\-\s]*$/).withMessage('Use only numbers, spaces, +, ( ) and -'),
    link('facebook', { webOnly: true, label: 'Facebook link' }),
    link('instagram', { webOnly: true, label: 'Instagram link' }),
    link('tiktok', { webOnly: true, label: 'TikTok link' }),
    link('etsy', { webOnly: true, label: 'Etsy link' }),
    bool('musicEnabled', 'Music on/off'),
    link('musicTrack', { label: 'Music track' }),
  ]),
  c.updateSettings
);

// --- Page content ------------------------------------------------------------
const MAX_CONTENT_BYTES = 20 * 1024;

// Only text, numbers, true/false, lists and plain objects; no null, no HTML-only tricks needed.
const isPlainContent = (value, depth = 0) => {
  if (depth > 8) return false;
  if (typeof value === 'string' || typeof value === 'boolean') return true;
  if (typeof value === 'number') return Number.isFinite(value);
  if (Array.isArray(value)) return value.every((item) => isPlainContent(item, depth + 1));
  if (value && Object.getPrototypeOf(value) === Object.prototype) {
    return Object.values(value).every((item) => isPlainContent(item, depth + 1));
  }
  return false;
};

router.get('/content', c.getContent);
router.put(
  '/content/:key',
  validate([
    param('key').isIn(CONTENT_KEYS).withMessage(`Unknown content key. Use one of: ${CONTENT_KEYS.join(', ')}`),
    body('data')
      .custom((v) => v && typeof v === 'object' && !Array.isArray(v)).withMessage('data must be an object').bail()
      .custom((v) => isPlainContent(v)).withMessage('data may only contain text, numbers, true/false, lists and objects').bail()
      .custom((v) => Buffer.byteLength(JSON.stringify(v)) <= MAX_CONTENT_BYTES).withMessage('data is too large (max 20 kB)'),
  ]),
  c.updateContent
);

// --- Work categories ---------------------------------------------------------
const workCategoryRules = (isNew) => [
  text('name', 120, { required: isNew, label: 'Name' }),
  slug(isNew),
  text('intro', 2000, { label: 'Intro' }),
  body('tags').optional().isArray({ max: 20 }).withMessage('Tags must be a list (max 20)'),
  body('tags.*').isString().withMessage('Each tag must be text').bail().trim()
    .notEmpty().withMessage('A tag cannot be empty').isLength({ max: 60 }),
  body('layout').optional().isIn(['gallery', 'sites']).withMessage('Layout must be "gallery" or "sites"'),
];
router.get('/work-categories', c.listWorkCategories);
router.post('/work-categories', validate(workCategoryRules(true)), c.createWorkCategory);
router.put('/work-categories/order', validate(orderIds()), c.orderWorkCategories);
router.put('/work-categories/:id', validate([id(), ...workCategoryRules(false)]), c.updateWorkCategory);
router.delete('/work-categories/:id', validate([id()]), c.deleteWorkCategory);

// --- Works -------------------------------------------------------------------
const size = (field) =>
  body(field).optional({ values: 'null' }).isInt({ min: 1, max: 100000 }).withMessage('Must be a whole number of pixels').toInt();
const workRules = (isNew) => [
  bodyId('categoryId', { required: isNew, label: 'Category' }),
  text('title', 200, { required: isNew, label: 'Title' }),
  text('description', 5000, { label: 'Description' }),
  text('meta', 200, { label: 'Meta line' }),
  link('image', { required: isNew, label: 'Image' }),
  size('imageWidth'),
  size('imageHeight'),
  link('video', { nullable: true, label: 'Video' }),
  link('url', { nullable: true, webOnly: true, label: 'Website link' }),
];
router.post('/works', validate(workRules(true)), c.createWork);
router.put('/works/order', validate([bodyId('categoryId', { label: 'Category' }), ...orderIds()]), c.orderWorks);
router.put('/works/:id', validate([id(), ...workRules(false)]), c.updateWork);
router.delete('/works/:id', validate([id()]), c.deleteWork);

// --- Price categories --------------------------------------------------------
const priceCategoryRules = (isNew) => [
  text('name', 120, { required: isNew, label: 'Name' }),
  slug(isNew),
  text('intro', 2000, { label: 'Intro' }),
];
router.get('/price-categories', c.listPriceCategories);
router.post('/price-categories', validate(priceCategoryRules(true)), c.createPriceCategory);
router.put('/price-categories/order', validate(orderIds()), c.orderPriceCategories);
router.put('/price-categories/:id', validate([id(), ...priceCategoryRules(false)]), c.updatePriceCategory);
router.delete('/price-categories/:id', validate([id()]), c.deletePriceCategory);

// --- Price items -------------------------------------------------------------
const priceItemRules = (isNew) => [
  bodyId('categoryId', { required: isNew, label: 'Category' }),
  text('title', 200, { required: isNew, label: 'Title' }),
  text('detail', 200, { label: 'Detail' }),
  body('amount').optional({ values: 'null' })
    .isInt({ min: 0, max: 100000000 }).withMessage('Amount must be a whole number of rand (or empty for "Get a quote")').toInt(),
  bool('isFrom', '"From"'),
];
router.post('/price-items', validate(priceItemRules(true)), c.createPriceItem);
router.put('/price-items/order', validate([bodyId('categoryId', { label: 'Category' }), ...orderIds()]), c.orderPriceItems);
router.put('/price-items/:id', validate([id(), ...priceItemRules(false)]), c.updatePriceItem);
router.delete('/price-items/:id', validate([id()]), c.deletePriceItem);

// --- Service slides ----------------------------------------------------------
const serviceSlideRules = (isNew) => [
  text('title', 120, { required: isNew, label: 'Title' }),
  text('text', 2000, { label: 'Text' }),
  text('tags', 300, { label: 'Tags' }),
  link('image', { required: isNew, label: 'Image' }),
  link('video', { nullable: true, label: 'Video' }),
  link('link', { label: 'Link' }),
  text('linkLabel', 80, { label: 'Link label' }),
];
router.get('/service-slides', c.listServiceSlides);
router.post('/service-slides', validate(serviceSlideRules(true)), c.createServiceSlide);
router.put('/service-slides/order', validate(orderIds()), c.orderServiceSlides);
router.put('/service-slides/:id', validate([id(), ...serviceSlideRules(false)]), c.updateServiceSlide);
router.delete('/service-slides/:id', validate([id()]), c.deleteServiceSlide);

// --- Media upload ------------------------------------------------------------
router.post('/uploads', mediaUpload, c.upload);

// --- Enquiries ---------------------------------------------------------------
router.get(
  '/enquiries',
  validate([
    query('page').optional().isInt({ min: 1, max: 100000 }).withMessage('page must be 1 or more').toInt(),
    query('pageSize').optional().isInt({ min: 1, max: 100 }).withMessage('pageSize must be 1 to 100').toInt(),
  ]),
  c.listEnquiries
);
router.get('/enquiries/:id', validate([id()]), c.getEnquiry);
router.patch(
  '/enquiries/:id',
  validate([id(), body('isRead').exists().withMessage('isRead is required').isBoolean().withMessage('isRead must be true or false').toBoolean()]),
  c.updateEnquiry
);
router.delete('/enquiries/:id', validate([id()]), c.deleteEnquiry);
router.get('/enquiries/:id/files/:fileId', validate([id(), id('fileId')]), c.downloadEnquiryFile);

module.exports = router;
