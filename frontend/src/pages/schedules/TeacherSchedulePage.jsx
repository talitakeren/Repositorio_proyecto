import { useEffect, useState } from "react";
import { teacherService } from "../../services/teacherService.js";
import { scheduleService } from "../../services/scheduleService.js";

export default function TeacherSchedulePage() {
  const [teachers, setTeachers] = useState([]);
  const [teacherId, setTeacherId] = useState("");
  const [rows, setRows] = useState([]);

  useEffect(() => { teacherService.list().then(setTeachers); }, []);
  useEffect(() => {
    if (teacherId) scheduleService.byTeacher(teacherId).then(setRows);
  }, [teacherId]);

  return (
    <>
      <div className="page-header"><h2>Horario por docente</h2></div>
      <div className="card">
        <select value={teacherId} onChange={(e) => setTeacherId(e.target.value)}>
          <option value="">Docente...</option>
          {teachers.map((t) => <option key={t._id} value={t._id}>{t.fullName}</option>)}
        </select>
      </div>
      <table>
        <thead><tr><th>Curso</th><th>Aula</th><th>Franja</th></tr></thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i}>
              <td>{r.course?.code}</td>
              <td>{r.classroom?.code}</td>
              <td>{r.timeSlot?.label}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
