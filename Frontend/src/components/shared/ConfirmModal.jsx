import Modal from "./Modal";
import Button from "./Button";

export default function ConfirmModal({
  isOpen,
  onCancel,
  onConfirm,
  title = "Confirmer ?",
  message = "Cette action est irréversible.",
  confirmLabel = "Supprimer",
  cancelLabel = "Annuler",
  loading = false,
}) {
  return (
    <Modal isOpen={isOpen} onClose={onCancel} title={title}>
      <p className="confirm-message">{message}</p>
      <div className="confirm-actions">
        <Button variant="secondary" onClick={onCancel}>
          {cancelLabel}
        </Button>
        <Button variant="danger" onClick={onConfirm} loading={loading}>
          {confirmLabel}
        </Button>
      </div>
    </Modal>
  );
}
