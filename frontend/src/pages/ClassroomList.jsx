import { useEffect, useState } from "react";

export default function ClassroomList() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:5050/classroom")
      .then(res => res.json())
      .then(d => { setData(d); setLoading(false); });
  }, []);

  return (
    <>
      <div className="page-header">
        <h2>Aulas</h2>
        <p>Listado de aulas disponibles y su capacidad</p>
      </div>

      {loading ? (
        <div className="empty-state">Cargando aulas…</div>
      ) : data.length === 0 ? (
        <div className="empty-state">No hay aulas registradas.</div>
      ) : (
        <div className="item-list">
          {data.map(item => (
            <div className="item-row" key={item._id}>
              <span className="item-badge">{item.code}</span>
              <span className="item-label">Aula {item.code}</span>
              <span className="item-meta">Capacidad: {item.capacity} personas</span>
            </div>
          ))}
        </div>
      )}
    </>
  );
}