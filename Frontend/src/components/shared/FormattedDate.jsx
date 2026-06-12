import { formatDate } from "../../utils/format";

export default function FormattedDate({ value }) {
  return <span className="date">{formatDate(value)}</span>;
}
