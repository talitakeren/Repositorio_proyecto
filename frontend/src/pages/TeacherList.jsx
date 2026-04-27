import { useEffect, useState } from "react";

export default function TeacherList() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:5050/teacher")
      .then(res => res.json())
      .then(d => { setData(d); setLoading(false); });
  }, []);

  return (
    <>
      <div className="page-header">
        <h2>Docentes</h2>
        <p>Listado del cuerpo docente registrado</p>
      </div>

      {loading ? (
        <div className="empty-state">Cargando docentes…</div>
      ) : data.length === 0 ? (
        <div className="empty-state">No hay docentes registrados.</div>
      ) : (
        <div className="item-list">
          {data.map(item => (
            <div className="item-row" key={item._id}>
              <span className="item-label">{item.name}</span>
              <span className="item-meta">{item.email}</span>
            </div>
          ))}
        </div>
      )}
    </>
  );
}