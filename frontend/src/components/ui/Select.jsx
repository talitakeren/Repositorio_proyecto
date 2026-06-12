export default function Select({
  label,
  error,
  className = "",
  id,
  children,
  ...props
}) {
  const selectId = id || props.name;

  return (
    <div className={className}>
      {label && (
        <label
          htmlFor={selectId}
          className="mb-1.5 block text-sm font-medium text-slate-700"
        >
          {label}
        </label>
      )}
      <select
        id={selectId}
        className={`w-full rounded-lg border bg-white px-3.5 py-2.5 text-sm text-slate-900 shadow-sm transition focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${
          error
            ? "border-red-300 focus:border-red-500"
            : "border-slate-200 focus:border-blue-500"
        }`}
        {...props}
      >
        {children}
      </select>
      {error && <p className="mt-1.5 text-xs text-red-600">{error}</p>}
    </div>
  );
}
