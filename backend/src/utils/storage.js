// Where uploaded files live on disk, and small helpers to name, find and delete them.
//
//   uploads/media/       public: images, videos and music uploaded in the admin (served at /api/uploads/media)
//   uploads/enquiries/   private: attachments sent with the contact form (admin download only)
//   uploads/tmp/         files still being checked; anything that fails the check is deleted from here
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const env = require('../config/env');

const dirs = {
  media: path.join(env.uploadDir, 'media'),
  enquiries: path.join(env.uploadDir, 'enquiries'),
  tmp: path.join(env.uploadDir, 'tmp'),
};
Object.values(dirs).forEach((dir) => fs.mkdirSync(dir, { recursive: true }));

const MEDIA_URL = '/api/uploads/media/';

// A random name that cannot be guessed and never clashes, e.g. "3f9c1a...e2.jpg".
const randomName = (ext) => `${crypto.randomBytes(16).toString('hex')}${ext ? `.${ext}` : ''}`;

// Deletes a file, quietly doing nothing when it is already gone.
const removeFile = async (filePath) => {
  try {
    await fs.promises.unlink(filePath);
  } catch (error) {
    if (error.code !== 'ENOENT') console.error(`[uploads] could not delete ${filePath}:`, error.message);
  }
};

// "/api/uploads/media/abc.jpg" -> the file on disk. Anything else (seeded /media/... files, outside links) -> null.
const mediaFileFromUrl = (url) => {
  if (typeof url !== 'string' || !url.startsWith(MEDIA_URL)) return null;
  const name = url.slice(MEDIA_URL.length);
  if (!/^[a-f0-9]{32}\.[a-z0-9]{2,5}$/.test(name)) return null; // only names this API created
  return path.join(dirs.media, name);
};

module.exports = { dirs, MEDIA_URL, randomName, removeFile, mediaFileFromUrl };
