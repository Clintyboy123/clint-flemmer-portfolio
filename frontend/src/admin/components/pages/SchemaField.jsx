import { Plus, Trash2 } from 'lucide-react';
import Field from '../ui/Field';
import Textarea from '../ui/Textarea';
import IconButton from '../ui/IconButton';
import ReorderButtons from '../ui/ReorderButtons';
import Eyebrow from '../ui/Eyebrow';
import { move } from '../../hooks/useLocalList';
import { emptyValue, RICH_HINT } from './contentSchema';

// Renders one field from contentSchema.js. Lists and groups render their own fields recursively.
// `path` is the dotted key (e.g. "steps.0.title") used to match the API's field errors.
export default function SchemaField({ field, value, onChange, path, errors }) {
  const error = errors[path] || errors[`data.${path}`];
  const hint = [field.hint, field.rich && RICH_HINT].filter(Boolean).join(' ');

  switch (field.type) {
    case 'textarea':
      return <Textarea label={field.label} rows={field.rows || 3} value={value} onChange={(e) => onChange(e.target.value)} hint={hint || undefined} error={error} />;
    case 'number':
      return (
        <Field
          label={field.label}
          type="number"
          inputMode="numeric"
          min={field.min}
          max={field.max}
          value={value}
          onChange={(e) => onChange(e.target.value === '' ? '' : Number(e.target.value))}
          hint={hint || undefined}
          error={error}
          inputClassName="max-w-32"
        />
      );
    case 'strings':
      return <StringList field={field} value={value} onChange={onChange} path={path} errors={errors} hint={hint} />;
    case 'objects':
      return <ObjectList field={field} value={value} onChange={onChange} path={path} errors={errors} />;
    case 'group':
      return (
        <fieldset className="border-t border-line pt-6">
          <legend className="sr-only">{field.label}</legend>
          <Eyebrow as="p" className="mb-6 text-center md:text-left" aria-hidden="true">
            {field.label}
          </Eyebrow>
          <div className="flex flex-col gap-6">
            {field.fields.map((sub) => (
              <SchemaField
                key={sub.key}
                field={sub}
                value={value[sub.key]}
                onChange={(next) => onChange({ ...value, [sub.key]: next })}
                path={`${path}.${sub.key}`}
                errors={errors}
              />
            ))}
          </div>
        </fieldset>
      );
    default:
      return <Field label={field.label} value={value} onChange={(e) => onChange(e.target.value)} hint={hint || undefined} error={error} />;
  }
}

function ListShell({ label, hint, error, count, itemLabel, onAdd, children }) {
  return (
    <fieldset className="text-left">
      <legend className="mb-2 text-ui font-semibold text-ink">{label}</legend>
      {hint && <p className="mb-4 text-meta text-muted">{hint}</p>}
      {count === 0 && <p className="mb-4 text-meta text-muted">None yet.</p>}
      {children}
      {error && <p className="mt-2 text-meta font-medium text-danger">{error}</p>}
      <div className="mt-2 flex justify-center md:justify-start">
        <button
          type="button"
          onClick={onAdd}
          className="inline-flex h-11 items-center gap-2 rounded-full px-4 text-ui font-semibold text-ink transition-colors duration-300 ease-out-soft hover:bg-soft md:-ml-4"
        >
          <Plus className="size-4" strokeWidth={1.75} aria-hidden="true" />
          Add {itemLabel}
        </button>
      </div>
    </fieldset>
  );
}

// Short lines: one input per line, with move and remove buttons.
function StringList({ field, value, onChange, path, errors, hint }) {
  const items = value || [];
  const itemLabel = field.itemLabel || 'item';
  const update = (index, text) => onChange(items.map((v, i) => (i === index ? text : v)));
  const remove = (index) => onChange(items.filter((_, i) => i !== index));
  const moveItem = (index, delta) => onChange(move(items, index, delta));

  return (
    <ListShell label={field.label} hint={hint} error={errors[path]} count={items.length} itemLabel={itemLabel} onAdd={() => onChange([...items, ''])}>
      <ol className="flex flex-col gap-2">
          {items.map((item, index) => {
            const name = `${itemLabel} ${index + 1}`;
            const Control = field.multiline ? Textarea : Field;
            return (
              <li key={index} className="flex items-start gap-1">
                <Control
                  label={<span className="sr-only">{`${field.label}, ${name}`}</span>}
                  className="min-w-0 flex-1 [&>label]:mb-0"
                  rows={field.multiline ? 2 : undefined}
                  value={item}
                  onChange={(e) => update(index, e.target.value)}
                  error={errors[`${path}.${index}`]}
                />
                <div className="flex shrink-0 items-center pt-0.5">
                  <ReorderButtons name={name} index={index} count={items.length} onMove={moveItem} />
                  <IconButton icon={Trash2} variant="danger" label={`Remove ${name}`} onClick={() => remove(index)} />
                </div>
              </li>
            );
          })}
      </ol>
    </ListShell>
  );
}

// Small groups (process steps, skill groups, programs): each one a block with its own fields.
function ObjectList({ field, value, onChange, path, errors }) {
  const items = value || [];
  const itemLabel = field.itemLabel || 'item';
  const blank = () => Object.fromEntries(field.fields.map((f) => [f.key, emptyValue(f)]));
  const update = (index, next) => onChange(items.map((v, i) => (i === index ? next : v)));
  const remove = (index) => onChange(items.filter((_, i) => i !== index));
  const moveItem = (index, delta) => onChange(move(items, index, delta));

  return (
    <ListShell label={field.label} error={errors[path]} count={items.length} itemLabel={itemLabel} onAdd={() => onChange([...items, blank()])}>
      <ol className="flex flex-col gap-4">
          {items.map((item, index) => {
            const title = (field.titleKey && item[field.titleKey]) || `New ${itemLabel}`;
            const name = `${itemLabel} ${index + 1}`;
            return (
              <li key={index} className="rounded-2xl bg-soft p-4 md:p-6">
                <div className="mb-4 flex flex-col items-center gap-2 md:flex-row">
                  <p className="min-w-0 flex-1 truncate text-center text-ui font-semibold md:text-left">
                    <span className="text-muted">{String(index + 1).padStart(2, '0')}</span> {title}
                  </p>
                  <div className="flex items-center">
                    <ReorderButtons name={name} index={index} count={items.length} onMove={moveItem} />
                    <IconButton icon={Trash2} variant="danger" label={`Remove ${name}`} onClick={() => remove(index)} />
                  </div>
                </div>
                <div className="flex flex-col gap-6">
                  {field.fields.map((sub) => (
                    <SchemaField
                      key={sub.key}
                      field={sub}
                      value={item[sub.key]}
                      onChange={(next) => update(index, { ...item, [sub.key]: next })}
                      path={`${path}.${index}.${sub.key}`}
                      errors={errors}
                    />
                  ))}
                </div>
              </li>
            );
          })}
      </ol>
    </ListShell>
  );
}
