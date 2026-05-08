import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const DAYS   = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"];
const BLOCKS = ["8-10", "10-12", "14-16", "16-18"];

export default function TeacherList() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:5050/teacher")
      .then(res => res.json())
      .then(d => {
        setData(d);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  async function remove(id) {
    try {
      await fetch(`http://localhost:5050/teacher/${id}`, {
        method: "DELETE",
      });

      setData(prev => prev.filter(t => t._id !== id));
    } catch (error) {
      console.error("Error eliminando docente", error);
    }
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
            const prefs = teacher.preferences || [];
            const isOpen = expanded === teacher._id;
            const sinDisponibilidad = avail.length === 0;

            return (
              <div
                key={teacher._id}
                className="item-row"
                style={{
                  flexDirection: "column",
                  alignItems: "stretch",
                  gap: 0,
                  borderColor: sinDisponibilidad
                    ? "rgba(255,79,106,0.4)"
                    : undefined,
                }}
              >

                {/* ───────── HEADER ───────── */}
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>

                  {/* Avatar */}
                  <div style={{
                    width: 38,
                    height: 38,
                    borderRadius: "50%",
                    background: "linear-gradient(135deg, var(--accent), var(--accent2))",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 800,
                    color: "#fff",
                    flexShrink: 0,
                  }}>
                    {teacher.name?.charAt(0).toUpperCase()}
                  </div>

                  {/* Info */}
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600 }}>{teacher.name}</div>
                    <div style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>
                      {teacher.email}
                    </div>
                  </div>

                  {/* BADGES */}
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>

                    {sinDisponibilidad ? (
                      <span style={{
                        fontSize: "0.72rem",
                        padding: "3px 8px",
                        borderRadius: 6,
                        background: "rgba(255,79,106,0.12)",
                        border: "1px solid rgba(255,79,106,0.35)",
                        color: "var(--danger)",
                        fontWeight: 600,
                      }}>
                        ⚠ Sin disponibilidad
                      </span>
                    ) : (
                      <>
                        <span style={{
                          fontSize: "0.72rem",
                          padding: "3px 8px",
                          borderRadius: 6,
                          background: "rgba(79,124,255,0.12)",
                          border: "1px solid rgba(79,124,255,0.3)",
                          color: "var(--accent)",
                          fontWeight: 600,
                        }}>
                          {avail.length} bloques
                        </span>

                        {prefs.length > 0 && (
                          <span style={{
                            fontSize: "0.72rem",
                            padding: "3px 8px",
                            borderRadius: 6,
                            background: "rgba(34,211,160,0.12)",
                            border: "1px solid rgba(34,211,160,0.3)",
                            color: "var(--success)",
                            fontWeight: 600,
                          }}>
                            ⭐ {prefs.length}
                          </span>
                        )}
                      </>
                    )}

                    {/* BOTÓN VER */}
                    <button
                      onClick={() => setExpanded(isOpen ? null : teacher._id)}
                      className="btn-ghost btn"
                    >
                      {isOpen ? "Ocultar" : "Ver"}
                    </button>

                    {/* EDITAR (AGREGADO PARA RÚBRICA) */}
                    <button
                      onClick={() => navigate(`/edit-teacher/${teacher._id}`)}
                      style={{
                        padding: "5px 10px",
                        fontSize: "0.75rem",
                        background: "rgba(79,124,255,0.1)",
                        border: "1px solid rgba(79,124,255,0.3)",
                        color: "var(--accent)",
                        borderRadius: 6,
                        cursor: "pointer",
                      }}
                    >
                      Editar
                    </button>

                    {/* ELIMINAR */}
                    <button
                      onClick={() => remove(teacher._id)}
                      style={{
                        padding: "5px 10px",
                        fontSize: "0.75rem",
                        background: "rgba(255,79,106,0.1)",
                        border: "1px solid rgba(255,79,106,0.3)",
                        color: "var(--danger)",
                        borderRadius: 6,
                        cursor: "pointer",
                      }}
                    >
                      Eliminar
                    </button>

                  </div>
                </div>

                {/* ───────── GRID EXPANDIDO ───────── */}
                {isOpen && (
                  <div style={{ marginTop: 16, paddingTop: 16, borderTop: "1px solid var(--border)" }}>

                    <div style={{
                      fontSize: "0.72rem",
                      color: "var(--text-muted)",
                      marginBottom: 10,
                      textTransform: "uppercase",
                    }}>
                      Disponibilidad (HC3) + Preferencias (SC1)
                    </div>

                    {/* HEADER BLOCKS */}
                    <div style={{
                      display: "grid",
                      gridTemplateColumns: "90px repeat(4, 1fr)",
                      gap: 5,
                      marginBottom: 5,
                    }}>
                      <div />
                      {BLOCKS.map(b => (
                        <div key={b} style={{
                          textAlign: "center",
                          fontSize: "0.7rem",
                          color: "var(--text-muted)",
                        }}>
                          {b}
                        </div>
                      ))}
                    </div>

                    {/* GRID */}
                    {DAYS.map(day => (
                      <div
                        key={day}
                        style={{
                          display: "grid",
                          gridTemplateColumns: "90px repeat(4, 1fr)",
                          gap: 5,
                          marginBottom: 5,
                        }}
                      >
                        <div style={{
                          fontSize: "0.75rem",
                          fontWeight: 600,
                          color: "var(--text-muted)",
                        }}>
                          {day}
                        </div>

                        {BLOCKS.map(block => {
                          const slot = `${day}-${block}`;
                          const isAvail = avail.includes(slot);
                          const isPref = prefs.includes(slot);

                          return (
                            <div
                              key={slot}
                              style={{
                                padding: "6px",
                                borderRadius: 6,
                                textAlign: "center",
                                fontSize: "0.7rem",
                                border: `1px solid ${
                                  isPref
                                    ? "rgba(34,211,160,0.4)"
                                    : isAvail
                                    ? "rgba(79,124,255,0.3)"
                                    : "var(--border)"
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
                              }}
                            >
                              {isPref ? "⭐" : isAvail ? "✓" : "—"}
                            </div>
                          );
                        })}
                      </div>
                    ))}

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