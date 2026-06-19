import helmet from "helmet";
import rateLimit from "express-rate-limit";

const isTest = process.env.NODE_ENV === "test";

const noop = (_req, _res, next) => next();

/** Cabeceras HTTP seguras (OWASP — Security Misconfiguration). */
export const securityHeaders = helmet({
  contentSecurityPolicy: process.env.NODE_ENV === "production",
  crossOriginEmbedderPolicy: false,
});

/** Límite de peticiones al login (OWASP — Authentication Failures). */
export const loginRateLimiter = isTest
  ? noop
  : rateLimit({
      windowMs: 15 * 60 * 1000,
      max: Number(process.env.LOGIN_RATE_LIMIT_MAX) || 20,
      standardHeaders: true,
      legacyHeaders: false,
      message: {
        success: false,
        message: "Demasiados intentos de inicio de sesión. Intente más tarde.",
      },
    });

/** Límite global suave para la API. */
export const apiRateLimiter = isTest
  ? noop
  : rateLimit({
      windowMs: 1 * 60 * 1000,
      max: Number(process.env.API_RATE_LIMIT_MAX) || 300,
      standardHeaders: true,
      legacyHeaders: false,
      message: {
        success: false,
        message: "Demasiadas solicitudes. Intente más tarde.",
      },
    });
