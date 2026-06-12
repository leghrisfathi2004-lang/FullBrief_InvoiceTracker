export default function StatCard({ label, value, percentage, icon, color }) {
  return (
    <div className="stat-card" style={color ? { borderColor: color } : undefined}>
      {icon && <div className="stat-icon">{icon}</div>}
      <div className="stat-content">
        <span className="stat-label">{label}</span>
        <span className="stat-value">{value}</span>
        {percentage != null && (
          <span className="stat-pct">{percentage.toFixed(0)}%</span>
        )}
      </div>
    </div>
  );
}
