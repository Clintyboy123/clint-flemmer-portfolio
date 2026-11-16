import { useRef, useState } from 'react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import Field from '../ui/Field';
import Select from '../ui/Select';
import Toggle from '../ui/Toggle';
import useSaving from '../../hooks/useSaving';
import { createPriceItem, updatePriceItem } from '../../services/pricing';
import { formatPrice } from '../../lib/format';
import { focusFirstInvalid } from '../../lib/dom';

export default function PriceItemForm({ item, categoryId, categories, open, onClose, onSaved }) {
  return (
    <Modal open={open} onClose={onClose} title={item ? 'Edit price' : 'New price'}>
      {open && <Body item={item} categoryId={categoryId} categories={categories} onClose={onClose} onSaved={onSaved} />}
    </Modal>
  );
}

// "2 500", "R2500", "2,500" -> 2500. Empty -> null (quoted per project). Anything else -> NaN.
function parseAmount(text) {
  const cleaned = String(text).replace(/[R\s  ,]/gi, '');
  if (!cleaned) return null;
  return /^\d+$/.test(cleaned) ? Number(cleaned) : NaN;
}

function Body({ item, categoryId, categories, onClose, onSaved }) {
  const formRef = useRef(null);
  const { saving, fieldErrors, setFieldErrors, run } = useSaving();
  const [values, setValues] = useState({
    categoryId: String(item?.categoryId ?? categoryId ?? categories[0]?.id ?? ''),
    title: item?.title || '',
    detail: item?.detail || '',
    amount: item?.amount ?? '',
    isFrom: Boolean(item?.isFrom),
  });
  const set = (name, value) => setValues((v) => ({ ...v, [name]: value }));
  const amount = parseAmount(values.amount);
  const preview = Number.isNaN(amount) ? '' : formatPrice({ amount, isFrom: values.isFrom && amount !== null });

  const submit = async (event) => {
    event.preventDefault();
    const errors = {};
    if (!values.categoryId) errors.categoryId = 'Choose a category.';
    if (!values.title.trim()) errors.title = 'Give this price a title.';
    if (Number.isNaN(amount)) errors.amount = 'Use whole rands only, e.g. 2500. Leave it empty for "Quoted per project".';
    if (Object.keys(errors).length) {
      setFieldErrors(errors);
      focusFirstInvalid(formRef.current);
      return;
    }
    const body = {
      categoryId: Number(values.categoryId),
      title: values.title.trim(),
      detail: values.detail.trim(),
      amount,
      isFrom: amount === null ? false : values.isFrom,
    };
    const saved = await run(() => (item ? updatePriceItem(item.id, body) : createPriceItem(body)), {
      success: item ? 'Price saved' : 'Price added',
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
      <Field label="Detail" optional value={values.detail} onChange={(e) => set('detail', e.target.value)} error={fieldErrors.detail} hint="A short line about what's included." />
      <Field
        label="Amount in rand"
        optional
        inputMode="numeric"
        placeholder="e.g. 2500"
        value={values.amount}
        onChange={(e) => set('amount', e.target.value)}
        error={fieldErrors.amount}
        hint={preview ? `Shows on the site as: ${preview}` : 'Leave empty to show "Quoted per project".'}
      />
      <Toggle
        label='Show "From"'
        hint="For prices that start at this amount."
        checked={values.isFrom && amount !== null}
        disabled={amount === null || Number.isNaN(amount)}
        onChange={(checked) => set('isFrom', checked)}
      />
      <div className="mt-2 flex flex-col-reverse gap-2 border-t border-line pt-6 md:flex-row md:justify-end">
        <Button variant="secondary" onClick={onClose} disabled={saving}>
          Cancel
        </Button>
        <Button type="submit" loading={saving}>
          {item ? 'Save price' : 'Add price'}
        </Button>
      </div>
    </form>
  );
}
