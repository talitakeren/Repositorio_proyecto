import { useState } from "react";
import { enrollmentService } from "../../services/enrollmentService.js";

export default function EnrollmentValidationPage() {
  const [studentId, setStudentId] = useState("");
  const [courseIds, setCourseIds] = useState("");
  const [result, setResult] = useState(null);

  async function validate() {
    const ids = courseIds.split(",").map((s) => s.trim()).filter(Boolean);
    const data = await enrollmentService.validate({ studentId, courseIds: ids });
    setResult(data);
  }

  return (
    <>
      <div className="page-header"><h2>Validar matrícula</h2></div>
      <div className="card form-grid">
        <div className="form-group"><label>ID estudiante</label><input value={studentId} onChange={(e) => setStudentId(e.target.value)} /></div>
        <div className="form-group"><label>IDs cursos (separados por coma)</label><input value={courseIds} onChange={(e) => setCourseIds(e.target.value)} /></div>
        <button type="button" className="btn" onClick={validate}>Validar</button>
      </div>
      {result && (
        <div className={`card alert ${result.valid ? "alert-success" : "alert-error"}`}>
          <p><strong>Estado:</strong> {result.status}</p>
          <p><strong>Créditos:</strong> {result.totalCredits}</p>
          <ul>{result.messages?.map((m) => <li key={m}>{m}</li>)}</ul>
        </div>
      )}
    </>
  );
}
