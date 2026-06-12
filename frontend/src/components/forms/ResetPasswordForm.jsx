import { useState } from "react";
import Input from "../ui/Input.jsx";

export const RESET_PASSWORD_FORM_ID = "reset-password-form";

/**
 * Formulario para que el admin restablezca la contraseña de un usuario.
 */
export default function ResetPasswordForm({ user, onSubmit, submitting = false }) {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    if (!password || password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres");
      return;
    }
    if (password !== confirm) {
      setError("Las contraseñas no coinciden");
      return;
    }
    setError("");
    onSubmit(password);
  }

  return (
    <form id={RESET_PASSWORD_FORM_ID} onSubmit={handleSubmit} className="space-y-4">
      <div className="rounded-xl bg-slate-50 px-4 py-3 text-sm">
        <p className="font-medium text-slate-800">{user?.name}</p>
        <p className="text-xs text-slate-500">{user?.email}</p>
      </div>

      <Input
        label="Nueva contraseña"
        type="password"
        name="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        autoComplete="new-password"
        placeholder="Mínimo 6 caracteres"
      />
      <Input
        label="Confirmar contraseña"
        type="password"
        name="confirm"
        value={confirm}
        onChange={(e) => setConfirm(e.target.value)}
        autoComplete="new-password"
      />

      {error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-xs text-red-700">
          {error}
        </p>
      )}

      <p className="text-xs text-slate-500">
        El usuario deberá iniciar sesión nuevamente con la contraseña que definas.
      </p>

      <button type="submit" className="hidden" disabled={submitting} />
    </form>
  );
}
