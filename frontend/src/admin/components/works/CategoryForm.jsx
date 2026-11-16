import { useRef, useState } from 'react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import Field from '../ui/Field';
import Textarea from '../ui/Textarea';
import Select from '../ui/Select';
import TagsInput from '../ui/TagsInput';
import useSaving from '../../hooks/useSaving';
import { createWorkCategory, updateWorkCategory } from '../../services/works';
import { slugify } from '../../lib/format';
import { focusFirstInvalid, isSlug } from '../../lib/dom';

const LAYOUTS = [
  { value: 'gallery', label: 'Gallery: images and videos' },
  { value: 'sites', label: 'Sites: websites with a live link' },
];

export default function CategoryForm({ category, open, onClose, onSaved }) {
  return (
    <Modal open={open} onClose={onClose} title={category ? 'Edit category' : 'New category'}>
      {open && <CategoryFormBody category={category} onClose={onClose} onSaved={onSaved} />}
    </Modal>
  );
}

function CategoryFormBody({ category, onClose, onSaved }) {
  const formRef = useRef(null);
  const { saving, fieldErrors, setFieldErrors, run } = useSaving();
  const [slugTouched, setSlugTouched] = useState(Boolean(category));
  const [values, setValues] = useState({
    name: category?.name || '',
    slug: category?.slug || '',
    intro: category?.intro || '',
    tags: category?.tags || [],
    layout: category?.layout || 'gallery',
  });

  const set = (name, value) => setValues((v) => ({ ...v, [name]: value, ...(name === 'name' && !slugTouched ? { slug: slugify(value) } : {}) }));

  const submit = async (event) => {
    event.preventDefault();
    const errors = {};
    if (!values.name.trim()) errors.name = 'Give the category a name.';
    if (!isSlug(values.slug)) errors.slug = 'Use lowercase letters, numbers and dashes only.';
    if (Object.keys(errors).length) {
      setFieldErrors(errors);
      focusFirstInvalid(formRef.current);
      return;
    }
    const body = { ...values, name: values.name.trim(), intro: values.intro.trim() };
    const saved = await run(() => (category ? updateWorkCategory(category.id, body) : createWorkCategory(body)), {
      success: category ? 'Category saved' : 'Category added',
      onError: () => focusFirstInvalid(formRef.current),
    });
    if (saved) onSaved();
  };

  return (
    <form ref={formRef} onSubmit={submit} noValidate className="flex flex-col gap-6">
      <Field label="Name" required value={values.name} onChange={(e) => set('name', e.target.value)} error={fieldErrors.name} data-autofocus />
      <Field
        label="Link name"
        required
        value={values.slug}
        onChange={(e) => {
          setSlugTouched(true);
          set('slug', e.target.value.toLowerCase());
        }}
        error={fieldErrors.slug}
        hint={`Used in links to this section: /works#${values.slug || 'name'}`}
        autoCapitalize="off"
        spellCheck={false}
      />
      <Textarea label="Intro" optional rows={3} value={values.intro} onChange={(e) => set('intro', e.target.value)} error={fieldErrors.intro} />
      <TagsInput label="Tags" optional value={values.tags} onChange={(tags) => set('tags', tags)} error={fieldErrors.tags} />
      <Select label="Layout" options={LAYOUTS} value={values.layout} onChange={(e) => set('layout', e.target.value)} error={fieldErrors.layout} />
      <div className="mt-2 flex flex-col-reverse gap-2 border-t border-line pt-6 md:flex-row md:justify-end">
        <Button variant="secondary" onClick={onClose} disabled={saving}>
          Cancel
        </Button>
        <Button type="submit" loading={saving}>
          {category ? 'Save category' : 'Add category'}
        </Button>
      </div>
    </form>
  );
}
