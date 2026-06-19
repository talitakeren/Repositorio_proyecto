export default function Input({
  label,
  error,
  className = "",
  id,
  ...props
}) {
  const inputId = id || props.name;
  const errorId = error ? `${inputId}-error` : undefined;

  return (
    <div className={className}>
      {label && (
        <label
          htmlFor={inputId}
          className="mb-1.5 block text-sm font-medium text-slate-700"
        >
          {label}
        </label>
      )}
      <input
        id={inputId}
        aria-invalid={error ? "true" : undefined}
        aria-describedby={errorId}
        className={`w-full rounded-lg border bg-white px-3.5 py-2.5 text-sm text-slate-900 shadow-sm transition placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${
          error
            ? "border-red-300 focus:border-red-500"
            : "border-slate-200 focus:border-blue-500"
        }`}
        {...props}
      />
      {error && (
        <p id={errorId} className="mt-1.5 text-xs text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
