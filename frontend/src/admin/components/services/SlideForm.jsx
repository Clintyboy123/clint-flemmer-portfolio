import { useRef, useState } from 'react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import Field from '../ui/Field';
import Textarea from '../ui/Textarea';
import Select from '../ui/Select';
import FileUpload from '../ui/FileUpload';
import useSaving from '../../hooks/useSaving';
import useUploadCount from '../../hooks/useUploadCount';
import { createSlide, updateSlide } from '../../services/slides';
import { focusFirstInvalid } from '../../lib/dom';

const CUSTOM = '__custom';

// Link targets: each works category, the main pages, or a custom path.
function linkOptions(categories) {
  return [
    ...categories.map((c) => ({ value: `/works#${c.slug}`, label: `Works: ${c.name}` })),
    { value: '/works', label: 'Works (whole page)' },
    { value: '/pricing', label: 'Pricing' },
    { value: '/contact', label: 'Contact' },
    { value: CUSTOM, label: 'Custom link…' },
  ];
}

export default function SlideForm({ slide, categories, open, onClose, onSaved }) {
  const [uploading, setUploading] = useState(false);
  return (
    <Modal open={open} onClose={onClose} busy={uploading} title={slide ? 'Edit slide' : 'New slide'}>
      {open && <Body slide={slide} categories={categories} onClose={onClose} onSaved={onSaved} onUploadingChange={setUploading} />}
    </Modal>
  );
}

function Body({ slide, categories, onClose, onSaved, onUploadingChange }) {
  const formRef = useRef(null);
  const options = linkOptions(categories);
  const { saving, fieldErrors, setFieldErrors, run } = useSaving();
  const [uploading, trackUpload] = useUploadCount(onUploadingChange);
  const initialLink = slide?.link ?? (categories[0] ? `/works#${categories[0].slug}` : '/works');
  const [choice, setChoice] = useState(options.some((o) => o.value === initialLink) ? initialLink : CUSTOM);
  const [values, setValues] = useState({
    title: slide?.title || '',
    text: slide?.text || '',
    tags: slide?.tags || '',
    image: slide?.image || null,
    video: slide?.video || null,
    link: initialLink,
    linkLabel: slide?.linkLabel ?? 'See the work',
  });
  const set = (name, value) => setValues((v) => ({ ...v, [name]: value }));

  const chooseLink = (value) => {
    setChoice(value);
    if (value !== CUSTOM) set('link', value);
  };

  const submit = async (event) => {
    event.preventDefault();
    const errors = {};
    if (!values.title.trim()) errors.title = 'Give the slide a title.';
    if (!values.image) errors.image = 'Add an image for the slide.';
    const link = values.link.trim();
    if (link && !/^(\/|https?:\/\/)/i.test(link)) errors.link = 'Start with / for a page on your site, or https:// for another site.';
    if (Object.keys(errors).length) {
      setFieldErrors(errors);
      focusFirstInvalid(formRef.current);
      return;
    }
    const body = {
      title: values.title.trim(),
      text: values.text.trim(),
      tags: values.tags.trim(),
      image: values.image,
      video: values.video || null,
      link,
      linkLabel: values.linkLabel.trim(),
    };
    const saved = await run(() => (slide ? updateSlide(slide.id, body) : createSlide(body)), {
      success: slide ? 'Slide saved' : 'Slide added',
      onError: () => focusFirstInvalid(formRef.current),
    });
    if (saved) onSaved();
  };

  return (
    <form ref={formRef} onSubmit={submit} noValidate className="flex flex-col gap-6">
      <Field label="Title" required value={values.title} onChange={(e) => set('title', e.target.value)} error={fieldErrors.title} data-autofocus />
      <Textarea label="Text" optional rows={3} value={values.text} onChange={(e) => set('text', e.target.value)} error={fieldErrors.text} />
      <Field
        label="Tags"
        optional
        value={values.tags}
        onChange={(e) => set('tags', e.target.value)}
        error={fieldErrors.tags}
        hint="One line, separated with a middle dot: Campaigns · Billboards · Print"
      />
      <FileUpload
        kind="image"
        label="Image"
        required
        value={values.image}
        error={fieldErrors.image}
        onBusyChange={trackUpload}
        onChange={(file) => set('image', file?.url || null)}
      />
      <FileUpload
        kind="video"
        label="Video"
        optional
        hint="Plays in place of the image."
        value={values.video}
        error={fieldErrors.video}
        onBusyChange={trackUpload}
        onChange={(file) => set('video', file?.url || null)}
      />
      <Select label="Button links to" options={options} value={choice} onChange={(e) => chooseLink(e.target.value)} error={choice === CUSTOM ? undefined : fieldErrors.link} />
      {choice === CUSTOM && (
        <Field
          label="Custom link"
          value={values.link}
          onChange={(e) => set('link', e.target.value)}
          error={fieldErrors.link}
          placeholder="/works#graphic"
          hint="A page on your site (/works#graphic) or a full address (https://…)."
          autoCapitalize="off"
          spellCheck={false}
        />
      )}
      <Field label="Button label" optional value={values.linkLabel} onChange={(e) => set('linkLabel', e.target.value)} error={fieldErrors.linkLabel} />
      <div className="mt-2 flex flex-col-reverse gap-2 border-t border-line pt-6 md:flex-row md:justify-end">
        <Button variant="secondary" onClick={onClose} disabled={saving || uploading}>
          Cancel
        </Button>
        <Button type="submit" loading={saving} disabled={uploading}>
          {slide ? 'Save slide' : 'Add slide'}
        </Button>
      </div>
    </form>
  );
}
