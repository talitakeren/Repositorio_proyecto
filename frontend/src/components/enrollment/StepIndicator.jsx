import { Check } from "lucide-react";

/**
 * Indicador horizontal de pasos para el flujo de validación de matrícula.
 * - `steps`: [{ id, label }]
 * - `current`: índice del paso actual (0-based)
 * - `completed`: arreglo de booleanos por paso (true = completado)
 */
export default function StepIndicator({ steps, current = 0, completed = [] }) {
  return (
    <ol className="flex w-full items-center gap-2 overflow-x-auto sm:gap-3">
      {steps.map((step, idx) => {
        const isCompleted = completed[idx];
        const isActive = idx === current;
        const tone = isCompleted
          ? "bg-emerald-600 text-white ring-emerald-200"
          : isActive
            ? "bg-sgoha-primary text-white ring-blue-200"
            : "bg-slate-100 text-slate-500 ring-slate-200";
        const labelTone = isCompleted || isActive
          ? "text-slate-900"
          : "text-slate-400";

        return (
          <li
            key={step.id}
            className="flex flex-1 items-center gap-2 sm:gap-3"
          >
            <div className="flex items-center gap-2 sm:gap-3">
              <span
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold ring-2 sm:h-9 sm:w-9 sm:text-sm ${tone}`}
              >
                {isCompleted ? (
                  <Check className="h-4 w-4" />
                ) : (
                  idx + 1
                )}
              </span>
              <span
                className={`whitespace-nowrap text-xs font-semibold sm:text-sm ${labelTone}`}
              >
                {step.label}
              </span>
            </div>
            {idx < steps.length - 1 && (
              <span
                className={`hidden h-px flex-1 sm:block ${
                  isCompleted ? "bg-emerald-300" : "bg-slate-200"
                }`}
              />
            )}
          </li>
        );
      })}
    </ol>
  );
}
