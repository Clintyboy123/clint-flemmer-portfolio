// POST /api/enquiries - the contact form (multipart, so files can be attached).
const router = require('express').Router();
const { body } = require('express-validator');
const validate = require('../middleware/validate');
const { formLimiter } = require('../middleware/rateLimit');
const { enquiryUpload, MB } = require('../middleware/upload');
const { text } = require('../middleware/rules');
const controller = require('../controllers/enquiry.controller');

const ATTACHMENT_TYPES = ['image', 'document']; // images and PDFs

// Checks the attached files: real images or PDFs only, 10 MB together.
const attachmentsOk = (value, { req }) => {
  const files = req.files || [];
  if (files.some((file) => !file.detected || !ATTACHMENT_TYPES.includes(file.detected.kind))) {
    throw new Error('Attach images or PDFs only');
  }
  if (files.reduce((total, file) => total + file.size, 0) > 10 * MB) {
    throw new Error('Attachments can be 10 MB in total');
  }
  return true;
};

router.post(
  '/',
  formLimiter,
  enquiryUpload,
  validate([
    text('name', 120, { required: true, label: 'Your name' }),
    body('email')
      .exists({ values: 'null' }).withMessage('Enter a valid email address')
      .isString().bail().trim()
      .isEmail().withMessage('Enter a valid email address')
      .isLength({ max: 254 }).withMessage('Email can be at most 254 characters'),
    text('phone', 40, { label: 'Phone' }),
    text('company', 160, { label: 'Company' }),
    // Sent as a repeated form field; one value arrives as text, several as a list.
    body('services')
      .customSanitizer((value) => (value === undefined || value === null || value === '' ? [] : [].concat(value)))
      .isArray({ min: 1, max: 7 }).withMessage('Choose between 1 and 7 services'),
    body('services.*')
      .isString().withMessage('Each service must be text').bail()
      .trim()
      .notEmpty().withMessage('A service cannot be empty')
      .isLength({ max: 60 }).withMessage('Each service can be at most 60 characters'),
    text('budget', 120, { label: 'Budget' }),
    text('deadline', 120, { label: 'Deadline' }),
    text('brief', 5000, { required: true, label: 'Your brief' }),
    text('referenceLinks', 2000, { label: 'Reference links' }),
    body('website').isEmpty().withMessage('Invalid submission'), // spam trap: real visitors never fill it
    body('attachments').custom(attachmentsOk),
  ]),
  controller.create
);

module.exports = router;
