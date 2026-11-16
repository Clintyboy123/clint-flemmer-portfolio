import { useId, useState } from 'react';
import { X } from 'lucide-react';
import FieldShell, { describedBy } from './FieldShell';
import { controlBorder } from './fieldStyles';

// A list of short words. Enter or comma adds one; Backspace in an empty input removes the last.
export default function TagsInput({ label, hint = 'Press Enter or comma to add.', error, value = [], onChange, optional, placeholder = 'Add a tag' }) {
  const id = useId();
  const [draft, setDraft] = useState('');

  const add = () => {
    const parts = draft
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t && !value.includes(t));
    if (parts.length) onChange([...value, ...parts]);
    setDraft('');
  };

  const onKeyDown = (event) => {
    if (event.key === 'Enter' || event.key === ',') {
      event.preventDefault();
      add();
    } else if (event.key === 'Backspace' && !draft && value.length) {
      onChange(value.slice(0, -1));
    }
  };

  return (
    <FieldShell id={id} label={label} hint={hint} error={error} optional={optional}>
      <div
        className={`flex min-h-12 w-full flex-wrap items-center gap-2 rounded-xl border bg-paper px-2 py-2 transition-colors duration-200 focus-within:border-ink ${controlBorder(error)}`}
      >
        {value.map((tag) => (
          <span key={tag} className="inline-flex h-8 items-center gap-1 rounded-full bg-soft pr-1 pl-3 text-meta text-ink">
            {tag}
            <button
              type="button"
              onClick={() => onChange(value.filter((t) => t !== tag))}
              aria-label={`Remove ${tag}`}
              className="inline-flex size-6 items-center justify-center rounded-full text-muted hover:bg-line hover:text-ink"
            >
              <X className="size-3.5" aria-hidden="true" />
            </button>
          </span>
        ))}
        <input
          id={id}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={onKeyDown}
          onBlur={add}
          placeholder={value.length ? '' : placeholder}
          aria-describedby={describedBy(id, hint, error)}
          className="h-8 min-w-32 flex-1 bg-transparent px-2 text-left text-body text-ink placeholder:text-muted/70 focus:outline-none"
        />
      </div>
    </FieldShell>
  );
}
