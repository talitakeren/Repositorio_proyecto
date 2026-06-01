import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  CalendarClock,
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
import { teacherPortalService } from "../../services/teacherPortalService.js";
import { countAvailabilityStats } from "../../constants/timeBlocks.js";

export default function TeacherHomePage() {
  const { user } = useAuth();
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [linkError, setLinkError] = useState(false);

  useEffect(() => {
    teacherPortalService
      .getMySummary()
      .then((data) => setSummary(data))
      .catch(() => setLinkError(true))
      .finally(() => setLoading(false));
  }, []);

  const teacher = summary?.teacher;
  const { hours: weeklyHours } = countAvailabilityStats(
    teacher?.availability || []
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Bienvenido, ${user?.name?.split(" ")[0] || "Docente"}`}
        subtitle="Gestiona tu disponibilidad y consulta tus horarios asignados."
      />

      {linkError && (
        <Card className="flex items-start gap-3 border-amber-200 bg-amber-50 p-4 text-amber-900">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" />
          <div>
            <p className="text-sm font-semibold">Perfil docente no vinculado</p>
            <p className="mt-1 text-sm">
              Tu usuario aún no tiene un perfil docente asociado. Solicita al
              administrador que registre o vincule tu perfil para ver tus cursos
              y horarios.
            </p>
          </div>
        </Card>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          icon={BookOpen}
          label="CURSOS ASIGNADOS"
          value={summary?.coursesCount ?? 0}
          hint="Cursos que puedes dictar"
        />
        <StatCard
          icon={CalendarClock}
          label="BLOQUES DISPONIBLES"
          value={summary?.blocksCount ?? 0}
          hint={`${weeklyHours}h por semana`}
          accent="green"
        />
        <StatCard
          icon={Clock}
          label="HORARIO GENERADO"
          value={summary?.scheduleStatus ?? "Pendiente"}
          hint={
            (summary?.scheduleBlocks ?? 0) > 0
              ? `${summary.scheduleBlocks} bloque(s) asignado(s)`
              : "Se actualiza al generar horarios"
          }
          accent={(summary?.scheduleBlocks ?? 0) > 0 ? "green" : "amber"}
        />
        <StatCard
          icon={ShieldCheck}
          label="ESTADO"
          value={summary?.hasAvailability ? "Activo" : "Sin datos"}
          hint={
            summary?.hasAvailability
              ? "Disponibilidad registrada"
              : "Aún sin disponibilidad"
          }
          accent={summary?.hasAvailability ? "green" : "slate"}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="p-5 sm:p-6">
          <h3 className="text-base font-semibold text-slate-900">
            Acciones rápidas
          </h3>
          <p className="mt-1 text-sm text-slate-500">
            Mantén tu disponibilidad actualizada para la generación de horarios.
          </p>
          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Link
              to="/teacher/availability"
              className="group flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-4 transition hover:border-blue-300 hover:shadow-md"
            >
              <span className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-sgoha-secondary">
                  <CalendarClock className="h-5 w-5" />
                </span>
                <span className="text-sm font-semibold text-slate-800">
                  Actualizar disponibilidad
                </span>
              </span>
              <ArrowRight className="h-4 w-4 text-slate-400 transition group-hover:translate-x-1 group-hover:text-blue-600" />
            </Link>
            <Link
              to="/teacher/schedule"
              className="group flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-4 transition hover:border-blue-300 hover:shadow-md"
            >
              <span className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
                  <Clock className="h-5 w-5" />
                </span>
                <span className="text-sm font-semibold text-slate-800">
                  Ver mi horario
                </span>
              </span>
              <ArrowRight className="h-4 w-4 text-slate-400 transition group-hover:translate-x-1 group-hover:text-blue-600" />
            </Link>
          </div>
        </Card>

        <Card className="p-5 sm:p-6">
          <h3 className="text-base font-semibold text-slate-900">
            Información del docente
          </h3>
          <dl className="mt-4 space-y-3 text-sm">
            <div className="flex items-center justify-between gap-2 rounded-lg bg-slate-50 px-3 py-2">
              <dt className="text-slate-500">Nombre</dt>
              <dd className="truncate font-medium text-slate-900">
                {teacher?.fullName || user?.name || "—"}
              </dd>
            </div>
            <div className="flex items-center justify-between gap-2 rounded-lg bg-slate-50 px-3 py-2">
              <dt className="text-slate-500">Correo</dt>
              <dd className="truncate font-medium text-slate-900">
                {teacher?.email || user?.email || "—"}
              </dd>
            </div>
            <div className="flex items-center justify-between gap-2 rounded-lg bg-slate-50 px-3 py-2">
              <dt className="text-slate-500">Especialidad</dt>
              <dd className="truncate font-medium text-slate-900">
                {teacher?.specialty || "—"}
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
