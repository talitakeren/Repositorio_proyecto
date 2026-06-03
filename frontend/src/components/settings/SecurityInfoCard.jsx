import { AlertTriangle, ShieldCheck, KeyRound, Route } from "lucide-react";
import Card from "../ui/Card.jsx";
import Badge from "../ui/Badge.jsx";

const ROLES = [
  { name: "Administrador", key: "ADMIN" },
  { name: "Docente", key: "TEACHER" },
  { name: "Alumno", key: "STUDENT" },
];

export default function SecurityInfoCard() {
  return (
    <Card className="p-5 sm:p-6">
      <h3 className="text-lg font-semibold text-slate-900">
        Seguridad y acceso
      </h3>
      <p className="mt-1 text-sm text-slate-500">
        Información general de autenticación y protección de rutas.
      </p>

      <div className="mt-5 space-y-4">
        <div className="rounded-xl border border-slate-200 p-4">
          <p className="text-xs font-semibold uppercase text-slate-400">
            Roles activos
          </p>
          <ul className="mt-3 flex flex-wrap gap-2">
            {ROLES.map((role) => (
              <li key={role.key}>
                <Badge variant="info">{role.name}</Badge>
              </li>
            ))}
          </ul>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="flex items-start gap-3 rounded-xl bg-slate-50 p-4">
            <KeyRound className="h-5 w-5 text-sgoha-primary" />
            <div>
              <p className="text-sm font-semibold text-slate-800">
                Autenticación
              </p>
              <p className="text-sm text-slate-600">JWT activo</p>
              <Badge variant="success" className="mt-2">
                Protegido
              </Badge>
            </div>
          </div>
          <div className="flex items-start gap-3 rounded-xl bg-slate-50 p-4">
            <Route className="h-5 w-5 text-sgoha-primary" />
            <div>
              <p className="text-sm font-semibold text-slate-800">
                Protección de rutas
              </p>
              <p className="text-sm text-slate-600">
                Rutas por rol en el panel administrativo y portales.
              </p>
              <Badge variant="success" className="mt-2">
                Activa
              </Badge>
            </div>
          </div>
        </div>

        <div className="flex items-start gap-3 rounded-xl border border-slate-200 p-4">
          <ShieldCheck className="h-5 w-5 shrink-0 text-slate-500" />
          <p className="text-sm text-slate-600">
            Las credenciales y rutas de conexión se administran desde archivos{" "}
            <code className="rounded bg-slate-100 px-1 text-xs">.env</code>.
            No se muestran secretos, contraseñas ni cadenas de conexión
            completas en esta pantalla.
          </p>
        </div>

        <div className="flex gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          <AlertTriangle className="h-5 w-5 shrink-0" />
          <p>
            Por seguridad, los archivos{" "}
            <code className="rounded bg-amber-100/80 px-1 text-xs">.env</code>{" "}
            no deben subirse a GitHub.
          </p>
        </div>
      </div>
    </Card>
  );
}
