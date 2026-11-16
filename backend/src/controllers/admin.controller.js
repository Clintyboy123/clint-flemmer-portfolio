// The admin area. Every route that reaches here has passed requireAuth and validation.
const { matchedData } = require('express-validator');
const pick = require('../utils/fields');
const ApiError = require('../utils/ApiError');
const { MEDIA_URL } = require('../utils/storage');
const { MB } = require('../middleware/upload');
const dashboard = require('../services/dashboard.service');
const settings = require('../services/settings.service');
const content = require('../services/content.service');
const works = require('../services/works.service');
const pricing = require('../services/pricing.service');
const serviceSlides = require('../services/serviceSlides.service');
const enquiries = require('../services/enquiries.service');

const ok = (res, data, status = 200) => res.status(status).json({ success: true, data });
const params = (req) => matchedData(req, { locations: ['params'] });

// --- Dashboard, settings, content ------------------------------------------
exports.dashboard = async (req, res) => ok(res, await dashboard.counts());
exports.getSettings = async (req, res) => ok(res, await settings.get());
exports.updateSettings = async (req, res) => ok(res, await settings.update(pick(req)));
exports.getContent = async (req, res) => ok(res, await content.getAll());
exports.updateContent = async (req, res) => ok(res, await content.update(params(req).key, pick(req).data));

// --- Work categories and works ---------------------------------------------
exports.listWorkCategories = async (req, res) => ok(res, await works.list());
exports.createWorkCategory = async (req, res) => ok(res, await works.createCategory(pick(req)), 201);
exports.updateWorkCategory = async (req, res) => ok(res, await works.updateCategory(params(req).id, pick(req)));
exports.deleteWorkCategory = async (req, res) => {
  await works.deleteCategory(params(req).id);
  res.status(204).end();
};
exports.orderWorkCategories = async (req, res) => ok(res, await works.reorderCategories(pick(req).ids));

exports.createWork = async (req, res) => ok(res, await works.createWork(pick(req)), 201);
exports.updateWork = async (req, res) => ok(res, await works.updateWork(params(req).id, pick(req)));
exports.deleteWork = async (req, res) => {
  await works.deleteWork(params(req).id);
  res.status(204).end();
};
exports.orderWorks = async (req, res) => {
  const { categoryId, ids } = pick(req);
  ok(res, await works.reorderWorks(categoryId, ids));
};

// --- Price categories and items --------------------------------------------
exports.listPriceCategories = async (req, res) => ok(res, await pricing.list());
exports.createPriceCategory = async (req, res) => ok(res, await pricing.createCategory(pick(req)), 201);
exports.updatePriceCategory = async (req, res) => ok(res, await pricing.updateCategory(params(req).id, pick(req)));
exports.deletePriceCategory = async (req, res) => {
  await pricing.deleteCategory(params(req).id);
  res.status(204).end();
};
exports.orderPriceCategories = async (req, res) => ok(res, await pricing.reorderCategories(pick(req).ids));

exports.createPriceItem = async (req, res) => ok(res, await pricing.createItem(pick(req)), 201);
exports.updatePriceItem = async (req, res) => ok(res, await pricing.updateItem(params(req).id, pick(req)));
exports.deletePriceItem = async (req, res) => {
  await pricing.deleteItem(params(req).id);
  res.status(204).end();
};
exports.orderPriceItems = async (req, res) => {
  const { categoryId, ids } = pick(req);
  ok(res, await pricing.reorderItems(categoryId, ids));
};

// --- Service slides ----------------------------------------------------------
exports.listServiceSlides = async (req, res) => ok(res, await serviceSlides.list());
exports.createServiceSlide = async (req, res) => ok(res, await serviceSlides.create(pick(req)), 201);
exports.updateServiceSlide = async (req, res) => ok(res, await serviceSlides.update(params(req).id, pick(req)));
exports.deleteServiceSlide = async (req, res) => {
  await serviceSlides.remove(params(req).id);
  res.status(204).end();
};
exports.orderServiceSlides = async (req, res) => ok(res, await serviceSlides.reorder(pick(req).ids));

// --- Media upload ------------------------------------------------------------
// The largest file allowed for each kind of media.
const LIMITS = { image: 10 * MB, video: 60 * MB, audio: 15 * MB };

exports.upload = async (req, res) => {
  const file = req.file;
  if (!file) throw new ApiError(422, 'Please check the highlighted fields.', [{ field: 'file', message: 'Choose a file to upload' }]);

  const type = file.detected;
  if (!type || !LIMITS[type.kind]) {
    throw new ApiError(422, 'Please check the highlighted fields.', [
      { field: 'file', message: 'Upload an image (JPG, PNG, WebP, AVIF, GIF), a video (MP4, WebM) or an MP3' },
    ]);
  }
  if (file.size > LIMITS[type.kind]) {
    const message = `That ${type.kind} is too large (max ${LIMITS[type.kind] / MB} MB)`;
    throw new ApiError(413, message, [{ field: 'file', message }]);
  }

  ok(res, { url: `${MEDIA_URL}${file.filename}`, mime: type.mime, size: file.size }, 201);
};

// --- Enquiries ---------------------------------------------------------------
exports.listEnquiries = async (req, res) => {
  const { page = 1, pageSize = 20 } = matchedData(req, { locations: ['query'] });
  const { data, meta } = await enquiries.list({ page, pageSize });
  res.json({ success: true, data, meta });
};
exports.getEnquiry = async (req, res) => ok(res, await enquiries.get(params(req).id));
exports.updateEnquiry = async (req, res) => ok(res, await enquiries.setRead(params(req).id, pick(req).isRead));
exports.deleteEnquiry = async (req, res) => {
  await enquiries.remove(params(req).id);
  res.status(204).end();
};
exports.downloadEnquiryFile = async (req, res) => {
  const { id, fileId } = params(req);
  const { file, filePath } = await enquiries.file(id, fileId);
  res.set('Cache-Control', 'private, no-store');
  res.type(file.mime);
  res.download(filePath, file.originalName);
};
