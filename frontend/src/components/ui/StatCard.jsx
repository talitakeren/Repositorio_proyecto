/**
 * Tarjeta de métrica compacta usada en los homes por rol.
 */
export default function StatCard({
  icon: Icon,
  label,
  value,
  hint,
  accent = "blue",
}) {
  const accents = {
    blue: { bg: "bg-blue-50", text: "text-sgoha-secondary" },
    green: { bg: "bg-green-50", text: "text-green-600" },
    amber: { bg: "bg-amber-50", text: "text-amber-600" },
    slate: { bg: "bg-slate-100", text: "text-slate-600" },
    red: { bg: "bg-red-50", text: "text-red-600" },
  };
  const tone = accents[accent] || accents.blue;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
            {label}
          </p>
          <p className="mt-2 text-2xl font-bold text-slate-900">{value}</p>
          {hint && (
            <p className="mt-1 text-xs text-slate-500">{hint}</p>
          )}
        </div>
        {Icon && (
          <div
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${tone.bg} ${tone.text}`}
          >
            <Icon className="h-5 w-5" strokeWidth={2} />
          </div>
        )}
      </div>
    </div>
  );
}
