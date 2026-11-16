// The Services carousel on the home page.
const ApiError = require('../utils/ApiError');
const reorder = require('../utils/reorder');
const format = require('./format');
const { deleteUnusedUploads } = require('./works.service');
const { ServiceSlide } = require('../models');

exports.list = async () => {
  const slides = await ServiceSlide.findAll({ order: [['position', 'ASC'], ['id', 'ASC']] });
  return slides.map(format.serviceSlide);
};

const find = async (id) => {
  const slide = await ServiceSlide.findByPk(id);
  if (!slide) throw new ApiError(404, 'Service slide not found');
  return slide;
};

exports.create = async (values) => {
  const position = ((await ServiceSlide.max('position')) || 0) + 1;
  return format.serviceSlide(await ServiceSlide.create({ ...values, position }));
};

exports.update = async (id, values) => {
  const slide = await find(id);
  await slide.update(values);
  return format.serviceSlide(slide);
};

exports.remove = async (id) => {
  const slide = await find(id);
  await slide.destroy();
  await deleteUnusedUploads([slide.image, slide.video]);
};

exports.reorder = async (ids) => {
  await reorder(ServiceSlide, ids);
  return exports.list();
};
