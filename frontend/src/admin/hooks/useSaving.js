import { useCallback, useState } from 'react';
import { useToast } from '../context/ToastContext';

// Wraps a save: tracks the busy state, collects field errors, and shows a toast for the outcome.
//   const { saving, fieldErrors, run } = useSaving();
//   run(() => saveThing(values), { success: 'Saved' }).then((ok) => ok && close());
export default function useSaving() {
  const toast = useToast();
  const [saving, setSaving] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});

  const run = useCallback(
    async (action, { success = 'Saved', onError } = {}) => {
      setSaving(true);
      setFieldErrors({});
      try {
        const result = await action();
        if (success) toast.success(success);
        return result ?? true;
      } catch (error) {
        setFieldErrors(error.fields || {});
        if (error.status !== 401) toast.error(error.message);
        onError?.(error);
        return false;
      } finally {
        setSaving(false);
      }
    },
    [toast]
  );

  return { saving, fieldErrors, setFieldErrors, run };
}
