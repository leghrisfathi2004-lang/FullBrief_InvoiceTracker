import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getAllSuppliers,
  createSupplier,
  updateSupplier,
  deleteSupplier,
} from "../api/fournisseurAPI";
import SupplierTable from "../components/tables/SupplierTable";
import SupplierForm from "../components/forms/SupplierForm";
import Modal from "../components/shared/Modal";
import ConfirmModal from "../components/shared/ConfirmModal";
import Button from "../components/shared/Button";
import SearchBar from "../components/shared/SearchBar";
import Spinner from "../components/shared/Spinner";

export default function Suppliers() {
  const navigate = useNavigate();
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [formModal, setFormModal] = useState({ open: false, supplier: null });
  const [deleteTarget, setDeleteTarget] = useState(null);

  const refetch = () => {
    setLoading(true);
    getAllSuppliers()
      .then((res) => setSuppliers(res.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    refetch();
  }, []);

  const list = Array.isArray(suppliers) ? suppliers : [];
  const filtered = list.filter((s) =>
    (s.name || "").toLowerCase().includes(search.toLowerCase())
  );

  const handleSubmit = async (data) => {
    if (formModal.supplier) {
      await updateSupplier(formModal.supplier._id, data);
    } else {
      await createSupplier(data);
    }
    setFormModal({ open: false, supplier: null });
    refetch();
  };

  const handleDelete = async () => {
    await deleteSupplier(deleteTarget._id);
    setDeleteTarget(null);
    refetch();
  };

  return (
    <div className="page">
      <header className="page-header page-header-row">
        <div>
          <h1>Fournisseurs</h1>
          <p className="muted">{list.length} fournisseur(s)</p>
        </div>
        <div className="header-actions">
          <SearchBar value={search} onChange={setSearch} />
          <Button onClick={() => setFormModal({ open: true, supplier: null })}>
            + Nouveau fournisseur
          </Button>
        </div>
      </header>

      {loading ? (
        <Spinner />
      ) : (
        <SupplierTable
          suppliers={filtered}
          onRowClick={(s) => navigate(`/suppliers/${s._id}`)}
          onEdit={(s) => setFormModal({ open: true, supplier: s })}
          onDelete={(s) => setDeleteTarget(s)}
        />
      )}

      <Modal
        isOpen={formModal.open}
        onClose={() => setFormModal({ open: false, supplier: null })}
        title={formModal.supplier ? "Modifier le fournisseur" : "Nouveau fournisseur"}
      >
        <SupplierForm
          defaultValues={formModal.supplier || undefined}
          onSubmit={handleSubmit}
        />
      </Modal>

      <ConfirmModal
        isOpen={!!deleteTarget}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Supprimer ce fournisseur ?"
        message="Cette action supprimera aussi toutes ses factures et paiements."
      />
    </div>
  );
}
