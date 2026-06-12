import { useEffect, useState, useCallback } from "react";
import { useLocation } from "react-router-dom";

/**
 * Control del menú lateral en viewports móviles.
 * Cierra al cambiar de ruta y bloquea scroll del body cuando está abierto.
 */
export function useMobileNav() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const toggle = useCallback(() => setOpen((v) => !v), []);
  const close = useCallback(() => setOpen(false), []);

  return { open, setOpen, toggle, close };
}
