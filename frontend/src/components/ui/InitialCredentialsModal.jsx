import { useState } from "react";
import { Copy, Check, KeyRound, ShieldCheck } from "lucide-react";
import Modal from "./Modal.jsx";
import Button from "./Button.jsx";

/**
 * Muestra al admin las credenciales iniciales auto-generadas para una cuenta
 * recién creada desde los módulos Estudiantes / Docentes. La contraseña solo
 * se entrega en la respuesta de creación (no se persiste visible en ningún
 * otro endpoint), por lo que este modal debe presentarse inmediatamente.
 */
export default function InitialCredentialsModal({ data, onClose }) {
  const open = Boolean(data);
  const credentials = data?.credentials;
  const conflictRole = data?.conflictRole;
  const wasCreated = data?.wasCreated;
  const linkedExisting = data?.linkedExisting;
  const [copied, setCopied] = useState(null);

  function copy(text, key) {
    if (!text) return;
    navigator.clipboard?.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 1500);
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      size="md"
      title={
        conflictRole
          ? "No se pudo crear la cuenta automáticamente"
          : wasCreated
            ? "Cuenta de acceso creada"
            : "Cuenta de acceso vinculada"
      }
      subtitle={
        conflictRole
          ? "Ya existía un usuario con ese correo pero con otro rol."
          : wasCreated
            ? "El usuario ya puede ingresar al sistema con esta contraseña inicial."
            : "Se vinculó la cuenta existente al nuevo perfil."
      }
      footer={
        <div className="flex justify-end">
          <Button onClick={onClose}>Entendido</Button>
        </div>
      }
    >
      {conflictRole ? (
        <div className="space-y-3 text-sm">
          <p className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-amber-800">
            Existe un usuario con el correo <strong>{data?.email}</strong> pero
            registrado como <strong>{conflictRole}</strong>. No se vinculó al
            nuevo perfil para evitar romper su acceso actual. Cambia el correo
            del perfil o ajusta el rol del usuario desde el módulo Usuarios.
          </p>
        </div>
      ) : linkedExisting ? (
        <div className="space-y-3 text-sm">
          <div className="flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-emerald-800">
            <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0" />
            <p>
              Se vinculó la cuenta existente <strong>{data?.email}</strong> al
              nuevo perfil. La contraseña actual del usuario se mantiene.
            </p>
          </div>
          <p className="text-xs text-slate-500">
            Si necesitas asignarle una nueva contraseña, hazlo desde el módulo
            Usuarios → acción "Resetear contraseña".
          </p>
        </div>
      ) : credentials ? (
        <div className="space-y-4 text-sm">
          <div className="flex items-start gap-3 rounded-xl border border-blue-200 bg-blue-50 px-3 py-3 text-blue-800">
            <KeyRound className="mt-0.5 h-4 w-4 shrink-0" />
            <p>
              Comparte estas credenciales con el usuario. Después podrá
              cambiarlas desde "Mi cuenta", o el admin podrá resetearlas desde
              el módulo Usuarios.
            </p>
          </div>

          <Field
            label="Correo"
            value={credentials.email}
            copied={copied === "email"}
            onCopy={() => copy(credentials.email, "email")}
          />
          <Field
            label="Contraseña inicial"
            value={credentials.password}
            mono
            copied={copied === "password"}
            onCopy={() => copy(credentials.password, "password")}
          />

          <p className="text-xs text-slate-500">
            Esta contraseña sólo se muestra ahora. No volverá a aparecer en
            ningún listado.
          </p>
        </div>
      ) : null}
    </Modal>
  );
}

function Field({ label, value, mono, copied, onCopy }) {
  return (
    <div>
      <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </p>
      <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
        <span
          className={`flex-1 truncate text-slate-900 ${mono ? "font-mono" : ""}`}
        >
          {value}
        </span>
        <button
          type="button"
          onClick={onCopy}
          className="inline-flex items-center gap-1 rounded-md bg-white px-2 py-1 text-xs font-medium text-slate-600 ring-1 ring-slate-200 hover:bg-slate-100"
        >
          {copied ? (
            <>
              <Check className="h-3 w-3 text-emerald-600" />
              Copiado
            </>
          ) : (
            <>
              <Copy className="h-3 w-3" />
              Copiar
            </>
          )}
        </button>
      </div>
    </div>
  );
}
