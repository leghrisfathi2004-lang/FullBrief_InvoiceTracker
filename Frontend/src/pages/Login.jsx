import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import AuthForm from "../components/forms/AuthForm";

export default function Login() {
  const { token, login } = useAuth();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  if (token) return <Navigate to="/" replace />;

  const handleSubmit = async ({ email, password }) => {
    setSubmitting(true);
    setError(null);
    try {
      await login({ email, password });
      navigate("/");
    } catch {
      setError("Identifiants invalides");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>📊 Connexion</h1>
        <p className="auth-subtitle">Bienvenue dans InvoiceTracker</p>
        <AuthForm mode="login" onSubmit={handleSubmit} submitting={submitting} />
        {error && <p className="form-error">{error}</p>}
        <p className="auth-footer">
          Pas de compte ? <Link to="/register">Inscrivez-vous</Link>
        </p>
      </div>
    </div>
  );
}
