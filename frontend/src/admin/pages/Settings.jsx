import { useEffect, useRef, useState } from 'react';
import { RotateCcw } from 'lucide-react';
import useApi from '../../hooks/useApi';
import useSaving from '../hooks/useSaving';
import useUploadCount from '../hooks/useUploadCount';
import { fetchSettings, saveSettings } from '../services/settings';
import { changePassword } from '../services/auth';
import PageHeader from '../components/ui/PageHeader';
import Field from '../components/ui/Field';
import Toggle from '../components/ui/Toggle';
import FileUpload from '../components/ui/FileUpload';
import Button from '../components/ui/Button';
import ErrorState from '../components/ui/ErrorState';
import SkeletonRows from '../components/ui/Skeleton';
import { focusFirstInvalid, isHttpUrl } from '../lib/dom';

const DEFAULT_TRACK = '/audio/site-music.mp3';

const LINKS = [
  { key: 'facebook', label: 'Facebook' },
  { key: 'instagram', label: 'Instagram' },
  { key: 'tiktok', label: 'TikTok' },
  { key: 'etsy', label: 'Etsy shop' },
];

export default function Settings() {
  const { data, loading, error, reload } = useApi(() => fetchSettings());

  return (
    <>
      <title>Settings · Admin</title>
      <PageHeader eyebrow="Site" title="Settings" intro="Contact details, social links and music, used across the whole site." />
      {loading && !data ? <SkeletonRows rows={5} label="Loading settings" /> : error ? <ErrorState error={error} onRetry={reload} /> : <SiteSettings settings={data} />}
      <PasswordForm />
    </>
  );
}

function SettingsGroup({ title, description, children }) {
  return (
    <fieldset className="grid gap-6 border-t border-line py-12 md:grid-cols-3 md:gap-12">
      <legend className="sr-only">{title}</legend>
      <div className="text-center md:text-left" aria-hidden="true">
        <p className="text-section font-bold tracking-heading">{title}</p>
        {description && <p className="mx-auto mt-2 max-w-xs text-meta text-muted md:mx-0">{description}</p>}
      </div>
      <div className="flex flex-col gap-6 md:col-span-2">{children}</div>
    </fieldset>
  );
}

function SiteSettings({ settings }) {
  const formRef = useRef(null);
  const { saving, fieldErrors, setFieldErrors, run } = useSaving();
  const [uploading, trackUpload] = useUploadCount();
  const [values, setValues] = useState(() => toValues(settings));
  const [base, setBase] = useState(() => toValues(settings));
  const dirty = JSON.stringify(values) !== JSON.stringify(base);
  const set = (name, value) => setValues((v) => ({ ...v, [name]: value }));

  useEffect(() => {
    const next = toValues(settings);
    setValues(next);
    setBase(next);
  }, [settings]);

  const submit = async (event) => {
    event.preventDefault();
    const errors = {};
    if (values.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) errors.email = 'That email address doesn’t look right.';
    for (const { key, label } of LINKS) {
      if (values[key].trim() && !isHttpUrl(values[key])) errors[key] = `Use the full ${label} address, starting with https://`;
    }
    if (Object.keys(errors).length) {
      setFieldErrors(errors);
      focusFirstInvalid(formRef.current);
      return;
    }
    const body = Object.fromEntries(Object.entries(values).map(([k, v]) => [k, typeof v === 'string' ? v.trim() : v]));
    const saved = await run(() => saveSettings(body), { success: 'Settings saved', onError: () => focusFirstInvalid(formRef.current) });
    if (saved) {
      const next = toValues(saved === true ? body : saved);
      setValues(next);
      setBase(next);
    }
  };

  return (
    <form ref={formRef} onSubmit={submit} noValidate>
      <SettingsGroup title="Contact" description="Where enquiries and the contact page point.">
        <Field label="Contact email" type="email" inputMode="email" autoComplete="email" value={values.email} onChange={(e) => set('email', e.target.value)} error={fieldErrors.email} />
        <Field
          label="WhatsApp number"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          placeholder="082 123 4567"
          value={values.whatsapp}
          onChange={(e) => set('whatsapp', e.target.value)}
          error={fieldErrors.whatsapp}
          hint={settings.whatsappUrl && values.whatsapp === base.whatsapp ? `Chat link: ${settings.whatsappUrl}` : 'Type it as you would say it; the chat link is made for you.'}
        />
      </SettingsGroup>

      <SettingsGroup title="Social" description="Leave a link empty to hide it on the site.">
        {LINKS.map(({ key, label }) => (
          <Field
            key={key}
            label={label}
            type="url"
            inputMode="url"
            placeholder="https://"
            value={values[key]}
            onChange={(e) => set(key, e.target.value)}
            error={fieldErrors[key]}
            autoCapitalize="off"
            spellCheck={false}
          />
        ))}
      </SettingsGroup>

      <SettingsGroup title="Music" description="The background track visitors can play on the site.">
        <Toggle label="Music on the site" hint="Shows the music button. Visitors always choose to start it." checked={values.musicEnabled} onChange={(checked) => set('musicEnabled', checked)} />
        <FileUpload
          kind="audio"
          label="Music track"
          value={values.musicTrack}
          removable={false}
          error={fieldErrors.musicTrack}
          onBusyChange={trackUpload}
          onChange={(file) => set('musicTrack', file?.url || DEFAULT_TRACK)}
        />
        {values.musicTrack !== DEFAULT_TRACK && (
          <div className="flex justify-center md:justify-start">
            <Button variant="ghost" size="sm" icon={RotateCcw} className="md:-ml-5" onClick={() => set('musicTrack', DEFAULT_TRACK)}>
              Use the default track
            </Button>
          </div>
        )}
      </SettingsGroup>

      <div className="flex flex-col-reverse items-center gap-2 border-t border-line py-8 md:flex-row md:justify-end">
        {dirty && (
          <Button variant="ghost" onClick={() => setValues(base)} disabled={saving}>
            Discard changes
          </Button>
        )}
        <Button type="submit" loading={saving} disabled={!dirty || uploading}>
          Save settings
        </Button>
      </div>
    </form>
  );
}

function toValues(s = {}) {
  return {
    email: s.email || '',
    whatsapp: s.whatsapp || '',
    facebook: s.facebook || '',
    instagram: s.instagram || '',
    tiktok: s.tiktok || '',
    etsy: s.etsy || '',
    musicEnabled: Boolean(s.musicEnabled),
    musicTrack: s.musicTrack || DEFAULT_TRACK,
  };
}

function PasswordForm() {
  const formRef = useRef(null);
  const { saving, fieldErrors, setFieldErrors, run } = useSaving();
  const [values, setValues] = useState({ currentPassword: '', newPassword: '', confirm: '' });
  const set = (name) => (e) => setValues((v) => ({ ...v, [name]: e.target.value }));

  const submit = async (event) => {
    event.preventDefault();
    const errors = {};
    if (!values.currentPassword) errors.currentPassword = 'Enter your current password.';
    if (values.newPassword.length < 10) errors.newPassword = 'Use at least 10 characters.';
    else if (values.confirm !== values.newPassword) errors.confirm = 'The two new passwords don’t match.';
    if (Object.keys(errors).length) {
      setFieldErrors(errors);
      focusFirstInvalid(formRef.current);
      return;
    }
    const ok = await run(() => changePassword({ currentPassword: values.currentPassword, newPassword: values.newPassword }), {
      success: 'Password changed',
      onError: () => focusFirstInvalid(formRef.current),
    });
    if (ok) setValues({ currentPassword: '', newPassword: '', confirm: '' });
  };

  return (
    <form ref={formRef} onSubmit={submit} noValidate className="mt-16">
      <SettingsGroup title="Change password" description="The password you use to sign in here.">
        {/* Helps password managers pair the new password with the right account. */}
        <input type="email" name="username" autoComplete="username" hidden readOnly value="" />
        <Field label="Current password" type="password" autoComplete="current-password" value={values.currentPassword} onChange={set('currentPassword')} error={fieldErrors.currentPassword} />
        <Field label="New password" type="password" autoComplete="new-password" value={values.newPassword} onChange={set('newPassword')} error={fieldErrors.newPassword} hint="At least 10 characters." />
        <Field label="Repeat new password" type="password" autoComplete="new-password" value={values.confirm} onChange={set('confirm')} error={fieldErrors.confirm} />
        <div className="flex justify-center md:justify-end">
          <Button type="submit" loading={saving}>
            Change password
          </Button>
        </div>
      </SettingsGroup>
    </form>
  );
}
