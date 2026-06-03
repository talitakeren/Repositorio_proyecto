import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.js";

/** Redirige a home si ya hay sesión (evita ver /login estando logueado) */
export default function GuestRoute({ children }) {
  const { user, loading, homePath } = useAuth();

  if (loading) {
    return (
      <div className="role-loading">
        <p>Cargando...</p>
      </div>
    );
  }

  if (user) {
    return <Navigate to={homePath} replace />;
  }

  return children;
}
