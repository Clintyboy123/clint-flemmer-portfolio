// Works page: categories and the pieces inside them.
const ApiError = require('../utils/ApiError');
const reorder = require('../utils/reorder');
const { removeFile, mediaFileFromUrl } = require('../utils/storage');
const format = require('./format');
const { WorkCategory, Work, ServiceSlide } = require('../models');
const { Op } = require('sequelize');

const nextPosition = async (Model, where = {}) => ((await Model.max('position', { where })) || 0) + 1;

exports.list = async () => {
  const categories = await WorkCategory.findAll({
    include: [{ model: Work, as: 'works' }],
    order: [['position', 'ASC'], ['id', 'ASC'], [{ model: Work, as: 'works' }, 'position', 'ASC'], [{ model: Work, as: 'works' }, 'id', 'ASC']],
  });
  return categories.map(format.workCategory);
};

// --- Categories -------------------------------------------------------------

const findCategory = async (id) => {
  const category = await WorkCategory.findByPk(id, { include: [{ model: Work, as: 'works' }], order: [[{ model: Work, as: 'works' }, 'position', 'ASC']] });
  if (!category) throw new ApiError(404, 'Work category not found');
  return category;
};

exports.createCategory = async (values) => {
  const category = await WorkCategory.create({ intro: '', tags: [], ...values, position: await nextPosition(WorkCategory) });
  return format.workCategory(await findCategory(category.id));
};

exports.updateCategory = async (id, values) => {
  const category = await findCategory(id);
  await category.update(values);
  return format.workCategory(await findCategory(id));
};

exports.deleteCategory = async (id) => {
  const category = await findCategory(id);
  if (category.works.length) {
    throw new ApiError(409, 'This category still has works in it. Move or delete them first.');
  }
  await category.destroy();
};

exports.reorderCategories = async (ids) => {
  await reorder(WorkCategory, ids);
  return exports.list();
};

// --- Works ------------------------------------------------------------------

const findWork = async (id) => {
  const work = await Work.findByPk(id);
  if (!work) throw new ApiError(404, 'Work not found');
  return work;
};

const requireCategory = async (categoryId) => {
  if (!(await WorkCategory.findByPk(categoryId))) {
    throw new ApiError(422, 'Please check the highlighted fields.', [{ field: 'categoryId', message: 'That category does not exist' }]);
  }
};

exports.createWork = async (values) => {
  await requireCategory(values.categoryId);
  const work = await Work.create({ ...values, position: await nextPosition(Work, { categoryId: values.categoryId }) });
  return format.work(work);
};

exports.updateWork = async (id, values) => {
  const work = await findWork(id);
  const changes = { ...values };
  if (changes.categoryId !== undefined && changes.categoryId !== work.categoryId) {
    await requireCategory(changes.categoryId);
    changes.position = await nextPosition(Work, { categoryId: changes.categoryId }); // moved: goes to the end
  }
  await work.update(changes);
  return format.work(work);
};

// Deletes uploaded files (never seeded /media files) that no work or service slide uses any more.
const deleteUnusedUploads = async (urls) => {
  for (const url of urls) {
    const filePath = mediaFileFromUrl(url);
    if (!filePath) continue;
    const where = { [Op.or]: [{ image: url }, { video: url }] };
    const stillUsed = (await Work.count({ where })) + (await ServiceSlide.count({ where }));
    if (!stillUsed) await removeFile(filePath);
  }
};
exports.deleteUnusedUploads = deleteUnusedUploads;

exports.deleteWork = async (id) => {
  const work = await findWork(id);
  await work.destroy();
  await deleteUnusedUploads([work.image, work.video]);
};

exports.reorderWorks = async (categoryId, ids) => {
  await requireCategory(categoryId);
  await reorder(Work, ids, { categoryId });
  const works = await Work.findAll({ where: { categoryId }, order: [['position', 'ASC'], ['id', 'ASC']] });
  return works.map(format.work);
};

