import Modal from './Modal';
import Button from './Button';

// A short explanation with a single "Got it" button (e.g. why something can't be deleted yet).
export default function InfoDialog({ open, onClose, title, message }) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      size="sm"
      footer={
        <Button onClick={onClose} data-autofocus>
          Got it
        </Button>
      }
    >
      <p className="text-center text-body text-muted md:text-left">{message}</p>
    </Modal>
  );
}
