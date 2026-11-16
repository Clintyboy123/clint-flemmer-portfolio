import { useId, useRef } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'motion/react';
import { X } from 'lucide-react';
import useFocusTrap from '../../hooks/useFocusTrap';
import { backdrop, dialog } from '../../motion';
import IconButton from './IconButton';

// Accessible dialog: focus trapped, Escape closes, focus returns to the opener.
// `footer` sits in a sticky bar under the scrolling body.
export default function Modal({ open, onClose, title, description, children, footer, size = 'md', busy = false }) {
  return createPortal(
    <AnimatePresence>
      {open && (
        <ModalPanel onClose={onClose} title={title} description={description} footer={footer} size={size} busy={busy}>
          {children}
        </ModalPanel>
      )}
    </AnimatePresence>,
    document.body
  );
}

const widths = { sm: 'max-w-md', md: 'max-w-2xl' };

function ModalPanel({ onClose, title, description, children, footer, size, busy }) {
  const ref = useRef(null);
  const id = useId();
  const close = () => !busy && onClose();
  // Also locks the page behind the dialog while it's open (see useFocusTrap).
  useFocusTrap(ref, true, close);

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center md:items-center md:p-8">
      <motion.div {...backdrop} className="absolute inset-0 bg-ink/40" onClick={close} aria-hidden="true" />
      <motion.div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-labelledby={`${id}-title`}
        aria-describedby={description ? `${id}-desc` : undefined}
        tabIndex={-1}
        {...dialog}
        className={`relative flex max-h-[92dvh] w-full ${widths[size]} flex-col rounded-t-3xl bg-paper focus:outline-none md:rounded-3xl`}
      >
        <header className="flex items-start gap-4 border-b border-line px-6 py-4 md:px-8">
          <div className="flex-1 py-2 text-center md:text-left">
            <h2 id={`${id}-title`} className="text-section font-bold tracking-heading">
              {title}
            </h2>
            {description && (
              <p id={`${id}-desc`} className="mt-2 text-meta text-muted">
                {description}
              </p>
            )}
          </div>
          <IconButton icon={X} label="Close" onClick={close} disabled={busy} className="-mr-2" />
        </header>
        <div className="flex-1 overflow-y-auto px-6 py-8 md:px-8">{children}</div>
        {footer && <footer className="flex flex-col-reverse gap-2 border-t border-line px-6 py-4 md:flex-row md:justify-end md:px-8">{footer}</footer>}
      </motion.div>
    </div>
  );
}
