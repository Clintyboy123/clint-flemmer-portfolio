import { useId, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ChevronDown } from 'lucide-react';
import SchemaField from './SchemaField';
import { withDefaults } from './contentSchema';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import useSaving from '../../hooks/useSaving';
import { saveContent } from '../../services/content';
import { focusFirstInvalid } from '../../lib/dom';
import { duration, ease } from '../../motion';

// One content key (e.g. home.hero) as a collapsible form, saved on its own with PUT /admin/content/:key.
export default function ContentSection({ section, stored, onSaved, defaultOpen = false }) {
  const id = useId();
  const formRef = useRef(null);
  const [open, setOpen] = useState(defaultOpen);
  const initial = useMemo(() => withDefaults(section.fields, stored), [section.fields, stored]);
  const [value, setValue] = useState(initial);
  const [base, setBase] = useState(initial);
  const { saving, fieldErrors, run } = useSaving();
  const dirty = useMemo(() => JSON.stringify(value) !== JSON.stringify(base), [value, base]);

  const submit = async (event) => {
    event.preventDefault();
    const clean = withDefaults(section.fields, value);
    const saved = await run(() => saveContent(section.key, clean), {
      success: `${section.title} saved`,
      onError: () => focusFirstInvalid(formRef.current),
    });
    if (saved) {
      const next = withDefaults(section.fields, saved.data ?? clean);
      setValue(next);
      setBase(next);
      onSaved?.(section.key, saved.data ?? clean);
    }
  };

  return (
    <section className="border-b border-line" aria-labelledby={`${id}-title`}>
      <h3 id={`${id}-title`} className="m-0">
        <button
          type="button"
          aria-expanded={open}
          aria-controls={`${id}-panel`}
          onClick={() => setOpen((o) => !o)}
          className="group flex min-h-11 w-full flex-col items-center gap-2 py-6 text-center transition-colors duration-300 ease-out-soft hover:bg-soft md:flex-row md:gap-6 md:px-4 md:text-left"
        >
          <span className="flex-1">
            <span className="flex items-center justify-center gap-2 text-lead font-semibold tracking-heading md:justify-start">
              {section.title}
              {dirty && <Badge tone="accent">Unsaved</Badge>}
            </span>
            {section.description && <span className="mt-1 block text-meta font-normal text-muted">{section.description}</span>}
          </span>
          <ChevronDown
            className={`size-5 text-muted transition-transform duration-300 ease-out-soft ${open ? 'rotate-180' : ''}`}
            strokeWidth={1.75}
            aria-hidden="true"
          />
        </button>
      </h3>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={`${id}-panel`}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1, transition: { duration: duration.base, ease } }}
            exit={{ height: 0, opacity: 0, transition: { duration: duration.fast, ease } }}
            className="overflow-hidden"
          >
            <form ref={formRef} onSubmit={submit} noValidate className="flex flex-col gap-6 pt-2 pb-12 md:px-4">
              {section.fields.map((field) => (
                <SchemaField
                  key={field.key}
                  field={field}
                  value={value[field.key]}
                  onChange={(next) => setValue((v) => ({ ...v, [field.key]: next }))}
                  path={field.key}
                  errors={fieldErrors}
                />
              ))}
              <div className="flex flex-col-reverse items-center gap-2 border-t border-line pt-6 md:flex-row md:justify-end">
                {dirty && (
                  <Button variant="ghost" onClick={() => setValue(base)} disabled={saving}>
                    Discard changes
                  </Button>
                )}
                <Button type="submit" loading={saving} disabled={!dirty}>
                  Save {section.title.toLowerCase()}
                </Button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
