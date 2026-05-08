import { useEffect, useState } from "react";

const DAYS   = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"];
const BLOCKS = ["8-10", "10-12", "14-16", "16-18"];

export default function TeacherList() {
  const [data,    setData]    = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null); // ID del docente expandido

  useEffect(() => {
    fetch("http://localhost:5050/teacher")
      .then(res => res.json())
      .then(d => { setData(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  async function remove(id) {
    await fetch(`http://localhost:5050/teacher/${id}`, { method: "DELETE" });
    setData(prev => prev.filter(t => t._id !== id));
  }

  return (
    <>
      <div className="page-header">
        <h2>Docentes</h2>
        <p>Listado del cuerpo docente con disponibilidad horaria configurada</p>
      </div>

      {loading ? (
        <div className="empty-state">Cargando docentes…</div>
      ) : data.length === 0 ? (
        <div className="empty-state">
          No hay docentes registrados. Agrega uno desde <strong>Nuevo Docente</strong>.
        </div>
      ) : (
        <div className="item-list">
          {data.map(teacher => {
            const avail = teacher.availability || [];
            const prefs = teacher.preferences  || [];
            const isOpen = expanded === teacher._id;

            // Advertencia: sin availability el algoritmo no puede asignarlo
            const sinDisponibilidad = avail.length === 0;

            return (
              <div key={teacher._id} className="item-row" style={{
                flexDirection: "column", alignItems: "stretch", gap: 0,
                borderColor: sinDisponibilidad ? "rgba(255,79,106,0.4)" : undefined,
              }}>

                {/* ── Fila principal ── */}
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>

                  {/* Avatar inicial */}
                  <div style={{
                    width: 38, height: 38, borderRadius: "50%",
                    background: "linear-gradient(135deg, var(--accent), var(--accent2))",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontFamily: "var(--font-head)", fontWeight: 800,
                    fontSize: "0.9rem", color: "#fff", flexShrink: 0,
                  }}>
                    {teacher.name?.charAt(0).toUpperCase()}
                  </div>

                  {/* Nombre y email */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 600, fontSize: "0.95rem" }}>
                      {teacher.name}
                    </div>
                    <div style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>
                      {teacher.email}
                    </div>
                  </div>

                  {/* Badges de métricas */}
                  <div style={{ display: "flex", gap: 8, flexShrink: 0, alignItems: "center" }}>
                    {sinDisponibilidad ? (
                      <span style={{
                        fontSize: "0.72rem", padding: "3px 9px", borderRadius: 6,
                        background: "rgba(255,79,106,0.12)",
                        border: "1px solid rgba(255,79,106,0.35)",
                        color: "var(--danger)", fontWeight: 600,
                      }}>
                        ⚠️ Sin disponibilidad
                      </span>
                    ) : (
                      <>
                        <span style={{
                          fontSize: "0.72rem", padding: "3px 9px", borderRadius: 6,
                          background: "rgba(79,124,255,0.12)",
                          border: "1px solid rgba(79,124,255,0.3)",
                          color: "var(--accent)", fontWeight: 600,
                        }}>
                          {avail.length} bloque{avail.length !== 1 ? "s" : ""}
                        </span>
                        {prefs.length > 0 && (
                          <span style={{
                            fontSize: "0.72rem", padding: "3px 9px", borderRadius: 6,
                            background: "rgba(34,211,160,0.12)",
                            border: "1px solid rgba(34,211,160,0.3)",
                            color: "var(--success)", fontWeight: 600,
                          }}>
                            ⭐ {prefs.length} pref.
                          </span>
                        )}
                      </>
                    )}

                    {/* Botón expandir */}
                    <button
                      type="button"
                      onClick={() => setExpanded(isOpen ? null : teacher._id)}
                      className="btn-ghost btn"
                      style={{ padding: "5px 10px", fontSize: "0.75rem" }}
                    >
                      {isOpen ? "▲ Ocultar" : "▼ Ver grilla"}
                    </button>

                    {/* Eliminar */}
                    <button
                      type="button"
                      onClick={() => remove(teacher._id)}
                      style={{
                        padding: "5px 10px", fontSize: "0.75rem",
                        background: "rgba(255,79,106,0.1)",
                        border: "1px solid rgba(255,79,106,0.3)",
                        color: "var(--danger)", borderRadius: 6,
                        cursor: "pointer", transform: "none", boxShadow: "none",
                      }}
                    >
                      Eliminar
                    </button>
                  </div>
                </div>

                {/* ── Grilla de disponibilidad expandible ── */}
                {isOpen && (
                  <div style={{ marginTop: 16, paddingTop: 16,
                    borderTop: "1px solid var(--border)" }}>

                    <div style={{
                      fontSize: "0.72rem", fontFamily: "var(--font-head)",
                      textTransform: "uppercase", letterSpacing: "0.08em",
                      color: "var(--text-muted)", marginBottom: 12,
                    }}>
                      Grilla horaria — HC3 (disponibilidad) · SC1 (preferencias ⭐)
                    </div>

                    {/* Encabezados bloques */}
                    <div style={{
                      display: "grid",
                      gridTemplateColumns: "90px repeat(4, 1fr)",
                      gap: 5, marginBottom: 4,
                    }}>
                      <div />
                      {BLOCKS.map(b => (
                        <div key={b} style={{
                          fontSize: "0.68rem", textAlign: "center",
                          color: "var(--text-muted)", fontFamily: "var(--font-head)",
                          fontWeight: 700, textTransform: "uppercase",
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
                        gap: 5, marginBottom: 5,
                      }}>
                        <div style={{
                          fontSize: "0.75rem", fontFamily: "var(--font-head)",
                          fontWeight: 700, color: "var(--text-muted)",
                          display: "flex", alignItems: "center",
                        }}>
                          {day}
                        </div>
                        {BLOCKS.map(block => {
                          const slot    = `${day}-${block}`;
                          const isAvail = avail.includes(slot);
                          const isPref  = prefs.includes(slot);
                          return (
                            <div key={slot} style={{
                              padding: "6px 4px", borderRadius: 6, textAlign: "center",
                              fontSize: "0.72rem", fontWeight: 600,
                              border: `1px solid ${
                                isPref  ? "rgba(34,211,160,0.4)" :
                                isAvail ? "rgba(79,124,255,0.35)" :
                                          "var(--border)"
                              }`,
                              background: isPref
                                ? "rgba(34,211,160,0.1)"
                                : isAvail
                                  ? "rgba(79,124,255,0.1)"
                                  : "var(--surface2)",
                              color: isPref
                                ? "var(--success)"
                                : isAvail
                                  ? "var(--accent)"
                                  : "var(--text-muted)",
                            }}>
                              {isPref ? "⭐" : isAvail ? "✓" : "—"}
                            </div>
                          );
                        })}
                      </div>
                    ))}

                    {/* Leyenda */}
                    <div style={{
                      display: "flex", gap: 16, marginTop: 10,
                      fontSize: "0.72rem", color: "var(--text-muted)",
                    }}>
                      <span><span style={{ color: "var(--accent)" }}>✓</span> Disponible (HC3)</span>
                      <span><span style={{ color: "var(--success)" }}>⭐</span> Preferido (SC1)</span>
                      <span>— No disponible</span>
                    </div>
                  </div>
                )}

              </div>
            );
          })}
        </div>
      )}
    </>
  );
}