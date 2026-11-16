import api, { payload } from './http';

// Limits from docs/API.md (POST /admin/uploads). Checked here first so a wrong file fails instantly.
export const UPLOAD_KINDS = {
  image: {
    types: ['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/gif'],
    extensions: ['jpg', 'jpeg', 'png', 'webp', 'avif', 'gif'],
    maxBytes: 10 * 1024 * 1024,
    hint: 'JPG, PNG, WebP, AVIF or GIF, up to 10 MB',
  },
  video: {
    types: ['video/mp4', 'video/webm'],
    extensions: ['mp4', 'webm'],
    maxBytes: 60 * 1024 * 1024,
    hint: 'MP4 or WebM, up to 60 MB',
  },
  audio: {
    types: ['audio/mpeg', 'audio/mp3'],
    extensions: ['mp3'],
    maxBytes: 15 * 1024 * 1024,
    hint: 'MP3, up to 15 MB',
  },
};

export function validateFile(file, kind) {
  const rules = UPLOAD_KINDS[kind];
  const extension = file.name.split('.').pop()?.toLowerCase();
  const typeOk = rules.types.includes(file.type) || (!file.type && rules.extensions.includes(extension));
  if (!typeOk) return `That file type isn't supported here. Use ${rules.hint}.`;
  if (file.size > rules.maxBytes) return `That file is too large. Use ${rules.hint}.`;
  return '';
}

export function uploadFile(file, onProgress) {
  const form = new FormData();
  form.append('file', file);
  return api
    .post('/admin/uploads', form, {
      // The shared instance defaults to JSON; this lets the browser set the multipart boundary.
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: 0,
      onUploadProgress: (event) => {
        if (onProgress && event.total) onProgress(Math.round((event.loaded / event.total) * 100));
      },
    })
    .then(payload);
}

// Reads an image's real pixel size in the browser before upload.
export function readImageSize(file) {
  return new Promise((resolve) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      resolve({ width: img.naturalWidth, height: img.naturalHeight });
      URL.revokeObjectURL(url);
    };
    img.onerror = () => {
      resolve({ width: null, height: null });
      URL.revokeObjectURL(url);
    };
    img.src = url;
  });
}
