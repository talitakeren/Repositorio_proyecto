import { useEffect, useState } from "react";

export default function StudentSchedule() {
  const [data,    setData]    = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:5050/schedule")
      .then(res => res.json())
      .then(d => { setData(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  // Agrupar por día para una vista más clara
  const DAYS_ORDER = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"];
  const byDay = DAYS_ORDER.reduce((acc, day) => {
    const items = data.filter(item => item.day === day);
    if (items.length > 0) acc[day] = items;
    return acc;
  }, {});

  return (
    <>
      <div className="page-header">
        <h2>Horario General</h2>
        <p>Vista completa del horario académico generado</p>
      </div>

      {loading ? (
        <div className="empty-state">Cargando horario…</div>
      ) : data.length === 0 ? (
        <div className="empty-state">
          El horario aún no ha sido generado. Ve a{" "}
          <strong>Generador de Horario</strong> para crearlo.
        </div>
      ) : (
        <>
          <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", marginBottom: 24 }}>
            {data.length} asignación{data.length !== 1 ? "es" : ""} en total
          </p>

          {Object.entries(byDay).map(([day, items]) => (
            <div key={day} style={{ marginBottom: 28 }}>
              {/* Cabecera del día */}
              <div style={{
                fontFamily: "var(--font-head)", fontWeight: 700,
                fontSize: "0.78rem", textTransform: "uppercase",
                letterSpacing: "0.1em", color: "var(--accent)",
                marginBottom: 10, paddingBottom: 6,
                borderBottom: "1px solid var(--border)",
              }}>
                {day}
              </div>

              <div className="schedule-grid">
                {items
                  .slice()
                  .sort((a, b) => (a.block || a.hour || "").localeCompare(b.block || b.hour || ""))
                  .map((item, i) => (
                    <div className="schedule-item" key={i}>
                      <span className="schedule-hour">
                        {item.block || item.hour}
                      </span>
                      <span className="schedule-course">{item.course}</span>
                      <span className="schedule-room" style={{ minWidth: 60 }}>
                        {item.teacher}
                      </span>
                      {item.classroom && (
                        <span className="schedule-room">{item.classroom}</span>
                      )}
                      {item.meetsPreference && (
                        <span title="Preferencia del docente cumplida (SC1)"
                          style={{ fontSize: "0.85rem" }}>⭐</span>
                      )}
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </>
      )}
    </>
  );
}