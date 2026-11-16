import Modal from './Modal';
import Button from './Button';

// "Are you sure?" for destructive actions. onConfirm may return a promise; the button shows busy until it settles.
export default function ConfirmDialog({ open, onClose, onConfirm, title, message, confirmLabel = 'Delete', busy = false }) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      size="sm"
      busy={busy}
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={busy} data-autofocus>
            Cancel
          </Button>
          <Button variant="danger" onClick={onConfirm} loading={busy}>
            {confirmLabel}
          </Button>
        </>
      }
    >
      <p className="text-center text-body text-muted md:text-left">{message}</p>
    </Modal>
  );
}
