import { useEffect, useState } from "react";
import { classroomService } from "../../services/classroomService.js";
import { scheduleService } from "../../services/scheduleService.js";

export default function ClassroomSchedulePage() {
  const [classrooms, setClassrooms] = useState([]);
  const [classroomId, setClassroomId] = useState("");
  const [rows, setRows] = useState([]);

  useEffect(() => { classroomService.list().then(setClassrooms); }, []);
  useEffect(() => {
    if (classroomId) scheduleService.byClassroom(classroomId).then(setRows);
  }, [classroomId]);

  return (
    <>
      <div className="page-header"><h2>Horario por aula</h2></div>
      <div className="card">
        <select value={classroomId} onChange={(e) => setClassroomId(e.target.value)}>
          <option value="">Aula...</option>
          {classrooms.map((c) => <option key={c._id} value={c._id}>{c.code}</option>)}
        </select>
      </div>
      <table>
        <thead><tr><th>Curso</th><th>Docente</th><th>Franja</th></tr></thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i}>
              <td>{r.course?.code}</td>
              <td>{r.teacher?.fullName}</td>
              <td>{r.timeSlot?.label}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
