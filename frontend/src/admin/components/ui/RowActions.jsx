import { Pencil, Trash2 } from 'lucide-react';
import IconButton from './IconButton';
import ReorderButtons from './ReorderButtons';

// The edit / delete / move controls at the end of a list row or section header.
export default function RowActions({ name, index, count, onMove, onEdit, onDelete, deleteBlocked = false, moving = false }) {
  return (
    <div className="flex items-center justify-center">
      <IconButton icon={Pencil} label={`Edit ${name}`} onClick={onEdit} />
      <IconButton
        icon={Trash2}
        variant="danger"
        label={deleteBlocked ? `${name} can't be deleted yet` : `Delete ${name}`}
        aria-disabled={deleteBlocked || undefined}
        className={deleteBlocked ? 'opacity-30' : ''}
        onClick={onDelete}
      />
      <span className="mx-1 h-6 w-px bg-line" aria-hidden="true" />
      <ReorderButtons name={name} index={index} count={count} onMove={onMove} disabled={moving} />
    </div>
  );
}
