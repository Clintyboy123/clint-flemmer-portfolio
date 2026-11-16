import { useId, useRef, useState } from 'react';
import { FileAudio, Film, ImageUp, Trash2, Upload } from 'lucide-react';
import { UPLOAD_KINDS, readImageSize, uploadFile, validateFile } from '../../services/uploads';
import Spinner from './Spinner';
import IconButton from './IconButton';

const icons = { image: ImageUp, video: Film, audio: FileAudio };

// Picks a file, checks type and size, uploads it to /admin/uploads with progress, and shows a preview.
// onChange receives { url, width, height } (width/height for images only) or null when removed.
export default function FileUpload({ kind = 'image', label, value, onChange, onBusyChange, required, optional, error, removable = !required, hint }) {
  const id = useId();
  const input = useRef(null);
  const [progress, setProgress] = useState(null);
  const [localError, setLocalError] = useState('');
  const Icon = icons[kind];
  const rules = UPLOAD_KINDS[kind];
  const busy = progress !== null;
  const shownError = localError || error;
  const hintText = hint ? `${hint} ${rules.hint}.` : `${rules.hint}.`;

  const setBusy = (state) => {
    setProgress(state ? 0 : null);
    onBusyChange?.(state);
  };

  const pick = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    const problem = validateFile(file, kind);
    if (problem) {
      setLocalError(problem);
      return;
    }
    setLocalError('');
    setBusy(true);
    try {
      const size = kind === 'image' ? await readImageSize(file) : {};
      const uploaded = await uploadFile(file, setProgress);
      onChange({ url: uploaded.url, width: size.width ?? null, height: size.height ?? null });
    } catch (err) {
      // The API's per-field message ("must be an image ...") is more useful here than its summary line.
      setLocalError(Object.values(err.fields || {})[0] || err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="text-left">
      <p id={`${id}-label`} className="mb-2 flex items-baseline gap-2 text-ui font-semibold text-ink">
        {label}
        {required && (
          <span className="text-accent" aria-hidden="true">
            *
          </span>
        )}
        {optional && <span className="text-meta font-normal text-muted">optional</span>}
      </p>

      <div className={`flex flex-col items-center gap-4 rounded-2xl border border-dashed p-4 md:flex-row ${shownError ? 'border-danger' : 'border-line'}`}>
        <Preview kind={kind} url={value} Icon={Icon} />

        <div className="flex min-w-0 flex-1 flex-col items-center gap-1 text-center md:items-start md:text-left">
          {busy ? (
            <p className="flex items-center gap-2 text-ui text-ink" role="status">
              <Spinner className="size-4" /> Uploading {progress}%
            </p>
          ) : (
            <p className="w-full truncate text-ui text-ink">{value ? value.split('/').pop() : 'No file yet'}</p>
          )}
          {busy && (
            <span className="h-1 w-full max-w-60 overflow-hidden rounded-full bg-soft" aria-hidden="true">
              <span className="block h-full bg-ink transition-[width] duration-200" style={{ width: `${progress}%` }} />
            </span>
          )}
          <p id={`${id}-hint`} className="text-meta text-muted">
            {hintText}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <input
            ref={input}
            id={id}
            type="file"
            accept={rules.types.join(',')}
            onChange={pick}
            className="sr-only"
            aria-labelledby={`${id}-label`}
            aria-describedby={`${id}-hint${shownError ? ` ${id}-error` : ''}`}
            aria-invalid={shownError ? true : undefined}
            disabled={busy}
            tabIndex={-1}
          />
          <button
            type="button"
            onClick={() => input.current?.click()}
            disabled={busy}
            aria-describedby={`${id}-label`}
            className="inline-flex h-11 items-center gap-2 rounded-full border border-line px-5 text-ui font-semibold transition-colors duration-300 ease-out-soft hover:border-ink disabled:opacity-50"
          >
            <Upload className="size-4" strokeWidth={1.75} aria-hidden="true" />
            {value ? 'Replace' : 'Choose file'}
          </button>
          {removable && value && !busy && <IconButton icon={Trash2} variant="danger" label={`Remove ${label.toLowerCase()}`} onClick={() => onChange(null)} />}
        </div>
      </div>

      {shownError && (
        <p id={`${id}-error`} className="mt-2 text-meta font-medium text-danger" role="alert">
          {shownError}
        </p>
      )}
    </div>
  );
}

function Preview({ kind, url, Icon }) {
  if (url && kind === 'image') {
    return <img src={url} alt="" className="size-24 shrink-0 rounded-xl bg-soft object-cover" />;
  }
  if (url && kind === 'video') {
    return <video src={url} className="size-24 shrink-0 rounded-xl bg-soft object-cover" muted playsInline preload="metadata" aria-hidden="true" />;
  }
  if (url && kind === 'audio') {
    return <audio src={url} controls preload="none" className="w-full max-w-64" />;
  }
  return (
    <span className="flex size-24 shrink-0 items-center justify-center rounded-xl bg-soft text-muted">
      <Icon className="size-6" strokeWidth={1.5} aria-hidden="true" />
    </span>
  );
}
