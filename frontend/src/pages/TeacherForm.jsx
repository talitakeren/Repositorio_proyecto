import { useState } from "react";

// Dominio del modelo de timetabling
const DAYS   = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"];
const BLOCKS = ["8-10", "10-12", "14-16", "16-18"];

// Genera todas las combinaciones día-bloque válidas
const ALL_SLOTS = DAYS.flatMap(day => BLOCKS.map(block => `${day}-${block}`));

export default function TeacherForm() {
  const [name,         setName]         = useState("");
  const [email,        setEmail]        = useState("");
  const [availability, setAvailability] = useState([]);  // HC3 — restricción dura
  const [preferences,  setPreferences]  = useState([]);  // SC1 — restricción blanda
  const [saved,        setSaved]        = useState(false);
  const [error,        setError]        = useState(null);

  // Toggle de disponibilidad: si se desmarca un bloque disponible,
  // también se quita de preferences (SC1 debe ser ⊆ availability)
  function toggleAvailability(slot) {
    setAvailability(prev => {
      const next = prev.includes(slot)
        ? prev.filter(s => s !== slot)
        : [...prev, slot];
      // SC1: preferences ⊆ availability
      setPreferences(p => p.filter(s => next.includes(s)));
      return next;
    });
    setSaved(false);
  }

  // Toggle de preferencia: solo si el bloque está en availability
  function togglePreference(slot) {
    if (!availability.includes(slot)) return;
    setPreferences(prev =>
      prev.includes(slot) ? prev.filter(s => s !== slot) : [...prev, slot]
    );
    setSaved(false);
  }

  async function save(e) {
    e.preventDefault();
    setError(null);

    if (availability.length === 0) {
      setError("El docente debe tener al menos un bloque de disponibilidad para que el algoritmo pueda asignarle cursos.");
      return;
    }

    try {
      const res = await fetch("http://localhost:5050/teacher", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ name, email, availability, preferences }),
      });

      if (!res.ok) throw new Error("Error del servidor");

      setSaved(true);
      setName("");
      setEmail("");
      setAvailability([]);
      setPreferences([]);
    } catch {
      setError("No se pudo guardar el docente. Verifica la conexión con el servidor.");
    }
  }

  return (
    <>
      <div className="page-header">
        <h2>Nuevo Docente</h2>
        <p>Registra un docente con su disponibilidad horaria y preferencias</p>
      </div>

      <div className="form-card" style={{ maxWidth: 680 }}>
        <form onSubmit={save}>

          {/* ── Nombre ── */}
          <div className="form-group">
            <label>Nombre completo</label>
            <input
              placeholder="Ej: María López"
              value={name}
              onChange={e => { setName(e.target.value); setSaved(false); }}
              required
            />
          </div>

          {/* ── Correo ── */}
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

          {/* ── Grilla de disponibilidad y preferencias ── */}
          <div className="form-group" style={{ marginTop: 24 }}>
            <label style={{ marginBottom: 6, display: "block" }}>
              Disponibilidad horaria
              <span style={{ color: "var(--danger)", marginLeft: 4 }}>*</span>
            </label>
            <p style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginBottom: 14, lineHeight: 1.5 }}>
              Marca los bloques disponibles <strong style={{ color: "var(--text)" }}>(HC3)</strong>.
              Luego marca los preferidos con ⭐ <strong style={{ color: "var(--text)" }}>(SC1)</strong>.
              Las preferencias mejoran el <em>objectiveScore</em>.
            </p>

            {/* Encabezados de bloques */}
            <div style={{ display: "grid", gridTemplateColumns: "90px repeat(4, 1fr)", gap: 6, marginBottom: 4 }}>
              <div />
              {BLOCKS.map(b => (
                <div key={b} style={{
                  fontSize: "0.7rem", fontFamily: "var(--font-head)",
                  fontWeight: 700, textAlign: "center",
                  color: "var(--text-muted)", textTransform: "uppercase",
                  letterSpacing: "0.06em",
                }}>
                  {b}
                </div>
              ))}
            </div>

            {/* Filas por día */}
            {DAYS.map(day => (
              <div key={day} style={{
                display: "grid",
                gridTemplateColumns: "90px repeat(4, 1fr)",
                gap: 6, marginBottom: 6,
              }}>
                <div style={{
                  fontSize: "0.78rem", fontFamily: "var(--font-head)",
                  fontWeight: 700, color: "var(--text-muted)",
                  display: "flex", alignItems: "center",
                }}>
                  {day}
                </div>

                {BLOCKS.map(block => {
                  const slot      = `${day}-${block}`;
                  const isAvail   = availability.includes(slot);
                  const isPref    = preferences.includes(slot);

                  return (
                    <div key={slot} style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                      {/* Botón de disponibilidad */}
                      <button
                        type="button"
                        onClick={() => toggleAvailability(slot)}
                        title={isAvail ? "Quitar disponibilidad" : "Marcar como disponible"}
                        style={{
                          padding: "7px 4px",
                          fontSize: "0.72rem",
                          fontFamily: "var(--font-head)",
                          fontWeight: 600,
                          borderRadius: 6,
                          border: `1px solid ${isAvail ? "var(--accent)" : "var(--border)"}`,
                          background: isAvail
                            ? "rgba(79,124,255,0.15)"
                            : "var(--surface2)",
                          color: isAvail ? "var(--accent)" : "var(--text-muted)",
                          cursor: "pointer",
                          transition: "all 0.15s",
                          transform: "none",
                          boxShadow: "none",
                          textAlign: "center",
                        }}
                      >
                        {isAvail ? "✓ Disponible" : "—"}
                      </button>

                      {/* Botón de preferencia (solo si está disponible) */}
                      {isAvail && (
                        <button
                          type="button"
                          onClick={() => togglePreference(slot)}
                          title={isPref ? "Quitar preferencia" : "Marcar como preferido (SC1)"}
                          style={{
                            padding: "4px",
                            fontSize: "0.7rem",
                            borderRadius: 5,
                            border: `1px solid ${isPref ? "var(--success)" : "var(--border)"}`,
                            background: isPref
                              ? "rgba(34,211,160,0.12)"
                              : "transparent",
                            color: isPref ? "var(--success)" : "var(--text-muted)",
                            cursor: "pointer",
                            transition: "all 0.15s",
                            transform: "none",
                            boxShadow: "none",
                            textAlign: "center",
                          }}
                        >
                          {isPref ? "⭐ Preferido" : "☆ Preferir"}
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}

            {/* Resumen */}
            <div style={{
              marginTop: 14, padding: "10px 14px",
              background: "var(--surface2)",
              borderRadius: 8, border: "1px solid var(--border)",
              fontSize: "0.8rem", color: "var(--text-muted)",
              display: "flex", gap: 24,
            }}>
              <span>
                <strong style={{ color: "var(--accent)" }}>{availability.length}</strong>
                {" "}bloque{availability.length !== 1 ? "s" : ""} disponible{availability.length !== 1 ? "s" : ""}
              </span>
              <span>
                <strong style={{ color: "var(--success)" }}>{preferences.length}</strong>
                {" "}preferencia{preferences.length !== 1 ? "s" : ""} (SC1)
              </span>
            </div>
          </div>

          {/* ── Error ── */}
          {error && (
            <div style={{
              marginTop: 12, padding: "10px 14px",
              background: "rgba(255,79,106,0.1)",
              border: "1px solid rgba(255,79,106,0.3)",
              borderRadius: 8, fontSize: "0.82rem",
              color: "var(--danger)",
            }}>
              ⚠️ {error}
            </div>
          )}

          <button type="submit" style={{ marginTop: 20 }}>
            Guardar docente
          </button>

          {saved && (
            <div className="alert alert-success" style={{ marginTop: 12 }}>
              ✓ Docente registrado con {availability.length} bloques de disponibilidad
              {preferences.length > 0 && ` y ${preferences.length} preferencias`}
            </div>
          )}
        </form>
      </div>
    </>
  );
}