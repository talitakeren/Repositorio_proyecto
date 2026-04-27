import { useEffect, useState } from "react";

export default function CourseList() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:5050/course")
      .then(res => res.json())
      .then(data => { setCourses(data); setLoading(false); });
  }, []);

  return (
    <>
      <div className="page-header">
        <h2>Cursos</h2>
        <p>Listado de cursos registrados en el sistema</p>
      </div>

      {loading ? (
        <div className="empty-state">Cargando cursos…</div>
      ) : courses.length === 0 ? (
        <div className="empty-state">No hay cursos registrados aún.</div>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Código</th>
                <th>Nombre</th>
                <th>Créditos</th>
                <th>Tipo de Aula</th>
              </tr>
            </thead>
            <tbody>
              {courses.map(course => (
                <tr key={course._id}>
                  <td>
                    <span className="item-badge">{course.code}</span>
                  </td>
                  <td>{course.name}</td>
                  <td>{course.credits}</td>
                  <td style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>
                    {course.classroomType || "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}