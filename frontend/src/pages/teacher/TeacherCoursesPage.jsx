import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  BookOpen,
  AlertTriangle,
  Search,
  Filter,
  Building2,
  GraduationCap,
  CheckCircle2,
  Eye,
  Clock,
  MapPin,
  Users,
  CalendarClock,
} from "lucide-react";
import PageHeader from "../../components/ui/PageHeader.jsx";
import Card from "../../components/ui/Card.jsx";
import Badge from "../../components/ui/Badge.jsx";
import EmptyState from "../../components/ui/EmptyState.jsx";
import Modal from "../../components/ui/Modal.jsx";
import StatCard from "../../components/ui/StatCard.jsx";
import { teacherPortalService } from "../../services/teacherPortalService.js";
import {
  getClassroomLabel,
  CLASSROOM_TYPE_BADGE,
} from "../../utils/courseLabels.js";
import { DAY_FULL_LABEL } from "../../constants/timeBlocks.js";

const DAY_ORDER = [
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
  "SUNDAY",
];

function getCourseId(course) {
  return String(course?._id || course?.id || "");
}

function getPrerequisites(course) {
  return (course?.prerequisites || []).map((p) =>
    typeof p === "object" ? p : { _id: p, code: String(p) }
  );
}

function formatAssignmentSchedule(assignment) {
  if (!assignment?.timeSlot) return "Aún no asignado";
  const t = assignment.timeSlot;
  const day = DAY_FULL_LABEL[t.day] || t.day || "";
  return `${day} ${t.startTime} - ${t.endTime}`.trim();
}

function buildAssignmentMap(assignments = []) {
  const map = new Map();
  for (const assignment of assignments) {
    const id = getCourseId(assignment?.course);
    if (!id) continue;
    const prev = map.get(id);
    if (!prev) {
      map.set(id, assignment);
      continue;
    }
    const prevDay = DAY_ORDER.indexOf(prev?.timeSlot?.day);
    const nextDay = DAY_ORDER.indexOf(assignment?.timeSlot?.day);
    const prevStart = prev?.timeSlot?.startTime || "99:99";
    const nextStart = assignment?.timeSlot?.startTime || "99:99";
    if (nextDay < prevDay || (nextDay === prevDay && nextStart < prevStart)) {
      map.set(id, assignment);
    }
  }
  return map;
}

export default function TeacherCoursesPage() {
  const [teacher, setTeacher] = useState(null);
  const [courses, setCourses] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [linkError, setLinkError] = useState(false);

  useEffect(() => {
    Promise.all([
      teacherPortalService.getMyProfile(),
      teacherPortalService.getMySchedule().catch(() => []),
    ])
      .then(([profile, scheduleAssignments]) => {
        setTeacher(profile || null);
        setCourses(Array.isArray(profile?.availableCourses) ? profile.availableCourses : []);
        setAssignments(Array.isArray(scheduleAssignments) ? scheduleAssignments : []);
      })
      .catch(() => setLinkError(true))
      .finally(() => setLoading(false));
  }, []);

  const assignmentByCourse = useMemo(
    () => buildAssignmentMap(assignments),
    [assignments]
  );

  const enrichedCourses = useMemo(
    () =>
      courses.map((course) => {
        const assignment = assignmentByCourse.get(getCourseId(course)) || null;
        return {
          ...course,
          assignment,
          hasSchedule: Boolean(assignment?.timeSlot),
          classroomLabel: assignment?.classroom?.code || "Pendiente",
          scheduleLabel: formatAssignmentSchedule(assignment),
          enrolledStudentsCount: assignment?.students?.length || 0,
        };
      }),
    [courses, assignmentByCourse]
  );

  const filteredCourses = useMemo(() => {
    const term = search.trim().toLowerCase();
    return enrichedCourses.filter((course) => {
      if (typeFilter !== "ALL" && course.classroomTypeRequired !== typeFilter) {
        return false;
      }
      if (statusFilter === "ACTIVE" && course.active === false) return false;
      if (statusFilter === "INACTIVE" && course.active !== false) return false;
      if (!term) return true;
      return (
        (course.code || "").toLowerCase().includes(term) ||
        (course.name || "").toLowerCase().includes(term)
      );
    });
  }, [enrichedCourses, search, typeFilter, statusFilter]);

  const summary = useMemo(() => {
    const totalCourses = enrichedCourses.length;
    const totalCredits = enrichedCourses.reduce(
      (sum, course) => sum + (course.credits || 0),
      0
    );
    const classroomTypes = new Set(
      enrichedCourses.map((course) => course.classroomTypeRequired).filter(Boolean)
    ).size;
    const hasAvailability = (teacher?.availability?.length || 0) > 0;
    const stateLabel =
      totalCourses > 0 && hasAvailability ? "Listo" : "Pendiente";
    const stateAccent =
      totalCourses > 0 && hasAvailability ? "green" : "amber";
    return {
      totalCourses,
      totalCredits,
      classroomTypes,
      hasAvailability,
      stateLabel,
      stateAccent,
    };
  }, [enrichedCourses, teacher]);

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center text-slate-500">
        Cargando cursos...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Mis cursos"
        subtitle="Consulta los cursos que puedes dictar y su información académica."
      >
        <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
          <Link
            to="/teacher/availability"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            <CalendarClock className="h-4 w-4" />
            Actualizar disponibilidad
          </Link>
          <Link
            to="/teacher/schedule"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-sgoha-primary px-4 py-2 text-sm font-semibold text-white shadow-md hover:bg-blue-900"
          >
            <Clock className="h-4 w-4" />
            Ver mi horario
          </Link>
        </div>
      </PageHeader>

      <p className="rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm text-blue-800">
        Estos cursos serán considerados por el sistema al momento de generar
        horarios, junto con tu disponibilidad registrada.
      </p>

      {linkError ? (
        <Card className="flex items-start gap-3 border-amber-200 bg-amber-50 p-5 text-amber-900">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" />
          <p className="text-sm">
            No encontramos un perfil docente vinculado a tu usuario.
          </p>
        </Card>
      ) : enrichedCourses.length === 0 ? (
        <EmptyState
          icon={BookOpen}
          title="No tienes cursos asignados"
          description="Cuando el administrador asigne cursos a tu perfil docente, aparecerán en esta sección."
          action={
            <Link
              to="/teacher/availability"
              className="inline-flex items-center gap-2 rounded-xl bg-sgoha-primary px-4 py-2 text-sm font-semibold text-white shadow-md hover:bg-blue-900"
            >
              <CalendarClock className="h-4 w-4" />
              Registrar disponibilidad
            </Link>
          }
        />
      ) : (
        <>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard
              icon={BookOpen}
              label="Cursos asignados"
              value={summary.totalCourses}
              hint="Cursos vinculados a tu perfil"
              accent="blue"
            />
            <StatCard
              icon={GraduationCap}
              label="Créditos totales"
              value={summary.totalCredits}
              hint="Carga académica potencial"
              accent="green"
            />
            <StatCard
              icon={Building2}
              label="Tipos de aula"
              value={summary.classroomTypes}
              hint="Tipos distintos requeridos"
              accent="amber"
            />
            <StatCard
              icon={summary.stateLabel === "Listo" ? CheckCircle2 : AlertTriangle}
              label="Estado"
              value={summary.stateLabel}
              hint={
                summary.hasAvailability
                  ? "Cursos + disponibilidad registrados"
                  : "Registra disponibilidad para estar listo"
              }
              accent={summary.stateAccent}
            />
          </div>

          <Card className="space-y-3 p-4 sm:p-5">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar curso por código o nombre..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="hidden items-center gap-1 text-xs font-semibold uppercase text-slate-500 sm:inline-flex">
                <Filter className="h-3.5 w-3.5" /> Filtros
              </span>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm"
              >
                <option value="ALL">Todos los tipos</option>
                <option value="STANDARD">Aula estándar</option>
                <option value="LAB">Laboratorio</option>
                <option value="COMPUTER_ROOM">Sala de cómputo</option>
              </select>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm"
              >
                <option value="ALL">Todos los estados</option>
                <option value="ACTIVE">Activos</option>
                <option value="INACTIVE">Inactivos</option>
              </select>
            </div>
          </Card>

          <Card className="overflow-hidden">
            {filteredCourses.length === 0 ? (
              <EmptyState
                icon={BookOpen}
                title="Sin coincidencias"
                description="Ningún curso coincide con los filtros aplicados."
              />
            ) : (
              <>
                <div className="divide-y divide-slate-100 lg:hidden">
                  {filteredCourses.map((course) => (
                    <article key={course._id} className="space-y-3 p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="font-semibold text-sgoha-primary">{course.code}</p>
                          <p className="truncate font-medium text-slate-900">{course.name}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => setDetail(course)}
                          className="inline-flex items-center gap-1 rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-200"
                        >
                          <Eye className="h-3.5 w-3.5" />
                          Detalle
                        </button>
                      </div>
                      <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600">
                        <span>{course.credits ?? "—"} créditos</span>
                        <Badge
                          variant={CLASSROOM_TYPE_BADGE[course.classroomTypeRequired] || "info"}
                        >
                          {getClassroomLabel(course.classroomTypeRequired)}
                        </Badge>
                        <Badge variant={course.active !== false ? "success" : "neutral"}>
                          {course.active !== false ? "Activo" : "Inactivo"}
                        </Badge>
                      </div>
                      <div className="space-y-1 text-xs text-slate-500">
                        <p>
                          <span className="font-semibold text-slate-700">Horario:</span>{" "}
                          {course.scheduleLabel}
                        </p>
                        <p>
                          <span className="font-semibold text-slate-700">Aula:</span>{" "}
                          {course.classroomLabel}
                        </p>
                      </div>
                    </article>
                  ))}
                </div>
                <div className="hidden overflow-x-auto lg:block">
                  <table className="w-full min-w-[1080px] text-left text-sm">
                    <thead>
                      <tr className="border-b border-slate-100 bg-slate-50/80 text-xs font-semibold uppercase tracking-wide text-slate-500">
                        <th className="px-5 py-3">Curso</th>
                        <th className="px-5 py-3">Créditos</th>
                        <th className="px-5 py-3">Tipo de aula</th>
                        <th className="px-5 py-3">Estado académico</th>
                        <th className="px-5 py-3">Horario</th>
                        <th className="px-5 py-3">Aula</th>
                        <th className="px-5 py-3 text-right">Acciones</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredCourses.map((course) => (
                        <tr key={course._id} className="hover:bg-slate-50/80">
                          <td className="px-5 py-3 align-top">
                            <p className="font-semibold text-sgoha-primary">{course.code}</p>
                            <p className="font-medium text-slate-900">{course.name}</p>
                            <div className="mt-1 flex flex-wrap gap-1">
                              {getPrerequisites(course).length === 0 ? (
                                <span className="text-xs italic text-slate-400">
                                  Sin prerrequisitos
                                </span>
                              ) : (
                                getPrerequisites(course).map((p) => (
                                  <span
                                    key={p._id || p.code}
                                    className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-700"
                                  >
                                    {p.code}
                                  </span>
                                ))
                              )}
                            </div>
                          </td>
                          <td className="px-5 py-3 align-top text-slate-700">
                            {course.credits ?? "—"} créditos
                          </td>
                          <td className="px-5 py-3 align-top">
                            <Badge
                              variant={
                                CLASSROOM_TYPE_BADGE[course.classroomTypeRequired] || "info"
                              }
                            >
                              {getClassroomLabel(course.classroomTypeRequired)}
                            </Badge>
                          </td>
                          <td className="px-5 py-3 align-top">
                            <Badge variant={course.active !== false ? "success" : "neutral"}>
                              {course.active !== false ? "Activo" : "Inactivo"}
                            </Badge>
                          </td>
                          <td className="px-5 py-3 align-top text-slate-600">
                            {course.scheduleLabel}
                          </td>
                          <td className="px-5 py-3 align-top text-slate-600">
                            {course.classroomLabel}
                          </td>
                          <td className="px-5 py-3 align-top text-right">
                            <button
                              type="button"
                              onClick={() => setDetail(course)}
                              className="inline-flex items-center gap-1 rounded-lg bg-slate-100 px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-200"
                            >
                              <Eye className="h-3.5 w-3.5" />
                              Ver detalle
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </Card>

          <Modal
            open={Boolean(detail)}
            onClose={() => setDetail(null)}
            size="md"
            title="Detalle del curso"
            subtitle={detail ? `${detail.code} · ${detail.name}` : ""}
            footer={
              <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => setDetail(null)}
                  className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Cerrar
                </button>
                <Link
                  to="/teacher/availability"
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-sgoha-primary px-4 py-2 text-sm font-semibold text-white hover:bg-blue-900"
                >
                  <CalendarClock className="h-4 w-4" />
                  Ir a mi disponibilidad
                </Link>
              </div>
            }
          >
            {detail && (
              <div className="space-y-4 text-sm">
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  <DetailRow label="Código" value={detail.code} />
                  <DetailRow label="Créditos" value={`${detail.credits ?? "—"} créditos`} />
                  <DetailRow label="Tipo de aula">
                    <Badge
                      variant={CLASSROOM_TYPE_BADGE[detail.classroomTypeRequired] || "info"}
                    >
                      {getClassroomLabel(detail.classroomTypeRequired)}
                    </Badge>
                  </DetailRow>
                  <DetailRow label="Estado">
                    <Badge variant={detail.active !== false ? "success" : "neutral"}>
                      {detail.active !== false ? "Activo" : "Inactivo"}
                    </Badge>
                  </DetailRow>
                </div>

                <div className="rounded-xl border border-slate-100 bg-slate-50 px-3 py-2.5">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Prerrequisitos
                  </p>
                  <div className="mt-1.5 flex flex-wrap gap-1.5">
                    {getPrerequisites(detail).length === 0 ? (
                      <span className="text-xs italic text-slate-400">Sin prerrequisitos</span>
                    ) : (
                      getPrerequisites(detail).map((p) => (
                        <span
                          key={p._id || p.code}
                          className="rounded-md bg-white px-2 py-0.5 text-[11px] font-medium text-slate-700 ring-1 ring-slate-200"
                        >
                          {p.code}
                        </span>
                      ))
                    )}
                  </div>
                </div>

                {detail.hasSchedule ? (
                  <div className="space-y-2 rounded-xl border border-emerald-200 bg-emerald-50 p-3">
                    <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">
                      Horario generado
                    </p>
                    <p className="inline-flex items-center gap-1 text-emerald-800">
                      <Clock className="h-4 w-4" />
                      {detail.scheduleLabel}
                    </p>
                    <p className="inline-flex items-center gap-1 text-emerald-800">
                      <MapPin className="h-4 w-4" />
                      Aula: {detail.classroomLabel}
                    </p>
                    <p className="inline-flex items-center gap-1 text-emerald-800">
                      <Users className="h-4 w-4" />
                      Estudiantes: {detail.enrolledStudentsCount}
                    </p>
                  </div>
                ) : (
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-slate-600">
                    Este curso aún no tiene horario generado.
                  </div>
                )}

                <p className="rounded-xl border border-blue-100 bg-blue-50 px-3 py-2 text-xs text-blue-800">
                  Este curso solo podrá ser asignado en franjas donde tengas
                  disponibilidad registrada.
                </p>
              </div>
            )}
          </Modal>
        </>
      )}
    </div>
  );
}

function DetailRow({ label, value, children }) {
  return (
    <div className="rounded-lg border border-slate-100 bg-white px-3 py-2">
      <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </p>
      <p className="mt-1 text-sm font-medium text-slate-900">{children ?? value}</p>
    </div>
  );
}
