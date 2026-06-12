import Button from "../shared/Button";
import EmptyState from "../shared/EmptyState";
import { formatCurrency, formatDate } from "../../utils/format";

export default function PaymentTable({ payments = [], onEdit, onDelete }) {
  if (payments.length === 0) {
    return <EmptyState title="Aucun paiement" description="Ajoutez un paiement pour commencer." />;
  }

  return (
    <table className="data-table">
      <thead>
        <tr>
          <th>Montant</th>
          <th>Date</th>
          <th className="actions-col">Actions</th>
        </tr>
      </thead>
      <tbody>
        {payments.map((p) => (
          <tr key={p._id}>
            <td>{formatCurrency(p.amount)}</td>
            <td>{formatDate(p.payDate)}</td>
            <td className="actions-cell">
              <Button variant="ghost" onClick={() => onEdit?.(p)} aria-label="Modifier">
                ✏️
              </Button>
              <Button variant="ghost" onClick={() => onDelete?.(p)} aria-label="Supprimer">
                🗑️
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
