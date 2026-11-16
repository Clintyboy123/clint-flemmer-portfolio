// Works out what a file really is from its first bytes ("magic bytes"), not from its name.
// A visitor can call any file "photo.jpg"; the bytes inside cannot lie the same way.
// Returns { mime, ext, kind } (kind is image, video, audio or document), or null when the type is not accepted.
const fs = require('fs/promises');

const HEAD_BYTES = 256;

const ascii = (buf, start, end) => buf.subarray(start, end).toString('latin1');
const startsWith = (buf, bytes, offset = 0) => bytes.every((b, i) => buf[offset + i] === b);

const TYPES = {
  jpg: { mime: 'image/jpeg', ext: 'jpg', kind: 'image' },
  png: { mime: 'image/png', ext: 'png', kind: 'image' },
  gif: { mime: 'image/gif', ext: 'gif', kind: 'image' },
  webp: { mime: 'image/webp', ext: 'webp', kind: 'image' },
  avif: { mime: 'image/avif', ext: 'avif', kind: 'image' },
  mp4: { mime: 'video/mp4', ext: 'mp4', kind: 'video' },
  webm: { mime: 'video/webm', ext: 'webm', kind: 'video' },
  mp3: { mime: 'audio/mpeg', ext: 'mp3', kind: 'audio' },
  pdf: { mime: 'application/pdf', ext: 'pdf', kind: 'document' },
};

// MP4 and AVIF are both "ISO media" files: a box called "ftyp" lists which formats ("brands") the file follows.
const ISO_REJECT = ['qt  ', 'heic', 'heix', 'hevc', 'heim', 'heis', 'msf1', 'crx ', 'jp2 ']; // QuickTime, HEIC, ...
const isoBrands = (buf) => {
  const boxSize = Math.min(buf.readUInt32BE(0), buf.length);
  const brands = [ascii(buf, 8, 12)];
  for (let i = 16; i + 4 <= boxSize; i += 4) brands.push(ascii(buf, i, i + 4));
  return brands;
};

const detect = (buf) => {
  if (buf.length < 4) return null;

  if (startsWith(buf, [0xff, 0xd8, 0xff])) return TYPES.jpg;
  if (startsWith(buf, [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])) return TYPES.png;
  if (ascii(buf, 0, 6) === 'GIF87a' || ascii(buf, 0, 6) === 'GIF89a') return TYPES.gif;
  if (ascii(buf, 0, 4) === 'RIFF' && ascii(buf, 8, 12) === 'WEBP') return TYPES.webp;
  if (ascii(buf, 0, 5) === '%PDF-') return TYPES.pdf;

  if (buf.length >= 12 && ascii(buf, 4, 8) === 'ftyp') {
    const brands = isoBrands(buf);
    if (brands.includes('avif') || brands.includes('avis')) return TYPES.avif;
    if (ISO_REJECT.includes(brands[0]) || brands[0] === 'mif1') return null;
    return TYPES.mp4;
  }

  // WebM is a Matroska file whose "DocType" says webm (plain .mkv files are not accepted).
  if (startsWith(buf, [0x1a, 0x45, 0xdf, 0xa3])) return ascii(buf, 0, 64).includes('webm') ? TYPES.webm : null;

  // MP3: either an ID3 tag first, or straight into an MPEG audio frame (Layer III).
  if (ascii(buf, 0, 3) === 'ID3') return TYPES.mp3;
  if (buf[0] === 0xff && (buf[1] & 0xe6) === 0xe2 && (buf[1] & 0x18) !== 0x08) return TYPES.mp3;

  return null;
};

// Reads the start of a file on disk and detects its type.
const detectFile = async (filePath) => {
  const handle = await fs.open(filePath, 'r');
  try {
    const buf = Buffer.alloc(HEAD_BYTES);
    const { bytesRead } = await handle.read(buf, 0, HEAD_BYTES, 0);
    return detect(buf.subarray(0, bytesRead));
  } finally {
    await handle.close();
  }
};

module.exports = { detect, detectFile };
