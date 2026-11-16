// Site settings are stored as key/value text rows; this turns them into one tidy object and back.
const { Setting } = require('../models');
const defaults = require('../seeders/data/settings');

const KEYS = Object.keys(defaults);

// "082 123 4567" -> "https://wa.me/27821234567" (South African numbers: a leading 0 becomes 27).
const whatsappUrl = (number) => {
  let digits = String(number || '').replace(/\D/g, '');
  if (digits.startsWith('0')) digits = `27${digits.slice(1)}`;
  return digits ? `https://wa.me/${digits}` : '';
};

const fromRows = (rows) => {
  const stored = Object.fromEntries(rows.map((row) => [row.key, row.value]));
  const value = (key) => (key in stored ? stored[key] : String(defaults[key]));
  return {
    email: value('email'),
    whatsapp: value('whatsapp'),
    whatsappUrl: whatsappUrl(value('whatsapp')),
    facebook: value('facebook'),
    instagram: value('instagram'),
    tiktok: value('tiktok'),
    etsy: value('etsy'),
    musicEnabled: value('musicEnabled') === 'true',
    musicTrack: value('musicTrack'),
  };
};

exports.get = async () => fromRows(await Setting.findAll({ where: { key: KEYS } }));

exports.update = async (values) => {
  await Setting.sequelize.transaction(async (transaction) => {
    for (const [key, value] of Object.entries(values)) {
      if (!KEYS.includes(key)) continue;
      await Setting.upsert({ key, value: String(value) }, { transaction });
    }
  });
  return exports.get();
};

exports.whatsappUrl = whatsappUrl;
