import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  Filter,
  GraduationCap,
  Users as UsersIcon,
  UserCheck,
  ClipboardList,
  Eye,
  X,
  Mail,
  BookOpen,
  AlertTriangle,
  Sparkles,
  Award,
} from "lucide-react";
import PageHeader from "../../components/ui/PageHeader.jsx";
import Card from "../../components/ui/Card.jsx";
import Badge from "../../components/ui/Badge.jsx";
import Button from "../../components/ui/Button.jsx";
import Modal from "../../components/ui/Modal.jsx";
import EmptyState from "../../components/ui/EmptyState.jsx";
import StatCard from "../../components/ui/StatCard.jsx";
import StudentForm, {
  STUDENT_FORM_ID,
} from "../../components/forms/StudentForm.jsx";
import InitialCredentialsModal from "../../components/ui/InitialCredentialsModal.jsx";
import { studentService } from "../../services/studentService.js";
import { courseService } from "../../services/courseService.js";
import {
  STUDENT_ENROLLMENT_STATUS_OPTIONS,
  STUDENT_ENROLLMENT_STATUS_LABELS,
  STUDENT_ENROLLMENT_STATUS_BADGE,
  getApprovedCreditsTotal,
  isNewStudent,
} from "../../utils/studentLabels.js";
import {
  CLASSROOM_TYPE_LABELS,
  CLASSROOM_TYPE_BADGE,
} from "../../utils/classroomLabels.js";

function getInitials(name = "") {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase())
    .join("");
}

export default function StudentsPage() {
  const [items, setItems] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("ALL");
  const [enrollmentFilter, setEnrollmentFilter] = useState("ALL");
  const [programFilter, setProgramFilter] = useState("ALL");

  const [editing, setEditing] = useState(null);
  const [editorOpen, setEditorOpen] = useState(false);
  const [viewing, setViewing] = useState(null);
  const [credentialsInfo, setCredentialsInfo] = useState(null);

  const [toast, setToast] = useState(null);
  const showToast = useCallback((text, type = "success") => {
    setToast({ text, type });
    setTimeout(() => setToast(null), 3500);
  }, []);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [studentsData, coursesData] = await Promise.all([
        studentService.getStudents(),
        courseService.getCourses().catch(() => []),
      ]);
      setItems(Array.isArray(studentsData) ? studentsData : []);
      setCourses(Array.isArray(coursesData) ? coursesData : []);
    } catch {
      showToast("No se pudieron cargar los estudiantes.", "error");
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    load();
  }, [load]);

  const programOptions = useMemo(() => {
    const set = new Set();
    for (const s of items) {
      if (s.program?.trim()) set.add(s.program.trim());
    }
    return Array.from(set).sort();
  }, [items]);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return items.filter((s) => {
      if (activeFilter === "ACTIVE" && s.active === false) return false;
      if (activeFilter === "INACTIVE" && s.active !== false) return false;
      if (
        enrollmentFilter !== "ALL" &&
        s.enrollmentStatus !== enrollmentFilter
      )
        return false;
      if (programFilter !== "ALL" && s.program !== programFilter) return false;
      if (!term) return true;
      return (
        (s.code || "").toLowerCase().includes(term) ||
        (s.fullName || "").toLowerCase().includes(term) ||
        (s.email || "").toLowerCase().includes(term)
      );
    });
  }, [items, search, activeFilter, enrollmentFilter, programFilter]);

  const stats = useMemo(() => {
    const total = items.length;
    const active = items.filter((s) => s.active !== false).length;
    const pending = items.filter(
      (s) => s.enrollmentStatus === "PENDING"
    ).length;
    const validated = items.filter(
      (s) => s.enrollmentStatus === "VALIDATED"
    ).length;
    const totalApproved = items.reduce(
      (sum, s) => sum + (s.approvedCourses?.length || 0),
      0
    );
    const avgApproved = total ? (totalApproved / total).toFixed(1) : "0.0";
    return { total, active, pending, validated, avgApproved };
  }, [items]);

  const activeFiltersCount =
    (activeFilter !== "ALL" ? 1 : 0) +
    (enrollmentFilter !== "ALL" ? 1 : 0) +
    (programFilter !== "ALL" ? 1 : 0);

  function openCreate() {
    setEditing(null);
    setEditorOpen(true);
  }
  function openEdit(s) {
    setEditing(s);
    setEditorOpen(true);
  }
  function closeEditor() {
    if (saving) return;
    setEditorOpen(false);
    setEditing(null);
  }

  async function handleSubmit(payload) {
    setSaving(true);
    try {
      if (editing) {
        await studentService.updateStudent(editing._id, payload);
        showToast("Estudiante actualizado correctamente.");
        setEditorOpen(false);
        setEditing(null);
      } else {
        const created = await studentService.createStudent(payload);
        const account = created?._account;
        if (account?.conflictRole) {
          showToast(
            "Estudiante registrado, pero el correo ya pertenecía a otro rol.",
            "error"
          );
          setCredentialsInfo({
            email: payload.email,
            conflictRole: account.conflictRole,
          });
        } else if (account?.created && account?.initialPassword) {
          showToast(
            "Estudiante registrado. Se generó su cuenta de acceso."
          );
          setCredentialsInfo({
            wasCreated: true,
            credentials: {
              email: payload.email,
              password: account.initialPassword,
            },
          });
        } else if (account && !account.created) {
          showToast(
            "Estudiante registrado y vinculado a una cuenta existente."
          );
          setCredentialsInfo({
            linkedExisting: true,
            email: payload.email,
          });
        } else {
          showToast("Estudiante registrado correctamente.");
        }
        setEditorOpen(false);
        setEditing(null);
      }
      load();
    } catch (e) {
      const msg =
        e?.response?.data?.message || "No se pudo guardar el estudiante.";
      showToast(msg, "error");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(s) {
    if (
      !window.confirm(
        `¿Eliminar al estudiante ${s.fullName}? Esta acción es permanente y también borrará su cuenta de acceso.`
      )
    )
      return;
    try {
      await studentService.deleteStudent(s._id);
      showToast("Estudiante eliminado.");
      load();
    } catch {
      showToast("No se pudo eliminar al estudiante.", "error");
    }
  }

  function resetFilters() {
    setSearch("");
    setActiveFilter("ALL");
    setEnrollmentFilter("ALL");
    setProgramFilter("ALL");
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
        title="Gestión de estudiantes"
        subtitle="Administra estudiantes y su historial académico."
      >
        <Button onClick={openCreate} className="w-full sm:w-auto">
          <Plus className="h-4 w-4" />
          Nuevo estudiante
        </Button>
      </PageHeader>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
        <StatCard
          icon={UsersIcon}
          label="TOTAL ESTUDIANTES"
          value={stats.total}
          hint="Registrados en el sistema"
        />
        <StatCard
          icon={UserCheck}
          label="ESTUDIANTES ACTIVOS"
          value={stats.active}
          accent="green"
        />
        <StatCard
          icon={ClipboardList}
          label="MATRÍCULA PENDIENTE"
          value={stats.pending}
          accent="amber"
        />
        <StatCard
          icon={ClipboardList}
          label="MATRÍCULA VALIDADA"
          value={stats.validated}
          accent="blue"
        />
        <Card className="bg-gradient-to-br from-[#1E3A8A] to-[#172554] p-5 text-white shadow-md">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-blue-200/90">
                PROMEDIO DE CURSOS APROBADOS
              </p>
              <p className="mt-2 text-2xl font-bold">{stats.avgApproved}</p>
              <p className="mt-1 text-xs text-blue-100/80">
                cursos por estudiante
              </p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15 text-white ring-1 ring-white/20">
              <BookOpen className="h-5 w-5" />
            </div>
          </div>
        </Card>
      </div>

      <Card className="overflow-hidden">
        <div className="space-y-3 border-b border-slate-100 p-4 lg:p-5">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              placeholder="Buscar por código, nombre o correo..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="hidden items-center gap-2 text-xs font-semibold uppercase text-slate-500 sm:inline-flex">
              <Filter className="h-3.5 w-3.5" /> Filtros
            </span>
            <select
              value={activeFilter}
              onChange={(e) => setActiveFilter(e.target.value)}
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm"
            >
              <option value="ALL">Todos los estados</option>
              <option value="ACTIVE">Activos</option>
              <option value="INACTIVE">Inactivos</option>
            </select>
            <select
              value={enrollmentFilter}
              onChange={(e) => setEnrollmentFilter(e.target.value)}
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm"
            >
              <option value="ALL">Todas las matrículas</option>
              {STUDENT_ENROLLMENT_STATUS_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <select
              value={programFilter}
              onChange={(e) => setProgramFilter(e.target.value)}
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm"
            >
              <option value="ALL">Todos los programas</option>
              {programOptions.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
            {activeFiltersCount > 0 && (
              <button
                type="button"
                onClick={resetFilters}
                className="inline-flex items-center gap-1 rounded-lg bg-slate-100 px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-200"
              >
                <X className="h-3 w-3" /> Limpiar filtros
              </button>
            )}
          </div>
        </div>

        {loading ? (
          <div className="flex min-h-[240px] items-center justify-center text-slate-500">
            Cargando estudiantes...
          </div>
        ) : items.length === 0 ? (
          <EmptyState
            icon={GraduationCap}
            title="No hay estudiantes registrados"
            description="Registra estudiantes y su historial académico para poder validar matrícula y generar horarios."
            action={
              <Button onClick={openCreate}>
                <Plus className="h-4 w-4" />
                Nuevo estudiante
              </Button>
            }
          />
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={GraduationCap}
            title="Sin coincidencias"
            description="Ningún estudiante coincide con los filtros actuales."
          />
        ) : (
          <>
            <div className="divide-y divide-slate-100 lg:hidden">
              {filtered.map((s) => (
                <StudentCard
                  key={s._id}
                  student={s}
                  onView={() => setViewing(s)}
                  onEdit={() => openEdit(s)}
                  onDelete={() => handleDelete(s)}
                />
              ))}
            </div>
            <div className="hidden overflow-x-auto lg:block">
              <table className="w-full min-w-[1080px] text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/80 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    <th className="px-5 py-3">Código</th>
                    <th className="px-5 py-3">Estudiante</th>
                    <th className="px-5 py-3">Correo</th>
                    <th className="px-5 py-3">Cursos aprobados</th>
                    <th className="px-5 py-3">Créditos</th>
                    <th className="px-5 py-3">Matrícula</th>
                    <th className="px-5 py-3">Estado</th>
                    <th className="px-5 py-3 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filtered.map((s) => (
                    <StudentRow
                      key={s._id}
                      student={s}
                      onView={() => setViewing(s)}
                      onEdit={() => openEdit(s)}
                      onDelete={() => handleDelete(s)}
                    />
                  ))}
                </tbody>
              </table>
            </div>
            <div className="border-t border-slate-100 px-5 py-3 text-xs text-slate-500">
              Mostrando {filtered.length} de {items.length} estudiantes
            </div>
          </>
        )}
      </Card>

      <Modal
        open={editorOpen}
        onClose={closeEditor}
        size="lg"
        title={editing ? "Editar estudiante" : "Nuevo estudiante"}
        subtitle={
          editing
            ? "Actualiza la información y el historial académico del estudiante."
            : "Registra un nuevo estudiante para matrícula y generación de horarios."
        }
        footer={
          <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
            <Button variant="secondary" onClick={closeEditor} disabled={saving}>
              Cancelar
            </Button>
            <button
              type="submit"
              form={STUDENT_FORM_ID}
              disabled={saving}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-sgoha-primary px-4 py-2 text-sm font-semibold text-white shadow-md hover:bg-blue-900 disabled:opacity-60"
            >
              {saving
                ? "Guardando..."
                : editing
                  ? "Guardar cambios"
                  : "Guardar estudiante"}
            </button>
          </div>
        }
      >
        <StudentForm
          student={editing}
          courses={courses}
          onSubmit={handleSubmit}
          submitting={saving}
        />
      </Modal>

      <StudentHistoryModal
        student={viewing}
        onClose={() => setViewing(null)}
      />

      <InitialCredentialsModal
        data={credentialsInfo}
        onClose={() => setCredentialsInfo(null)}
      />
    </div>
  );
}

function StudentRow({ student, onView, onEdit, onDelete }) {
  const approved = student.approvedCourses || [];
  const credits = getApprovedCreditsTotal(approved);
  const isNew = isNewStudent(student);
  return (
    <tr className="hover:bg-slate-50/80">
      <td className="px-5 py-3 align-top font-semibold text-sgoha-primary">
        {student.code}
      </td>
      <td className="px-5 py-3 align-top">
        <div className="flex items-center gap-3">
          <Avatar name={student.fullName} />
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-1.5">
              <p className="truncate font-medium text-slate-900">
                {student.fullName}
              </p>
              {isNew && <NewStudentBadge />}
            </div>
            <p className="truncate text-xs text-slate-500">
              {student.program || "Sin programa"}
            </p>
          </div>
        </div>
      </td>
      <td className="px-5 py-3 align-top text-slate-600">{student.email}</td>
      <td className="px-5 py-3 align-top">
        <ApprovedCoursesChips approved={approved} />
      </td>
      <td className="px-5 py-3 align-top">
        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
          <Award className="h-3 w-3" />
          {credits}
        </span>
      </td>
      <td className="px-5 py-3 align-top">
        <Badge
          variant={
            STUDENT_ENROLLMENT_STATUS_BADGE[student.enrollmentStatus] ||
            "neutral"
          }
        >
          {STUDENT_ENROLLMENT_STATUS_LABELS[student.enrollmentStatus] ||
            student.enrollmentStatus}
        </Badge>
      </td>
      <td className="px-5 py-3 align-top">
        <Badge variant={student.active !== false ? "success" : "neutral"}>
          {student.active !== false ? "Activo" : "Inactivo"}
        </Badge>
      </td>
      <td className="px-5 py-3 align-top">
        <div className="flex justify-end gap-1">
          <IconBtn title="Ver historial" onClick={onView} icon={Eye} />
          <IconBtn title="Editar" onClick={onEdit} icon={Pencil} />
          <IconBtn title="Eliminar" onClick={onDelete} icon={Trash2} danger />
        </div>
      </td>
    </tr>
  );
}

function NewStudentBadge() {
  return (
    <span
      title="Estudiante nuevo: en su primera matrícula no se aplicarán restricciones de prerrequisitos ni créditos previos."
      className="inline-flex items-center gap-1 rounded-full border border-blue-200 bg-blue-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-blue-700"
    >
      <Sparkles className="h-2.5 w-2.5" />
      Nuevo
    </span>
  );
}

function StudentCard({ student, onView, onEdit, onDelete }) {
  const approved = student.approvedCourses || [];
  const credits = getApprovedCreditsTotal(approved);
  const isNew = isNewStudent(student);
  return (
    <article className="space-y-3 p-4">
      <div className="flex items-start gap-3">
        <Avatar name={student.fullName} />
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-1.5">
                <p className="truncate font-semibold text-slate-900">
                  {student.fullName}
                </p>
                {isNew && <NewStudentBadge />}
              </div>
              <p className="truncate text-xs text-slate-500">
                {student.code} · {student.program || "Sin programa"}
              </p>
            </div>
            <Badge variant={student.active !== false ? "success" : "neutral"}>
              {student.active !== false ? "Activo" : "Inactivo"}
            </Badge>
          </div>
          <p className="mt-1 flex items-center gap-1 truncate text-xs text-slate-500">
            <Mail className="h-3 w-3 shrink-0" />
            {student.email}
          </p>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <Badge
          variant={
            STUDENT_ENROLLMENT_STATUS_BADGE[student.enrollmentStatus] ||
            "neutral"
          }
        >
          {STUDENT_ENROLLMENT_STATUS_LABELS[student.enrollmentStatus] ||
            student.enrollmentStatus}
        </Badge>
        <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600">
          <BookOpen className="h-3 w-3" />
          {approved.length} cursos
        </span>
        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700">
          <Award className="h-3 w-3" />
          {credits} créditos
        </span>
      </div>
      <ApprovedCoursesChips approved={approved} compact />
      <div className="flex flex-wrap gap-2 pt-1">
        <IconBtn title="Ver historial" onClick={onView} icon={Eye} />
        <IconBtn title="Editar" onClick={onEdit} icon={Pencil} />
        <IconBtn title="Eliminar" onClick={onDelete} icon={Trash2} danger />
      </div>
    </article>
  );
}

function Avatar({ name }) {
  return (
    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-sgoha-primary text-xs font-bold text-white">
      {getInitials(name) || "·"}
    </div>
  );
}

function ApprovedCoursesChips({ approved, compact = false }) {
  if (!approved?.length) {
    return (
      <span className="text-xs italic text-slate-400">Sin cursos aprobados</span>
    );
  }
  const visible = compact ? approved.slice(0, 3) : approved.slice(0, 4);
  const rest = approved.length - visible.length;
  return (
    <div className="flex flex-wrap gap-1.5">
      {visible.map((c) => (
        <span
          key={c._id || c}
          className="inline-flex items-center rounded-full border border-blue-200 bg-blue-50 px-2 py-0.5 text-[11px] font-semibold text-blue-700"
        >
          {c?.code || "—"}
        </span>
      ))}
      {rest > 0 && (
        <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-600">
          +{rest}
        </span>
      )}
    </div>
  );
}

function IconBtn({ icon: Icon, danger, title, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={`rounded-lg p-2 transition ${
        danger
          ? "text-slate-500 hover:bg-red-50 hover:text-red-600"
          : "text-slate-500 hover:bg-slate-100 hover:text-sgoha-primary"
      }`}
    >
      <Icon className="h-4 w-4" />
    </button>
  );
}

function StudentHistoryModal({ student, onClose }) {
  const approved = student?.approvedCourses || [];
  const credits = getApprovedCreditsTotal(approved);
  const isNew = isNewStudent(student);
  return (
    <Modal
      open={Boolean(student)}
      onClose={onClose}
      size="lg"
      title="Historial académico"
      subtitle={
        student
          ? `${student.fullName} · ${student.code}`
          : "Ficha del estudiante"
      }
    >
      {student && (
        <div className="space-y-5">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <InfoTile label="Código" value={student.code} />
            <InfoTile label="Programa" value={student.program || "—"} />
            <InfoTile label="Correo" value={student.email} />
            <InfoTile label="Estado de matrícula">
              <Badge
                variant={
                  STUDENT_ENROLLMENT_STATUS_BADGE[student.enrollmentStatus] ||
                  "neutral"
                }
              >
                {STUDENT_ENROLLMENT_STATUS_LABELS[student.enrollmentStatus] ||
                  student.enrollmentStatus}
              </Badge>
            </InfoTile>
            <InfoTile label="Cursos aprobados">
              <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-700">
                <BookOpen className="h-3 w-3" />
                {approved.length}
              </span>
            </InfoTile>
            <InfoTile label="Créditos acumulados">
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700">
                <Award className="h-3 w-3" />
                {credits}
              </span>
            </InfoTile>
          </div>

          {isNew ? (
            <p className="flex items-start gap-2 rounded-xl border border-blue-100 bg-blue-50 px-3 py-2 text-xs font-medium text-blue-800">
              <Sparkles className="mt-0.5 h-3.5 w-3.5 shrink-0" />
              Estudiante nuevo: en su PRIMERA matrícula podrá inscribirse en
              cualquier curso sin restricciones de prerrequisitos ni de
              créditos previos. Las restricciones se aplicarán a partir de la
              segunda matrícula.
            </p>
          ) : (
            <p className="flex items-start gap-2 rounded-xl bg-blue-50 px-3 py-2 text-xs font-medium text-blue-800">
              <BookOpen className="mt-0.5 h-3.5 w-3.5 shrink-0" />
              Este historial será usado para validar prerrequisitos durante la
              matrícula.
            </p>
          )}

          {student.active === false && (
            <p className="flex items-start gap-2 rounded-xl bg-amber-50 px-3 py-2 text-xs font-medium text-amber-800">
              <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
              Este estudiante está inactivo y no será considerado para
              matrícula ni generación de horarios.
            </p>
          )}

          <div>
            <div className="mb-2 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-800">
                Cursos aprobados ({approved.length})
              </h3>
              {approved.length > 0 && (
                <span className="text-xs font-medium text-slate-500">
                  Total: <span className="text-slate-800">{credits} créditos</span>
                </span>
              )}
            </div>
            {approved.length === 0 ? (
              <EmptyState
                icon={BookOpen}
                title="Sin historial"
                description="El estudiante aún no tiene cursos aprobados registrados."
              />
            ) : (
              <div className="overflow-hidden rounded-xl border border-slate-200">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    <tr>
                      <th className="px-4 py-2">Código</th>
                      <th className="px-4 py-2">Curso</th>
                      <th className="px-4 py-2">Créditos</th>
                      <th className="px-4 py-2">Tipo de aula</th>
                      <th className="px-4 py-2">Estado</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {approved.map((c) => (
                      <tr key={c._id || c.code}>
                        <td className="px-4 py-2 font-semibold text-sgoha-primary">
                          {c.code}
                        </td>
                        <td className="px-4 py-2 text-slate-700">{c.name}</td>
                        <td className="px-4 py-2 text-slate-600">
                          {c.credits ?? "—"}
                        </td>
                        <td className="px-4 py-2">
                          {c.classroomTypeRequired ? (
                            <Badge
                              variant={
                                CLASSROOM_TYPE_BADGE[c.classroomTypeRequired] ||
                                "info"
                              }
                            >
                              {CLASSROOM_TYPE_LABELS[c.classroomTypeRequired] ||
                                c.classroomTypeRequired}
                            </Badge>
                          ) : (
                            "—"
                          )}
                        </td>
                        <td className="px-4 py-2">
                          <Badge
                            variant={
                              c.active === false ? "neutral" : "success"
                            }
                          >
                            {c.active === false ? "Inactivo" : "Aprobado"}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </Modal>
  );
}

function InfoTile({ label, value, children }) {
  return (
    <div className="rounded-xl border border-slate-100 bg-slate-50 px-3 py-2.5">
      <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </p>
      <div className="mt-1 text-sm font-medium text-slate-900">
        {children ?? value}
      </div>
    </div>
  );
}
