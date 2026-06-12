import { isOverdue } from "../../utils/format";

export default function OverdueBadge({ dueDate, status }) {
  if (!isOverdue(dueDate, status)) return null;
  return <span className="overdue-badge">En retard</span>;
}
