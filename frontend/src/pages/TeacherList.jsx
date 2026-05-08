import { useEffect, useState, useMemo } from "react";

const DAYS   = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"];
const BLOCKS = ["8-10", "10-12", "14-16", "16-18"];
const TOTAL_SLOTS = DAYS.length * BLOCKS.length;

export default function TeacherList() {
  const [data, setData]       = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetch("http://localhost:5050/teacher")
      .then(res => res.json())
      .then(d => { setData(d); setLoading(false); })
      .catch((err) => { console.error(err); setLoading(false); });
  }, []);

  async function remove(id, name) {
    if (!window.confirm(`¿Estás seguro de que deseas eliminar al docente ${name}?`)) return;
    
    try {
      const res = await fetch(`http://localhost:5050/teacher/${id}`, { method: "DELETE" });
      if(res.ok) {
        setData(prev => prev.filter(t => t._id !== id));
      }
    } catch (error) {
      alert("Error al intentar eliminar el docente");
    }
  }

  const filteredData = useMemo(() => {
    return data.filter(teacher => 
      teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      teacher.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [data, searchTerm]);

  return (
    <>
      <div className="page-header" style={{ marginBottom: "20px", color: "#f8fafc" }}>
        {/* Asumo que los estilos de h2 y p ya los maneja tu CSS global para la cabecera */}
        <h2>Docentes</h2>
        <p style={{ color: "#94a3b8" }}>Listado del cuerpo docente con disponibilidad horaria configurada</p>
      </div>

      {/* --- BUSCADOR --- */}
      {!loading && data.length > 0 && (
        <div style={{ marginBottom: "24px" }}>
          <div style={{ position: "relative", maxWidth: "400px" }}>
            <span style={{ position: "absolute", left: "14px", top: "10px", fontSize: "1rem" }}>🔍</span>
            <input 
              type="text" 
              placeholder="Buscar por nombre o correo..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: "100%", padding: "10px 15px 10px 40px",
                borderRadius: "8px", 
                border: "1px solid rgba(255, 255, 255, 0.1)",
                background: "rgba(255, 255, 255, 0.05)",
                color: "#f8fafc",
                fontSize: "0.95rem", outline: "none",
                boxSizing: "border-box"
              }}
            />
          </div>
        </div>
      )}

      {loading ? (
        <div className="empty-state" style={{ color: "#94a3b8" }}>Cargando docentes…</div>
      ) : data.length === 0 ? (
        <div className="empty-state" style={{ color: "#94a3b8" }}>
          No hay docentes registrados. Agrega uno desde <strong style={{color: "#f8fafc"}}>Nuevo Docente</strong>.
        </div>
      ) : filteredData.length === 0 ? (
        <div className="empty-state" style={{ color: "#94a3b8" }}>No se encontraron docentes con esa búsqueda.</div>
      ) : (
        <div className="item-list" style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {filteredData.map(teacher => {
            const avail = teacher.availability || [];
            const prefs = teacher.preferences  || [];
            const isOpen = expanded === teacher._id;
            const sinDisponibilidad = avail.length === 0;

            const availPercentage = (avail.length / TOTAL_SLOTS) * 100;

            return (
              <div key={teacher._id} className="item-row" style={{
                flexDirection: "column", alignItems: "stretch", gap: 0,
                backgroundColor: "rgba(255, 255, 255, 0.03)", // Fondo de tarjeta oscuro
                padding: "16px",
                borderRadius: "12px",
                border: `1px solid ${sinDisponibilidad ? "rgba(255,79,106,0.3)" : "rgba(255, 255, 255, 0.08)"}`,
                transition: "all 0.2s ease"
              }}>

                {/* ── Fila principal ── */}
                <div style={{ display: "flex", alignItems: "center", gap: 16 }}>

                  {/* Avatar inicial */}
                  <div style={{
                    width: 45, height: 45, borderRadius: "50%",
                    background: sinDisponibilidad ? "rgba(255,255,255,0.1)" : "linear-gradient(135deg, #6366f1, #818cf8)", // Tonos índigo
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontFamily: "var(--font-head)", fontWeight: 800,
                    fontSize: "1.1rem", color: sinDisponibilidad ? "#64748b" : "#ffffff", flexShrink: 0,
                  }}>
                    {teacher.name?.charAt(0).toUpperCase()}
                  </div>

                  {/* Nombre y email */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 600, fontSize: "1.05rem", color: sinDisponibilidad ? "#94a3b8" : "#f8fafc" }}>
                      {teacher.name}
                    </div>
                    <div style={{ fontSize: "0.85rem", color: "#64748b", marginTop: "2px" }}>
                      {teacher.email}
                    </div>
                  </div>

                  {/* Badges y Barra de Capacidad */}
                  <div style={{ display: "flex", flexDirection: "column", gap: 6, flexShrink: 0, width: "160px" }}>
                    {sinDisponibilidad ? (
                      <span style={{
                        fontSize: "0.75rem", padding: "4px 10px", borderRadius: 6, textAlign: "center",
                        background: "rgba(255,79,106,0.1)", border: "1px solid rgba(255,79,106,0.3)",
                        color: "#ff4f6a", fontWeight: 600,
                      }}>
                        ⚠️ Sin disponibilidad
                      </span>
                    ) : (
                      <>
                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem", fontWeight: 600 }}>
                          <span style={{ color: "#818cf8" }}>{avail.length} bloques disp.</span>
                          {prefs.length > 0 && <span style={{ color: "#34d399" }}>⭐ {prefs.length} pref.</span>}
                        </div>
                        <div style={{ width: "100%", height: "6px", background: "rgba(255,255,255,0.1)", borderRadius: "3px", overflow: "hidden" }}>
                          <div style={{ 
                            height: "100%", 
                            width: `${availPercentage}%`, 
                            background: "#6366f1",
                            borderRadius: "3px"
                          }} />
                        </div>
                      </>
                    )}
                  </div>

                  {/* Separador vertical */}
                  <div style={{ width: "1px", height: "40px", background: "rgba(255, 255, 255, 0.1)", margin: "0 8px" }}></div>

                  {/* Acciones */}
                  <div style={{ display: "flex", gap: 8, flexShrink: 0, alignItems: "center" }}>
                    <button
                      type="button"
                      onClick={() => setExpanded(isOpen ? null : teacher._id)}
                      style={{ 
                        padding: "8px 12px", fontSize: "0.8rem", cursor: "pointer",
                        background: isOpen ? "rgba(255,255,255,0.1)" : "transparent",
                        color: "#cbd5e1",
                        border: "1px solid rgba(255,255,255,0.15)", borderRadius: "6px", fontWeight: 600
                      }}
                    >
                      {isOpen ? "▲ Ocultar" : "▼ Ver grilla"}
                    </button>

                    <button
                      type="button"
                      onClick={() => remove(teacher._id, teacher.name)}
                      style={{
                        padding: "8px 12px", fontSize: "0.8rem", fontWeight: 600,
                        background: "rgba(255,79,106,0.1)", border: "1px solid rgba(255,79,106,0.3)",
                        color: "#ff4f6a", borderRadius: "6px", cursor: "pointer",
                      }}
                      title="Eliminar docente"
                    >
                      ✕
                    </button>
                  </div>
                </div>

                {/* ── Grilla de disponibilidad expandible ── */}
                {isOpen && (
                  <div style={{ marginTop: 20, paddingTop: 16, borderTop: "1px dashed rgba(255,255,255,0.1)" }}>
                    <div style={{
                      fontSize: "0.75rem", fontFamily: "var(--font-head)",
                      textTransform: "uppercase", letterSpacing: "0.05em",
                      color: "#94a3b8", marginBottom: 12, fontWeight: 600
                    }}>
                      Grilla horaria semanal
                    </div>

                    {/* Encabezados bloques */}
                    <div style={{
                      display: "grid", gridTemplateColumns: "90px repeat(4, 1fr)",
                      gap: 5, marginBottom: 8,
                    }}>
                      <div />
                      {BLOCKS.map(b => (
                        <div key={b} style={{
                          fontSize: "0.7rem", textAlign: "center", color: "#94a3b8",
                          fontWeight: 700, textTransform: "uppercase", background: "rgba(255,255,255,0.05)", padding: "4px", borderRadius: "4px"
                        }}>
                          {b}
                        </div>
                      ))}
                    </div>

                    {/* Filas por día */}
                    {DAYS.map(day => (
                      <div key={day} style={{
                        display: "grid", gridTemplateColumns: "90px repeat(4, 1fr)",
                        gap: 5, marginBottom: 5,
                      }}>
                        <div style={{
                          fontSize: "0.8rem", fontWeight: 700, color: "#cbd5e1",
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
                              padding: "8px 4px", borderRadius: 6, textAlign: "center",
                              fontSize: "0.8rem",
                              border: `1px solid ${
                                isPref  ? "rgba(52, 211, 153, 0.3)" :
                                isAvail ? "rgba(129, 140, 248, 0.3)" : "rgba(255,255,255,0.05)"
                              }`,
                              background: isPref ? "rgba(52, 211, 153, 0.1)" : isAvail ? "rgba(99, 102, 241, 0.15)" : "rgba(255,255,255,0.02)",
                              color: isPref ? "#34d399" : isAvail ? "#818cf8" : "#475569",
                              transition: "all 0.2s ease",
                            }}>
                              {isPref ? "⭐" : isAvail ? "✓" : "—"}
                            </div>
                          );
                        })}
                      </div>
                    ))}

                    {/* Leyenda */}
                    <div style={{
                      display: "flex", gap: 20, marginTop: 16,
                      fontSize: "0.75rem", color: "#94a3b8", background: "rgba(255,255,255,0.03)", padding: "8px 12px", borderRadius: "6px", width: "fit-content"
                    }}>
                      <span style={{display: "flex", alignItems: "center", gap: "4px"}}><span style={{ color: "#818cf8", fontWeight: "bold" }}>✓</span> Disponible (HC3)</span>
                      <span style={{display: "flex", alignItems: "center", gap: "4px"}}><span style={{ color: "#34d399", fontWeight: "bold" }}>⭐</span> Preferido (SC1)</span>
                      <span style={{display: "flex", alignItems: "center", gap: "4px"}}><span style={{ color: "#475569", fontWeight: "bold" }}>—</span> No disponible</span>
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