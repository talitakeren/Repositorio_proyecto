import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ClipboardList,
  Search,
  Plus,
  Eye,
} from "lucide-react";
import PageHeader from "../../components/ui/PageHeader.jsx";
import Card from "../../components/ui/Card.jsx";
import EmptyState from "../../components/ui/EmptyState.jsx";
import Modal from "../../components/ui/Modal.jsx";
import EnrollmentSummaryCards from "../../components/enrollments/EnrollmentSummaryCards.jsx";
import EnrollmentStatusBadge from "../../components/enrollments/EnrollmentStatusBadge.jsx";
import EnrollmentDetailDrawer from "../../components/enrollments/EnrollmentDetailDrawer.jsx";
import { enrollmentService } from "../../services/enrollmentService.js";
import { studentService } from "../../services/studentService.js";
import { courseService } from "../../services/courseService.js";

function getInitials(name = "") {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("");
}

function creditBadgeClass(total) {
  if (total < 20) return "bg-amber-100 text-amber-800 border-amber-200";
  if (total > 22) return "bg-red-100 text-red-700 border-red-200";
  return "bg-emerald-100 text-emerald-700 border-emerald-200";
}

export default function EnrollmentsPage() {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [creditsFilter, setCreditsFilter] = useState("ALL");
  const [validationFilter, setValidationFilter] = useState("ALL");
  const [detail, setDetail] = useState(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [newStudentId, setNewStudentId] = useState("");
  const [newCourseIds, setNewCourseIds] = useState([]);
  const [toast, setToast] = useState(null);

  const showToast = useCallback((text, type = "success") => {
    setToast({ text, type });
    setTimeout(() => setToast(null), 3500);
  }, []);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await enrollmentService.getEnrollments({
        search: search.trim() || undefined,
        status: statusFilter === "ALL" ? undefined : statusFilter,
      });
      setEnrollments(Array.isArray(data) ? data : []);
    } catch {
      showToast("No se pudieron cargar las matrículas.", "error");
      setEnrollments([]);
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter, showToast]);

  useEffect(() => {
    const t = setTimeout(load, 250);
    return () => clearTimeout(t);
  }, [load]);

  useEffect(() => {
    Promise.all([
      studentService.getStudents().catch(() => []),
      courseService.getCourses({ active: "true" }).catch(() => []),
    ]).then(([studentsData, coursesData]) => {
      setStudents(Array.isArray(studentsData) ? studentsData : []);
      setCourses(Array.isArray(coursesData) ? coursesData : []);
    });
  }, []);

  const filtered = useMemo(() => {
    return enrollments.filter((e) => {
      const total = e.totalCredits || 0;
      if (creditsFilter === "UNDER_20" && !(total < 20)) return false;
      if (creditsFilter === "BETWEEN_20_22" && !(total >= 20 && total <= 22))
        return false;
      if (creditsFilter === "OVER_22" && !(total > 22)) return false;

      const vr = e.validationResults || {};
      if (validationFilter === "PREREQ_OK" && vr.prerequisitesValid !== true)
        return false;
      if (
        validationFilter === "PREREQ_MISSING" &&
        vr.prerequisitesValid !== false
      )
        return false;
      if (validationFilter === "CREDITS_OK" && vr.creditsValid !== true)
        return false;
      if (validationFilter === "CREDITS_INVALID" && vr.creditsValid !== false)
        return false;

      return true;
    });
  }, [enrollments, creditsFilter, validationFilter]);

  async function createEnrollment() {
    if (!newStudentId || newCourseIds.length === 0) {
      showToast("Selecciona estudiante y al menos un curso.", "error");
      return;
    }
    setSaving(true);
    try {
      await enrollmentService.createEnrollment({
        studentId: newStudentId,
        courseIds: newCourseIds,
      });
      setCreateOpen(false);
      setNewStudentId("");
      setNewCourseIds([]);
      await load();
      showToast("Matrícula creada correctamente.");
    } catch (e) {
      showToast(e?.response?.data?.message || "No se pudo crear la matrícula.", "error");
    } finally {
      setSaving(false);
    }
  }

  function toggleCourse(id) {
    setNewCourseIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }

  const selectedCreateCredits = useMemo(
    () =>
      courses
        .filter((c) => newCourseIds.includes(String(c._id)))
        .reduce((sum, c) => sum + (c.credits || 0), 0),
    [courses, newCourseIds]
  );

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
        title="Matrícula"
        subtitle="Supervisa las matrículas que los estudiantes validan y confirman en su portal."
      >
        <button
          type="button"
          onClick={() => setCreateOpen(true)}
          className="inline-flex items-center gap-2 rounded-xl bg-sgoha-primary px-4 py-2 text-sm font-semibold text-white shadow-md hover:bg-blue-900"
        >
          <Plus className="h-4 w-4" />
          Nueva matrícula
        </button>
      </PageHeader>

      <p className="rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm text-blue-800">
        Los alumnos gestionan su matrícula desde el portal (validar y confirmar).
        Las matrículas confirmadas alimentan el motor de generación de horarios.
      </p>

      <EnrollmentSummaryCards enrollments={enrollments} />

      <Card className="space-y-3 p-4 sm:p-5">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por estudiante, código o correo..."
            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm"
          >
            <option value="ALL">Todos los estados</option>
            <option value="DRAFT">Borrador</option>
            <option value="PENDING">Pendiente</option>
            <option value="VALIDATED">Validada</option>
            <option value="VALID">Válida (legado)</option>
            <option value="CONFIRMED">Confirmada</option>
            <option value="OBSERVED">Observada</option>
            <option value="REJECTED">Rechazada</option>
            <option value="INVALID">Inválida (legado)</option>
          </select>

          <select
            value={creditsFilter}
            onChange={(e) => setCreditsFilter(e.target.value)}
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm"
          >
            <option value="ALL">Todos los créditos</option>
            <option value="UNDER_20">Menos de 20</option>
            <option value="BETWEEN_20_22">Entre 20 y 22</option>
            <option value="OVER_22">Más de 22</option>
          </select>

          <select
            value={validationFilter}
            onChange={(e) => setValidationFilter(e.target.value)}
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm"
          >
            <option value="ALL">Todas las validaciones</option>
            <option value="PREREQ_OK">Prerrequisitos correctos</option>
            <option value="PREREQ_MISSING">Prerrequisitos faltantes</option>
            <option value="CREDITS_OK">Créditos válidos</option>
            <option value="CREDITS_INVALID">Créditos inválidos</option>
          </select>
        </div>
      </Card>

      <Card className="overflow-hidden">
        {loading ? (
          <div className="flex min-h-[220px] items-center justify-center text-slate-500">
            Cargando matrículas...
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={ClipboardList}
            title="No hay matrículas registradas"
            description="Cuando los estudiantes seleccionen cursos o el administrador cree matrículas, aparecerán en esta sección."
            action={
              <button
                type="button"
                onClick={() => setCreateOpen(true)}
                className="inline-flex items-center gap-2 rounded-xl bg-sgoha-primary px-4 py-2 text-sm font-semibold text-white shadow-md hover:bg-blue-900"
              >
                <Plus className="h-4 w-4" />
                Nueva matrícula
              </button>
            }
          />
        ) : (
          <>
            <div className="hidden overflow-x-auto lg:block">
              <table className="w-full min-w-[1180px] text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/80 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    <th className="px-5 py-3">Estudiante</th>
                    <th className="px-5 py-3">Cursos seleccionados</th>
                    <th className="px-5 py-3">Créditos</th>
                    <th className="px-5 py-3">Prerrequisitos</th>
                    <th className="px-5 py-3">Estado</th>
                    <th className="px-5 py-3">Última actualización</th>
                    <th className="px-5 py-3 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filtered.map((e) => (
                    <tr key={e._id} className="hover:bg-slate-50/70">
                      <td className="px-5 py-3 align-top">
                        <div className="flex items-center gap-3">
                          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">
                            {getInitials(e.student?.fullName)}
                          </span>
                          <div className="min-w-0">
                            <p className="truncate font-medium text-slate-900">{e.student?.fullName || "—"}</p>
                            <p className="truncate text-xs text-slate-500">{e.student?.code || "—"} · {e.student?.email || "—"}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3 align-top">
                        <p className="text-xs text-slate-500">{e.courses?.length || 0} cursos</p>
                        <div className="mt-1 flex max-w-[300px] flex-wrap gap-1">
                          {(e.courses || []).slice(0, 3).map((c) => (
                            <span key={c._id || c.code} className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-700">
                              {c.code}
                            </span>
                          ))}
                          {(e.courses || []).length > 3 && (
                            <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-700">
                              +{(e.courses || []).length - 3} más
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-5 py-3 align-top">
                        <span className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-semibold ${creditBadgeClass(e.totalCredits || 0)}`}>
                          {e.totalCredits || 0} créditos
                        </span>
                      </td>
                      <td className="px-5 py-3 align-top text-xs">
                        {e.validationResults?.newStudentPrereqsSkipped ? (
                          <span className="font-semibold text-blue-700">N/A (nuevo)</span>
                        ) : e.validationResults?.prerequisitesValid === true ? (
                          <span className="font-semibold text-emerald-700">Correcto</span>
                        ) : e.validationResults?.prerequisitesValid === false ? (
                          <span className="font-semibold text-red-700">Faltantes</span>
                        ) : (
                          <span className="text-slate-400">No validado</span>
                        )}
                      </td>
                      <td className="px-5 py-3 align-top">
                        <EnrollmentStatusBadge status={e.status} />
                      </td>
                      <td className="px-5 py-3 align-top text-xs text-slate-500">
                        {new Date(e.updatedAt).toLocaleString()}
                      </td>
                      <td className="px-5 py-3 align-top">
                        <div className="flex justify-end gap-1">
                          <IconBtn
                            icon={Eye}
                            title="Ver detalle"
                            onClick={() => setDetail(e)}
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="divide-y divide-slate-100 lg:hidden">
              {filtered.map((e) => (
                <article key={e._id} className="space-y-2 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-slate-900">{e.student?.fullName || "—"}</p>
                      <p className="text-xs text-slate-500">{e.student?.code || "—"} · {e.student?.email || "—"}</p>
                    </div>
                    <EnrollmentStatusBadge status={e.status} />
                  </div>
                  <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600">
                    <span className={`inline-flex rounded-full border px-2.5 py-0.5 font-semibold ${creditBadgeClass(e.totalCredits || 0)}`}>
                      {e.totalCredits || 0} créditos
                    </span>
                    <span>{e.courses?.length || 0} cursos</span>
                  </div>
                  <div className="flex gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setDetail(e)}
                      className="inline-flex items-center gap-1 rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700"
                    >
                      <Eye className="h-3.5 w-3.5" /> Ver detalle
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </>
        )}
      </Card>

      <EnrollmentDetailDrawer
        enrollment={detail}
        open={Boolean(detail)}
        onClose={() => setDetail(null)}
      />

      <Modal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        title="Nueva matrícula"
        subtitle="Crear matrícula manual desde administración"
        size="lg"
        footer={
          <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={() => setCreateOpen(false)}
              className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={createEnrollment}
              disabled={saving}
              className="rounded-lg bg-sgoha-primary px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
            >
              Guardar matrícula
            </button>
          </div>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Estudiante</label>
            <select
              value={newStudentId}
              onChange={(e) => setNewStudentId(e.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm"
            >
              <option value="">Selecciona estudiante</option>
              {students.map((s) => (
                <option key={s._id} value={s._id}>
                  {s.code} · {s.fullName} ({s.email})
                </option>
              ))}
            </select>
          </div>

          <div>
            <p className="mb-1 text-sm font-medium text-slate-700">Cursos</p>
            <div className="max-h-56 space-y-1 overflow-y-auto rounded-lg border border-slate-200 bg-slate-50 p-2">
              {courses.map((c) => {
                const checked = newCourseIds.includes(String(c._id));
                return (
                  <label key={c._id} className="flex items-center justify-between gap-3 rounded-md bg-white px-2 py-2 text-sm">
                    <span className="min-w-0 truncate">
                      <span className="font-semibold text-sgoha-primary">{c.code}</span> · {c.name}
                    </span>
                    <span className="flex items-center gap-3">
                      <span className="text-xs text-slate-500">{c.credits} cr.</span>
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleCourse(String(c._id))}
                      />
                    </span>
                  </label>
                );
              })}
            </div>
            <p className="mt-2 text-xs text-slate-500">Total créditos: {selectedCreateCredits}</p>
          </div>
        </div>
      </Modal>
    </div>
  );
}

function IconBtn({ icon: Icon, title, onClick, danger, disabled }) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      disabled={disabled}
      className={`rounded-lg p-2 transition ${
        danger
          ? "text-slate-500 hover:bg-red-50 hover:text-red-600"
          : "text-slate-500 hover:bg-slate-100 hover:text-sgoha-primary"
      } disabled:opacity-50`}
    >
      <Icon className="h-4 w-4" />
    </button>
  );
}
