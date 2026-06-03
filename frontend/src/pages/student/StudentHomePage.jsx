import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ClipboardCheck,
  BookOpen,
  Clock,
  ShieldCheck,
  AlertTriangle,
  ArrowRight,
} from "lucide-react";
import { useAuth } from "../../hooks/useAuth.js";
import PageHeader from "../../components/ui/PageHeader.jsx";
import StatCard from "../../components/ui/StatCard.jsx";
import Card from "../../components/ui/Card.jsx";
import Badge from "../../components/ui/Badge.jsx";
import { studentPortalService } from "../../services/studentPortalService.js";
import {
  ENROLLMENT_STATUS_LABEL,
  ENROLLMENT_STATUS_BADGE,
} from "../../utils/enrollmentConstants.js";

export default function StudentHomePage() {
  const { user } = useAuth();
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [linkError, setLinkError] = useState(false);

  useEffect(() => {
    studentPortalService
      .getMySummary()
      .then((data) => {
        if (!data?.student) setLinkError(true);
        setSummary(data);
      })
      .catch(() => setLinkError(true))
      .finally(() => setLoading(false));
  }, []);

  const student = summary?.student;
  const status = summary?.status;
  const statusLabel = status ? ENROLLMENT_STATUS_LABEL[status] : "Pendiente";
  const statusVariant = status ? ENROLLMENT_STATUS_BADGE[status] : "neutral";

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Bienvenido, ${user?.name?.split(" ")[0] || "Alumno"}`}
        subtitle="Gestiona tu matrícula y consulta tu horario académico."
      />

      {linkError && (
        <Card className="flex items-start gap-3 border-amber-200 bg-amber-50 p-4 text-amber-900">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" />
          <div>
            <p className="text-sm font-semibold">
              Perfil de alumno no vinculado
            </p>
            <p className="mt-1 text-sm">
              Pide al administrador que registre tu perfil de estudiante con tu
              correo institucional para habilitar la matrícula.
            </p>
          </div>
        </Card>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          icon={ShieldCheck}
          label="ESTADO DE MATRÍCULA"
          value={statusLabel}
          hint={
            status === "CONFIRMED"
              ? "Matrícula confirmada"
              : "Sigue los pasos en Mi matrícula"
          }
          accent={
            status === "CONFIRMED"
              ? "green"
              : status === "VALID" || status === "VALIDATED"
                ? "green"
                : status === "INVALID" || status === "REJECTED"
                  ? "red"
                  : "slate"
          }
        />
        <StatCard
          icon={ClipboardCheck}
          label="CRÉDITOS SELECCIONADOS"
          value={summary?.totalCredits ?? 0}
          hint="Mínimo 20 · Máximo 22"
        />
        <StatCard
          icon={BookOpen}
          label="CURSOS SELECCIONADOS"
          value={summary?.coursesCount ?? 0}
          hint="En tu matrícula actual"
        />
        <StatCard
          icon={Clock}
          label="HORARIO GENERADO"
          value={summary?.scheduleStatus ?? "Pendiente"}
          hint={
            (summary?.scheduleBlocks ?? 0) > 0
              ? `${summary.scheduleBlocks} bloque(s) en tu horario`
              : "Disponible tras generación administrativa"
          }
          accent={(summary?.scheduleBlocks ?? 0) > 0 ? "green" : "amber"}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="p-5 sm:p-6">
          <h3 className="text-base font-semibold text-slate-900">
            Acciones rápidas
          </h3>
          <p className="mt-1 text-sm text-slate-500">
            Avanza paso a paso en tu matrícula del período.
          </p>
          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <QuickAction
              to="/student/enrollment-validation"
              icon={ShieldCheck}
              label="Seleccionar y validar cursos"
              accent="bg-blue-50 text-sgoha-secondary"
            />
            <QuickAction
              to="/student/enrollment"
              icon={ClipboardCheck}
              label="Ver mi matrícula"
              accent="bg-amber-50 text-amber-600"
            />
            <QuickAction
              to="/student/schedule"
              icon={Clock}
              label="Ver mi horario"
              accent="bg-slate-100 text-slate-600"
            />
            <QuickAction
              to="/student/profile"
              icon={BookOpen}
              label="Perfil académico"
              accent="bg-green-50 text-green-600"
            />
          </div>
        </Card>

        <Card className="p-5 sm:p-6">
          <h3 className="text-base font-semibold text-slate-900">
            Información académica
          </h3>
          <dl className="mt-4 space-y-3 text-sm">
            <InfoRow label="Código" value={student?.code || "—"} />
            <InfoRow
              label="Nombre"
              value={student?.fullName || user?.name || "—"}
            />
            <InfoRow
              label="Correo"
              value={student?.email || user?.email || "—"}
            />
            <InfoRow
              label="Programa"
              value={student?.program || "Por asignar"}
            />
            <div className="flex items-center justify-between gap-2 rounded-lg bg-slate-50 px-3 py-2">
              <dt className="text-slate-500">Estado matrícula</dt>
              <dd>
                <Badge variant={statusVariant}>{statusLabel}</Badge>
              </dd>
            </div>
          </dl>
        </Card>
      </div>

      {loading && (
        <p className="text-sm text-slate-400">Cargando información...</p>
      )}
    </div>
  );
}

function QuickAction({ to, icon: Icon, label, accent }) {
  return (
    <Link
      to={to}
      className="group flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-4 transition hover:border-blue-300 hover:shadow-md"
    >
      <span className="flex items-center gap-3">
        <span
          className={`flex h-10 w-10 items-center justify-center rounded-xl ${accent}`}
        >
          <Icon className="h-5 w-5" />
        </span>
        <span className="text-sm font-semibold text-slate-800">{label}</span>
      </span>
      <ArrowRight className="h-4 w-4 text-slate-400 transition group-hover:translate-x-1 group-hover:text-blue-600" />
    </Link>
  );
}

function InfoRow({ label, value }) {
  return (
    <div className="flex items-center justify-between gap-2 rounded-lg bg-slate-50 px-3 py-2">
      <dt className="text-slate-500">{label}</dt>
      <dd className="truncate font-medium text-slate-900">{value}</dd>
    </div>
  );
}
