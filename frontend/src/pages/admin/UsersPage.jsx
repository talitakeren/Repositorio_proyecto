import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  KeyRound,
  Power,
  Users as UsersIcon,
  ShieldCheck,
  UserRound,
  GraduationCap,
} from "lucide-react";
import PageHeader from "../../components/ui/PageHeader.jsx";
import Card from "../../components/ui/Card.jsx";
import Badge from "../../components/ui/Badge.jsx";
import Button from "../../components/ui/Button.jsx";
import Modal from "../../components/ui/Modal.jsx";
import EmptyState from "../../components/ui/EmptyState.jsx";
import StatCard from "../../components/ui/StatCard.jsx";
import UserForm, { USER_FORM_ID } from "../../components/forms/UserForm.jsx";
import ResetPasswordForm, {
  RESET_PASSWORD_FORM_ID,
} from "../../components/forms/ResetPasswordForm.jsx";
import { userService } from "../../services/userService.js";
import { useAuth } from "../../hooks/useAuth.js";
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

export default function UsersPage() {
  const { user: me } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [activeFilter, setActiveFilter] = useState("ALL");
  const [saving, setSaving] = useState(false);

  const [editing, setEditing] = useState(null);
  const [editorOpen, setEditorOpen] = useState(false);

  const [pwdTarget, setPwdTarget] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = useCallback((text, type = "success") => {
    setToast({ text, type });
    setTimeout(() => setToast(null), 3500);
  }, []);

  const load = useCallback(async () => {
    try {
      const data = await userService.list();
      setUsers(Array.isArray(data) ? data : []);
    } catch {
      showToast("No se pudieron cargar los usuarios", "error");
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    load();
  }, [load]);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return users.filter((u) => {
      if (roleFilter !== "ALL" && u.role !== roleFilter) return false;
      if (activeFilter === "true" && !u.active) return false;
      if (activeFilter === "false" && u.active) return false;
      if (!term) return true;
      return (
        u.name.toLowerCase().includes(term) ||
        u.email.toLowerCase().includes(term)
      );
    });
  }, [users, search, roleFilter, activeFilter]);

  const stats = useMemo(() => {
    const total = users.length;
    const admins = users.filter((u) => u.role === "ADMIN").length;
    const teachers = users.filter((u) => u.role === "TEACHER").length;
    const students = users.filter((u) => u.role === "STUDENT").length;
    return { total, admins, teachers, students };
  }, [users]);

  function openCreate() {
    setEditing(null);
    setEditorOpen(true);
  }
  function openEdit(u) {
    setEditing(u);
    setEditorOpen(true);
  }
  function closeEditor() {
    if (saving) return;
    setEditorOpen(false);
    setEditing(null);
  }

  function ensureAdmin() {
    if (me?.role !== "ADMIN") {
      showToast(
        `Tu sesión actual es ${ROLE_LABEL[me?.role] || "no autorizada"}. Inicia sesión como administrador para gestionar usuarios.`,
        "error"
      );
      return false;
    }
    return true;
  }

  async function handleSubmit(payload) {
    if (!ensureAdmin()) return;
    setSaving(true);
    try {
      if (editing) {
        await userService.update(editing._id || editing.id, payload);
        showToast("Usuario actualizado correctamente.");
      } else {
        await userService.create(payload);
        showToast("Usuario creado correctamente.");
      }
      setEditorOpen(false);
      setEditing(null);
      load();
    } catch (e) {
      const status = e?.response?.status;
      const msg =
        status === 403
          ? `Tu sesión actual no tiene permisos de administrador (rol: ${ROLE_LABEL[me?.role] || me?.role || "desconocido"}). Vuelve a iniciar sesión como admin.`
          : e?.response?.data?.message ||
            "No se pudo guardar el usuario. Revisa los datos.";
      showToast(msg, "error");
    } finally {
      setSaving(false);
    }
  }

  async function handleToggle(u) {
    if (!ensureAdmin()) return;
    try {
      await userService.toggle(u._id || u.id);
      showToast(
        `Usuario ${u.active ? "desactivado" : "activado"} correctamente.`
      );
      load();
    } catch {
      showToast("No se pudo actualizar el estado.", "error");
    }
  }

  async function handleDelete(u) {
    if (!ensureAdmin()) return;
    if (!window.confirm(`¿Eliminar al usuario ${u.name}?`)) return;
    try {
      await userService.remove(u._id || u.id);
      showToast("Usuario eliminado.");
      load();
    } catch (e) {
      const msg = e?.response?.data?.message || "No se pudo eliminar el usuario.";
      showToast(msg, "error");
    }
  }

  async function handleResetPassword(newPassword) {
    if (!ensureAdmin()) return;
    if (!pwdTarget) return;
    setSaving(true);
    try {
      await userService.resetPassword(
        pwdTarget._id || pwdTarget.id,
        newPassword
      );
      showToast("Contraseña restablecida.");
      setPwdTarget(null);
    } catch (e) {
      const msg =
        e?.response?.data?.message || "No se pudo cambiar la contraseña.";
      showToast(msg, "error");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      {toast && (
        <div
          className={`fixed left-4 right-4 top-[4.25rem] z-[60] rounded-lg px-4 py-3 text-center text-sm font-medium shadow-lg sm:left-auto sm:right-6 sm:top-20 sm:max-w-sm sm:text-left ${
            toast.type === "error"
              ? "bg-red-600 text-white"
              : "bg-green-600 text-white"
          }`}
        >
          {toast.text}
        </div>
      )}

      <PageHeader
        title="Gestión de usuarios"
        subtitle="Crea, edita y administra usuarios y roles del sistema."
      >
        <Button onClick={openCreate} className="w-full sm:w-auto">
          <Plus className="h-4 w-4" />
          Nuevo usuario
        </Button>
      </PageHeader>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard
          icon={UsersIcon}
          label="TOTAL USUARIOS"
          value={stats.total}
          hint="Cuentas registradas"
        />
        <StatCard
          icon={ShieldCheck}
          label="ADMINISTRADORES"
          value={stats.admins}
          accent="blue"
        />
        <StatCard
          icon={UserRound}
          label="DOCENTES"
          value={stats.teachers}
          accent="green"
        />
        <StatCard
          icon={GraduationCap}
          label="ALUMNOS"
          value={stats.students}
          accent="amber"
        />
      </div>

      <Card className="overflow-hidden">
        <div className="space-y-3 border-b border-slate-100 p-4 lg:p-5">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              placeholder="Buscar por nombre o correo..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm"
            >
              <option value="ALL">Todos los roles</option>
              <option value="ADMIN">Administradores</option>
              <option value="TEACHER">Docentes</option>
              <option value="STUDENT">Alumnos</option>
            </select>
            <select
              value={activeFilter}
              onChange={(e) => setActiveFilter(e.target.value)}
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm"
            >
              <option value="ALL">Activos e inactivos</option>
              <option value="true">Solo activos</option>
              <option value="false">Solo inactivos</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="flex min-h-[240px] items-center justify-center text-slate-500">
            Cargando usuarios...
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={UsersIcon}
            title="Sin usuarios"
            description="No hay usuarios que coincidan con tus filtros."
          />
        ) : (
          <>
            <div className="divide-y divide-slate-100 lg:hidden">
              {filtered.map((u) => (
                <UserCard
                  key={u._id || u.id}
                  user={u}
                  isMe={String(me?.id) === String(u._id || u.id)}
                  onEdit={() => openEdit(u)}
                  onToggle={() => handleToggle(u)}
                  onDelete={() => handleDelete(u)}
                  onResetPwd={() => setPwdTarget(u)}
                />
              ))}
            </div>
            <div className="hidden overflow-x-auto lg:block">
              <table className="w-full min-w-[820px] text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/80 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    <th className="px-5 py-3">Usuario</th>
                    <th className="px-5 py-3">Correo</th>
                    <th className="px-5 py-3">Rol</th>
                    <th className="px-5 py-3">Estado</th>
                    <th className="px-5 py-3 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filtered.map((u) => {
                    const isMe = String(me?.id) === String(u._id || u.id);
                    return (
                      <tr key={u._id || u.id} className="hover:bg-slate-50/80">
                        <td className="px-5 py-3">
                          <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-sgoha-primary text-xs font-bold text-white">
                              {getInitials(u.name)}
                            </div>
                            <div className="min-w-0">
                              <p className="truncate font-semibold text-slate-900">
                                {u.name}
                                {isMe && (
                                  <span className="ml-2 rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-semibold text-blue-700">
                                    Tú
                                  </span>
                                )}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-3 text-slate-600">{u.email}</td>
                        <td className="px-5 py-3">
                          <Badge variant={ROLE_VARIANT[u.role] || "neutral"}>
                            {ROLE_LABEL[u.role] || u.role}
                          </Badge>
                        </td>
                        <td className="px-5 py-3">
                          <Badge variant={u.active ? "success" : "neutral"}>
                            {u.active ? "Activo" : "Inactivo"}
                          </Badge>
                        </td>
                        <td className="px-5 py-3">
                          <div className="flex justify-end gap-1">
                            <IconBtn
                              title="Editar"
                              onClick={() => openEdit(u)}
                              icon={Pencil}
                            />
                            <IconBtn
                              title="Restablecer contraseña"
                              onClick={() => setPwdTarget(u)}
                              icon={KeyRound}
                            />
                            <IconBtn
                              title={u.active ? "Desactivar" : "Activar"}
                              onClick={() => handleToggle(u)}
                              icon={Power}
                              danger={!u.active ? false : true}
                            />
                            <IconBtn
                              title="Eliminar"
                              onClick={() => handleDelete(u)}
                              icon={Trash2}
                              danger
                              disabled={isMe}
                            />
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}
      </Card>

      <Modal
        open={editorOpen}
        onClose={closeEditor}
        size="lg"
        title={editing ? "Editar usuario" : "Nuevo usuario"}
        subtitle={
          editing
            ? "Actualiza los datos básicos y el rol del usuario."
            : "Crea una nueva cuenta para acceder al sistema."
        }
        footer={
          <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
            <Button variant="secondary" onClick={closeEditor} disabled={saving}>
              Cancelar
            </Button>
            <button
              type="submit"
              form={USER_FORM_ID}
              disabled={saving}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-sgoha-primary px-4 py-2 text-sm font-semibold text-white shadow-md hover:bg-blue-900 disabled:opacity-60"
            >
              {saving
                ? "Guardando..."
                : editing
                  ? "Guardar cambios"
                  : "Crear usuario"}
            </button>
          </div>
        }
      >
        <UserForm
          user={editing}
          onSubmit={handleSubmit}
          submitting={saving}
        />
      </Modal>

      <Modal
        open={Boolean(pwdTarget)}
        onClose={() => (!saving ? setPwdTarget(null) : null)}
        size="md"
        title="Restablecer contraseña"
        subtitle="Define una nueva contraseña para este usuario."
        footer={
          <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
            <Button
              variant="secondary"
              onClick={() => setPwdTarget(null)}
              disabled={saving}
            >
              Cancelar
            </Button>
            <button
              type="submit"
              form={RESET_PASSWORD_FORM_ID}
              disabled={saving}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-sgoha-primary px-4 py-2 text-sm font-semibold text-white shadow-md hover:bg-blue-900 disabled:opacity-60"
            >
              {saving ? "Guardando..." : "Guardar contraseña"}
            </button>
          </div>
        }
      >
        <ResetPasswordForm
          user={pwdTarget}
          onSubmit={handleResetPassword}
          submitting={saving}
        />
      </Modal>
    </div>
  );
}

function UserCard({ user, isMe, onEdit, onToggle, onDelete, onResetPwd }) {
  return (
    <article className="space-y-3 p-4">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-sgoha-primary text-sm font-bold text-white">
          {getInitials(user.name)}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate font-semibold text-slate-900">
            {user.name}
            {isMe && (
              <span className="ml-2 rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-semibold text-blue-700">
                Tú
              </span>
            )}
          </p>
          <p className="truncate text-xs text-slate-500">{user.email}</p>
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        <Badge variant={ROLE_VARIANT[user.role] || "neutral"}>
          {ROLE_LABEL[user.role] || user.role}
        </Badge>
        <Badge variant={user.active ? "success" : "neutral"}>
          {user.active ? "Activo" : "Inactivo"}
        </Badge>
      </div>
      <div className="flex flex-wrap gap-2">
        <IconBtn title="Editar" onClick={onEdit} icon={Pencil} />
        <IconBtn title="Contraseña" onClick={onResetPwd} icon={KeyRound} />
        <IconBtn title="Activar/Desactivar" onClick={onToggle} icon={Power} />
        <IconBtn
          title="Eliminar"
          onClick={onDelete}
          icon={Trash2}
          danger
          disabled={isMe}
        />
      </div>
    </article>
  );
}

function IconBtn({ icon: Icon, danger, disabled, title, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`rounded-lg p-2 transition disabled:opacity-40 ${
        danger
          ? "text-slate-500 hover:bg-red-50 hover:text-red-600"
          : "text-slate-500 hover:bg-slate-100 hover:text-sgoha-primary"
      }`}
    >
      <Icon className="h-4 w-4" />
    </button>
  );
}
