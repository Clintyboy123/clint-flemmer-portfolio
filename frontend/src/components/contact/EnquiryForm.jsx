import { useEffect, useRef, useState } from 'react';
import Reveal from '../ui/Reveal';
import FileDrop, { fmtSize } from './FileDrop';
import { ArrowRight } from '../ui/icons';
import useMagnetic from '../../hooks/useMagnetic';
import { sendEnquiry } from '../../services/enquiries';
import cx from '../../utils/cx';
import { reduceMotion } from '../../utils/env';

// The enquiry form: friendly inline validation (on submit, then as people correct things), service chips,
// reference uploads, and a real submit to POST /api/enquiries. The API's validation is the final word:
// its field errors show under the fields, anything else in the note beside the button. What was typed is kept.
const SERVICES = ['Graphic Design', 'Motion Graphics', 'Illustration', 'Web Design', '3D Animation', '2D Animation', 'Something else'];
const MAX_FILES = 5;
const MAX_BYTES = 10 * 1024 * 1024;
const NOTE = (
  <>
    Fields marked <span className="req">*</span> are required.
  </>
);

const RULES = {
  name: (v) => (v.trim() ? '' : 'Please add your name.'),
  email: (v) =>
    !v.trim() ? 'Please add your email so I can reply.' : /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) ? '' : 'That email doesn’t look quite right.',
  brief: (v) => (v.trim().length >= 10 ? '' : 'Please tell me a little about the project.'),
};
const okType = (f) => f.type.startsWith('image/') || f.type === 'application/pdf' || /\.pdf$/i.test(f.name);
// API field names → the form's own error slots
const API_FIELD = { attachments: 'files' };

function Field({ id, label, required, error, children }) {
  return (
    <div className={cx('field', error && 'is-invalid')}>
      <label htmlFor={id}>
        {label}{' '}
        {required ? (
          <span className="req" aria-hidden="true">*</span>
        ) : (
          <span className="opt">optional</span>
        )}
      </label>
      {children}
      <p className="field__error" id={`${id}-error`} aria-live="polite">
        {error}
      </p>
    </div>
  );
}

export default function EnquiryForm({ onSent }) {
  const [v, setV] = useState({ name: '', email: '', phone: '', company: '', budget: '', deadline: '', brief: '', referenceLinks: '', website: '' });
  const [services, setServices] = useState([]);
  const [files, setFiles] = useState([]);
  const [errors, setErrors] = useState({});
  const [sending, setSending] = useState(false);
  const [note, setNote] = useState(null);
  const form = useRef(null);
  const btn = useRef(null);
  useMagnetic(btn);

  const setError = (k, msg) => setErrors((e) => ({ ...e, [k]: msg }));
  const check = (k, value = v[k]) => {
    const msg = RULES[k](value);
    setError(k, msg);
    return !msg;
  };
  const filesMessage = (list, msg = '') => {
    const total = list.reduce((a, f) => a + f.size, 0);
    if (!msg && total > MAX_BYTES) msg = `That’s ${fmtSize(total)} — please keep references under 10 MB in total, or share a link instead.`;
    return msg;
  };

  const bind = (k) => ({
    id: `f-${k === 'referenceLinks' ? 'links' : k}`,
    name: k,
    value: v[k],
    'aria-invalid': RULES[k] ? (errors[k] ? 'true' : 'false') : errors[k] ? 'true' : undefined,
    'aria-describedby': `f-${k === 'referenceLinks' ? 'links' : k}-error`,
    onChange: (e) => {
      const value = e.target.value;
      setV((s) => ({ ...s, [k]: value }));
      if (errors[k]) RULES[k] ? check(k, value) : setError(k, '');
    },
    onBlur: RULES[k] ? (e) => check(k, e.target.value) : undefined,
  });

  const toggleService = (s) => {
    const next = services.includes(s) ? services.filter((x) => x !== s) : [...services, s];
    setServices(next);
    if (errors.services) setError('services', next.length ? '' : 'Pick at least one — or “Something else”.');
  };

  const addFiles = (incoming) => {
    const all = [...incoming];
    const accepted = all.filter(okType);
    const next = files.concat(accepted).slice(0, MAX_FILES);
    setFiles(next);
    setError('files', filesMessage(next, accepted.length < all.length ? 'Only images and PDFs can be attached.' : ''));
  };
  const removeFile = (i) => {
    const next = files.filter((_, n) => n !== i);
    setFiles(next);
    setError('files', filesMessage(next));
  };

  // move to the first field with a problem, once React has rendered the errors (effect below)
  const [focusTick, setFocusTick] = useState(0);
  const focusFirstInvalid = () => setFocusTick((n) => n + 1);
  useEffect(() => {
    if (!focusTick) return;
    const f = form.current;
    let first = f.querySelector('.is-invalid input, .is-invalid textarea');
    if (!first && f.querySelector('#services-error')?.textContent) first = f.querySelector('[name="services"]');
    if (!first && f.querySelector('#files-error')?.textContent) first = f.querySelector('#f-files');
    if (!first) return;
    first.focus({ preventScroll: true });
    first.scrollIntoView({ block: 'center', behavior: reduceMotion ? 'auto' : 'smooth' });
  }, [focusTick]);

  const submit = async (e) => {
    e.preventDefault();
    if (sending) return;
    const okFields = ['name', 'email', 'brief'].map((k) => check(k)).every(Boolean);
    const okServices = services.length > 0;
    setError('services', okServices ? '' : 'Pick at least one — or “Something else”.');
    const fMsg = filesMessage(files, errors.files?.startsWith('Only') ? errors.files : '');
    setError('files', fMsg);
    const okFiles = !fMsg || fMsg.startsWith('Only');
    if (!okFields || !okServices || !okFiles) return focusFirstInvalid();

    const data = new FormData();
    Object.entries(v).forEach(([k, val]) => data.append(k, val));
    services.forEach((s) => data.append('services', s));
    files.forEach((f) => data.append('attachments', f));

    setSending(true);
    setNote(null);
    try {
      await sendEnquiry(data);
      onSent();
    } catch (err) {
      const fields = Object.entries(err.fields || {});
      if (fields.length) {
        // "services[0]" / "services.0" belong to the services group
        const slot = (k) => {
          const base = k.replace(/[[.].*$/, '');
          return API_FIELD[base] || base;
        };
        setErrors((cur) => ({ ...cur, ...Object.fromEntries(fields.map(([k, m]) => [slot(k), m])) }));
        focusFirstInvalid();
      }
      setNote(err.message);
      setSending(false);
    }
  };

  return (
    <form ref={form} className="enquiry" id="enquiryForm" noValidate onSubmit={submit}>
      <input type="text" name="website" className="enquiry__honey" tabIndex={-1} autoComplete="off" aria-hidden="true" value={v.website} onChange={(e) => setV((s) => ({ ...s, website: e.target.value }))} />

      <Reveal as="fieldset" className="enquiry__group fade">
        <legend className="eyebrow">01 · Your details</legend>
        <div className="enquiry__row">
          <Field id="f-name" label="Name" required error={errors.name}>
            <input {...bind('name')} type="text" autoComplete="name" required />
          </Field>
          <Field id="f-email" label="Email" required error={errors.email}>
            <input {...bind('email')} type="email" autoComplete="email" required />
          </Field>
        </div>
        <div className="enquiry__row">
          <Field id="f-phone" label="Phone" error={errors.phone}>
            <input {...bind('phone')} type="tel" autoComplete="tel" inputMode="tel" />
          </Field>
          <Field id="f-company" label="Company / brand" error={errors.company}>
            <input {...bind('company')} type="text" autoComplete="organization" />
          </Field>
        </div>
      </Reveal>

      <Reveal as="fieldset" className="enquiry__group fade">
        <legend className="eyebrow">02 · The project</legend>
        <div className={cx('field', errors.services && 'is-invalid')}>
          <p className="field__label" id="services-label">
            What do you need? <span className="req" aria-hidden="true">*</span>
          </p>
          <div className="chips" role="group" aria-labelledby="services-label" aria-describedby="services-error">
            {SERVICES.map((s) => (
              <label className="chip" key={s}>
                <input type="checkbox" name="services" value={s} checked={services.includes(s)} onChange={() => toggleService(s)} />
                <span>{s}</span>
              </label>
            ))}
          </div>
          <p className="field__error" id="services-error" aria-live="polite">
            {errors.services}
          </p>
        </div>
        <div className="enquiry__row">
          <Field id="f-budget" label="Budget" error={errors.budget}>
            <input {...bind('budget')} type="text" />
          </Field>
          <Field id="f-deadline" label="Deadline" error={errors.deadline}>
            <input {...bind('deadline')} type="text" placeholder="e.g. end of March" />
          </Field>
        </div>
        <Field id="f-brief" label="Your brief" required error={errors.brief}>
          <textarea {...bind('brief')} rows="6" required placeholder="What’s the project, who is it for, and what should it achieve?" />
        </Field>
      </Reveal>

      <Reveal as="fieldset" className="enquiry__group fade">
        <legend className="eyebrow">
          03 · References <span className="opt">optional</span>
        </legend>
        <div className="field">
          <p className="field__label">Artwork you like</p>
          <FileDrop files={files} onAdd={addFiles} onRemove={removeFile} error={errors.files} />
        </div>
        <Field id="f-links" label="Reference links" error={errors.referenceLinks}>
          <textarea {...bind('referenceLinks')} rows="3" placeholder="Pinterest boards, Behance projects, websites — one per line" />
        </Field>
      </Reveal>

      <Reveal className="enquiry__submit fade">
        <button ref={btn} type="submit" className="btn btn--solid magnetic" disabled={sending}>
          {sending ? 'Sending… ' : 'Send enquiry '}
          <ArrowRight />
        </button>
        <p className={cx('enquiry__note', note && 'is-error')} role={note ? 'alert' : undefined}>
          {note || NOTE}
        </p>
      </Reveal>
    </form>
  );
}
