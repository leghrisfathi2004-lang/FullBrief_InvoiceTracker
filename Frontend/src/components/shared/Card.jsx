export default function Card({ title, action, children }) {
  return (
    <div className="card">
      {(title || action) && (
        <div className="card-header">
          {title && <h3>{title}</h3>}
          {action}
        </div>
      )}
      <div className="card-body">{children}</div>
    </div>
  );
}
