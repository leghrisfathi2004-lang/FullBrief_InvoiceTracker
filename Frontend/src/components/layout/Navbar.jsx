import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Button from "../shared/Button";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        InvoiceTracker
      </Link>
      <div className="navbar-links">
        <NavLink to="/">Dashboard</NavLink>
        <NavLink to="/suppliers">Fournisseurs</NavLink>
        <NavLink to="/invoices">Factures</NavLink>
      </div>
      <div className="navbar-user">
        {user && <span>{user.name}</span>}
        <Button variant="ghost" onClick={handleLogout}>
          Déconnexion
        </Button>
      </div>
    </nav>
  );
}
