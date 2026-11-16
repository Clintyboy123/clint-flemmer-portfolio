// Small helpers shared by the seeders.
const { QueryTypes } = require('sequelize');

// True when a table has no rows yet. Seeders check this first, so running one twice never duplicates content.
exports.isEmpty = async (queryInterface, table) => {
  const [row] = await queryInterface.sequelize.query(`SELECT COUNT(*) AS total FROM \`${table}\``, {
    type: QueryTypes.SELECT,
  });
  return Number(row.total) === 0;
};

// { slug: id } for a category table, used to link the rows that belong to each category.
exports.idsBySlug = async (queryInterface, table) => {
  const rows = await queryInterface.sequelize.query(`SELECT id, slug FROM \`${table}\``, { type: QueryTypes.SELECT });
  return Object.fromEntries(rows.map((row) => [row.slug, row.id]));
};
