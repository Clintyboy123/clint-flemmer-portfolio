import { useId } from 'react';
import { ChevronDown } from 'lucide-react';
import FieldShell, { describedBy } from './FieldShell';
import { control, controlBorder } from './fieldStyles';

// options: [{ value, label }]
export default function Select({ label, hint, error, required, optional, options = [], className = '', id: givenId, ...props }) {
  const autoId = useId();
  const id = givenId || autoId;
  return (
    <FieldShell id={id} label={label} hint={hint} error={error} required={required} optional={optional} className={className}>
      <div className="relative">
        <select
          id={id}
          required={required}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy(id, hint, error)}
          className={`${control} ${controlBorder(error)} h-12 cursor-pointer appearance-none pr-12`}
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute top-1/2 right-4 size-4 -translate-y-1/2 text-muted" aria-hidden="true" />
      </div>
    </FieldShell>
  );
}
