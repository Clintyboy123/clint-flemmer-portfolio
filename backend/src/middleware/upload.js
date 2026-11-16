// File uploads (multer). Files are written to uploads/tmp first, then checked by their real content
// (see utils/fileType.js) and moved to their final folder under a name generated here.
// If the request fails for any reason (bad type, too big, a form field missing...), every file it
// wrote is deleted again, so nothing half-finished is left on disk.
const fs = require('fs/promises');
const path = require('path');
const multer = require('multer');
const ApiError = require('../utils/ApiError');
const { detectFile } = require('../utils/fileType');
const { dirs, randomName, removeFile } = require('../utils/storage');

const MB = 1024 * 1024;

const storage = multer.diskStorage({
  destination: dirs.tmp,
  filename: (req, file, cb) => cb(null, randomName('part')),
});

// Deletes this request's files when it ends with an error (or the visitor disconnects half-way).
const cleanUpOnFailure = (req, res) => {
  res.on('close', () => {
    if (res.statusCode < 400 && res.writableFinished) return;
    const files = req.file ? [req.file] : req.files || [];
    files.forEach((file) => removeFile(file.path));
  });
};

// After multer: detect each file's real type and move the accepted ones into place.
// file.detected is { mime, ext, kind } or null (rejected later by the route's validation).
const checkFiles = async (req, targetDir) => {
  const files = req.file ? [req.file] : req.files || [];
  for (const file of files) {
    file.detected = await detectFile(file.path);
    if (file.detected) {
      const finalPath = path.join(targetDir, randomName(file.detected.ext));
      await fs.rename(file.path, finalPath);
      file.path = finalPath;
      file.filename = path.basename(finalPath);
    }
  }
};

// Turns multer's own errors into clear messages for the form.
const multerError = (error, field, tooLargeStatus, tooLargeMessage) => {
  if (!(error instanceof multer.MulterError)) return error;
  if (error.code === 'LIMIT_FILE_SIZE') {
    const message = tooLargeStatus === 422 ? 'Please check the highlighted fields.' : tooLargeMessage;
    return new ApiError(tooLargeStatus, message, [{ field, message: tooLargeMessage }]);
  }
  if (error.code === 'LIMIT_FILE_COUNT' || error.code === 'LIMIT_UNEXPECTED_FILE') {
    const message = field === 'attachments' ? 'Attach up to 5 files.' : 'Send one file in the "file" field.';
    return new ApiError(422, 'Please check the highlighted fields.', [{ field, message }]);
  }
  return new ApiError(400, 'The upload could not be read.');
};

const build = ({ parse, field, targetDir, tooLargeStatus, tooLargeMessage }) => (req, res, next) => {
  cleanUpOnFailure(req, res);
  parse(req, res, (error) => {
    if (error) return next(multerError(error, field, tooLargeStatus, tooLargeMessage));
    checkFiles(req, targetDir).then(() => next(), next);
  });
};

// Admin media: one file in "file", at most 60 MB (the per-type limits are checked in the controller).
const mediaUpload = build({
  parse: multer({ storage, limits: { fileSize: 60 * MB, files: 1, fields: 10 } }).single('file'),
  field: 'file',
  targetDir: dirs.media,
  tooLargeStatus: 413,
  tooLargeMessage: 'That file is too large. Images can be up to 10 MB, video 60 MB and audio 15 MB.',
});

// Contact form attachments: up to 5 files in "attachments", 10 MB in total (checked in the route's validation).
const enquiryUpload = build({
  parse: multer({ storage, limits: { fileSize: 10 * MB, files: 5, fields: 30, fieldSize: 64 * 1024 } }).array('attachments', 5),
  field: 'attachments',
  targetDir: dirs.enquiries,
  tooLargeStatus: 422,
  tooLargeMessage: 'Attachments can be 10 MB in total.',
});

module.exports = { mediaUpload, enquiryUpload, MB };
