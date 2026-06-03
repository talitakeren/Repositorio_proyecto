const variants = {
  primary:
    "bg-sgoha-primary text-white hover:bg-blue-900 shadow-md shadow-blue-900/20",
  secondary:
    "bg-white text-sgoha-primary border border-gray-200 hover:bg-gray-50",
  ghost: "bg-transparent text-gray-600 hover:bg-gray-100",
  accent:
    "bg-sgoha-primary text-white hover:bg-blue-800 shadow-lg shadow-blue-900/25",
};

const sizes = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2 text-sm",
  lg: "px-5 py-2.5 text-base",
};

export default function Button({
  children,
  variant = "primary",
  size = "md",
  className = "",
  ...props
}) {
  return (
    <button
      type="button"
      className={`inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-sgoha-secondary/40 disabled:opacity-60 disabled:cursor-not-allowed ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
