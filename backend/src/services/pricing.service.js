// Price list: categories and the rows inside them.
const ApiError = require('../utils/ApiError');
const reorder = require('../utils/reorder');
const format = require('./format');
const { PriceCategory, PriceItem } = require('../models');

const nextPosition = async (Model, where = {}) => ((await Model.max('position', { where })) || 0) + 1;

exports.list = async () => {
  const categories = await PriceCategory.findAll({
    include: [{ model: PriceItem, as: 'items' }],
    order: [['position', 'ASC'], ['id', 'ASC'], [{ model: PriceItem, as: 'items' }, 'position', 'ASC'], [{ model: PriceItem, as: 'items' }, 'id', 'ASC']],
  });
  return categories.map(format.priceCategory);
};

// --- Categories -------------------------------------------------------------

const findCategory = async (id) => {
  const category = await PriceCategory.findByPk(id, { include: [{ model: PriceItem, as: 'items' }], order: [[{ model: PriceItem, as: 'items' }, 'position', 'ASC']] });
  if (!category) throw new ApiError(404, 'Price category not found');
  return category;
};

exports.createCategory = async (values) => {
  const category = await PriceCategory.create({ intro: '', ...values, position: await nextPosition(PriceCategory) });
  return format.priceCategory(await findCategory(category.id));
};

exports.updateCategory = async (id, values) => {
  const category = await findCategory(id);
  await category.update(values);
  return format.priceCategory(await findCategory(id));
};

exports.deleteCategory = async (id) => {
  const category = await findCategory(id);
  if (category.items.length) {
    throw new ApiError(409, 'This category still has prices in it. Move or delete them first.');
  }
  await category.destroy();
};

exports.reorderCategories = async (ids) => {
  await reorder(PriceCategory, ids);
  return exports.list();
};

// --- Items ------------------------------------------------------------------

const findItem = async (id) => {
  const item = await PriceItem.findByPk(id);
  if (!item) throw new ApiError(404, 'Price not found');
  return item;
};

const requireCategory = async (categoryId) => {
  if (!(await PriceCategory.findByPk(categoryId))) {
    throw new ApiError(422, 'Please check the highlighted fields.', [{ field: 'categoryId', message: 'That category does not exist' }]);
  }
};

exports.createItem = async (values) => {
  await requireCategory(values.categoryId);
  const item = await PriceItem.create({ ...values, position: await nextPosition(PriceItem, { categoryId: values.categoryId }) });
  return format.priceItem(item);
};

exports.updateItem = async (id, values) => {
  const item = await findItem(id);
  const changes = { ...values };
  if (changes.categoryId !== undefined && changes.categoryId !== item.categoryId) {
    await requireCategory(changes.categoryId);
    changes.position = await nextPosition(PriceItem, { categoryId: changes.categoryId });
  }
  await item.update(changes);
  return format.priceItem(item);
};

exports.deleteItem = async (id) => {
  const item = await findItem(id);
  await item.destroy();
};

exports.reorderItems = async (categoryId, ids) => {
  await requireCategory(categoryId);
  await reorder(PriceItem, ids, { categoryId });
  const items = await PriceItem.findAll({ where: { categoryId }, order: [['position', 'ASC'], ['id', 'ASC']] });
  return items.map(format.priceItem);
};
