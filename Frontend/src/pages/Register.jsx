import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { register as apiRegister } from "../api/userAPI";
import AuthForm from "../components/forms/AuthForm";

export default function Register() {
  const { token, login } = useAuth();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  if (token) return <Navigate to="/" replace />;

  const handleSubmit = async ({ name, email, password }) => {
    setSubmitting(true);
    setError(null);
    try {
      await apiRegister({ name, email, password });
      await login({ email, password });
      navigate("/");
    } catch {
      setError("Inscription échouée");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>📊 Inscription</h1>
        <p className="auth-subtitle">Commencez à suivre vos factures</p>
        <AuthForm mode="register" onSubmit={handleSubmit} submitting={submitting} />
        {error && <p className="form-error">{error}</p>}
        <p className="auth-footer">
          Déjà un compte ? <Link to="/login">Connectez-vous</Link>
        </p>
      </div>
    </div>
  );
}
