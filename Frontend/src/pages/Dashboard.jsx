import { useEffect, useState } from "react";
import { getDashboard } from "../api/dashboardAPI";
import { useAuth } from "../context/AuthContext";
import StatCard from "../components/shared/StatCard";
import Spinner from "../components/shared/Spinner";
import ErrorState from "../components/shared/ErrorState";
import { formatCurrency, formatDate } from "../utils/format";

export default function Dashboard() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getDashboard();
        setData(res.data);
      } catch {
        setError("Impossible de charger le tableau de bord");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <Spinner />;
  if (error) return <ErrorState message={error} />;

  const total = data.totalInvoices || 0;
  const pct = (n) => (total > 0 ? Math.round((n / total) * 100) : 0);

  return (
    <div className="page">
      <header className="page-header">
        <h1>Bonjour {user?.name || ""} 👋</h1>
        <p className="muted">Voici un aperçu de vos factures</p>
      </header>

      <div className="stat-grid">
        <StatCard label="Total factures" value={data.totalInvoices} />
        <StatCard label="Payées" value={data.paidInvoices} percentage={pct(data.paidInvoices)} />
        <StatCard label="Impayées" value={data.unpaidInvoices} percentage={pct(data.unpaidInvoices)} />
        <StatCard label="En retard" value={data.overdueInvoices} percentage={pct(data.overdueInvoices)} />
      </div>

      <div className="stat-grid stat-grid-2">
        <StatCard label="Total dépensé" value={formatCurrency(data.totalSpent)} />
        <StatCard label="Fournisseurs" value={data.supplierCount} />
      </div>

      <section className="card">
        <h2>Paiements récents</h2>
        {data.recentPayments?.length > 0 ? (
          <ul className="payment-list">
            {data.recentPayments.map((p, i) => (
              <li key={i} className="payment-list-item">
                <span>{formatCurrency(p.amount)}</span>
                <span className="muted">{formatDate(p.payDate)}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="muted">Aucun paiement récent.</p>
        )}
      </section>
    </div>
  );
}
