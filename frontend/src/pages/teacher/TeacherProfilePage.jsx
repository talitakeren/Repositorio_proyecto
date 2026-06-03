import { useEffect, useState } from "react";
import { Mail, BookOpen, CalendarClock, AlertTriangle } from "lucide-react";
import PageHeader from "../../components/ui/PageHeader.jsx";
import Card from "../../components/ui/Card.jsx";
import Badge from "../../components/ui/Badge.jsx";
import { teacherPortalService } from "../../services/teacherPortalService.js";
import { getInitials } from "../../utils/getInitials.js";
import {
  countAvailabilityStats,
} from "../../utils/availabilityConstants.js";

export default function TeacherProfilePage() {
  const [teacher, setTeacher] = useState(null);
  const [loading, setLoading] = useState(true);
  const [linkError, setLinkError] = useState(false);

  useEffect(() => {
    teacherPortalService
      .getMyProfile()
      .then(setTeacher)
      .catch(() => setLinkError(true))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center text-slate-500">
        Cargando perfil...
      </div>
    );
  }

  if (linkError || !teacher) {
    return (
      <div className="space-y-6">
        <PageHeader title="Mi perfil docente" />
        <Card className="flex items-start gap-3 border-amber-200 bg-amber-50 p-5 text-amber-900">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" />
          <p className="text-sm">
            Tu usuario aún no tiene un perfil docente vinculado.
          </p>
        </Card>
      </div>
    );
  }

  const { blocks, hours } = countAvailabilityStats(teacher.availability);

  return (
    <div className="space-y-6">
      <PageHeader title="Mi perfil docente" />

      <Card className="overflow-hidden">
        <div className="flex flex-col items-center gap-4 border-b border-slate-100 bg-gradient-to-br from-[#1E3A8A] to-[#172554] p-6 text-center text-white sm:flex-row sm:text-left">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/15 text-xl font-bold ring-2 ring-white/30">
            {getInitials(teacher.fullName)}
          </div>
          <div>
            <h3 className="text-lg font-semibold">{teacher.fullName}</h3>
            <p className="text-sm text-blue-100/90">{teacher.specialty}</p>
            <div className="mt-2 flex flex-wrap justify-center gap-2 sm:justify-start">
              <Badge variant={teacher.active !== false ? "success" : "neutral"}>
                {teacher.active !== false ? "Activo" : "Inactivo"}
              </Badge>
            </div>
          </div>
        </div>

        <dl className="grid grid-cols-1 gap-px bg-slate-100 sm:grid-cols-2">
          <Info icon={Mail} label="Correo institucional" value={teacher.email} />
          <Info
            icon={BookOpen}
            label="Cursos asignados"
            value={`${teacher.availableCourses?.length || 0} cursos`}
          />
          <Info
            icon={CalendarClock}
            label="Disponibilidad"
            value={`${blocks} bloques · ${hours}h por semana`}
          />
        </dl>
      </Card>

      <Card className="p-5 sm:p-6">
        <h3 className="text-base font-semibold text-slate-900">
          Cursos que puedes dictar
        </h3>
        {teacher.availableCourses?.length ? (
          <ul className="mt-4 space-y-2">
            {teacher.availableCourses.map((c) => (
              <li
                key={c._id || c}
                className="flex items-center justify-between gap-3 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm"
              >
                <span className="font-medium text-slate-900">
                  <span className="text-sgoha-primary">{c.code}</span> · {c.name}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-3 text-sm text-slate-500">
            Aún no tienes cursos asignados.
          </p>
        )}
      </Card>
    </div>
  );
}

function Info({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-3 bg-white px-5 py-4">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-sgoha-secondary">
        <Icon className="h-4 w-4" />
      </span>
      <div className="min-w-0">
        <p className="text-xs uppercase tracking-wide text-slate-400">
          {label}
        </p>
        <p className="truncate font-medium text-slate-900">{value}</p>
      </div>
    </div>
  );
}
