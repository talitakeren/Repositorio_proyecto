/**
 * Estado vacío reutilizable.
 * Permite pasar un icono, título, descripción y acción opcional.
 */
export default function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className = "",
}) {
  return (
    <div
      className={`flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white px-6 py-12 text-center ${className}`}
    >
      {Icon && (
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-sgoha-secondary">
          <Icon className="h-7 w-7" />
        </div>
      )}
      {title && (
        <h3 className="text-base font-semibold text-slate-900 sm:text-lg">
          {title}
        </h3>
      )}
      {description && (
        <p className="mt-2 max-w-md text-sm text-slate-500">{description}</p>
      )}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
