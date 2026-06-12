import Button from "../shared/Button";
import EmptyState from "../shared/EmptyState";
import { formatDate } from "../../utils/format";

export default function SupplierTable({ suppliers = [], onRowClick, onEdit, onDelete }) {
  if (suppliers.length === 0) {
    return <EmptyState title="Aucun fournisseur" description="Créez votre premier fournisseur." />;
  }

  return (
    <table className="data-table">
      <thead>
        <tr>
          <th>Nom</th>
          <th>Créé le</th>
          <th>Factures</th>
          <th className="actions-col">Actions</th>
        </tr>
      </thead>
      <tbody>
        {suppliers.map((s) => (
          <tr key={s._id} onClick={() => onRowClick?.(s)} className="clickable-row">
            <td>{s.name}</td>
            <td>{formatDate(s.createdAt)}</td>
            <td>{s.invoiceCount ?? "—"}</td>
            <td onClick={(e) => e.stopPropagation()} className="actions-cell">
              <Button variant="ghost" onClick={() => onEdit?.(s)} aria-label="Modifier">
                ✏️
              </Button>
              <Button variant="ghost" onClick={() => onDelete?.(s)} aria-label="Supprimer">
                🗑️
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
