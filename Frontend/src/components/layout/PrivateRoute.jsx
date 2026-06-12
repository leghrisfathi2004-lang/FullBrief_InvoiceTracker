import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Spinner from "../shared/Spinner";

export default function PrivateRoute() {
  const { token, loading } = useAuth();

  if (loading) return <Spinner />;
  if (!token) return <Navigate to="/login" replace />;
  return <Outlet />;
}
