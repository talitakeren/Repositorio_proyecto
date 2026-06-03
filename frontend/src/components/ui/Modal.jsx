import { useEffect } from "react";
import { X } from "lucide-react";

const SIZE_CLASS = {
  md: "max-w-lg",
  lg: "max-w-3xl",
  xl: "max-w-6xl",
  full: "max-w-[min(calc(100vw-1.5rem),72rem)]",
};

/**
 * Modal centrado con backdrop difuminado.
 * Ideal para formularios amplios (p. ej. grilla de disponibilidad docente).
 */
export default function Modal({
  open,
  onClose,
  title,
  subtitle,
  children,
  footer,
  size = "lg",
}) {
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    function onKey(e) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center p-0 sm:items-center sm:p-4 md:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <button
        type="button"
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-md transition-opacity"
        onClick={onClose}
        aria-label="Cerrar"
      />

      <div
        className={`relative flex max-h-[min(100dvh,900px)] w-full flex-col overflow-hidden rounded-t-2xl border border-slate-200/80 bg-white shadow-2xl shadow-slate-900/20 sm:max-h-[min(92dvh,880px)] sm:rounded-2xl ${SIZE_CLASS[size] ?? SIZE_CLASS.lg}`}
      >
        <div className="shrink-0 border-b border-slate-100 bg-white px-5 py-4 sm:px-6 sm:py-5">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0 pr-2">
              <h2
                id="modal-title"
                className="text-lg font-semibold tracking-tight text-slate-900 sm:text-xl"
              >
                {title}
              </h2>
              {subtitle && (
                <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
              )}
            </div>
            <button
              type="button"
              onClick={onClose}
              className="shrink-0 rounded-xl p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 py-5 sm:px-6">
          {children}
        </div>

        {footer && (
          <div className="shrink-0 border-t border-slate-100 bg-slate-50/90 px-5 py-4 backdrop-blur-sm sm:px-6">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
