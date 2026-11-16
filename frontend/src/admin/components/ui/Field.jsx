import { useId } from 'react';
import FieldShell, { describedBy } from './FieldShell';
import { control, controlBorder } from './fieldStyles';

// Label + 48px input + hint + error.
export default function Field({ label, hint, error, required, optional, className = '', inputClassName = '', id: givenId, ...props }) {
  const autoId = useId();
  const id = givenId || autoId;
  return (
    <FieldShell id={id} label={label} hint={hint} error={error} required={required} optional={optional} className={className}>
      <input
        id={id}
        required={required}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(id, hint, error)}
        className={`${control} ${controlBorder(error)} h-12 ${inputClassName}`}
        {...props}
      />
    </FieldShell>
  );
}
