import { useEffect, useState } from "react";
import { Clock } from "lucide-react";
import PageHeader from "../../components/ui/PageHeader.jsx";
import EmptyState from "../../components/ui/EmptyState.jsx";
import WeeklyGrid from "../../components/schedules/WeeklyGrid.jsx";
import { teacherPortalService } from "../../services/teacherPortalService.js";

export default function TeacherSchedulePage() {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    teacherPortalService
      .getMySchedule()
      .then((data) => setAssignments(Array.isArray(data) ? data : []))
      .catch(() => setAssignments([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Mi horario"
        subtitle="Consulta tu horario académico generado."
      />

      {loading ? (
        <div className="flex min-h-[40vh] items-center justify-center text-slate-500">
          Cargando horario...
        </div>
      ) : assignments.length === 0 ? (
        <EmptyState
          icon={Clock}
          title="Aún no tienes horario asignado"
          description="Cuando el administrador genere los horarios del período, verás aquí tus clases asignadas."
        />
      ) : (
        <WeeklyGrid assignments={assignments} variant="teacher" />
      )}
    </div>
  );
}
