import Modal from './Modal';
import Button from './Button';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  isDanger?: boolean;
}

export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Sí, Confirmar',
  cancelText = 'Cancelar',
  isDanger = true,
}: ConfirmModalProps) {
  const footer = (
    <div className="flex justify-end gap-3">
      <Button type="button" onClick={onClose}
        className="bg-surface-2 text-text hover:bg-surface border border-border shadow-none">
        {cancelText}
      </Button>
      <Button type="button"
        onClick={() => { onConfirm(); onClose(); }}
        className={isDanger ? 'bg-danger hover:bg-danger-hover text-white shadow-lg shadow-danger/20 border-0' : ''}>
        {confirmText}
      </Button>
    </div>
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm"
      title={isDanger ? `⚠️ ${title}` : title}
      footer={footer}>
      <div className="text-text-muted">
        {message}
      </div>
    </Modal>
  );
}
