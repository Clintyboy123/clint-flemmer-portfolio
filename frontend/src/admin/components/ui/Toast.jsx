import { AnimatePresence, motion } from 'motion/react';
import { CircleAlert, CircleCheck, X } from 'lucide-react';
import { toast as toastMotion } from '../../motion';

// Rendered once by ToastProvider. Polite live region for success, assertive for errors.
export default function Toaster({ toasts, onDismiss }) {
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-60 flex flex-col items-center gap-2 p-4 md:items-end md:p-8">
      <div aria-live="polite" role="status" className="flex w-full flex-col items-center gap-2 md:items-end">
        <ToastList toasts={toasts.filter((t) => t.tone === 'success')} onDismiss={onDismiss} />
      </div>
      <div aria-live="assertive" role="alert" className="flex w-full flex-col items-center gap-2 md:items-end">
        <ToastList toasts={toasts.filter((t) => t.tone === 'error')} onDismiss={onDismiss} />
      </div>
    </div>
  );
}

function ToastList({ toasts, onDismiss }) {
  return (
    <AnimatePresence initial={false}>
      {toasts.map((t) => {
        const Icon = t.tone === 'error' ? CircleAlert : CircleCheck;
        return (
          <motion.div
            key={t.id}
            layout
            {...toastMotion}
            className="pointer-events-auto flex w-full max-w-sm items-center gap-3 rounded-2xl bg-ink py-2 pr-2 pl-4 text-ui text-paper"
          >
            <Icon className={`size-5 shrink-0 ${t.tone === 'error' ? 'text-accent' : 'text-paper'}`} strokeWidth={1.75} aria-hidden="true" />
            <p className="flex-1 py-2 text-left">{t.message}</p>
            <button
              type="button"
              onClick={() => onDismiss(t.id)}
              aria-label="Dismiss"
              className="inline-flex size-11 shrink-0 items-center justify-center rounded-full text-paper/70 transition-colors duration-200 hover:text-paper"
            >
              <X className="size-4" aria-hidden="true" />
            </button>
          </motion.div>
        );
      })}
    </AnimatePresence>
  );
}
