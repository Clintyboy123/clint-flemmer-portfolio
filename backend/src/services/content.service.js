// Editable page copy: one JSON object per section key.
const { PageContent } = require('../models');
const seeded = require('../seeders/data/content');

// The sections the site knows about (the same list as docs/API.md "Page content").
const KEYS = Object.keys(seeded);

exports.KEYS = KEYS;

exports.getAll = async () => {
  const rows = await PageContent.findAll({ where: { key: KEYS } });
  return Object.fromEntries(rows.map((row) => [row.key, row.data]));
};

exports.update = async (key, data) => {
  await PageContent.upsert({ key, data });
  return { key, data };
};
