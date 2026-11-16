const pick = require('../utils/fields');
const enquiries = require('../services/enquiries.service');

// POST /api/enquiries - the contact form.
exports.create = async (req, res) => {
  const { website, ...values } = pick(req); // "website" is the spam trap, not saved
  const enquiry = await enquiries.create(values, req.files || []);
  res.status(201).json({ success: true, message: 'Thank you. I’ll read your brief and come back to you by email.', data: { id: enquiry.id } });
};
