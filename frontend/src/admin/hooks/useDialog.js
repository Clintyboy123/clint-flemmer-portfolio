import { useRef, useState } from 'react';

// Which dialog is open, plus the last one opened, so a closing dialog keeps its text
// while it animates out instead of going blank.
export default function useDialog() {
  const [dialog, setDialog] = useState(null);
  const last = useRef(null);
  if (dialog) last.current = dialog;
  return { dialog, shown: last.current || {}, open: setDialog, close: () => setDialog(null) };
}
