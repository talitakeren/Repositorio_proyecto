import { createContext, useCallback, useEffect, useState } from "react";
import { authService } from "../services/authService.js";
import { getHomePathForRole } from "../utils/authRedirect.js";
import { AUTH_EVENTS, TOKEN_KEY } from "../config/api.js";

export const AuthContext = createContext(null);

/**
 * Provee el usuario autenticado, mantiene sincronía con cambios externos
 * (otra pestaña que cierra/inicia sesión, token caducado, 403 por rol) y
 * expone refresh manual.
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  /** Carga el perfil real del token actual. */
  const refresh = useCallback(async () => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) {
      setUser(null);
      return null;
    }
    try {
      const data = await authService.getMe();
      setUser(data);
      return data;
    } catch {
      authService.logout();
      setUser(null);
      return null;
    }
  }, []);

  // Carga inicial
  useEffect(() => {
    refresh().finally(() => setLoading(false));
  }, [refresh]);

  // Sincronía entre pestañas: si el token cambia en otra pestaña, reaccionamos.
  useEffect(() => {
    function onStorage(e) {
      if (e.key !== TOKEN_KEY) return;
      // Token eliminado en otra pestaña -> cerrar sesión local
      if (!e.newValue) {
        setUser(null);
        if (!window.location.pathname.startsWith("/login")) {
          window.location.href = "/login";
        }
        return;
      }
      // Token reemplazado en otra pestaña -> refrescar para tomar el nuevo usuario
      refresh();
    }
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [refresh]);

  // Reaccionar a 401/403 emitidos por axios.
  useEffect(() => {
    function onInvalid() {
      setUser(null);
      if (!window.location.pathname.startsWith("/login")) {
        window.location.href = "/login";
      }
    }
    function onForbidden() {
      // Re-sincroniza el usuario por si el rol cambió en backend o
      // si otra pestaña reemplazó el token con uno de otro rol.
      refresh();
    }
    window.addEventListener(AUTH_EVENTS.invalid, onInvalid);
    window.addEventListener(AUTH_EVENTS.forbidden, onForbidden);
    return () => {
      window.removeEventListener(AUTH_EVENTS.invalid, onInvalid);
      window.removeEventListener(AUTH_EVENTS.forbidden, onForbidden);
    };
  }, [refresh]);

  const login = async (email, password) => {
    const response = await authService.login(email, password);

    if (!response.success) {
      const err = new Error(response.message || "Credenciales incorrectas");
      err.response = { data: response };
      throw err;
    }

    localStorage.setItem(TOKEN_KEY, response.data.token);
    setUser(response.data.user);
    return response.data;
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  /** Actualiza datos locales sin volver a llamar a /me. */
  const updateLocalUser = (patch) => {
    setUser((prev) => (prev ? { ...prev, ...patch } : prev));
  };

  const homePath = user ? getHomePathForRole(user.role) : "/login";

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        refresh,
        updateLocalUser,
        homePath,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
