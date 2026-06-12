import Button from "../shared/Button";
import StatusBadge from "../shared/StatusBadge";
import OverdueBadge from "../shared/OverdueBadge";
import EmptyState from "../shared/EmptyState";
import { formatCurrency, formatDate } from "../../utils/format";

export default function InvoiceTable({
  invoices = [],
  showSupplier = true,
  onRowClick,
  onEdit,
  onDelete,
}) {
  if (invoices.length === 0) {
    return <EmptyState title="Aucune facture" description="Aucune facture à afficher." />;
  }

  return (
    <table className="data-table">
      <thead>
        <tr>
          {showSupplier && <th>Fournisseur</th>}
          <th>Montant</th>
          <th>Échéance</th>
          <th>Statut</th>
          <th className="actions-col">Actions</th>
        </tr>
      </thead>
      <tbody>
        {invoices.map((inv) => {
          const canEdit = inv.status !== "paid";
          const canDelete = inv.status === "unpaid";
          return (
            <tr key={inv._id} onClick={() => onRowClick?.(inv)} className="clickable-row">
              {showSupplier && <td>{inv.fournisseurId?.name || "—"}</td>}
              <td>{formatCurrency(inv.amount)}</td>
              <td>
                {formatDate(inv.dueDate)}
                <OverdueBadge dueDate={inv.dueDate} status={inv.status} />
              </td>
              <td>
                <StatusBadge status={inv.status} />
              </td>
              <td onClick={(e) => e.stopPropagation()} className="actions-cell">
                <Button
                  variant="ghost"
                  onClick={() => onEdit?.(inv)}
                  disabled={!canEdit}
                  title={canEdit ? "Modifier" : "Facture payée — non modifiable"}
                >
                  ✏️
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => onDelete?.(inv)}
                  disabled={!canDelete}
                  title={canDelete ? "Supprimer" : "Seules les factures impayées peuvent être supprimées"}
                >
                  🗑️
                </Button>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
