import { useEffect, useMemo, useState } from "react";
import { AlertTriangle, X as XIcon, Info, Sparkles } from "lucide-react";
import Input from "../ui/Input.jsx";
import Select from "../ui/Select.jsx";
import {
  STUDENT_ENROLLMENT_STATUS_OPTIONS,
  SUGGESTED_PROGRAMS,
  getApprovedCreditsTotal,
} from "../../utils/studentLabels.js";

export const STUDENT_FORM_ID = "student-form";

/**
 * Formulario de estudiante: datos personales + programa + historial académico
 * (approvedCourses) + enrollmentStatus + active.
 *
 * Recibe la lista de cursos disponibles desde el padre para no acoplarse al
 * servicio de cursos. Los cursos seleccionados se muestran como chips.
 */
export default function StudentForm({
  student,
  courses = [],
  onSubmit,
  submitting = false,
}) {
  const [form, setForm] = useState({
    code: "",
    fullName: "",
    email: "",
    program: SUGGESTED_PROGRAMS[0],
    approvedCourses: [],
    enrollmentStatus: "PENDING",
    isNewStudent: true,
    active: true,
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (student) {
      const approvedIds = (student.approvedCourses || []).map((c) =>
        typeof c === "object" ? c._id : c
      );
      setForm({
        code: student.code || "",
        fullName: student.fullName || "",
        email: student.email || "",
        program: student.program || SUGGESTED_PROGRAMS[0],
        approvedCourses: approvedIds,
        enrollmentStatus: student.enrollmentStatus || "PENDING",
        isNewStudent:
          student.isNewStudent === undefined
            ? approvedIds.length === 0
            : Boolean(student.isNewStudent),
        active: student.active !== false,
      });
    } else {
      setForm({
        code: "",
        fullName: "",
        email: "",
        program: SUGGESTED_PROGRAMS[0],
        approvedCourses: [],
        enrollmentStatus: "PENDING",
        isNewStudent: true,
        active: true,
      });
    }
    setErrors({});
  }, [student]);

  const courseMap = useMemo(() => {
    const map = new Map();
    for (const c of courses) map.set(String(c._id), c);
    return map;
  }, [courses]);

  const availableToAdd = useMemo(() => {
    const selected = new Set(form.approvedCourses.map(String));
    return courses.filter((c) => !selected.has(String(c._id)));
  }, [courses, form.approvedCourses]);

  function set(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function addCourse(id) {
    if (!id) return;
    setForm((prev) => ({
      ...prev,
      approvedCourses: [...prev.approvedCourses, id],
      // Si el alumno ya tiene historial registrado, deja de ser nuevo.
      isNewStudent: false,
    }));
  }
  function removeCourse(id) {
    setForm((prev) => ({
      ...prev,
      approvedCourses: prev.approvedCourses.filter((c) => c !== id),
    }));
  }

  const approvedCoursesObjs = useMemo(
    () =>
      form.approvedCourses
        .map((id) => courseMap.get(String(id)))
        .filter(Boolean),
    [form.approvedCourses, courseMap]
  );
  const approvedCreditsTotal = getApprovedCreditsTotal(approvedCoursesObjs);
  const hasHistory = form.approvedCourses.length > 0;

  function validate() {
    const next = {};
    if (!form.code.trim()) next.code = "El código del estudiante es obligatorio.";
    if (!form.fullName.trim())
      next.fullName = "El nombre completo es obligatorio.";
    if (!form.email.trim())
      next.email = "El correo institucional es obligatorio.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      next.email = "Ingresa un correo válido.";
    if (!form.program?.trim())
      next.program = "El programa académico es obligatorio.";
    if (!form.enrollmentStatus)
      next.enrollmentStatus = "Selecciona el estado de matrícula.";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;
    onSubmit({
      code: form.code.trim().toUpperCase(),
      fullName: form.fullName.trim(),
      email: form.email.trim().toLowerCase(),
      program: form.program.trim(),
      approvedCourses: form.approvedCourses,
      enrollmentStatus: form.enrollmentStatus,
      // Con historial registrado deja de ser nuevo independientemente del toggle.
      isNewStudent: hasHistory ? false : form.isNewStudent,
      active: form.active,
    });
  }

  return (
    <form id={STUDENT_FORM_ID} onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <section className="space-y-4">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
            Datos del estudiante
          </h3>
          <Input
            label="Código del estudiante"
            name="code"
            value={form.code}
            onChange={(e) => set("code", e.target.value)}
            error={errors.code}
            placeholder="Ej. EST-2023-001"
            autoComplete="off"
          />
          <Input
            label="Nombre completo"
            name="fullName"
            value={form.fullName}
            onChange={(e) => set("fullName", e.target.value)}
            error={errors.fullName}
            placeholder="Ej. Alejandro Arreola"
          />
          <Input
            label="Correo institucional"
            name="email"
            type="email"
            value={form.email}
            onChange={(e) => set("email", e.target.value)}
            error={errors.email}
            placeholder="Ej. a.arreola@university.edu"
          />
          <div>
            <label
              htmlFor="program"
              className="mb-1.5 block text-sm font-medium text-slate-700"
            >
              Programa académico
            </label>
            <input
              id="program"
              list="program-suggestions"
              value={form.program}
              onChange={(e) => set("program", e.target.value)}
              className={`w-full rounded-lg border bg-white px-3.5 py-2.5 text-sm text-slate-900 shadow-sm transition placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${
                errors.program
                  ? "border-red-300 focus:border-red-500"
                  : "border-slate-200 focus:border-blue-500"
              }`}
              placeholder="Ej. Ingeniería de Sistemas e Informática"
            />
            <datalist id="program-suggestions">
              {SUGGESTED_PROGRAMS.map((p) => (
                <option key={p} value={p} />
              ))}
            </datalist>
            {errors.program && (
              <p className="mt-1.5 text-xs text-red-600">{errors.program}</p>
            )}
          </div>
        </section>

        <section className="space-y-4">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
            Estado y matrícula
          </h3>
          <Select
            label="Estado de matrícula"
            name="enrollmentStatus"
            value={form.enrollmentStatus}
            onChange={(e) => set("enrollmentStatus", e.target.value)}
            error={errors.enrollmentStatus}
          >
            {STUDENT_ENROLLMENT_STATUS_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </Select>

          <label
            className={`flex cursor-pointer items-start gap-3 rounded-xl border px-4 py-3 transition ${
              form.isNewStudent && !hasHistory
                ? "border-blue-200 bg-blue-50"
                : "border-slate-200 bg-slate-50"
            } ${hasHistory ? "cursor-not-allowed opacity-60" : ""}`}
          >
            <input
              type="checkbox"
              disabled={hasHistory}
              checked={form.isNewStudent && !hasHistory}
              onChange={(e) => set("isNewStudent", e.target.checked)}
              className="mt-0.5 h-4 w-4 rounded border-slate-300 text-sgoha-secondary focus:ring-sgoha-secondary"
            />
            <span className="space-y-1 text-sm">
              <span className="flex items-center gap-1.5 font-medium text-slate-800">
                <Sparkles className="h-3.5 w-3.5 text-blue-600" />
                Estudiante nuevo (primera matrícula)
              </span>
              <span className="block text-xs text-slate-500">
                En su PRIMERA matrícula no se aplicarán restricciones de
                prerrequisitos ni de créditos previos. A partir de la segunda
                matrícula, las restricciones se aplican normalmente usando el
                historial académico.
              </span>
            </span>
          </label>

          {hasHistory && (
            <p className="flex items-start gap-2 rounded-xl bg-slate-50 px-3 py-2 text-xs font-medium text-slate-600">
              <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />
              El estudiante ya tiene historial académico registrado, por lo
              que deja de ser nuevo automáticamente.
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
              Habilitado para matrícula y generación de horarios
            </span>
          </label>

          {!form.active && (
            <p className="flex items-start gap-2 rounded-xl bg-amber-50 px-3 py-2 text-xs font-medium text-amber-800">
              <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
              Un estudiante inactivo no será considerado para matrícula ni
              generación de horarios.
            </p>
          )}
        </section>
      </div>

      <section className="space-y-3">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
              Historial académico (cursos aprobados)
            </h3>
            <p className="text-xs text-slate-500">
              Solo cursos que el estudiante ya aprobó. Se usarán para validar
              prerrequisitos en el módulo de matrícula.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
              {form.approvedCourses.length} cursos
            </span>
            <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
              {approvedCreditsTotal} créditos aprobados
            </span>
          </div>
        </div>

        {courses.length === 0 ? (
          <p className="flex items-start gap-2 rounded-xl bg-amber-50 px-3 py-2 text-xs font-medium text-amber-800">
            <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />
            Primero registra cursos para agregarlos al historial académico.
          </p>
        ) : (
          <>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                Agregar curso aprobado
              </label>
              <select
                value=""
                onChange={(e) => addCourse(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                disabled={availableToAdd.length === 0}
              >
                <option value="">
                  {availableToAdd.length === 0
                    ? "Todos los cursos disponibles ya están en el historial"
                    : "Selecciona un curso para agregar..."}
                </option>
                {availableToAdd.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.code} · {c.name} ({c.credits} créditos)
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-wrap gap-2">
              {form.approvedCourses.length === 0 ? (
                <p className="text-xs italic text-slate-400">
                  Aún no agregaste cursos al historial.
                </p>
              ) : (
                form.approvedCourses.map((id) => {
                  const c = courseMap.get(String(id));
                  return (
                    <span
                      key={id}
                      className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-800"
                    >
                      <span className="font-bold">{c?.code || id}</span>
                      <span className="hidden text-blue-700 sm:inline">
                        · {c?.name || "Curso"}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeCourse(id)}
                        className="rounded-full p-0.5 hover:bg-blue-100"
                        aria-label="Quitar"
                      >
                        <XIcon className="h-3 w-3" />
                      </button>
                    </span>
                  );
                })
              )}
            </div>
          </>
        )}
      </section>

      <button type="submit" className="hidden" disabled={submitting} />
    </form>
  );
}
