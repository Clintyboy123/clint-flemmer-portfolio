import { useRef, useState } from 'react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import Field from '../ui/Field';
import Textarea from '../ui/Textarea';
import useSaving from '../../hooks/useSaving';
import { createPriceCategory, updatePriceCategory } from '../../services/pricing';
import { slugify } from '../../lib/format';
import { focusFirstInvalid, isSlug } from '../../lib/dom';

export default function PriceCategoryForm({ category, open, onClose, onSaved }) {
  return (
    <Modal open={open} onClose={onClose} title={category ? 'Edit price category' : 'New price category'}>
      {open && <Body category={category} onClose={onClose} onSaved={onSaved} />}
    </Modal>
  );
}

function Body({ category, onClose, onSaved }) {
  const formRef = useRef(null);
  const { saving, fieldErrors, setFieldErrors, run } = useSaving();
  const [slugTouched, setSlugTouched] = useState(Boolean(category));
  const [values, setValues] = useState({ name: category?.name || '', slug: category?.slug || '', intro: category?.intro || '' });

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
    const body = { name: values.name.trim(), slug: values.slug, intro: values.intro.trim() };
    const saved = await run(() => (category ? updatePriceCategory(category.id, body) : createPriceCategory(body)), {
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
        hint="A short id for this section: lowercase letters, numbers and dashes."
        autoCapitalize="off"
        spellCheck={false}
      />
      <Textarea label="Intro" optional rows={3} value={values.intro} onChange={(e) => set('intro', e.target.value)} error={fieldErrors.intro} />
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
