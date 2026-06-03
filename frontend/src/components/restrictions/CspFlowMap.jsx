import {
  ClipboardCheck,
  BookOpen,
  UserRound,
  Building2,
  Clock,
  ShieldCheck,
  CalendarDays,
  ChevronDown,
} from "lucide-react";
import Card from "../ui/Card.jsx";

const STEPS = [
  { icon: ClipboardCheck, label: "Matrículas listas" },
  { icon: BookOpen, label: "Cursos a programar" },
  { icon: UserRound, label: "Docentes disponibles" },
  { icon: Building2, label: "Aulas compatibles" },
  { icon: Clock, label: "Franjas horarias" },
  { icon: ShieldCheck, label: "Validación de restricciones" },
  { icon: CalendarDays, label: "Horario generado" },
];

export default function CspFlowMap() {
  return (
    <Card className="p-5 sm:p-6">
      <h3 className="text-lg font-semibold text-slate-900">
        Flujo de validación CSP
      </h3>
      <p className="mt-1 text-sm text-slate-500">
        Secuencia informativa que sigue el motor al construir una programación
        válida.
      </p>

      <div className="mt-6 hidden lg:flex lg:items-stretch lg:justify-between lg:gap-2">
        {STEPS.map((step, index) => {
          const Icon = step.icon;
          return (
            <div key={step.label} className="flex flex-1 items-center gap-2">
              <div className="flex min-w-0 flex-1 flex-col items-center rounded-xl border border-slate-200 bg-slate-50 px-2 py-4 text-center">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 text-sgoha-primary">
                  <Icon className="h-5 w-5" />
                </span>
                <p className="mt-2 text-xs font-semibold text-slate-700">
                  {step.label}
                </p>
                <span className="mt-1 text-[10px] text-slate-400">
                  Paso {index + 1}
                </span>
              </div>
              {index < STEPS.length - 1 && (
                <span className="hidden shrink-0 text-slate-300 xl:block">→</span>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-6 flex flex-col items-center gap-2 lg:hidden">
        {STEPS.map((step, index) => {
          const Icon = step.icon;
          return (
            <div key={step.label} className="flex w-full max-w-sm flex-col items-center">
              <div className="flex w-full items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-50 text-sgoha-primary">
                  <Icon className="h-4 w-4" />
                </span>
                <div className="min-w-0 text-left">
                  <p className="text-sm font-semibold text-slate-800">
                    {step.label}
                  </p>
                  <p className="text-xs text-slate-400">Paso {index + 1}</p>
                </div>
              </div>
              {index < STEPS.length - 1 && (
                <ChevronDown className="my-0.5 h-5 w-5 text-slate-300" />
              )}
            </div>
          );
        })}
      </div>
    </Card>
  );
}
