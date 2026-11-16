import { useId } from 'react';
import FieldShell, { describedBy } from './FieldShell';
import { control, controlBorder } from './fieldStyles';

export default function Textarea({ label, hint, error, required, optional, rows = 4, className = '', id: givenId, ...props }) {
  const autoId = useId();
  const id = givenId || autoId;
  return (
    <FieldShell id={id} label={label} hint={hint} error={error} required={required} optional={optional} className={className}>
      <textarea
        id={id}
        rows={rows}
        required={required}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(id, hint, error)}
        className={`${control} ${controlBorder(error)} block resize-y py-3 leading-relaxed`}
        {...props}
      />
    </FieldShell>
  );
}
