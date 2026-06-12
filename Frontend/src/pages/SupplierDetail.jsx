import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  getSupplierById,
  updateSupplier,
  deleteSupplier,
} from "../api/fournisseurAPI";
import {
  getAllInvoices,
  createInvoice,
  updateInvoice,
  deleteInvoice,
} from "../api/facteurAPI";
import InvoiceTable from "../components/tables/InvoiceTable";
import SupplierForm from "../components/forms/SupplierForm";
import InvoiceForm from "../components/forms/InvoiceForm";
import Modal from "../components/shared/Modal";
import ConfirmModal from "../components/shared/ConfirmModal";
import Button from "../components/shared/Button";
import StatCard from "../components/shared/StatCard";
import Spinner from "../components/shared/Spinner";
import { formatCurrency } from "../utils/format";

export default function SupplierDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [supplier, setSupplier] = useState(null);
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [invoiceModal, setInvoiceModal] = useState({ open: false, invoice: null });
  const [invoiceToDelete, setInvoiceToDelete] = useState(null);

  const fetchAll = () => {
    setLoading(true);
    Promise.all([
      getSupplierById(id).then((r) => setSupplier(r.data)),
      getAllInvoices({ fournisseurId: id }).then((r) => setInvoices(r.data)),
    ]).finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (loading || !supplier) return <Spinner />;

  const totalInvoiced = invoices.reduce((s, i) => s + i.amount, 0);
  const totalPaid = invoices.reduce(
    (s, i) => s + (i.paiments ?? []).reduce((a, p) => a + p.amount, 0),
    0
  );

  const handleSupplierUpdate = async (data) => {
    await updateSupplier(id, data);
    setEditOpen(false);
    fetchAll();
  };

  const handleSupplierDelete = async () => {
    await deleteSupplier(id);
    navigate("/suppliers");
  };

  const handleInvoiceSubmit = async (data) => {
    if (invoiceModal.invoice) {
      await updateInvoice(invoiceModal.invoice._id, data);
    } else {
      await createInvoice({ ...data, fournisseurId: id });
    }
    setInvoiceModal({ open: false, invoice: null });
    fetchAll();
  };

  const handleInvoiceDelete = async () => {
    await deleteInvoice(invoiceToDelete._id);
    setInvoiceToDelete(null);
    fetchAll();
  };

  return (
    <div className="page">
      <Link to="/suppliers" className="back-link">← Retour aux fournisseurs</Link>

      <header className="page-header page-header-row">
        <div>
          <h1>{supplier.name}</h1>
          <p className="muted">{invoices.length} facture(s)</p>
        </div>
        <div className="header-actions">
          <Button variant="secondary" onClick={() => setEditOpen(true)}>
            Modifier
          </Button>
          <Button variant="danger" onClick={() => setDeleteOpen(true)}>
            Supprimer
          </Button>
        </div>
      </header>

      <div className="stat-grid stat-grid-3">
        <StatCard label="Total facturé" value={formatCurrency(totalInvoiced)} />
        <StatCard label="Total payé" value={formatCurrency(totalPaid)} />
        <StatCard label="Factures" value={invoices.length} />
      </div>

      <section className="page-section">
        <div className="section-header">
          <h2>Factures</h2>
          <Button onClick={() => setInvoiceModal({ open: true, invoice: null })}>
            + Nouvelle facture
          </Button>
        </div>
        <InvoiceTable
          invoices={invoices}
          showSupplier={false}
          onRowClick={(inv) => navigate(`/invoices/${inv._id}`)}
          onEdit={(inv) => setInvoiceModal({ open: true, invoice: inv })}
          onDelete={(inv) => setInvoiceToDelete(inv)}
        />
      </section>

      <Modal
        isOpen={editOpen}
        onClose={() => setEditOpen(false)}
        title="Modifier le fournisseur"
      >
        <SupplierForm defaultValues={supplier} onSubmit={handleSupplierUpdate} />
      </Modal>

      <Modal
        isOpen={invoiceModal.open}
        onClose={() => setInvoiceModal({ open: false, invoice: null })}
        title={invoiceModal.invoice ? "Modifier la facture" : "Nouvelle facture"}
      >
        <InvoiceForm
          suppliers={[supplier]}
          defaultValues={invoiceModal.invoice || { fournisseurId: id }}
          onSubmit={handleInvoiceSubmit}
        />
      </Modal>

      <ConfirmModal
        isOpen={deleteOpen}
        onCancel={() => setDeleteOpen(false)}
        onConfirm={handleSupplierDelete}
        title="Supprimer ce fournisseur ?"
        message="Cette action supprimera aussi toutes ses factures et paiements."
      />

      <ConfirmModal
        isOpen={!!invoiceToDelete}
        onCancel={() => setInvoiceToDelete(null)}
        onConfirm={handleInvoiceDelete}
        title="Supprimer cette facture ?"
        message="Cette action est irréversible."
      />
    </div>
  );
}
