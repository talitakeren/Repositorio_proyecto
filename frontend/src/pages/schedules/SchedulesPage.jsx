import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  BookOpen,
  Building2,
  CalendarClock,
  CheckCircle2,
  ClipboardCheck,
  Loader2,
  UserRound,
  Zap,
  AlertCircle,
  XCircle,
  ExternalLink,
} from "lucide-react";
import PageHeader from "../../components/ui/PageHeader.jsx";
import Card from "../../components/ui/Card.jsx";
import Badge from "../../components/ui/Badge.jsx";
import WeeklyGrid from "../../components/schedules/WeeklyGrid.jsx";
import ConflictList from "../../components/schedules/ConflictList.jsx";
import { scheduleService } from "../../services/scheduleService.js";
import { studentService } from "../../services/studentService.js";
import { teacherService } from "../../services/teacherService.js";
import { classroomService } from "../../services/classroomService.js";

const PERIOD = "2026-1";

const SUMMARY_CARDS = [
  {
    key: "eligibleEnrollments",
    fallbackKey: "confirmedEnrollments",
    label: "Matrículas listas",
    icon: ClipboardCheck,
  },
  { key: "coursesToSchedule", label: "Cursos a programar", icon: BookOpen },
  { key: "availableTeachers", label: "Docentes disponibles", icon: UserRound },
  { key: "availableClassrooms", label: "Aulas disponibles", icon: Building2 },
  { key: "activeTimeSlots", label: "Franjas activas", icon: CalendarClock },
];

const CSP_RULES = [
  "No solapamiento de docentes.",
  "No solapamiento de aulas.",
  "No solapamiento de estudiantes.",
  "Compatibilidad entre curso y tipo de aula.",
  "Capacidad suficiente del aula.",
  "Disponibilidad docente.",
  "Matrículas confirmadas, validadas o válidas.",
];

const VIEW_TABS = [
  { id: "student", label: "Por estudiante" },
  { id: "teacher", label: "Por docente" },
  { id: "classroom", label: "Por aula" },
];

function checkStatusLabel(status) {
  if (status === "ok") return { text: "Correcto", variant: "success" };
  if (status === "warning") return { text: "Advertencia", variant: "warning" };
  if (status === "error") return { text: "Pendiente", variant: "error" };
  if (status === "pending") return { text: "Sin datos", variant: "neutral" };
  return { text: "Pendiente", variant: "neutral" };
}

/** Horario con asignaciones reales (no intentos vacíos FAILED). */
function isUsableSchedule(schedule) {
  if (!schedule) return false;
  return (schedule.assignments?.length ?? 0) > 0;
}

function scheduleStatusCard(status) {
  if (status === "GENERATED") {
    return {
      variant: "success",
      title: "Horario generado correctamente",
      icon: CheckCircle2,
      border: "border-green-200 bg-green-50",
      text: "text-green-900",
    };
  }
  if (status === "PARTIAL") {
    return {
      variant: "warning",
      title: "Horario generado parcialmente",
      icon: AlertCircle,
      border: "border-amber-200 bg-amber-50",
      text: "text-amber-900",
    };
  }
  return {
    variant: "error",
    title: "No se pudo generar un horario válido",
    icon: XCircle,
    border: "border-red-200 bg-red-50",
    text: "text-red-900",
  };
}

function filterAssignments(schedule, view, entityId) {
  if (!schedule?.assignments?.length || !entityId) return [];
  const id = String(entityId);
  if (view === "student") {
    return schedule.assignments.filter((a) =>
      (a.students || []).some((s) => String(s._id || s) === id)
    );
  }
  if (view === "teacher") {
    return schedule.assignments.filter(
      (a) => String(a.teacher?._id || a.teacher) === id
    );
  }
  return schedule.assignments.filter(
    (a) => String(a.classroom?._id || a.classroom) === id
  );
}

export default function SchedulesPage() {
  const [precheck, setPrecheck] = useState(null);
  const [latest, setLatest] = useState(null);
  const [generation, setGeneration] = useState(null);
  const [stats, setStats] = useState(null);
  const [loadingPrecheck, setLoadingPrecheck] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [generateError, setGenerateError] = useState(null);
  const [generating, setGenerating] = useState(false);

  const [view, setView] = useState("student");
  const [entityId, setEntityId] = useState("");
  const [students, setStudents] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [classrooms, setClassrooms] = useState([]);

  const loadData = useCallback(async () => {
    setLoadingPrecheck(true);
    setLoadError(null);
    try {
      const [pc, lat] = await Promise.all([
        scheduleService.getSchedulePrecheck(),
        scheduleService.getLatestSchedule(),
      ]);
      setPrecheck(pc);
      setLatest(isUsableSchedule(lat) ? lat : null);
    } catch (err) {
      setPrecheck(null);
      setLatest(null);
      setLoadError(
        err.response?.data?.message ||
          "No se pudo conectar con el servidor. Verifique que el backend esté activo."
      );
    } finally {
      setLoadingPrecheck(false);
    }
  }, []);

  useEffect(() => {
    loadData();
    Promise.all([
      studentService.getStudents(),
      teacherService.getTeachers(),
      classroomService.getClassrooms(),
    ])
      .then(([s, t, c]) => {
        setStudents(Array.isArray(s) ? s : []);
        setTeachers(Array.isArray(t) ? t : []);
        setClassrooms(Array.isArray(c) ? c : []);
      })
      .catch(() => {});
  }, [loadData]);

  const displaySchedule = useMemo(() => {
    const candidate = generation?.schedule || latest;
    return isUsableSchedule(candidate) ? candidate : null;
  }, [generation, latest]);

  const lastFailedAttempt =
    generation?.schedule && !isUsableSchedule(generation.schedule)
      ? generation.schedule
      : null;

  const displayStats = stats || generation?.stats;

  async function handleGenerate() {
    setGenerating(true);
    setGenerateError(null);
    try {
      const result = await scheduleService.generateSchedule(PERIOD);
      setGeneration(result);
      setStats(result.stats || null);
      if (isUsableSchedule(result.schedule)) {
        setLatest(result.schedule);
      } else {
        setGenerateError(
          "La generación no produjo asignaciones. Revise matrículas, docentes, aulas y disponibilidad."
        );
      }
      const pc = await scheduleService.getSchedulePrecheck();
      setPrecheck(pc);
    } catch (err) {
      setGenerateError(
        err.response?.data?.message || "Error al generar el horario."
      );
    } finally {
      setGenerating(false);
    }
  }

  const gridAssignments = useMemo(
    () => filterAssignments(displaySchedule, view, entityId),
    [displaySchedule, view, entityId]
  );

  const entityOptions =
    view === "student"
      ? students.map((s) => ({
          id: s._id || s.id,
          label: s.fullName || s.name || s.email,
        }))
      : view === "teacher"
        ? teachers.map((t) => ({
            id: t._id || t.id,
            label: t.fullName || t.email,
          }))
        : classrooms.map((r) => ({
            id: r._id || r.id,
            label: `${r.code || ""} — ${r.name || r.type || ""}`.trim(),
          }));

  const resultMeta = displaySchedule
    ? scheduleStatusCard(displaySchedule.status)
    : null;
  const ResultIcon = resultMeta?.icon;

  const canGenerate = precheck?.canGenerate ?? false;

  return (
    <div className="space-y-8">
      <PageHeader
        title="Horarios académicos"
        subtitle="Genera horarios válidos y consulta la programación por estudiante, docente y aula."
      />

      {/* A. Resumen */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {SUMMARY_CARDS.map(({ key, fallbackKey, label, icon: Icon }) => (
          <Card key={key} className="flex items-start gap-3 p-4 sm:p-5">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-sgoha-primary">
              <Icon className="h-5 w-5" strokeWidth={2} />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                {label}
              </p>
              <p className="mt-1 text-2xl font-bold text-slate-900">
                {loadingPrecheck
                  ? "—"
                  : (precheck?.summary?.[key] ??
                    precheck?.summary?.[fallbackKey] ??
                    0)}
              </p>
            </div>
          </Card>
        ))}
      </section>

      {loadError && (
        <Card className="border-red-200 bg-red-50 p-4 text-sm text-red-800">
          {loadError}
        </Card>
      )}

      {/* B. Prevalidación */}
      <Card className="p-5 sm:p-6">
        <h3 className="text-lg font-semibold text-slate-900">
          Prevalidación de recursos
        </h3>
        <p className="mt-1 text-sm text-slate-500">
          Revise que existan datos suficientes antes de ejecutar el motor CSP.
        </p>

        {loadingPrecheck ? (
          <p className="mt-6 flex items-center gap-2 text-sm text-slate-500">
            <Loader2 className="h-4 w-4 animate-spin" />
            Cargando validaciones...
          </p>
        ) : (
          <>
            <ul className="mt-5 divide-y divide-slate-100 rounded-xl border border-slate-200">
              {(precheck?.checks || []).map((item) => {
                const st = checkStatusLabel(item.status);
                return (
                  <li
                    key={item.id}
                    className="flex flex-col gap-2 px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div>
                      <p className="font-medium text-slate-800">{item.label}</p>
                      <p className="text-sm text-slate-500">{item.message}</p>
                    </div>
                    <Badge variant={st.variant}>{st.text}</Badge>
                  </li>
                );
              })}
            </ul>

            {precheck?.warnings?.length > 0 && (
              <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50/60 px-4 py-3">
                <p className="text-sm font-semibold text-amber-900">
                  Advertencias detectadas
                </p>
                <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-amber-800">
                  {precheck.warnings.map((w, i) => (
                    <li key={i}>{w}</li>
                  ))}
                </ul>
              </div>
            )}

            {!loadingPrecheck && (precheck?.summary?.eligibleEnrollments ?? 0) === 0 && (
              <p className="mt-4 text-sm text-slate-600">
                Datos en tiempo real desde MongoDB. Para habilitar la generación,
                valide y confirme matrículas en{" "}
                <Link
                  to="/enrollments"
                  className="inline-flex items-center gap-1 font-semibold text-sgoha-primary hover:underline"
                >
                  Matrícula
                  <ExternalLink className="h-3.5 w-3.5" />
                </Link>
                .
              </p>
            )}
          </>
        )}
      </Card>

      {/* C. Generación */}
      <Card className="p-5 sm:p-6">
        <h3 className="text-lg font-semibold text-slate-900">
          Generación automática de horarios
        </h3>
        <p className="mt-1 text-sm text-slate-600">
          El motor CSP asignará cursos a docentes, aulas y franjas horarias
          oficiales.
        </p>
        <p className="mt-2 text-xs font-medium uppercase tracking-wide text-slate-400">
          Algoritmo
        </p>
        <p className="text-sm font-medium text-sgoha-primary">
          CSP básico por backtracking
        </p>
        <ul className="mt-3 grid gap-1 sm:grid-cols-2">
          {CSP_RULES.map((rule) => (
            <li
              key={rule}
              className="flex items-center gap-2 text-sm text-slate-600"
            >
              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-sgoha-secondary" />
              {rule}
            </li>
          ))}
        </ul>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={handleGenerate}
            disabled={generating || !canGenerate}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-sgoha-primary px-5 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-blue-900 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {generating ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Generando horario...
              </>
            ) : (
              <>
                <Zap className="h-4 w-4" />
                Generar horario
              </>
            )}
          </button>
          {!canGenerate && !loadingPrecheck && (
            <p className="text-sm text-red-600">
              Complete los requisitos de prevalidación para habilitar la
              generación (matrículas listas, cursos y franjas HORALV).
            </p>
          )}
          {generateError && (
            <p className="w-full text-sm text-red-600">{generateError}</p>
          )}
        </div>
      </Card>

      {lastFailedAttempt?.conflicts?.length > 0 && !displaySchedule && (
        <section className="space-y-3">
          <h3 className="text-lg font-semibold text-slate-900">
            Último intento sin asignaciones
          </h3>
          <ConflictList conflicts={lastFailedAttempt.conflicts} />
        </section>
      )}

      {/* D. Resultado */}
      {displaySchedule && resultMeta && (
        <section className="space-y-4">
          <h3 className="text-lg font-semibold text-slate-900">
            Resultado de generación
          </h3>
          <Card className={`border p-5 sm:p-6 ${resultMeta.border}`}>
            <div className="flex items-start gap-3">
              {ResultIcon && (
                <ResultIcon
                  className={`h-6 w-6 shrink-0 ${resultMeta.text}`}
                />
              )}
              <div className="min-w-0 flex-1">
                <p className={`font-semibold ${resultMeta.text}`}>
                  {resultMeta.title}
                </p>
                <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
                  <div>
                    <p className="text-xs text-slate-500">Cursos asignados</p>
                    <p className="font-semibold text-slate-900">
                      {displayStats?.coursesAssigned ??
                        displaySchedule.assignments?.length ??
                        0}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Docentes</p>
                    <p className="font-semibold text-slate-900">
                      {displayStats?.teachersUsed ?? "—"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Aulas</p>
                    <p className="font-semibold text-slate-900">
                      {displayStats?.classroomsUsed ?? "—"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Estudiantes</p>
                    <p className="font-semibold text-slate-900">
                      {displayStats?.studentsConsidered ?? "—"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Tiempo</p>
                    <p className="font-semibold text-slate-900">
                      {displayStats?.generationMs != null
                        ? `${displayStats.generationMs} ms`
                        : "—"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Conflictos</p>
                    <p className="font-semibold text-slate-900">
                      {displayStats?.conflictsCount ??
                        displaySchedule.conflicts?.length ??
                        0}
                    </p>
                  </div>
                </div>
                <div className="mt-3">
                  <Badge variant={resultMeta.variant}>
                    {displaySchedule.status}
                  </Badge>
                  <span className="ml-2 text-sm text-slate-500">
                    Periodo {displaySchedule.period || PERIOD}
                  </span>
                </div>
              </div>
            </div>
          </Card>

          {displaySchedule.conflicts?.length > 0 && (
            <ConflictList conflicts={displaySchedule.conflicts} />
          )}
        </section>
      )}

      {/* E–F. Consulta */}
      <section className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">
            Consultar horarios
          </h3>
          <p className="mt-1 text-sm text-slate-500">
            Vistas filtradas desde la misma programación general del sistema.
          </p>
        </div>

        {!displaySchedule ? (
          <Card className="p-8 text-center text-slate-500">
            Genere un horario para consultar la grilla por estudiante, docente o
            aula.
          </Card>
        ) : (
          <Card className="space-y-5 p-5 sm:p-6">
            <div className="inline-flex rounded-xl border border-slate-200 bg-slate-50 p-1">
              {VIEW_TABS.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => {
                    setView(tab.id);
                    setEntityId("");
                  }}
                  className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                    view === tab.id
                      ? "bg-white text-sgoha-primary shadow-sm"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="max-w-md">
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                {view === "student"
                  ? "Estudiante"
                  : view === "teacher"
                    ? "Docente"
                    : "Aula"}
              </label>
              <select
                value={entityId}
                onChange={(e) => setEntityId(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm focus:border-sgoha-secondary focus:outline-none focus:ring-2 focus:ring-blue-100"
              >
                <option value="">Seleccione...</option>
                {entityOptions.map((opt) => (
                  <option key={opt.id} value={opt.id}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {!entityId ? (
              <p className="text-sm text-slate-500">
                Elija un registro para ver la grilla semanal HORALV.
              </p>
            ) : gridAssignments.length === 0 ? (
              <p className="text-sm text-amber-700">
                No hay asignaciones para esta selección en el último horario
                generado.
              </p>
            ) : (
              <WeeklyGrid assignments={gridAssignments} variant={view} />
            )}
          </Card>
        )}
      </section>
    </div>
  );
}
