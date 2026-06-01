import { useEffect, useState } from "react";
import { studentService } from "../../services/studentService.js";
import { scheduleService } from "../../services/scheduleService.js";
import PageHeader from "../../components/ui/PageHeader.jsx";
import Card from "../../components/ui/Card.jsx";

export default function StudentSchedulePage() {
  const [students, setStudents] = useState([]);
  const [studentId, setStudentId] = useState("");
  const [rows, setRows] = useState([]);

  useEffect(() => {
    studentService.list().then(setStudents);
  }, []);

  useEffect(() => {
    if (studentId) scheduleService.byStudent(studentId).then(setRows);
    else setRows([]);
  }, [studentId]);

  return (
    <div className="space-y-6">
      <PageHeader title="Horario por estudiante" />

      <Card className="p-4 sm:p-6">
        <label className="mb-1.5 block text-sm font-medium text-slate-700">
          Estudiante
        </label>
        <select
          value={studentId}
          onChange={(e) => setStudentId(e.target.value)}
          className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
        >
          <option value="">Seleccionar estudiante...</option>
          {students.map((s) => (
            <option key={s._id} value={s._id}>
              {s.fullName}
            </option>
          ))}
        </select>
      </Card>

      {rows.length > 0 && (
        <>
          <div className="space-y-3 md:hidden">
            {rows.map((r, i) => (
              <Card key={i} className="p-4">
                <p className="font-semibold text-sgoha-primary">
                  {r.course?.code || r.course}
                </p>
                <dl className="mt-2 space-y-1 text-sm text-slate-600">
                  <div className="flex justify-between gap-2">
                    <dt className="text-slate-400">Docente</dt>
                    <dd className="text-right">{r.teacher?.fullName || r.teacher}</dd>
                  </div>
                  <div className="flex justify-between gap-2">
                    <dt className="text-slate-400">Aula</dt>
                    <dd className="text-right">{r.classroom?.code || r.classroom}</dd>
                  </div>
                  <div className="flex justify-between gap-2">
                    <dt className="text-slate-400">Franja</dt>
                    <dd className="text-right">
                      {r.timeSlot?.label ||
                        `${r.timeSlot?.day} ${r.timeSlot?.startTime}`}
                    </dd>
                  </div>
                </dl>
              </Card>
            ))}
          </div>

          <Card className="hidden overflow-hidden md:block">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[560px] text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50 text-xs font-semibold uppercase text-slate-500">
                    <th className="px-5 py-3">Curso</th>
                    <th className="px-5 py-3">Docente</th>
                    <th className="px-5 py-3">Aula</th>
                    <th className="px-5 py-3">Franja</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {rows.map((r, i) => (
                    <tr key={i} className="hover:bg-slate-50/80">
                      <td className="px-5 py-3 font-medium">
                        {r.course?.code || r.course}
                      </td>
                      <td className="px-5 py-3">
                        {r.teacher?.fullName || r.teacher}
                      </td>
                      <td className="px-5 py-3">
                        {r.classroom?.code || r.classroom}
                      </td>
                      <td className="px-5 py-3">
                        {r.timeSlot?.label ||
                          `${r.timeSlot?.day} ${r.timeSlot?.startTime}`}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </>
      )}
    </div>
  );
}
