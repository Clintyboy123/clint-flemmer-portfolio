import { ArrowDown, ArrowUp } from 'lucide-react';
import IconButton from './IconButton';

// Up / down controls for ordered lists. `name` makes the labels specific ("Move Branding up").
export default function ReorderButtons({ name, index, count, onMove, disabled = false }) {
  return (
    <div className="flex items-center" role="group" aria-label={`Reorder ${name}`}>
      <IconButton icon={ArrowUp} label={`Move ${name} up`} onClick={() => onMove(index, -1)} disabled={disabled || index === 0} />
      <IconButton icon={ArrowDown} label={`Move ${name} down`} onClick={() => onMove(index, 1)} disabled={disabled || index === count - 1} />
    </div>
  );
}
