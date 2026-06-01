import { useEffect, useRef, useState } from "react";
import { CalendarClock, X } from "lucide-react";
import Input from "../ui/Input.jsx";
import AvailabilityGrid from "../availability/AvailabilityGrid.jsx";
import { countAvailabilityStats } from "../../utils/availabilityConstants.js";

const emptyForm = {
  fullName: "",
  email: "",
  specialty: "",
  availableCourses: [],
  availability: [],
  active: true,
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const TEACHER_FORM_ID = "sgoha-teacher-form";

export default function TeacherForm({
  initialData = null,
  allCourses = [],
  onSubmit,
  onCancel,
  saving = false,
  focusAvailability = false,
  hideActions = false,
}) {
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const availabilityRef = useRef(null);

  useEffect(() => {
    if (initialData) {
      setForm({
        fullName: initialData.fullName || "",
        email: initialData.email || "",
        specialty: initialData.specialty || "",
        availableCourses: (initialData.availableCourses || []).map((c) =>
          typeof c === "object" ? c._id : c
        ),
        availability: initialData.availability || [],
        active: initialData.active !== false,
      });
    } else {
      setForm(emptyForm);
    }
    setErrors({});
  }, [initialData]);

  useEffect(() => {
    if (focusAvailability && availabilityRef.current) {
      const t = setTimeout(() => {
        availabilityRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 150);
      return () => clearTimeout(t);
    }
  }, [focusAvailability, initialData]);

  function validate() {
    const next = {};
    if (!form.fullName.trim()) {
      next.fullName = "El nombre completo es obligatorio.";
    }
    if (!form.email.trim()) {
      next.email = "El correo institucional es obligatorio.";
    } else if (!EMAIL_RE.test(form.email.trim())) {
      next.email = "Ingresa un correo válido.";
    }
    if (!form.specialty.trim()) {
      next.specialty = "La especialidad es obligatoria.";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;
    onSubmit({
      fullName: form.fullName.trim(),
      email: form.email.trim().toLowerCase(),
      specialty: form.specialty.trim(),
      availableCourses: form.availableCourses,
      availability: form.availability,
      active: form.active,
    });
  }

  function toggleCourse(id) {
    const sid = String(id);
    setForm((prev) => ({
      ...prev,
      availableCourses: prev.availableCourses.some((c) => String(c) === sid)
        ? prev.availableCourses.filter((c) => String(c) !== sid)
        : [...prev.availableCourses, id],
    }));
  }

  function removeCourse(id) {
    setForm((prev) => ({
      ...prev,
      availableCourses: prev.availableCourses.filter(
        (c) => String(c) !== String(id)
      ),
    }));
  }

  const { blocks, hours } = countAvailabilityStats(form.availability);
  const showAvailWarning = !form.availability?.length;
  const showCoursesWarning = !form.availableCourses?.length;

  return (
    <form
      id={TEACHER_FORM_ID}
      onSubmit={handleSubmit}
      className="space-y-6"
    >
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
            Datos del docente
          </p>
          <Input
            label="Nombre completo"
            name="fullName"
            placeholder="Ej. Dr. Ricardo Silva"
            value={form.fullName}
            onChange={(e) => setForm({ ...form, fullName: e.target.value })}
            error={errors.fullName}
            disabled={saving}
          />
          <Input
            label="Correo institucional"
            name="email"
            type="email"
            placeholder="nombre@sgoha.edu"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            error={errors.email}
            disabled={saving}
          />
          <Input
            label="Especialidad o área académica"
            name="specialty"
            placeholder="Ej. Programación y Base de Datos"
            value={form.specialty}
            onChange={(e) => setForm({ ...form, specialty: e.target.value })}
            error={errors.specialty}
            disabled={saving}
          />
        </div>

        <div className="space-y-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
            Asignación académica
          </p>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              Cursos que puede dictar
            </label>
            {allCourses.length === 0 ? (
              <p className="rounded-xl border border-dashed border-amber-200 bg-amber-50 px-3 py-3 text-sm text-amber-800">
                Primero registra cursos para asignarlos al docente.
              </p>
            ) : (
              <div className="max-h-40 space-y-1 overflow-y-auto rounded-xl border border-slate-200 bg-white p-2">
                {allCourses.map((c) => {
                  const selected = form.availableCourses.some(
                    (id) => String(id) === String(c._id)
                  );
                  return (
                    <label
                      key={c._id}
                      className={`flex cursor-pointer items-center gap-2 rounded-lg px-2 py-2 text-sm transition ${
                        selected
                          ? "bg-blue-50 text-blue-900 ring-1 ring-blue-100"
                          : "text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={selected}
                        onChange={() => toggleCourse(c._id)}
                        disabled={saving}
                        className="rounded border-slate-300 text-blue-600"
                      />
                      <span className="font-medium">{c.code}</span>
                      <span className="truncate text-slate-500">{c.name}</span>
                    </label>
                  );
                })}
              </div>
            )}
            {form.availableCourses.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {form.availableCourses.map((cid) => {
                  const course = allCourses.find(
                    (c) => String(c._id) === String(cid)
                  );
                  return (
                    <span
                      key={cid}
                      className="inline-flex max-w-full items-center gap-1 rounded-full bg-blue-100 px-2.5 py-1 text-xs font-medium text-blue-800"
                    >
                      <span className="truncate">
                        {course ? `${course.code} - ${course.name}` : cid}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeCourse(cid)}
                        className="shrink-0 rounded-full p-0.5 hover:bg-blue-200"
                        disabled={saving}
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  );
                })}
              </div>
            )}
            {showCoursesWarning && allCourses.length > 0 && (
              <p className="mt-2 text-xs text-amber-600">
                Este docente aún no tiene cursos asignados.
              </p>
            )}
          </div>

          <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
            <div>
              <p className="text-sm font-medium text-slate-800">
                Estado del docente
              </p>
              <p className="text-xs text-slate-500">
                {form.active ? "Activo" : "Inactivo"}
              </p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={form.active}
              onClick={() => setForm({ ...form, active: !form.active })}
              disabled={saving}
              className={`relative h-6 w-11 shrink-0 rounded-full transition ${
                form.active ? "bg-blue-600" : "bg-slate-300"
              }`}
            >
              <span
                className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition ${
                  form.active ? "translate-x-5" : ""
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      <section
        ref={availabilityRef}
        className={`scroll-mt-4 rounded-2xl border bg-gradient-to-b from-slate-50 to-white p-4 shadow-sm sm:p-5 ${
          focusAvailability
            ? "border-blue-300 ring-2 ring-blue-100"
            : "border-slate-200"
        }`}
      >
        <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#1E3A8A]/10 text-[#1E3A8A]">
              <CalendarClock className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-900 sm:text-base">
                Disponibilidad horaria semanal
              </h3>
              <p className="mt-0.5 text-xs text-slate-500 sm:text-sm">
                Usada por el motor CSP para validar franjas al generar horarios.
              </p>
            </div>
          </div>
          {blocks > 0 && (
            <span className="inline-flex w-fit items-center rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-800">
              {blocks} bloques · {hours}h / semana
            </span>
          )}
        </div>

        <AvailabilityGrid
          value={form.availability}
          onChange={(availability) => setForm({ ...form, availability })}
        />

        {showAvailWarning && (
          <p className="mt-3 rounded-lg border border-amber-100 bg-amber-50 px-3 py-2 text-xs text-amber-800">
            Este docente aún no tiene disponibilidad horaria registrada.
          </p>
        )}
      </section>

      {!hideActions && (
        <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-4 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onCancel}
            disabled={saving}
            className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-60 sm:min-w-[120px]"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={saving}
            className="rounded-xl bg-[#1E3A8A] px-5 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-blue-900 disabled:opacity-60 sm:min-w-[160px]"
          >
            {saving ? "Guardando..." : "Guardar docente"}
          </button>
        </div>
      )}
    </form>
  );
}
