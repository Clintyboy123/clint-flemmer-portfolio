// Sets "position" from a list of ids: the first id becomes 1, the next 2, and so on.
// Rows not in the list keep their order and move after the listed ones.
const ApiError = require('./ApiError');

module.exports = async (Model, ids, where = {}) => {
  const rows = await Model.findAll({ where, attributes: ['id', 'position'], order: [['position', 'ASC'], ['id', 'ASC']] });
  const known = new Set(rows.map((row) => row.id));
  const unknown = ids.filter((id) => !known.has(id));
  if (unknown.length) {
    throw new ApiError(422, 'Please check the highlighted fields.', [
      { field: 'ids', message: `Unknown id(s) in this list: ${unknown.join(', ')}` },
    ]);
  }

  const order = [...ids, ...rows.map((row) => row.id).filter((id) => !ids.includes(id))];
  await Model.sequelize.transaction(async (transaction) => {
    for (const [index, id] of order.entries()) {
      await Model.update({ position: index + 1 }, { where: { id }, transaction });
    }
  });
};
