// Briefs from the contact form, and their attachments.
const path = require('path');
const fs = require('fs');
const ApiError = require('../utils/ApiError');
const { dirs, removeFile } = require('../utils/storage');
const format = require('./format');
const { Enquiry, EnquiryFile, sequelize } = require('../models');

const withFiles = { include: [{ model: EnquiryFile, as: 'files' }] };

// files: the accepted uploads, already moved into uploads/enquiries by the upload middleware.
exports.create = (values, files = []) =>
  sequelize.transaction(async (transaction) => {
    const enquiry = await Enquiry.create(values, { transaction });
    if (files.length) {
      await EnquiryFile.bulkCreate(
        files.map((file) => ({
          enquiryId: enquiry.id,
          originalName: file.originalname.slice(0, 255),
          storedName: file.filename,
          mime: file.detected.mime,
          size: file.size,
        })),
        { transaction }
      );
    }
    return enquiry;
  });

exports.list = async ({ page, pageSize }) => {
  const [{ rows, count }, unread] = await Promise.all([
    Enquiry.findAndCountAll({
      ...withFiles,
      distinct: true, // count enquiries, not enquiry + file combinations
      order: [['createdAt', 'DESC'], ['id', 'DESC'], [{ model: EnquiryFile, as: 'files' }, 'id', 'ASC']],
      limit: pageSize,
      offset: (page - 1) * pageSize,
    }),
    Enquiry.count({ where: { isRead: false } }),
  ]);
  return { data: rows.map(format.enquiry), meta: { page, pageSize, total: count, unread } };
};

const find = async (id) => {
  const enquiry = await Enquiry.findByPk(id, { ...withFiles, order: [[{ model: EnquiryFile, as: 'files' }, 'id', 'ASC']] });
  if (!enquiry) throw new ApiError(404, 'Enquiry not found');
  return enquiry;
};

exports.get = async (id) => format.enquiry(await find(id));

exports.setRead = async (id, isRead) => {
  const enquiry = await find(id);
  await enquiry.update({ isRead });
  return format.enquiry(enquiry);
};

exports.remove = async (id) => {
  const enquiry = await find(id);
  await enquiry.destroy(); // the database removes the file records with it (ON DELETE CASCADE)
  await Promise.all(enquiry.files.map((file) => removeFile(path.join(dirs.enquiries, file.storedName))));
};

// The attachment's record and where it is on disk.
exports.file = async (enquiryId, fileId) => {
  const file = await EnquiryFile.findOne({ where: { id: fileId, enquiryId } });
  if (!file) throw new ApiError(404, 'File not found');
  const filePath = path.join(dirs.enquiries, path.basename(file.storedName));
  if (!fs.existsSync(filePath)) throw new ApiError(404, 'File not found');
  return { file, filePath };
};
