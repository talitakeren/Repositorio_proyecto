import { useEffect, useState } from "react";
import { AlertTriangle, Info } from "lucide-react";
import Input from "../ui/Input.jsx";
import Select from "../ui/Select.jsx";
import {
  CLASSROOM_TYPE_OPTIONS,
  CLASSROOM_STATUS_OPTIONS,
} from "../../utils/classroomLabels.js";

export const CLASSROOM_FORM_ID = "classroom-form";

/**
 * Formulario de aula. Comparte estructura con el modal del módulo: emite
 * `onSubmit(payload)` y opcionalmente puede ser embebido sin botones
 * internos (footer del Modal).
 */
export default function ClassroomForm({
  classroom,
  onSubmit,
  submitting = false,
}) {
  const isEdit = Boolean(classroom);
  const [form, setForm] = useState({
    code: "",
    type: "STANDARD",
    capacity: "",
    location: "",
    status: "AVAILABLE",
    active: true,
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (classroom) {
      setForm({
        code: classroom.code || "",
        type: classroom.type || "STANDARD",
        capacity:
          classroom.capacity !== undefined && classroom.capacity !== null
            ? String(classroom.capacity)
            : "",
        location: classroom.location || "",
        status: classroom.status || "AVAILABLE",
        active: classroom.active !== false,
      });
    } else {
      setForm({
        code: "",
        type: "STANDARD",
        capacity: "",
        location: "",
        status: "AVAILABLE",
        active: true,
      });
    }
    setErrors({});
  }, [classroom]);

  function set(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function validate() {
    const next = {};
    if (!form.code.trim()) next.code = "El código del aula es obligatorio.";
    if (!form.type) next.type = "Selecciona el tipo de aula.";
    if (form.capacity === "" || form.capacity === null)
      next.capacity = "La capacidad es obligatoria.";
    else if (!Number.isFinite(Number(form.capacity)) || Number(form.capacity) <= 0)
      next.capacity = "La capacidad debe ser mayor a 0.";
    if (!form.status) next.status = "Selecciona el estado del aula.";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;
    onSubmit({
      code: form.code.trim().toUpperCase(),
      type: form.type,
      capacity: Number(form.capacity),
      location: form.location.trim(),
      status: form.status,
      active: form.active,
    });
  }

  const showInactiveWarning = !form.active || form.status === "INACTIVE";
  const showMaintenanceWarning = form.status === "MAINTENANCE";

  return (
    <form id={CLASSROOM_FORM_ID} onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Input
          label="Código del aula"
          name="code"
          value={form.code}
          onChange={(e) => set("code", e.target.value)}
          error={errors.code}
          placeholder="Ej. A-101"
          autoComplete="off"
        />
        <Select
          label="Tipo de aula"
          name="type"
          value={form.type}
          onChange={(e) => set("type", e.target.value)}
          error={errors.type}
        >
          {CLASSROOM_TYPE_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </Select>
        <Input
          label="Capacidad (estudiantes)"
          name="capacity"
          type="number"
          min={1}
          value={form.capacity}
          onChange={(e) => set("capacity", e.target.value)}
          error={errors.capacity}
          placeholder="Ej. 40"
        />
        <Input
          label="Ubicación"
          name="location"
          value={form.location}
          onChange={(e) => set("location", e.target.value)}
          placeholder="Ej. Pabellón A - Piso 1"
        />
        <Select
          label="Estado operativo"
          name="status"
          value={form.status}
          onChange={(e) => set("status", e.target.value)}
          error={errors.status}
          className="md:col-span-2"
        >
          {CLASSROOM_STATUS_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </Select>
      </div>

      <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
        <input
          type="checkbox"
          checked={form.active}
          onChange={(e) => set("active", e.target.checked)}
          className="h-4 w-4 rounded border-slate-300 text-sgoha-secondary focus:ring-sgoha-secondary"
        />
        <span className="text-sm font-medium text-slate-700">
          Habilitada para asignación de horarios
        </span>
      </label>

      <div className="rounded-xl bg-blue-50 px-3 py-2 text-xs text-blue-700">
        <p className="flex items-start gap-2">
          <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />
          El tipo de aula y la capacidad serán usados por el motor CSP para
          validar compatibilidad con los cursos (
          <strong>classroomTypeRequired</strong>) y el número de estudiantes
          matriculados.
        </p>
      </div>

      {showInactiveWarning && (
        <p className="flex items-start gap-2 rounded-xl bg-slate-50 px-3 py-2 text-xs font-medium text-slate-600">
          <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
          Un aula inactiva no será considerada para la generación de horarios.
        </p>
      )}

      {showMaintenanceWarning && (
        <p className="flex items-start gap-2 rounded-xl bg-amber-50 px-3 py-2 text-xs font-medium text-amber-800">
          <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
          Un aula en mantenimiento no debería usarse para asignación de horarios.
        </p>
      )}

      {/* Submit oculto para permitir Enter desde un modal con footer externo. */}
      <button type="submit" className="hidden" disabled={submitting} />
    </form>
  );
}
