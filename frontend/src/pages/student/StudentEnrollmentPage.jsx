import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ShieldCheck,
  ClipboardCheck,
  BookOpen,
  Calendar,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  GraduationCap,
  ListChecks,
  Info,
  Mail,
  IdCard,
  Award,
} from "lucide-react";
import PageHeader from "../../components/ui/PageHeader.jsx";
import Card from "../../components/ui/Card.jsx";
import Badge from "../../components/ui/Badge.jsx";
import EmptyState from "../../components/ui/EmptyState.jsx";
import { studentPortalService } from "../../services/studentPortalService.js";
import {
  MIN_CREDITS,
  MAX_CREDITS,
  ENROLLMENT_STATUS_LABEL,
  ENROLLMENT_STATUS_BADGE,
} from "../../utils/enrollmentConstants.js";
import {
  CLASSROOM_TYPE_LABELS,
  CLASSROOM_TYPE_BADGE,
} from "../../utils/courseLabels.js";

function getInitials(name = "") {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase())
    .join("");
}

function formatDate(value) {
  if (!value) return null;
  try {
    return new Date(value).toLocaleString("es-PE", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return value;
  }
}

/**
 * Dashboard académico de "Mi matrícula" para el rol STUDENT.
 *
 * Esta vista es de **solo lectura**: el alumno consulta el estado de su
 * matrícula, los cursos seleccionados con detalle, los mensajes de validación
 * y el avance del proceso. Las acciones de agregar / quitar cursos y
 * confirmar la matrícula viven en `/student/enrollment-validation` para
 * mantener un único flujo de selección y validación.
 */
export default function StudentEnrollmentPage() {
  const [bundle, setBundle] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      const data = await studentPortalService.getMyEnrollment();
      setBundle(data);
    } catch {
      setBundle(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const student = bundle?.student;
  const enrollment = bundle?.enrollment;
  const courses = enrollment?.courses || [];
  const status = enrollment?.status;
  const messages = enrollment?.validationMessages || [];

  const totalCredits = useMemo(
    () => courses.reduce((sum, c) => sum + (c.credits || 0), 0),
    [courses]
  );

  const stats = useMemo(() => {
    const types = courses.reduce(
      (acc, c) => {
        const key = c.classroomTypeRequired;
        if (key === "LAB") acc.lab += 1;
        else if (key === "COMPUTER_ROOM") acc.computer += 1;
        else acc.standard += 1;
        return acc;
      },
      { standard: 0, lab: 0, computer: 0 }
    );
    return { ...types };
  }, [courses]);

  const progressPct = Math.min(
    100,
    Math.round((totalCredits / MAX_CREDITS) * 100)
  );

  const heroState = computeHeroState({ status, totalCredits });

  // Checklist de avance académico (timeline)
  const steps = [
    {
      id: "select",
      label: "Selección de cursos",
      done: courses.length > 0,
      description: courses.length
        ? `${courses.length} curso(s) seleccionado(s)`
        : "Aún no agregaste cursos a tu selección",
    },
    {
      id: "validate",
      label: "Validación de prerrequisitos y créditos",
      done: status === "VALID" || status === "CONFIRMED",
      description:
        status === "VALID" || status === "CONFIRMED"
          ? "Cumple las reglas académicas"
          : "Falta validar la selección actual",
    },
    {
      id: "confirm",
      label: "Confirmación de matrícula",
      done: status === "CONFIRMED",
      description:
        status === "CONFIRMED"
          ? "Tu matrícula está confirmada"
          : "Pendiente de confirmación",
    },
    {
      id: "schedule",
      label: "Generación de horario",
      done: false,
      description: "Disponible al cierre del periodo",
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Mi matrícula"
        subtitle="Resumen completo de tu matrícula académica del periodo."
      >
        <Link
          to="/student/enrollment-validation"
          className="inline-flex items-center gap-2 rounded-xl bg-sgoha-primary px-4 py-2 text-sm font-semibold text-white shadow-md hover:bg-blue-900"
        >
          <ShieldCheck className="h-4 w-4" />
          Gestionar y validar
        </Link>
      </PageHeader>

      {loading ? (
        <div className="flex min-h-[50vh] items-center justify-center text-slate-500">
          Cargando tu matrícula...
        </div>
      ) : !student ? (
        <Card className="border-amber-200 bg-amber-50 p-5">
          <div className="flex items-start gap-3">
            <AlertTriangle className="mt-0.5 h-5 w-5 text-amber-700" />
            <div>
              <p className="text-sm font-semibold text-amber-900">
                Perfil de alumno no vinculado
              </p>
              <p className="mt-1 text-sm text-amber-800">
                Contacta al administrador para que registre tu perfil de
                estudiante con tu correo institucional.
              </p>
            </div>
          </div>
        </Card>
      ) : (
        <>
          <HeroCard
            student={student}
            heroState={heroState}
            totalCredits={totalCredits}
            coursesCount={courses.length}
            progressPct={progressPct}
            status={status}
          />

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <MiniStat
              icon={BookOpen}
              label="AULAS ESTÁNDAR"
              value={stats.standard}
              tone="blue"
            />
            <MiniStat
              icon={GraduationCap}
              label="LABORATORIOS"
              value={stats.lab}
              tone="amber"
            />
            <MiniStat
              icon={Calendar}
              label="SALAS DE CÓMPUTO"
              value={stats.computer}
              tone="emerald"
            />
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
            <div className="space-y-5">
              <SelectedCoursesSection courses={courses} />
              <ValidationMessagesSection
                messages={messages}
                status={status}
                hasCourses={courses.length > 0}
              />
            </div>

            <div className="space-y-5">
              <StudentSummaryCard student={student} />
              <EnrollmentTimeline steps={steps} />
              <NextActionCard status={status} hasCourses={courses.length > 0} />
              <UpdatedAtCard enrollment={enrollment} />
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function computeHeroState({ status, totalCredits }) {
  if (status === "CONFIRMED") {
    return {
      key: "CONFIRMED",
      title: "¡Matrícula confirmada!",
      message:
        "Tu matrícula del periodo está confirmada. Pronto recibirás tu horario académico.",
      gradient: "from-emerald-600 via-emerald-700 to-emerald-900",
      icon: CheckCircle2,
      badgeTone: "bg-emerald-400/20 text-emerald-100 ring-emerald-300/40",
    };
  }
  if (status === "VALID") {
    return {
      key: "VALID",
      title: "Tu selección es válida",
      message:
        "Cumple prerrequisitos y rango de créditos. Confírmala desde Validación de matrícula.",
      gradient: "from-blue-600 via-blue-700 to-sgoha-primary",
      icon: ShieldCheck,
      badgeTone: "bg-blue-400/20 text-blue-100 ring-blue-300/40",
    };
  }
  if (status === "INVALID") {
    return {
      key: "INVALID",
      title: "Aún hay observaciones por resolver",
      message:
        "Revisa los mensajes de validación y ajusta tu selección de cursos.",
      gradient: "from-rose-600 via-rose-700 to-rose-900",
      icon: XCircle,
      badgeTone: "bg-rose-400/20 text-rose-100 ring-rose-300/40",
    };
  }
  if (status === "DRAFT" || totalCredits > 0) {
    return {
      key: "DRAFT",
      title: "Tu matrícula está en construcción",
      message:
        "Sigue agregando cursos en Validación de matrícula y valida tu selección.",
      gradient: "from-amber-500 via-amber-600 to-amber-800",
      icon: ClipboardCheck,
      badgeTone: "bg-amber-300/20 text-amber-50 ring-amber-200/40",
    };
  }
  return {
    key: "EMPTY",
    title: "Aún no inicias tu matrícula",
    message:
      "Ve a Validación de matrícula para seleccionar tus cursos del periodo.",
    gradient: "from-slate-700 via-slate-800 to-slate-900",
    icon: ClipboardCheck,
    badgeTone: "bg-slate-500/20 text-slate-100 ring-slate-400/30",
  };
}

function HeroCard({
  student,
  heroState,
  totalCredits,
  coursesCount,
  progressPct,
  status,
}) {
  const Icon = heroState.icon;
  const statusLabel = status
    ? ENROLLMENT_STATUS_LABEL[status]
    : "Sin iniciar";
  return (
    <section
      className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${heroState.gradient} p-6 text-white shadow-xl sm:p-8`}
    >
      <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-white/5 blur-2xl" />
      <div className="absolute -bottom-20 -left-10 h-72 w-72 rounded-full bg-white/5 blur-3xl" />

      <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="flex items-start gap-4">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/15 ring-1 ring-white/20">
            <Icon className="h-6 w-6" />
          </span>
          <div>
            <span
              className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ring-1 ${heroState.badgeTone}`}
            >
              {statusLabel}
            </span>
            <h2 className="mt-2 text-xl font-bold sm:text-2xl">
              {heroState.title}
            </h2>
            <p className="mt-1 max-w-xl text-sm text-white/85">
              {heroState.message}
            </p>
            {student?.isNewStudent && (
              <p className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-medium ring-1 ring-white/20">
                <Sparkles className="h-3 w-3" />
                Primera matrícula: sin restricciones de prerrequisitos
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:min-w-[420px]">
          <HeroStat label="Créditos" value={totalCredits} unit="/ 22" />
          <HeroStat label="Cursos" value={coursesCount} />
          <HeroStat label="Avance" value={`${progressPct}%`} />
          <div className="col-span-2 sm:col-span-3">
            <div className="h-2 w-full overflow-hidden rounded-full bg-white/15">
              <div
                className="h-full bg-white transition-all"
                style={{ width: `${progressPct}%` }}
              />
            </div>
            <p className="mt-2 text-xs text-white/75">
              Rango permitido: {MIN_CREDITS} – {MAX_CREDITS} créditos
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function HeroStat({ label, value, unit }) {
  return (
    <div className="rounded-xl bg-white/10 px-3 py-2 ring-1 ring-white/15 backdrop-blur-sm">
      <p className="text-[10px] font-semibold uppercase tracking-wide text-white/70">
        {label}
      </p>
      <p className="mt-0.5 text-xl font-bold">
        {value}
        {unit && (
          <span className="ml-1 text-xs font-medium text-white/70">
            {unit}
          </span>
        )}
      </p>
    </div>
  );
}

function MiniStat({ icon: Icon, label, value, tone }) {
  const palette = {
    blue: "bg-blue-50 text-sgoha-secondary",
    amber: "bg-amber-50 text-amber-600",
    emerald: "bg-emerald-50 text-emerald-600",
  }[tone];
  return (
    <Card className="flex items-center justify-between gap-3 p-4">
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">
          {label}
        </p>
        <p className="mt-1 text-2xl font-bold text-slate-900">{value}</p>
      </div>
      <span
        className={`flex h-10 w-10 items-center justify-center rounded-xl ${palette}`}
      >
        <Icon className="h-5 w-5" />
      </span>
    </Card>
  );
}

function SelectedCoursesSection({ courses }) {
  return (
    <Card className="overflow-hidden">
      <header className="flex items-center justify-between gap-3 border-b border-slate-100 px-5 py-4">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-sgoha-primary">
            <BookOpen className="h-4 w-4" />
          </span>
          <div>
            <h3 className="text-base font-semibold text-slate-900">
              Cursos seleccionados
            </h3>
            <p className="text-xs text-slate-500">
              Detalle de los cursos incluidos en tu matrícula actual.
            </p>
          </div>
        </div>
        <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-700">
          {courses.length} cursos
        </span>
      </header>

      {courses.length === 0 ? (
        <EmptyState
          icon={BookOpen}
          title="Aún no tienes cursos seleccionados"
          description="Ve a Validación de matrícula para empezar a armar tu selección del periodo."
          action={
            <Link
              to="/student/enrollment-validation"
              className="inline-flex items-center gap-2 rounded-xl bg-sgoha-primary px-4 py-2 text-sm font-semibold text-white shadow-md hover:bg-blue-900"
            >
              Ir a Validación
              <ArrowRight className="h-4 w-4" />
            </Link>
          }
        />
      ) : (
        <>
          <div className="hidden overflow-x-auto lg:block">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/80 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  <th className="px-5 py-3">Curso</th>
                  <th className="px-5 py-3">Créditos</th>
                  <th className="px-5 py-3">Tipo de aula</th>
                  <th className="px-5 py-3">Prerrequisitos</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {courses.map((c) => (
                  <tr key={c._id} className="hover:bg-slate-50/60">
                    <td className="px-5 py-3 align-top">
                      <p className="font-semibold text-slate-900">{c.name}</p>
                      <p className="text-xs font-semibold text-sgoha-primary">
                        {c.code}
                      </p>
                    </td>
                    <td className="px-5 py-3 align-top">
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700">
                        <Award className="h-3 w-3" />
                        {c.credits}
                      </span>
                    </td>
                    <td className="px-5 py-3 align-top">
                      <Badge
                        variant={
                          CLASSROOM_TYPE_BADGE[c.classroomTypeRequired] ||
                          "info"
                        }
                      >
                        {CLASSROOM_TYPE_LABELS[c.classroomTypeRequired] ||
                          c.classroomTypeRequired ||
                          "—"}
                      </Badge>
                    </td>
                    <td className="px-5 py-3 align-top">
                      <PrereqPills prerequisites={c.prerequisites} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="divide-y divide-slate-100 lg:hidden">
            {courses.map((c) => (
              <article key={c._id} className="space-y-2 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-semibold text-slate-900">{c.name}</p>
                    <p className="text-xs font-semibold text-sgoha-primary">
                      {c.code}
                    </p>
                  </div>
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700">
                    <Award className="h-3 w-3" />
                    {c.credits} cr.
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge
                    variant={
                      CLASSROOM_TYPE_BADGE[c.classroomTypeRequired] || "info"
                    }
                  >
                    {CLASSROOM_TYPE_LABELS[c.classroomTypeRequired] ||
                      c.classroomTypeRequired ||
                      "—"}
                  </Badge>
                  <PrereqPills prerequisites={c.prerequisites} />
                </div>
              </article>
            ))}
          </div>
        </>
      )}
    </Card>
  );
}

function PrereqPills({ prerequisites }) {
  if (!prerequisites?.length) {
    return (
      <span className="text-xs italic text-slate-400">
        Sin prerrequisitos
      </span>
    );
  }
  return (
    <div className="flex flex-wrap gap-1">
      {prerequisites.map((p) => (
        <span
          key={p._id || p}
          className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-700"
        >
          {typeof p === "object" ? p.code : p}
        </span>
      ))}
    </div>
  );
}

function ValidationMessagesSection({ messages, status, hasCourses }) {
  if (!hasCourses) return null;
  return (
    <Card className="overflow-hidden">
      <header className="flex items-center gap-3 border-b border-slate-100 px-5 py-4">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-sgoha-primary">
          <ListChecks className="h-4 w-4" />
        </span>
        <div>
          <h3 className="text-base font-semibold text-slate-900">
            Mensajes de validación
          </h3>
          <p className="text-xs text-slate-500">
            Resultado de la última validación realizada por el sistema.
          </p>
        </div>
      </header>
      <div className="space-y-2 p-5">
        {messages.length === 0 ? (
          <p className="rounded-xl border border-dashed border-slate-200 bg-slate-50/60 px-4 py-3 text-sm text-slate-500">
            Aún no se ha validado tu selección. Ve a{" "}
            <Link
              to="/student/enrollment-validation"
              className="font-semibold text-sgoha-primary underline-offset-2 hover:underline"
            >
              Validación de matrícula
            </Link>
            .
          </p>
        ) : (
          messages.map((m, idx) => {
            const tone = inferMessageTone(m, status);
            return <MessageRow key={`${idx}-${m}`} tone={tone} text={m} />;
          })
        )}
      </div>
    </Card>
  );
}

function inferMessageTone(msg, status) {
  const lower = msg.toLowerCase();
  if (lower.includes("válida")) return "success";
  if (lower.includes("estudiante nuevo")) return "info";
  if (
    lower.includes("supera") ||
    lower.includes("repetidos") ||
    lower.includes("no existen") ||
    lower.includes("aprobó") ||
    lower.includes("prerrequisito")
  )
    return "error";
  if (lower.includes("insuficientes")) return "warn";
  return status === "VALID" || status === "CONFIRMED" ? "success" : "info";
}

function MessageRow({ tone, text }) {
  const palette =
    tone === "success"
      ? {
          ring: "border-emerald-200 bg-emerald-50 text-emerald-800",
          Icon: CheckCircle2,
          iconBg: "text-emerald-600",
        }
      : tone === "warn"
        ? {
            ring: "border-amber-200 bg-amber-50 text-amber-800",
            Icon: AlertTriangle,
            iconBg: "text-amber-600",
          }
        : tone === "error"
          ? {
              ring: "border-red-200 bg-red-50 text-red-800",
              Icon: XCircle,
              iconBg: "text-red-600",
            }
          : {
              ring: "border-blue-200 bg-blue-50 text-blue-800",
              Icon: Info,
              iconBg: "text-blue-600",
            };
  const { Icon } = palette;
  return (
    <div
      className={`flex items-start gap-2 rounded-xl border px-3 py-2 text-sm ${palette.ring}`}
    >
      <Icon className={`mt-0.5 h-4 w-4 shrink-0 ${palette.iconBg}`} />
      <span className="leading-snug">{text}</span>
    </div>
  );
}

function StudentSummaryCard({ student }) {
  return (
    <Card className="p-5">
      <div className="flex items-start gap-3">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-sgoha-primary text-sm font-bold text-white">
          {getInitials(student.fullName) || "·"}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-slate-900">
            {student.fullName}
          </p>
          <p className="truncate text-xs text-slate-500">
            {student.program || "Sin programa registrado"}
          </p>
          <div className="mt-1.5 flex flex-wrap gap-1.5">
            <Badge variant={student.active !== false ? "success" : "neutral"}>
              {student.active !== false ? "Activo" : "Inactivo"}
            </Badge>
            {student.isNewStudent && (
              <Badge variant="info">
                <Sparkles className="mr-1 inline h-3 w-3" />
                Nuevo
              </Badge>
            )}
          </div>
        </div>
      </div>
      <dl className="mt-4 space-y-2 text-sm">
        <SummaryRow
          icon={IdCard}
          label="Código"
          value={student.code || "—"}
        />
        <SummaryRow icon={Mail} label="Correo" value={student.email} />
        <SummaryRow
          icon={BookOpen}
          label="Cursos aprobados"
          value={`${student.approvedCourses?.length || 0}`}
        />
      </dl>
    </Card>
  );
}

function SummaryRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center justify-between gap-2 rounded-lg bg-slate-50 px-3 py-2">
      <dt className="flex items-center gap-2 text-xs font-medium text-slate-500">
        <Icon className="h-3.5 w-3.5" />
        {label}
      </dt>
      <dd className="truncate text-xs font-semibold text-slate-800">
        {value}
      </dd>
    </div>
  );
}

function EnrollmentTimeline({ steps }) {
  return (
    <Card className="p-5">
      <h3 className="text-sm font-semibold text-slate-900">
        Avance de tu matrícula
      </h3>
      <ol className="mt-4 space-y-3">
        {steps.map((step, idx) => {
          const last = idx === steps.length - 1;
          return (
            <li key={step.id} className="relative flex gap-3">
              {!last && (
                <span
                  className={`absolute left-3 top-7 h-full w-px ${
                    step.done ? "bg-emerald-200" : "bg-slate-200"
                  }`}
                  aria-hidden
                />
              )}
              <span
                className={`relative z-10 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                  step.done
                    ? "bg-emerald-600 text-white"
                    : "bg-slate-100 text-slate-500"
                }`}
              >
                {step.done ? <CheckCircle2 className="h-3.5 w-3.5" /> : idx + 1}
              </span>
              <div className="-mt-0.5">
                <p
                  className={`text-sm font-semibold ${
                    step.done ? "text-slate-900" : "text-slate-600"
                  }`}
                >
                  {step.label}
                </p>
                <p className="text-xs text-slate-500">{step.description}</p>
              </div>
            </li>
          );
        })}
      </ol>
    </Card>
  );
}

function NextActionCard({ status, hasCourses }) {
  const cta = computeCTA({ status, hasCourses });
  return (
    <Link
      to={cta.to}
      className="group block overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-blue-300 hover:shadow-md"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <span
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${cta.iconBg}`}
          >
            <cta.icon className="h-5 w-5" />
          </span>
          <div>
            <p className="text-sm font-semibold text-slate-900">{cta.title}</p>
            <p className="text-xs text-slate-500">{cta.description}</p>
          </div>
        </div>
        <ArrowRight className="h-4 w-4 text-slate-400 transition group-hover:translate-x-1 group-hover:text-sgoha-primary" />
      </div>
    </Link>
  );
}

function computeCTA({ status, hasCourses }) {
  if (status === "CONFIRMED") {
    return {
      to: "/student/schedule",
      title: "Ver mi horario",
      description: "Consulta el horario asignado.",
      icon: Calendar,
      iconBg: "bg-emerald-50 text-emerald-600",
    };
  }
  if (status === "VALID") {
    return {
      to: "/student/enrollment-validation",
      title: "Confirmar matrícula",
      description: "Tu selección es válida, confírmala.",
      icon: CheckCircle2,
      iconBg: "bg-blue-50 text-sgoha-secondary",
    };
  }
  if (!hasCourses) {
    return {
      to: "/student/enrollment-validation",
      title: "Seleccionar cursos",
      description: "Inicia tu matrícula del periodo.",
      icon: BookOpen,
      iconBg: "bg-amber-50 text-amber-600",
    };
  }
  return {
    to: "/student/enrollment-validation",
    title: "Validar mi selección",
    description: "Verifica prerrequisitos y créditos.",
    icon: ShieldCheck,
    iconBg: "bg-blue-50 text-sgoha-secondary",
  };
}

function UpdatedAtCard({ enrollment }) {
  if (!enrollment?.updatedAt) return null;
  const formatted = formatDate(enrollment.updatedAt);
  return (
    <p className="rounded-xl border border-slate-100 bg-slate-50/60 px-3 py-2 text-[11px] text-slate-500">
      Última actualización: <span className="font-medium">{formatted}</span>
    </p>
  );
}
