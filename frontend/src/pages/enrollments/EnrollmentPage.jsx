import { useEffect, useState } from "react";
import { studentService } from "../../services/studentService.js";
import { courseService } from "../../services/courseService.js";
import { enrollmentService } from "../../services/enrollmentService.js";

export default function EnrollmentPage() {
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [studentId, setStudentId] = useState("");
  const [selected, setSelected] = useState([]);
  const [totalCredits, setTotalCredits] = useState(0);

  useEffect(() => {
    studentService.list().then(setStudents);
    courseService.list().then(setCourses);
  }, []);

  useEffect(() => {
    const total = courses
      .filter((c) => selected.includes(c._id))
      .reduce((s, c) => s + c.credits, 0);
    setTotalCredits(total);
  }, [selected, courses]);

  function toggle(courseId) {
    setSelected((prev) =>
      prev.includes(courseId) ? prev.filter((id) => id !== courseId) : [...prev, courseId]
    );
  }

  async function save() {
    await enrollmentService.create({ studentId, courseIds: selected });
    alert("Matrícula guardada (borrador)");
    setSelected([]);
  }

  return (
    <>
      <div className="page-header">
        <h2>Matrícula</h2>
        <p>El estudiante elige los cursos (sin asignación aleatoria)</p>
      </div>
      <div className="card">
        <div className="form-group">
          <label>Estudiante</label>
          <select value={studentId} onChange={(e) => setStudentId(e.target.value)}>
            <option value="">Seleccione...</option>
            {students.map((s) => <option key={s._id} value={s._id}>{s.code} - {s.fullName}</option>)}
          </select>
        </div>
        <p><strong>Créditos acumulados:</strong> {totalCredits} (objetivo: 20-22)</p>
        <div style={{ display: "grid", gap: "0.5rem", marginTop: "1rem" }}>
          {courses.map((c) => (
            <label key={c._id} style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
              <input type="checkbox" checked={selected.includes(c._id)} onChange={() => toggle(c._id)} />
              {c.code} - {c.name} ({c.credits} créditos)
            </label>
          ))}
        </div>
        <button type="button" className="btn" style={{ marginTop: "1rem" }} disabled={!studentId || !selected.length} onClick={save}>
          Guardar selección
        </button>
      </div>
    </>
  );
}
