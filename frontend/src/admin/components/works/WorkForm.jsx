import { useRef, useState } from 'react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import Field from '../ui/Field';
import Textarea from '../ui/Textarea';
import Select from '../ui/Select';
import FileUpload from '../ui/FileUpload';
import useSaving from '../../hooks/useSaving';
import useUploadCount from '../../hooks/useUploadCount';
import { createWork, updateWork } from '../../services/works';
import { focusFirstInvalid, isHttpUrl } from '../../lib/dom';

// Add or edit one work. `work` is null for a new one; `categoryId` preselects the category.
export default function WorkForm({ open, work, categoryId, categories, onClose, onSaved }) {
  const [uploading, setUploading] = useState(false);
  return (
    <Modal open={open} onClose={onClose} busy={uploading} title={work ? 'Edit work' : 'New work'}>
      {open && (
        <WorkFormBody work={work} categoryId={categoryId} categories={categories} onClose={onClose} onSaved={onSaved} onUploadingChange={setUploading} />
      )}
    </Modal>
  );
}

function WorkFormBody({ work, categoryId, categories, onClose, onSaved, onUploadingChange }) {
  const formRef = useRef(null);
  const { saving, fieldErrors, setFieldErrors, run } = useSaving();
  const [uploading, trackUpload] = useUploadCount(onUploadingChange);
  const [values, setValues] = useState({
    categoryId: String(work?.categoryId ?? categoryId ?? categories[0]?.id ?? ''),
    title: work?.title || '',
    description: work?.description || '',
    meta: work?.meta || '',
    image: work?.image || null,
    imageWidth: work?.imageWidth ?? null,
    imageHeight: work?.imageHeight ?? null,
    video: work?.video || null,
    url: work?.url || '',
  });

  const category = categories.find((c) => String(c.id) === values.categoryId);
  const isSites = category?.layout === 'sites';
  const set = (name, value) => setValues((v) => ({ ...v, [name]: value }));

  const submit = async (event) => {
    event.preventDefault();
    const errors = {};
    if (!values.categoryId) errors.categoryId = 'Choose a category.';
    if (!values.title.trim()) errors.title = 'Give the work a title.';
    if (!values.image) errors.image = 'Add an image. It is the thumbnail on the works page.';
    if (isSites && values.url.trim() && !isHttpUrl(values.url)) errors.url = 'Use a full address starting with https://';
    if (Object.keys(errors).length) {
      setFieldErrors(errors);
      focusFirstInvalid(formRef.current);
      return;
    }
    const body = {
      categoryId: Number(values.categoryId),
      title: values.title.trim(),
      description: values.description.trim(),
      meta: values.meta.trim(),
      image: values.image,
      imageWidth: values.imageWidth,
      imageHeight: values.imageHeight,
      video: values.video || null,
      url: isSites && values.url.trim() ? values.url.trim() : null,
    };
    const saved = await run(() => (work ? updateWork(work.id, body) : createWork(body)), {
      success: work ? 'Work saved' : 'Work added',
      onError: () => focusFirstInvalid(formRef.current),
    });
    if (saved) onSaved();
  };

  return (
    <form ref={formRef} onSubmit={submit} noValidate className="flex flex-col gap-6">
      <Select
        label="Category"
        required
        options={categories.map((c) => ({ value: String(c.id), label: c.name }))}
        value={values.categoryId}
        onChange={(e) => set('categoryId', e.target.value)}
        error={fieldErrors.categoryId}
      />
      <Field label="Title" required value={values.title} onChange={(e) => set('title', e.target.value)} error={fieldErrors.title} data-autofocus />
      <Field label="Meta" optional value={values.meta} onChange={(e) => set('meta', e.target.value)} error={fieldErrors.meta} hint="A short line under the title, e.g. client and year." />
      <Textarea label="Description" optional rows={4} value={values.description} onChange={(e) => set('description', e.target.value)} error={fieldErrors.description} />
      <FileUpload
        kind="image"
        label="Image"
        required
        value={values.image}
        error={fieldErrors.image}
        onBusyChange={trackUpload}
        onChange={(file) => setValues((v) => ({ ...v, image: file?.url || null, imageWidth: file?.width ?? null, imageHeight: file?.height ?? null }))}
      />
      <FileUpload
        kind="video"
        label="Video"
        optional
        hint="Plays in the lightbox when the work is opened."
        value={values.video}
        error={fieldErrors.video}
        onBusyChange={trackUpload}
        onChange={(file) => set('video', file?.url || null)}
      />
      {isSites && (
        <Field
          label="Live site"
          optional
          type="url"
          inputMode="url"
          placeholder="https://"
          value={values.url}
          onChange={(e) => set('url', e.target.value)}
          error={fieldErrors.url}
          hint="The website this work links to."
        />
      )}
      <div className="mt-2 flex flex-col-reverse gap-2 border-t border-line pt-6 md:flex-row md:justify-end">
        <Button variant="secondary" onClick={onClose} disabled={saving || uploading}>
          Cancel
        </Button>
        <Button type="submit" loading={saving} disabled={uploading}>
          {work ? 'Save work' : 'Add work'}
        </Button>
      </div>
    </form>
  );
}
