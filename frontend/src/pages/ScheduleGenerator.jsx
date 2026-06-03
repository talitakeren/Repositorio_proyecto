import { useState } from "react";
import { apiUrl } from "../config/api";

export default function ScheduleGenerator() {
  const [schedule,   setSchedule]   = useState([]);
  const [metrics,    setMetrics]    = useState(null);
  const [loading,    setLoading]    = useState(false);
  const [generated,  setGenerated]  = useState(false);
  const [error,      setError]      = useState(null);

  async function generate() {
    setLoading(true);
    setGenerated(false);
    setError(null);

    try {
      const res  = await fetch(apiUrl("/schedule/generate"));
      const data = await res.json();

      // El backend devuelve { schedule, totalAssigned, conflicts, unassigned,
      //                       preferencesMet, objectiveScore }
      setSchedule(data.schedule  || []);
      setMetrics({
        totalAssigned:  data.totalAssigned  ?? 0,
        conflicts:      data.conflicts      ?? 0,
        unassigned:     data.unassigned     ?? [],
        preferencesMet: data.preferencesMet ?? 0,
        objectiveScore: data.objectiveScore ?? 0,
      });
    } catch (err) {
      setError("No se pudo conectar al servidor. Verifica que el backend esté corriendo.");
    } finally {
      setLoading(false);
      setGenerated(true);
    }
  }

  // Color del score según calidad
  function scoreColor(score) {
    if (score >= 0.8) return "var(--success)";
    if (score >= 0.5) return "#f59e0b";
    return "var(--danger)";
  }

  // Etiqueta de calidad
  function scoreLabel(score) {
    if (score >= 0.8) return "Óptimo";
    if (score >= 0.5) return "Aceptable";
    return "Con conflictos";
  }

  // Porcentaje para la barra de progreso
  const scorePct = metrics ? Math.round(metrics.objectiveScore * 100) : 0;

  return (
    <>
      {/* ── Encabezado ── */}
      <div className="page-header">
        <h2>Generador de Horario</h2>
        <p>
          Genera automáticamente el horario académico usando backtracking con
          restricciones duras (HC1–HC3) y blandas (SC1–SC2).
        </p>
      </div>

      <button onClick={generate} disabled={loading}
        className={loading ? "btn-ghost btn" : ""}>
        {loading ? "⏳ Generando…" : "⚡ Generar Horario"}
      </button>

      {/* ── Error ── */}
      {error && (
        <div className="alert" style={{
          background: "rgba(255,79,106,0.1)",
          border: "1px solid rgba(255,79,106,0.3)",
          color: "var(--danger)",
          marginTop: 20,
        }}>
          ⚠️ {error}
        </div>
      )}

      {/* ── Panel de métricas ── */}
      {generated && metrics && (
        <div style={{
          marginTop: 28,
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: 14,
        }}>

          {/* Score principal */}
          <div className="card" style={{ gridColumn: "span 2", position: "relative", overflow: "hidden" }}>
            <div style={{ fontSize: "0.72rem", fontFamily: "var(--font-head)", textTransform: "uppercase",
              letterSpacing: "0.08em", color: "var(--text-muted)", marginBottom: 10 }}>
              Función Objetivo (objectiveScore)
            </div>
            <div style={{ display: "flex", alignItems: "flex-end", gap: 14, marginBottom: 12 }}>
              <span style={{
                fontSize: "3rem", fontFamily: "var(--font-head)", fontWeight: 800,
                lineHeight: 1, color: scoreColor(metrics.objectiveScore),
              }}>
                {(metrics.objectiveScore * 100).toFixed(1)}%
              </span>
              <span style={{
                fontSize: "0.8rem", padding: "3px 10px", borderRadius: 6,
                background: `${scoreColor(metrics.objectiveScore)}22`,
                color: scoreColor(metrics.objectiveScore),
                fontWeight: 600, marginBottom: 6,
              }}>
                {scoreLabel(metrics.objectiveScore)}
              </span>
            </div>
            {/* Barra de progreso */}
            <div style={{
              height: 6, borderRadius: 3,
              background: "var(--surface2)",
              overflow: "hidden",
            }}>
              <div style={{
                height: "100%", width: `${scorePct}%`,
                background: `linear-gradient(90deg, ${scoreColor(metrics.objectiveScore)}, ${scoreColor(metrics.objectiveScore)}aa)`,
                borderRadius: 3,
                transition: "width 0.6s ease",
              }} />
            </div>
            <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: 8 }}>
              FO = 0.7 × (asignados/total) + 0.3 × (preferencias/asignados)
            </div>
          </div>

          {/* Cursos asignados */}
          <MetricCard
            label="Cursos asignados"
            value={metrics.totalAssigned}
            icon="✅"
            color="var(--success)"
          />

          {/* Conflictos */}
          <MetricCard
            label="Conflictos (sin asignar)"
            value={metrics.conflicts}
            icon={metrics.conflicts === 0 ? "🎯" : "⚠️"}
            color={metrics.conflicts === 0 ? "var(--success)" : "var(--danger)"}
          />

          {/* Preferencias cumplidas */}
          <MetricCard
            label="Preferencias docente cumplidas (SC1)"
            value={metrics.preferencesMet}
            icon="⭐"
            color="var(--accent)"
          />

          {/* Cursos no asignados */}
          {metrics.unassigned.length > 0 && (
            <div className="card" style={{ gridColumn: "span 2",
              borderColor: "rgba(255,79,106,0.35)" }}>
              <div style={{ fontSize: "0.72rem", fontFamily: "var(--font-head)",
                textTransform: "uppercase", letterSpacing: "0.08em",
                color: "var(--danger)", marginBottom: 8 }}>
                ⚠️ Cursos sin horario asignado
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {metrics.unassigned.map((c, i) => (
                  <span key={i} style={{
                    fontSize: "0.82rem", padding: "3px 10px", borderRadius: 6,
                    background: "rgba(255,79,106,0.12)",
                    color: "var(--danger)", border: "1px solid rgba(255,79,106,0.3)",
                  }}>{c}</span>
                ))}
              </div>
              <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: 8 }}>
                Causa: sin docente disponible (HC3) o sin aula libre (HC2) en ningún bloque.
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── Tabla del horario ── */}
      {generated && schedule.length > 0 && (
        <div style={{ marginTop: 28 }}>
          <div className="page-header" style={{ marginBottom: 16 }}>
            <h2 style={{ fontSize: "1.1rem" }}>Horario Generado</h2>
            <p style={{ fontSize: "0.82rem" }}>
              {schedule.length} bloque{schedule.length !== 1 ? "s" : ""} asignado{schedule.length !== 1 ? "s" : ""}
            </p>
          </div>

          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Día</th>
                  <th>Bloque</th>
                  <th>Curso</th>
                  <th>Docente</th>
                  <th>Aula</th>
                  <th>Pref. SC1</th>
                </tr>
              </thead>
              <tbody>
                {schedule.map((item, i) => (
                  <tr key={i}>
                    <td style={{ fontFamily: "var(--font-head)", fontWeight: 700,
                      fontSize: "0.8rem", color: i % 2 === 0 ? "var(--accent)" : "#a78bfa" }}>
                      {item.day}
                    </td>
                    <td style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>
                      {item.block}
                    </td>
                    <td style={{ fontWeight: 500 }}>{item.course}</td>
                    <td style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>
                      {item.teacher}
                    </td>
                    <td>
                      <span style={{
                        fontSize: "0.78rem", padding: "3px 9px", borderRadius: 5,
                        background: "var(--surface2)",
                        border: "1px solid var(--border)",
                        color: "var(--text-muted)",
                      }}>
                        {item.classroom}
                      </span>
                    </td>
                    <td style={{ textAlign: "center" }}>
                      {item.meetsPreference
                        ? <span title="Bloque preferido cumplido">⭐</span>
                        : <span style={{ color: "var(--text-muted)" }}>—</span>
                      }
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── Sin datos ── */}
      {generated && !error && schedule.length === 0 && (
        <div className="empty-state" style={{ marginTop: 24 }}>
          No se pudo generar el horario. Verifica que existan cursos, docentes con
          disponibilidad configurada, y aulas registradas.
        </div>
      )}
    </>
  );
}

/* Tarjeta de métrica simple */
function MetricCard({ label, value, icon, color }) {
  return (
    <div className="card">
      <div style={{ fontSize: "0.72rem", fontFamily: "var(--font-head)",
        textTransform: "uppercase", letterSpacing: "0.08em",
        color: "var(--text-muted)", marginBottom: 8 }}>
        {label}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <span style={{ fontSize: "1.6rem" }}>{icon}</span>
        <span style={{
          fontSize: "2.2rem", fontFamily: "var(--font-head)",
          fontWeight: 800, color, lineHeight: 1,
        }}>
          {value}
        </span>
      </div>
    </div>
  );
}