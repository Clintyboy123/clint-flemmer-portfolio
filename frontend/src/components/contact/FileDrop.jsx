import { useEffect, useMemo, useState } from 'react';
import cx from '../../utils/cx';

// References drop zone: drop or browse images/PDFs, see them listed with a thumbnail and size, remove any.
export const fmtSize = (b) => (b < 1024 * 1024 ? `${Math.max(1, Math.round(b / 1024))} KB` : `${(b / 1024 / 1024).toFixed(1)} MB`);

function FileItem({ file, onRemove }) {
  const isImage = file.type.startsWith('image/');
  const url = useMemo(() => (isImage ? URL.createObjectURL(file) : null), [file, isImage]);
  useEffect(() => () => url && URL.revokeObjectURL(url), [url]);
  return (
    <li>
      {isImage ? <img src={url} alt="" /> : <span className="pdf">PDF</span>}
      <span className="name">{file.name}</span>
      <span className="size">{fmtSize(file.size)}</span>
      <button type="button" aria-label={`Remove ${file.name}`} onClick={onRemove}>
        <svg viewBox="0 0 16 16" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="1.6">
          <path d="M3 3l10 10M13 3L3 13" />
        </svg>
      </button>
    </li>
  );
}

export default function FileDrop({ files, onAdd, onRemove, error }) {
  const [over, setOver] = useState(false);
  const enter = (e) => {
    e.preventDefault();
    setOver(true);
  };
  const leave = (e) => {
    e.preventDefault();
    setOver(false);
  };
  return (
    <>
      <label className={cx('drop', over && 'is-over')} id="drop" onDragEnter={enter} onDragOver={enter} onDragLeave={leave} onDrop={(e) => { leave(e); onAdd(e.dataTransfer.files); }}>
        <input
          type="file"
          name="attachments"
          id="f-files"
          accept="image/*,.pdf"
          multiple
          aria-describedby="files-error"
          onChange={(e) => {
            onAdd(e.target.files);
            e.target.value = ''; // so the same file can be picked again after removing it
          }}
        />
        <svg className="drop__icon" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
          <path d="M24 32V12M16 20l8-8 8 8M8 32v6a2 2 0 0 0 2 2h28a2 2 0 0 0 2-2v-6" />
        </svg>
        <span className="drop__text">
          <strong>Drop images or PDFs here</strong> or <u>browse your files</u>
        </span>
        <span className="drop__hint">Up to 5 files · 10 MB in total</span>
      </label>
      <ul className="files" id="fileList" aria-live="polite">
        {files.map((f, i) => (
          <FileItem key={`${f.name}-${f.size}-${f.lastModified}-${i}`} file={f} onRemove={() => onRemove(i)} />
        ))}
      </ul>
      <p className="field__error" id="files-error" aria-live="polite">
        {error}
      </p>
    </>
  );
}
