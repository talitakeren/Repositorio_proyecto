import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.js";
import { getHomePathForRole } from "../utils/authRedirect.js";

export default function RoleRoute({ roles, children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="role-loading">
        <p>Cargando...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!roles.includes(user.role)) {
    return <Navigate to={getHomePathForRole(user.role)} replace />;
  }

  return children;
}
