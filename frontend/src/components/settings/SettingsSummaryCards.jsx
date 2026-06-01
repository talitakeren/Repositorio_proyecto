import { CalendarDays, GraduationCap, Clock, Cpu } from "lucide-react";
import Card from "../ui/Card.jsx";
import Badge from "../ui/Badge.jsx";

export default function SettingsSummaryCards({ settings }) {
  const period = settings?.academicPeriod?.name || "—";
  const min = settings?.enrollmentRules?.minCredits ?? "—";
  const max = settings?.enrollmentRules?.maxCredits ?? "—";
  const weekly = settings?.scheduleRules?.totalWeeklySlots ?? 126;
  const perDay = settings?.scheduleRules?.blocksPerDay ?? 18;
  const cspActive = settings?.csp?.enabled;

  const cards = [
    {
      label: "Periodo activo",
      value: period,
      icon: CalendarDays,
      accent: "text-sgoha-primary bg-blue-50",
    },
    {
      label: "Créditos permitidos",
      value: `${min} - ${max}`,
      icon: GraduationCap,
      accent: "text-violet-700 bg-violet-50",
    },
    {
      label: "Franjas horarias",
      value: `${weekly} semanales`,
      sub: `${perDay} por día`,
      icon: Clock,
      accent: "text-amber-800 bg-amber-50",
    },
    {
      label: "Motor CSP",
      value: cspActive ? "Activo" : "Inactivo",
      icon: Cpu,
      accent: cspActive
        ? "text-emerald-700 bg-emerald-50"
        : "text-slate-600 bg-slate-100",
      badge: cspActive,
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map(({ label, value, sub, icon: Icon, accent, badge }) => (
        <Card key={label} className="flex items-start gap-3 p-4 sm:p-5">
          <span
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${accent}`}
          >
            <Icon className="h-5 w-5" strokeWidth={2} />
          </span>
          <div className="min-w-0">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
              {label}
            </p>
            <div className="mt-1 flex flex-wrap items-center gap-2">
              <p className="text-lg font-bold text-slate-900">{value}</p>
              {badge && <Badge variant="success">Activo</Badge>}
            </div>
            {sub && <p className="text-xs text-slate-500">{sub}</p>}
          </div>
        </Card>
      ))}
    </div>
  );
}
