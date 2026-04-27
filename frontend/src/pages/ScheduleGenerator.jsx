import { useState } from "react";

export default function ScheduleGenerator() {
  const [schedule, setSchedule] = useState([]);
  const [loading, setLoading] = useState(false);
  const [generated, setGenerated] = useState(false);

  async function generate() {
    setLoading(true);
    setGenerated(false);
    const res = await fetch("http://localhost:5050/schedule/generate");
    const data = await res.json();
    setSchedule(data);
    setLoading(false);
    setGenerated(true);
  }

  return (
    <>
      <div className="page-header">
        <h2>Generador de Horario</h2>
        <p>Genera automáticamente el horario académico</p>
      </div>

      <button onClick={generate} disabled={loading} className={loading ? "btn-ghost btn" : ""}>
        {loading ? "⏳ Generando…" : "⚡ Generar Horario"}
      </button>

      {generated && schedule.length > 0 && (
        <div style={{ marginTop: "28px" }}>
          <div className="page-header">
            <p style={{ fontSize: "0.82rem" }}>
              {schedule.length} bloques generados
            </p>
          </div>
          <div className="schedule-grid">
            {schedule.map((item, index) => (
              <div className="schedule-item" key={index}>
                <span className="schedule-day">{item.day}</span>
                <span className="schedule-hour">{item.hour}</span>
                <span className="schedule-course">{item.course}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {generated && schedule.length === 0 && (
        <div className="empty-state" style={{ marginTop: 24 }}>
          No se pudo generar el horario. Verifica los datos ingresados.
        </div>
      )}
    </>
  );
}