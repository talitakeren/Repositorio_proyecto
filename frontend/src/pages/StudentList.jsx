import { useEffect, useState } from "react";

export default function StudentList() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:5050/student")
      .then(res => res.json())
      .then(d => { setData(d); setLoading(false); });
  }, []);

  return (
    <>
      <div className="page-header">
        <h2>Estudiantes</h2>
        <p>Listado de estudiantes matriculados</p>
      </div>

      {loading ? (
        <div className="empty-state">Cargando estudiantes…</div>
      ) : data.length === 0 ? (
        <div className="empty-state">No hay estudiantes registrados.</div>
      ) : (
        <div className="item-list">
          {data.map(item => (
            <div className="item-row" key={item._id}>
              <span className="item-badge">{item.code}</span>
              <span className="item-label">{item.name}</span>
            </div>
          ))}
        </div>
      )}
    </>
  );
}