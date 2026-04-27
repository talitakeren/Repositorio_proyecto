import { useState } from "react";

export default function TeacherForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [saved, setSaved] = useState(false);

  async function save(e) {
    e.preventDefault();
    await fetch("http://localhost:5050/teacher", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email }),
    });
    setSaved(true);
    setName("");
    setEmail("");
  }

  return (
    <>
      <div className="page-header">
        <h2>Nuevo Docente</h2>
        <p>Registra un docente en el sistema</p>
      </div>

      <div className="form-card">
        <form onSubmit={save}>
          <div className="form-group">
            <label>Nombre completo</label>
            <input
              placeholder="Ej: María López"
              value={name}
              onChange={e => { setName(e.target.value); setSaved(false); }}
              required
            />
          </div>

          <div className="form-group">
            <label>Correo electrónico</label>
            <input
              type="email"
              placeholder="Ej: m.lopez@universidad.edu"
              value={email}
              onChange={e => { setEmail(e.target.value); setSaved(false); }}
              required
            />
          </div>

          <button type="submit">Guardar docente</button>

          {saved && (
            <div className="alert alert-success">
              ✓ Docente registrado exitosamente
            </div>
          )}
        </form>
      </div>
    </>
  );
}