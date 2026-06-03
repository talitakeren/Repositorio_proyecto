import { useEffect, useState } from "react";
import Input from "../ui/Input.jsx";
import Select from "../ui/Select.jsx";

export const USER_FORM_ID = "user-form";

const ROLE_OPTIONS = [
  { value: "ADMIN", label: "Administrador" },
  { value: "TEACHER", label: "Docente" },
  { value: "STUDENT", label: "Alumno" },
];

/**
 * Formulario de creación y edición de usuarios para el admin.
 * En edición, el campo password es opcional (se cambia desde otro botón).
 */
export default function UserForm({ user, onSubmit, submitting = false }) {
  const isEdit = Boolean(user);
  const [form, setForm] = useState({
    name: "",
    email: "",
    role: "TEACHER",
    password: "",
    active: true,
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || "",
        email: user.email || "",
        role: user.role || "TEACHER",
        password: "",
        active: user.active !== false,
      });
    } else {
      setForm({
        name: "",
        email: "",
        role: "TEACHER",
        password: "",
        active: true,
      });
    }
    setErrors({});
  }, [user]);

  function set(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function validate() {
    const next = {};
    if (!form.name.trim()) next.name = "El nombre es obligatorio";
    if (!form.email.trim()) next.email = "El correo es obligatorio";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      next.email = "Formato de correo inválido";
    if (!isEdit) {
      if (!form.password) next.password = "La contraseña es obligatoria";
      else if (form.password.length < 6)
        next.password = "Mínimo 6 caracteres";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;
    const payload = {
      name: form.name.trim(),
      email: form.email.trim().toLowerCase(),
      role: form.role,
      active: form.active,
    };
    if (!isEdit) payload.password = form.password;
    onSubmit(payload);
  }

  return (
    <form id={USER_FORM_ID} onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input
          label="Nombre completo"
          name="name"
          value={form.name}
          onChange={(e) => set("name", e.target.value)}
          error={errors.name}
          placeholder="Ej. María Pérez"
        />
        <Input
          label="Correo institucional"
          name="email"
          type="email"
          value={form.email}
          onChange={(e) => set("email", e.target.value)}
          error={errors.email}
          placeholder="usuario@sgoha.edu"
        />
        <Select
          label="Rol"
          name="role"
          value={form.role}
          onChange={(e) => set("role", e.target.value)}
        >
          {ROLE_OPTIONS.map((r) => (
            <option key={r.value} value={r.value}>
              {r.label}
            </option>
          ))}
        </Select>

        {!isEdit && (
          <Input
            label="Contraseña inicial"
            name="password"
            type="password"
            value={form.password}
            onChange={(e) => set("password", e.target.value)}
            error={errors.password}
            placeholder="Mínimo 6 caracteres"
            autoComplete="new-password"
          />
        )}
      </div>

      {form.role === "TEACHER" && !isEdit && (
        <p className="rounded-lg bg-blue-50 px-3 py-2 text-xs text-blue-700">
          Se creará automáticamente un perfil docente vinculado a este usuario.
        </p>
      )}
      {form.role === "STUDENT" && !isEdit && (
        <p className="rounded-lg bg-blue-50 px-3 py-2 text-xs text-blue-700">
          Se creará automáticamente un perfil de alumno (con un código generado).
        </p>
      )}

      <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
        <input
          type="checkbox"
          checked={form.active}
          onChange={(e) => set("active", e.target.checked)}
          className="h-4 w-4 rounded border-slate-300 text-sgoha-secondary focus:ring-sgoha-secondary"
        />
        <span className="text-sm font-medium text-slate-700">
          Usuario activo (puede iniciar sesión)
        </span>
      </label>

      {/* Botón oculto para permitir submit con Enter incluso desde un modal con footer externo */}
      <button type="submit" className="hidden" disabled={submitting} />
    </form>
  );
}
