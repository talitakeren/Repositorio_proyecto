import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Mail,
  Lock,
  AlertCircle,
  ArrowRight,
  Eye,
  EyeOff,
  Shield,
  GraduationCap,
} from "lucide-react";
import { useAuth } from "../../hooks/useAuth.js";
import { getHomePathForRole } from "../../utils/authRedirect.js";
import "./LoginPage.css";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const HERO_DATE = new Date().toLocaleDateString("es-PE", {
  month: "long",
  day: "numeric",
  year: "numeric",
}).toUpperCase();

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  function validate() {
    const next = {};
    if (!email.trim()) {
      next.email = "Ingresa tu correo institucional.";
    } else if (!EMAIL_RE.test(email.trim())) {
      next.email = "Ingresa un correo válido.";
    }
    if (!password) {
      next.password = "Ingresa tu contraseña.";
    }
    setFieldErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    if (!validate()) return;

    setLoading(true);
    try {
      const data = await login(email.trim(), password);
      navigate(getHomePathForRole(data.user.role), { replace: true });
    } catch (err) {
      if (!err.response) {
        setError("No se pudo conectar con el servidor.");
      } else if (
        err.response.status === 401 ||
        err.response?.data?.message === "Credenciales incorrectas"
      ) {
        setError(
          "Credenciales incorrectas. Verifica tu correo y contraseña e inténtalo de nuevo."
        );
      } else {
        setError(err.response?.data?.message || "Error al iniciar sesión");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-page">
      <div className="login-page__left">
        <div className="login-page__content">
          <header className="login-brand">
            <div className="login-brand__logo-row">
              <div className="login-brand__icon" aria-hidden>
                <GraduationCap size={28} strokeWidth={2.2} />
              </div>
              <h1>SGOHA</h1>
            </div>
            <p>Sistema de Generación Óptima de Horarios Académicos</p>
          </header>

          <div className="login-card">
            <h2 className="login-card__title">Iniciar sesión</h2>
            <p className="login-card__subtitle">
              Ingresa con tu correo institucional
            </p>

            {error && (
              <div className="login-alert" role="alert">
                <AlertCircle size={18} strokeWidth={2} />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate>
              <div className="login-field">
                <label htmlFor="email">Correo institucional</label>
                <div className="login-input-wrap">
                  <Mail className="lucide" />
                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    placeholder="admin@sgoha.edu"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={fieldErrors.email ? "input-error" : ""}
                    disabled={loading}
                  />
                </div>
                {fieldErrors.email && (
                  <p className="login-field-error">{fieldErrors.email}</p>
                )}
              </div>

              <div className="login-field">
                <div className="login-field__row">
                  <label htmlFor="password">Contraseña</label>
                  <a
                    href="#"
                    className="login-field__link"
                    onClick={(e) => e.preventDefault()}
                  >
                    ¿Olvidaste tu contraseña?
                  </a>
                </div>
                <div className="login-input-wrap login-input-wrap--password">
                  <Lock className="lucide" />
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={fieldErrors.password ? "input-error" : ""}
                    disabled={loading}
                  />
                  <button
                    type="button"
                    className="login-toggle-pw"
                    onClick={() => setShowPassword((v) => !v)}
                    aria-label={
                      showPassword ? "Ocultar contraseña" : "Mostrar contraseña"
                    }
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {fieldErrors.password && (
                  <p className="login-field-error">{fieldErrors.password}</p>
                )}
              </div>

              <button type="submit" className="login-submit" disabled={loading}>
                {loading ? "Ingresando..." : "Iniciar sesión"}
                {!loading && <ArrowRight size={18} strokeWidth={2.5} />}
              </button>
            </form>
          </div>

          <p className="login-page__footer">
            <Shield size={16} />
            Acceso para administradores, docentes y estudiantes
          </p>
        </div>
      </div>

      <aside className="login-page__right" aria-hidden>
        <div className="login-hero-badge">
          <span className="login-hero-badge__dot" />
          Campus digital
        </div>

        <div className="login-page__hero-frame">
          <div className="login-page__hero">
            <img src="/login-hero.png" alt="" />
          </div>

          <div className="login-hero-card">
            <div className="login-hero-card__tabs">
              <span className="login-hero-card__tab" />
              <span className="login-hero-card__tab" />
            </div>
            <div className="login-hero-card__days">
              <span>S</span>
              <span>M</span>
              <span>T</span>
              <span>W</span>
              <span className="active">T</span>
              <span>F</span>
              <span>S</span>
            </div>
            <p className="login-hero-card__date">{HERO_DATE}</p>
            <span className="login-hero-card__btn login-hero-card__btn--primary">
              LOGIN
            </span>
            <span className="login-hero-card__btn login-hero-card__btn--ghost">
              CAMPUS RESOURCES
            </span>
            <span className="login-hero-card__btn login-hero-card__btn--ghost">
              HELP
            </span>
          </div>
        </div>
      </aside>
    </div>
  );
}
