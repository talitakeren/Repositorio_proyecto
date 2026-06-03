import { useEffect, useState } from "react";
import { Save, KeyRound, ShieldCheck } from "lucide-react";
import PageHeader from "../../components/ui/PageHeader.jsx";
import Card from "../../components/ui/Card.jsx";
import Badge from "../../components/ui/Badge.jsx";
import Input from "../../components/ui/Input.jsx";
import Button from "../../components/ui/Button.jsx";
import { useAuth } from "../../hooks/useAuth.js";
import { authService } from "../../services/authService.js";
import { getInitials } from "../../utils/getInitials.js";

const ROLE_LABEL = {
  ADMIN: "Administrador",
  TEACHER: "Docente",
  STUDENT: "Alumno",
};
const ROLE_VARIANT = {
  ADMIN: "info",
  TEACHER: "success",
  STUDENT: "warning",
};

/**
 * Página "Mi cuenta" reutilizable para los tres roles.
 * Permite editar nombre/correo y cambiar la contraseña validando la actual.
 */
export default function AccountPage() {
  const { user, refresh } = useAuth();

  const [profile, setProfile] = useState({ name: "", email: "" });
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileMsg, setProfileMsg] = useState(null);
  const [profileError, setProfileError] = useState({});

  const [pwd, setPwd] = useState({ current: "", next: "", confirm: "" });
  const [savingPwd, setSavingPwd] = useState(false);
  const [pwdMsg, setPwdMsg] = useState(null);
  const [pwdError, setPwdError] = useState({});

  useEffect(() => {
    setProfile({ name: user?.name || "", email: user?.email || "" });
  }, [user?.name, user?.email]);

  function validateProfile() {
    const errs = {};
    if (!profile.name.trim()) errs.name = "El nombre es obligatorio";
    if (!profile.email.trim()) errs.email = "El correo es obligatorio";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profile.email))
      errs.email = "Formato de correo inválido";
    setProfileError(errs);
    return Object.keys(errs).length === 0;
  }

  async function saveProfile(e) {
    e.preventDefault();
    setProfileMsg(null);
    if (!validateProfile()) return;
    setSavingProfile(true);
    try {
      await authService.updateMyProfile({
        name: profile.name.trim(),
        email: profile.email.trim().toLowerCase(),
      });
      await refresh();
      setProfileMsg({ type: "success", text: "Datos actualizados correctamente." });
    } catch (err) {
      const text =
        err?.response?.data?.message ||
        "No se pudieron guardar los cambios.";
      setProfileMsg({ type: "error", text });
    } finally {
      setSavingProfile(false);
    }
  }

  function validatePassword() {
    const errs = {};
    if (!pwd.current) errs.current = "Ingresa tu contraseña actual";
    if (!pwd.next || pwd.next.length < 6)
      errs.next = "La nueva contraseña debe tener al menos 6 caracteres";
    if (pwd.next !== pwd.confirm)
      errs.confirm = "Las contraseñas no coinciden";
    setPwdError(errs);
    return Object.keys(errs).length === 0;
  }

  async function changePassword(e) {
    e.preventDefault();
    setPwdMsg(null);
    if (!validatePassword()) return;
    setSavingPwd(true);
    try {
      await authService.changeMyPassword(pwd.current, pwd.next);
      setPwd({ current: "", next: "", confirm: "" });
      setPwdMsg({ type: "success", text: "Contraseña actualizada." });
    } catch (err) {
      const text =
        err?.response?.data?.message ||
        "No se pudo cambiar la contraseña.";
      setPwdMsg({ type: "error", text });
    } finally {
      setSavingPwd(false);
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Mi cuenta"
        subtitle="Actualiza tus datos personales y tu contraseña de acceso."
      />

      <Card className="overflow-hidden">
        <div className="flex flex-col items-center gap-4 border-b border-slate-100 bg-gradient-to-br from-[#1E3A8A] to-[#172554] p-6 text-center text-white sm:flex-row sm:text-left">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/15 text-xl font-bold ring-2 ring-white/30">
            {getInitials(user?.name || "U")}
          </div>
          <div className="min-w-0">
            <h3 className="text-lg font-semibold">{user?.name}</h3>
            <p className="truncate text-sm text-blue-100/90">{user?.email}</p>
            <div className="mt-2 flex flex-wrap justify-center gap-2 sm:justify-start">
              <Badge variant={ROLE_VARIANT[user?.role] || "neutral"}>
                {ROLE_LABEL[user?.role] || "Usuario"}
              </Badge>
            </div>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="p-5 sm:p-6">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-sgoha-secondary" />
            <h3 className="text-base font-semibold text-slate-900">
              Datos personales
            </h3>
          </div>
          <p className="mt-1 text-sm text-slate-500">
            Cambios aquí se sincronizan con tu perfil académico cuando aplica.
          </p>

          <form onSubmit={saveProfile} className="mt-5 space-y-4">
            <Input
              label="Nombre completo"
              name="name"
              value={profile.name}
              onChange={(e) =>
                setProfile((p) => ({ ...p, name: e.target.value }))
              }
              error={profileError.name}
            />
            <Input
              label="Correo institucional"
              type="email"
              name="email"
              value={profile.email}
              onChange={(e) =>
                setProfile((p) => ({ ...p, email: e.target.value }))
              }
              error={profileError.email}
            />
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              {profileMsg && (
                <p
                  className={`text-sm font-medium ${
                    profileMsg.type === "error"
                      ? "text-red-600"
                      : "text-green-600"
                  }`}
                >
                  {profileMsg.text}
                </p>
              )}
              <Button
                type="submit"
                disabled={savingProfile}
                className="ml-auto"
              >
                <Save className="h-4 w-4" />
                {savingProfile ? "Guardando..." : "Guardar cambios"}
              </Button>
            </div>
          </form>
        </Card>

        <Card className="p-5 sm:p-6">
          <div className="flex items-center gap-2">
            <KeyRound className="h-5 w-5 text-sgoha-secondary" />
            <h3 className="text-base font-semibold text-slate-900">
              Cambiar contraseña
            </h3>
          </div>
          <p className="mt-1 text-sm text-slate-500">
            Necesitas tu contraseña actual para confirmar el cambio.
          </p>

          <form onSubmit={changePassword} className="mt-5 space-y-4">
            <Input
              label="Contraseña actual"
              type="password"
              autoComplete="current-password"
              value={pwd.current}
              onChange={(e) => setPwd((p) => ({ ...p, current: e.target.value }))}
              error={pwdError.current}
            />
            <Input
              label="Nueva contraseña"
              type="password"
              autoComplete="new-password"
              value={pwd.next}
              onChange={(e) => setPwd((p) => ({ ...p, next: e.target.value }))}
              error={pwdError.next}
              placeholder="Mínimo 6 caracteres"
            />
            <Input
              label="Confirmar nueva contraseña"
              type="password"
              autoComplete="new-password"
              value={pwd.confirm}
              onChange={(e) =>
                setPwd((p) => ({ ...p, confirm: e.target.value }))
              }
              error={pwdError.confirm}
            />
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              {pwdMsg && (
                <p
                  className={`text-sm font-medium ${
                    pwdMsg.type === "error"
                      ? "text-red-600"
                      : "text-green-600"
                  }`}
                >
                  {pwdMsg.text}
                </p>
              )}
              <Button type="submit" disabled={savingPwd} className="ml-auto">
                <KeyRound className="h-4 w-4" />
                {savingPwd ? "Guardando..." : "Actualizar contraseña"}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
