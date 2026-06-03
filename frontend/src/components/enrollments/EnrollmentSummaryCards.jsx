import {
  ClipboardList,
  Clock3,
  BadgeCheck,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
import StatCard from "../ui/StatCard.jsx";

export default function EnrollmentSummaryCards({ enrollments = [] }) {
  const total = enrollments.length;
  const pending = enrollments.filter((e) => ["PENDING", "DRAFT"].includes(e.status)).length;
  const validated = enrollments.filter((e) => ["VALIDATED", "VALID"].includes(e.status)).length;
  const confirmed = enrollments.filter((e) => e.status === "CONFIRMED").length;
  const observedRejected = enrollments.filter((e) => ["OBSERVED", "REJECTED", "INVALID"].includes(e.status)).length;

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-5">
      <StatCard
        icon={ClipboardList}
        label="Total de matrículas"
        value={total}
        hint="Registradas en sistema"
        accent="blue"
      />
      <StatCard
        icon={Clock3}
        label="Pendientes"
        value={pending}
        hint="Borrador o pendiente"
        accent="amber"
      />
      <StatCard
        icon={BadgeCheck}
        label="Validadas"
        value={validated}
        hint="Validadas por el alumno"
        accent="green"
      />
      <StatCard
        icon={CheckCircle2}
        label="Confirmadas"
        value={confirmed}
        hint="Aptas para generación"
        accent="blue"
      />
      <StatCard
        icon={AlertTriangle}
        label="Observadas/Rechazadas"
        value={observedRejected}
        hint="Con errores o observaciones"
        accent="red"
      />
    </div>
  );
}
