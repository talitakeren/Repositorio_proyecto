import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  BookOpen,
  UserRound,
  Building2,
  Users,
  Clock,
  Database,
  Server,
  Cpu,
  BookPlus,
  UserPlus,
  CalendarDays,
} from "lucide-react";
import { useAuth } from "../../hooks/useAuth.js";
import { dashboardService } from "../../services/dashboardService.js";
import Card from "../../components/ui/Card.jsx";
import Badge from "../../components/ui/Badge.jsx";

const STAT_CONFIG = [
  { key: "courses", label: "CURSOS", icon: BookOpen },
  { key: "teachers", label: "DOCENTES", icon: UserRound },
  { key: "classrooms", label: "AULAS", icon: Building2 },
  { key: "students", label: "ESTUDIANTES", icon: Users },
  { key: "schedules", label: "HORARIOS", icon: Clock },
];

const STATUS_ICONS = {
  database: Database,
  server: Server,
  cpu: Cpu,
};

const STATUS_VARIANT = {
  Completado: "success",
  Validada: "info",
  "En progreso": "warning",
  Parcial: "warning",
  Observada: "warning",
  Rechazada: "error",
  Fallido: "error",
  Pendiente: "neutral",
};

function formatStatValue(key, value) {
  if (key === "students" && value >= 1000) {
    return value.toLocaleString("es-PE");
  }
  return String(value);
}

export default function DashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [summary, setSummary] = useState(null);
  const [status, setStatus] = useState([]);
  const [activity, setActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);

  const welcomeName = user?.name?.split(" ")[0] || "Admin";

  useEffect(() => {
    Promise.all([
      dashboardService.getDashboardSummary(),
      dashboardService.getSystemStatus(),
      dashboardService.getRecentActivity(),
    ])
      .then(([s, st, act]) => {
        setSummary(s);
        setStatus(st);
        setActivity(Array.isArray(act) ? act : []);
        setLoadError(null);
      })
      .catch(() => {
        setLoadError("No se pudieron cargar los datos del dashboard.");
        setSummary(null);
        setStatus([]);
        setActivity([]);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center text-gray-500">
        Cargando dashboard...
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      <div>
        <h2 className="text-xl font-bold tracking-tight text-gray-900 sm:text-2xl">
          Bienvenido, {welcomeName}
        </h2>
        <p className="mt-1 text-sm text-gray-500 sm:text-base">
          Resumen general del sistema de gestión académica.
        </p>
      </div>

      {loadError && (
        <Card className="border-red-200 bg-red-50 p-4 text-sm text-red-800">
          {loadError}
        </Card>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {STAT_CONFIG.map(({ key, label, icon: Icon }) => (
          <Card key={key} className="p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold tracking-wide text-gray-400">
                  {label}
                </p>
                <p className="mt-2 text-3xl font-bold text-gray-900">
                  {formatStatValue(key, summary?.[key] ?? 0)}
                </p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-sgoha-secondary">
                <Icon className="h-5 w-5" strokeWidth={2} />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Status + Quick actions */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="p-6">
          <h3 className="text-base font-semibold text-gray-900">Estado del sistema</h3>
          <ul className="mt-4 space-y-3">
            {status.map((item) => {
              const Icon = STATUS_ICONS[item.icon] || Server;
              return (
                <li
                  key={item.id}
                  className="flex items-center justify-between rounded-lg border border-gray-100 bg-gray-50/50 px-4 py-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-sgoha-secondary shadow-sm">
                      <Icon className="h-4 w-4" />
                    </div>
                    <span className="text-sm font-medium text-gray-800">{item.label}</span>
                  </div>
                  <Badge variant={item.ok === false ? "warning" : "success"}>
                    {item.status}
                  </Badge>
                </li>
              );
            })}
          </ul>
        </Card>

        <Card className="p-6">
          <h3 className="text-base font-semibold text-gray-900">Acciones rápidas</h3>
          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
            <button
              type="button"
              onClick={() => navigate("/courses")}
              className="flex flex-col items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white p-5 text-center transition hover:border-sgoha-secondary/40 hover:shadow-md"
            >
              <BookPlus className="h-8 w-8 text-gray-400" strokeWidth={1.5} />
              <span className="text-sm font-medium text-gray-700">Registrar curso</span>
            </button>
            <button
              type="button"
              onClick={() => navigate("/teachers")}
              className="flex flex-col items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white p-5 text-center transition hover:border-sgoha-secondary/40 hover:shadow-md"
            >
              <UserPlus className="h-8 w-8 text-gray-400" strokeWidth={1.5} />
              <span className="text-sm font-medium text-gray-700">Registrar docente</span>
            </button>
            <button
              type="button"
              onClick={() => navigate("/schedules")}
              className="flex flex-col items-center justify-center gap-2 rounded-xl bg-sgoha-primary p-5 text-center text-white shadow-lg shadow-blue-900/20 transition hover:bg-blue-900"
            >
              <CalendarDays className="h-8 w-8 text-white/90" strokeWidth={1.5} />
              <span className="text-sm font-semibold">Generar horario</span>
            </button>
          </div>
        </Card>
      </div>

      {/* Recent activity */}
      <Card className="overflow-hidden">
        <div className="flex items-center justify-between gap-2 border-b border-gray-100 px-4 py-4 sm:px-6">
          <h3 className="text-base font-semibold text-gray-900">Actividad reciente</h3>
          <button
            type="button"
            onClick={() => navigate("/enrollments")}
            className="shrink-0 text-sm font-medium text-sgoha-secondary hover:text-blue-700"
          >
            Ver matrículas
          </button>
        </div>

        {activity.length === 0 ? (
          <p className="px-6 py-8 text-center text-sm text-gray-500">
            Aún no hay actividad registrada en el sistema.
          </p>
        ) : (
          <>
        <div className="divide-y divide-gray-100 md:hidden">
          {activity.map((row) => (
            <div key={row.id} className="space-y-2 px-4 py-4">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs text-gray-500">{row.date}</span>
                <Badge variant={STATUS_VARIANT[row.status] || "info"}>
                  {row.status}
                </Badge>
              </div>
              <p className="font-medium text-gray-900">{row.action}</p>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gray-200 text-[10px] font-bold text-gray-600">
                  {row.user
                    .split(" ")
                    .map((w) => w[0])
                    .join("")
                    .slice(0, 2)
                    .toUpperCase()}
                </span>
                {row.user}
              </div>
            </div>
          ))}
        </div>

        <div className="hidden overflow-x-auto md:block">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/80 text-xs font-semibold uppercase tracking-wide text-gray-500">
                <th className="px-6 py-3">Fecha</th>
                <th className="px-6 py-3">Acción</th>
                <th className="px-6 py-3">Usuario</th>
                <th className="px-6 py-3">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {activity.map((row) => (
                <tr key={row.id} className="hover:bg-gray-50/50">
                  <td className="whitespace-nowrap px-6 py-4 text-gray-600">{row.date}</td>
                  <td className="px-6 py-4 font-medium text-gray-900">{row.action}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gray-200 text-[10px] font-bold text-gray-600">
                        {row.user
                          .split(" ")
                          .map((w) => w[0])
                          .join("")
                          .slice(0, 2)
                          .toUpperCase()}
                      </span>
                      <span className="text-gray-700">{row.user}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant={STATUS_VARIANT[row.status] || "info"}>
                      {row.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
          </>
        )}
      </Card>
    </div>
  );
}
