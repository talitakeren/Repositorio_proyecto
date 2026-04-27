import { useEffect, useState } from "react";

export default function StudentSchedule() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:5050/schedule")
      .then(res => res.json())
      .then(d => { setData(d); setLoading(false); });
  }, []);

  return (
    <>
      <div className="page-header">
        <h2>Horario General</h2>
        <p>Vista completa del horario académico</p>
      </div>

      {loading ? (
        <div className="empty-state">Cargando horario…</div>
      ) : data.length === 0 ? (
        <div className="empty-state">El horario aún no ha sido generado.</div>
      ) : (
        <div className="schedule-grid">
          {data.map((item, index) => (
            <div className="schedule-item" key={index}>
              <span className="schedule-day">{item.day}</span>
              <span className="schedule-hour">{item.hour}</span>
              <span className="schedule-course">{item.course}</span>
              {item.classroom && (
                <span className="schedule-room">{item.classroom}</span>
              )}
            </div>
          ))}
        </div>
      )}
    </>
  );
}