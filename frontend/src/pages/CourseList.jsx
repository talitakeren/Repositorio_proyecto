import { useEffect, useState } from "react";

export default function CourseList() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingCourse, setEditingCourse] = useState(null);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = () => {
    setLoading(true);
    fetch("http://localhost:5050/course")
      .then(res => res.json())
      .then(data => {
        setCourses(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  // ELIMINAR
  const handleDelete = async (id) => {
    if (!window.confirm("¿Eliminar curso?")) return;

    await fetch(`http://localhost:5050/course/${id}`, {
      method: "DELETE",
    });

    setCourses(courses.filter(c => c._id !== id));
  };

  // EDITAR
  const handleEditClick = (course) => {
    setEditingCourse(course);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setEditingCourse({ ...editingCourse, [name]: value });
  };

  // ACTUALIZAR
  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!editingCourse || !editingCourse._id) return;

    const { _id, ...data } = editingCourse;

    const response = await fetch(`http://localhost:5050/course/${_id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      setCourses(
        courses.map(c => (c._id === _id ? editingCourse : c))
      );
      setEditingCourse(null);
    } else {
      alert("Error al actualizar");
    }
  };

  return (
    <>
      <div className="page-header">
        <h2>Cursos</h2>
        <p>Listado de cursos registrados en el sistema</p>
      </div>

      {/* FORM EDITAR */}
      {editingCourse && (
        <div className="edit-form-wrap">
          <h3>Editar Curso</h3>

          <form onSubmit={handleUpdate}>
            <input
              name="code"
              value={editingCourse.code}
              onChange={handleFormChange}
              placeholder="Código"
            />

            <input
              name="name"
              value={editingCourse.name}
              onChange={handleFormChange}
              placeholder="Nombre"
            />

            <input
              name="credits"
              type="number"
              value={editingCourse.credits}
              onChange={handleFormChange}
              placeholder="Créditos"
            />

            <input
              name="classroomType"
              value={editingCourse.classroomType || ""}
              onChange={handleFormChange}
              placeholder="Tipo de Aula"
            />

            <button type="submit">Actualizar</button>

            <button type="button" onClick={() => setEditingCourse(null)}>
              Cancelar
            </button>
          </form>
        </div>
      )}

      {/* LISTADO */}
      {loading ? (
        <div>Cargando...</div>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Código</th>
                <th>Nombre</th>
                <th>Créditos</th>
                <th>Aula</th>
                <th>Acciones</th>
              </tr>
            </thead>

            <tbody>
              {courses.map(course => (
                <tr key={course._id}>
                  <td>{course.code}</td>
                  <td>{course.name}</td>
                  <td>{course.credits}</td>
                  <td>{course.classroomType || "—"}</td>

                  <td>
                    <button onClick={() => handleEditClick(course)}>
                      Editar
                    </button>

                    <button onClick={() => handleDelete(course._id)}>
                      Eliminar
                    </button>
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