const OPTIONS = [
  { value: "all", label: "Toutes" },
  { value: "unpaid", label: "Impayées" },
  { value: "partially_paid", label: "Partielles" },
  { value: "paid", label: "Payées" },
];

export default function StatusFilter({ value, onChange }) {
  return (
    <div className="status-filter">
      {OPTIONS.map((opt) => (
        <button
          key={opt.value}
          className={`tab ${value === opt.value ? "tab-active" : ""}`}
          onClick={() => onChange(opt.value)}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
