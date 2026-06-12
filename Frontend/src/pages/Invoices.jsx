import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getAllInvoices,
  createInvoice,
  updateInvoice,
  deleteInvoice,
} from "../api/facteurAPI";
import { getAllSuppliers } from "../api/fournisseurAPI";
import InvoiceTable from "../components/tables/InvoiceTable";
import InvoiceForm from "../components/forms/InvoiceForm";
import Modal from "../components/shared/Modal";
import ConfirmModal from "../components/shared/ConfirmModal";
import Button from "../components/shared/Button";
import SearchBar from "../components/shared/SearchBar";
import StatusFilter from "../components/shared/StatusFilter";
import Spinner from "../components/shared/Spinner";

export default function Invoices() {
  const navigate = useNavigate();
  const [invoices, setInvoices] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("all");
  const [search, setSearch] = useState("");
  const [formModal, setFormModal] = useState({ open: false, invoice: null });
  const [deleteTarget, setDeleteTarget] = useState(null);

  const refetch = () => {
    setLoading(true);
    const filters = status !== "all" ? { status } : {};
    getAllInvoices(filters)
      .then((res) => setInvoices(res.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    refetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  useEffect(() => {
    getAllSuppliers().then((res) => setSuppliers(res.data));
  }, []);

  const list = Array.isArray(invoices) ? invoices : [];
  const filtered = list.filter((inv) =>
    (inv.fournisseurId?.name || "").toLowerCase().includes(search.toLowerCase())
  );

  const handleSubmit = async (data) => {
    if (formModal.invoice) {
      await updateInvoice(formModal.invoice._id, data);
    } else {
      await createInvoice(data);
    }
    setFormModal({ open: false, invoice: null });
    refetch();
  };

  const handleDelete = async () => {
    await deleteInvoice(deleteTarget._id);
    setDeleteTarget(null);
    refetch();
  };

  return (
    <div className="page">
      <header className="page-header page-header-row">
        <div>
          <h1>Factures</h1>
          <p className="muted">{list.length} facture(s)</p>
        </div>
        <Button onClick={() => setFormModal({ open: true, invoice: null })}>
          + Nouvelle facture
        </Button>
      </header>

      <div className="filter-row">
        <StatusFilter value={status} onChange={setStatus} />
        <SearchBar value={search} onChange={setSearch} placeholder="Rechercher un fournisseur..." />
      </div>

      {loading ? (
        <Spinner />
      ) : (
        <InvoiceTable
          invoices={filtered}
          showSupplier
          onRowClick={(inv) => navigate(`/invoices/${inv._id}`)}
          onEdit={(inv) => setFormModal({ open: true, invoice: inv })}
          onDelete={(inv) => setDeleteTarget(inv)}
        />
      )}

      <Modal
        isOpen={formModal.open}
        onClose={() => setFormModal({ open: false, invoice: null })}
        title={formModal.invoice ? "Modifier la facture" : "Nouvelle facture"}
      >
        <InvoiceForm
          suppliers={suppliers}
          defaultValues={formModal.invoice || undefined}
          onSubmit={handleSubmit}
        />
      </Modal>

      <ConfirmModal
        isOpen={!!deleteTarget}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Supprimer cette facture ?"
        message="Cette action est irréversible."
      />
    </div>
  );
}
