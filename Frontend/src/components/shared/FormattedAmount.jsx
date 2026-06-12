import { formatCurrency } from "../../utils/format";

export default function FormattedAmount({ value }) {
  return <span className="amount">{formatCurrency(value)}</span>;
}
