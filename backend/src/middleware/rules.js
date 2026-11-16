// Reusable validation rules, so every route checks ids, links and texts the same way.
const { body, param } = require('express-validator');

const isHttpUrl = (value) => /^https?:\/\/[^\s]+$/i.test(value) && URL.canParse(value);
// A path on this site ("/works#graphic", "/media/work/a.jpg") or a full http(s) link.
const isSitePathOrUrl = (value) => (/^\/(?!\/)[^\s\\]*$/.test(value)) || isHttpUrl(value);

// A text field. required: must not be empty. Otherwise it may be left out (an update) or empty.
const text = (field, max, { required = false, label = 'This field' } = {}) => {
  let chain = body(field);
  chain = required ? chain.exists({ values: 'null' }).withMessage(`${label} is required`) : chain.optional();
  chain = chain.isString().withMessage(`${label} must be text`).bail().trim();
  if (required) chain = chain.notEmpty().withMessage(`${label} is required`);
  return chain.isLength({ max }).withMessage(`${label} can be at most ${max} characters`);
};

// A link or file path. nullable: null clears it. required: must be filled in.
const link = (field, { required = false, nullable = false, webOnly = false, label = 'This link' } = {}) => {
  let chain = body(field);
  if (required) chain = chain.exists({ values: 'null' }).withMessage(`${label} is required`);
  else chain = chain.optional({ values: nullable ? 'null' : 'undefined' });
  return chain
    .isString().withMessage(`${label} must be text`).bail()
    .trim()
    .isLength({ max: 500 }).withMessage(`${label} can be at most 500 characters`)
    .custom((value) => {
      if (value === '' && !required) return true;
      if (webOnly ? isHttpUrl(value) : isSitePathOrUrl(value)) return true;
      throw new Error(webOnly ? `${label} must start with http:// or https://` : `${label} must be a site path (starting with /) or an http(s) link`);
    });
};

const id = (field = 'id') => param(field).isInt({ min: 1 }).withMessage('Not a valid id').toInt();

const bodyId = (field, { required = true, label = 'This' } = {}) =>
  (required ? body(field).exists({ values: 'null' }).withMessage(`${label} is required`) : body(field).optional())
    .isInt({ min: 1 }).withMessage(`${label} must be a valid id`).toInt();

const slug = (required) =>
  (required ? body('slug').exists({ values: 'null' }).withMessage('Slug is required') : body('slug').optional())
    .isString().withMessage('Slug must be text').bail()
    .trim()
    .toLowerCase()
    .matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).withMessage('Use only a–z, 0–9 and dashes')
    .isLength({ max: 80 }).withMessage('Slug can be at most 80 characters');

const bool = (field, label = 'This') =>
  body(field).optional().isBoolean().withMessage(`${label} must be true or false`).toBoolean();

// { ids: [3, 1, 2] } for the "order" routes.
const orderIds = () => [
  body('ids').isArray({ min: 1, max: 500 }).withMessage('ids must be a list of ids')
    .custom((ids) => new Set(ids.map(String)).size === ids.length).withMessage('ids must not repeat'),
  body('ids.*').isInt({ min: 1 }).withMessage('Each id must be a number').toInt(),
];

module.exports = { text, link, id, bodyId, slug, bool, orderIds, isHttpUrl, isSitePathOrUrl };
