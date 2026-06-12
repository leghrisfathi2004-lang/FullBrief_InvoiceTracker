import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  getInvoiceById,
  updateInvoice,
  deleteInvoice,
} from "../api/facteurAPI";
import { getPaymentsByInvoice, createPayment } from "../api/paymentAPI";
import PaymentTable from "../components/tables/PaymentTable";
import InvoiceForm from "../components/forms/InvoiceForm";
import PaymentForm from "../components/forms/PaymentForm";
import Modal from "../components/shared/Modal";
import ConfirmModal from "../components/shared/ConfirmModal";
import Button from "../components/shared/Button";
import StatCard from "../components/shared/StatCard";
import StatusBadge from "../components/shared/StatusBadge";
import Spinner from "../components/shared/Spinner";
import { formatCurrency, calcProgress } from "../utils/format";

export default function InvoiceDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [invoice, setInvoice] = useState(null);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [paymentModal, setPaymentModal] = useState({ open: false, payment: null });

  const fetchAll = () => {
    setLoading(true);
    Promise.all([
      getInvoiceById(id).then((r) => setInvoice(r.data)),
      getPaymentsByInvoice(id).then((r) => setPayments(r.data)),
    ]).finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (loading || !invoice) return <Spinner />;

  const totalPaid = payments.reduce((s, p) => s + p.amount, 0);
  const remaining = invoice.amount - totalPaid;
  const progress = calcProgress(invoice.amount, totalPaid);
  const isFullyPaid = invoice.status === "paid";

  const handleInvoiceUpdate = async (data) => {
    await updateInvoice(id, data);
    setEditOpen(false);
    fetchAll();
  };

  const handleInvoiceDelete = async () => {
    await deleteInvoice(id);
    navigate("/invoices");
  };

  const handlePaymentSubmit = async (data) => {
    await createPayment(id, data);
    setPaymentModal({ open: false, payment: null });
    fetchAll();
  };

  return (
    <div className="page">
      <Link to="/invoices" className="back-link">← Retour aux factures</Link>

      <header className="page-header page-header-row">
        <div>
          <div className="title-row">
            <h1>Facture #{invoice._id?.slice(-6).toUpperCase()}</h1>
            <StatusBadge status={invoice.status} />
          </div>
          <p className="muted">Fournisseur: {invoice.fournisseurId?.name || "—"}</p>
        </div>
        <div className="header-actions">
          <Button
            variant="secondary"
            onClick={() => setEditOpen(true)}
            disabled={isFullyPaid}
          >
            Modifier
          </Button>
          <Button
            variant="danger"
            onClick={() => setDeleteOpen(true)}
            disabled={invoice.status !== "unpaid"}
          >
            Supprimer
          </Button>
        </div>
      </header>

      <div className="stat-grid stat-grid-3">
        <StatCard label="Montant total" value={formatCurrency(invoice.amount)} />
        <StatCard label="Déjà payé" value={formatCurrency(totalPaid)} />
        <StatCard label="Reste à payer" value={formatCurrency(remaining)} />
      </div>

      <div className="card">
        <div className="progress-header">
          <span>Progression du paiement</span>
          <span className="muted">{Math.round(progress)}%</span>
        </div>
        <div className="progress-track">
          <div className="progress-fill" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <section className="page-section">
        <div className="section-header">
          <h2>Paiements</h2>
          {!isFullyPaid && (
            <Button onClick={() => setPaymentModal({ open: true, payment: null })}>
              + Ajouter un paiement
            </Button>
          )}
        </div>
        <PaymentTable payments={payments} />
      </section>

      <Modal
        isOpen={editOpen}
        onClose={() => setEditOpen(false)}
        title="Modifier la facture"
      >
        <InvoiceForm
          suppliers={[invoice.fournisseurId]}
          defaultValues={invoice}
          onSubmit={handleInvoiceUpdate}
        />
      </Modal>

      <Modal
        isOpen={paymentModal.open}
        onClose={() => setPaymentModal({ open: false, payment: null })}
        title="Ajouter un paiement"
      >
        <PaymentForm max={remaining} onSubmit={handlePaymentSubmit} />
      </Modal>

      <ConfirmModal
        isOpen={deleteOpen}
        onCancel={() => setDeleteOpen(false)}
        onConfirm={handleInvoiceDelete}
        title="Supprimer cette facture ?"
        message="Cette action est irréversible."
      />
    </div>
  );
}
