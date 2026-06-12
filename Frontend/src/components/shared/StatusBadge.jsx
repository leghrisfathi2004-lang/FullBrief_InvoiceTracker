import { STATUS_COLORS, STATUS_LABELS } from "../../utils/statusColors";

export default function StatusBadge({ status }) {
  const colors = STATUS_COLORS[status] || STATUS_COLORS.unpaid;
  const label = STATUS_LABELS[status] || status;
  return (
    <span
      className="status-badge"
      style={{ backgroundColor: colors.bg, color: colors.text }}
    >
      {label}
    </span>
  );
}
