import {
  DAYS as AVAILABILITY_DAYS,
  TIME_BLOCKS,
  GRID_TURN_LABELS,
} from "../../constants/timeBlocks.js";

const TURN_LABELS = GRID_TURN_LABELS;

function studentCount(assignment) {
  const list = assignment.students;
  if (!list) return 0;
  return Array.isArray(list) ? list.length : 0;
}

/**
 * Grilla semanal HORALV (Lun–Dom × bloques oficiales).
 * variant: student | teacher | classroom
 */
export default function WeeklyGrid({ assignments = [], variant = "student" }) {
  const map = new Map();
  for (const a of assignments) {
    const ts = a.timeSlot || {};
    const key = `${ts.day}|${ts.startTime}|${ts.endTime}`;
    if (!map.has(key)) map.set(key, []);
    map.get(key).push(a);
  }

  const accentByVariant = {
    student: "bg-blue-50 border-blue-200 text-blue-900",
    teacher: "bg-amber-50 border-amber-200 text-amber-900",
    classroom: "bg-emerald-50 border-emerald-200 text-emerald-900",
  };
  const accent = accentByVariant[variant] || accentByVariant.student;

  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
      <table className="min-w-[720px] w-full border-collapse text-left">
        <thead>
          <tr className="border-b border-slate-200 bg-slate-50">
            <th className="sticky left-0 z-10 min-w-[7.5rem] bg-slate-50 px-3 py-2.5 text-xs font-semibold text-slate-500">
              Franja
            </th>
            {AVAILABILITY_DAYS.map((d) => (
              <th
                key={d.key}
                className="px-2 py-2.5 text-center text-xs font-semibold uppercase tracking-wide text-slate-600"
              >
                {d.fullLabel}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {TIME_BLOCKS.flatMap((block, blockIndex) => {
            const turn = TURN_LABELS.find((t) => t.afterIndex === blockIndex);
            const rows = [];

            if (blockIndex === 0) {
              rows.push(
                <tr key="turn-morning">
                  <td
                    colSpan={AVAILABILITY_DAYS.length + 1}
                    className="bg-slate-100/80 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-500"
                  >
                    Mañana
                  </td>
                </tr>
              );
            }
            if (turn) {
              rows.push(
                <tr key={`turn-${turn.label}`}>
                  <td
                    colSpan={AVAILABILITY_DAYS.length + 1}
                    className="bg-slate-100/80 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-500"
                  >
                    {turn.label}
                  </td>
                </tr>
              );
            }

            rows.push(
              <tr
                key={block.label}
                className="border-t border-slate-100 align-top"
              >
                <td className="sticky left-0 z-10 bg-white px-3 py-2 text-[11px] font-medium text-slate-500 whitespace-nowrap">
                  {block.label}
                </td>
                {AVAILABILITY_DAYS.map((d) => {
                  const cellKey = `${d.key}|${block.startTime}|${block.endTime}`;
                  const items = map.get(cellKey) || [];
                  return (
                    <td
                      key={`${d.key}-${block.startTime}`}
                      className="min-w-[6.5rem] border-l border-slate-50 px-1.5 py-1.5"
                    >
                      {items.map((a, idx) => (
                        <article
                          key={idx}
                          className={`mb-1 last:mb-0 rounded-lg border px-2 py-1.5 text-[11px] leading-tight ${accent}`}
                        >
                          <p className="truncate font-semibold">
                            {a.course?.code || "—"}
                          </p>
                          <p className="truncate opacity-90">
                            {a.course?.name || ""}
                          </p>
                          {variant === "student" && (
                            <>
                              <p className="truncate text-[10px] opacity-80">
                                {a.teacher?.fullName || "—"}
                              </p>
                              <p className="truncate text-[10px] opacity-80">
                                {a.classroom?.code || a.classroom?.name || "—"}
                              </p>
                            </>
                          )}
                          {variant === "teacher" && (
                            <>
                              <p className="truncate text-[10px] opacity-80">
                                {a.classroom?.code || a.classroom?.name || "—"}
                              </p>
                              <p className="truncate text-[10px] opacity-80">
                                {studentCount(a)} estudiante(s)
                              </p>
                            </>
                          )}
                          {variant === "classroom" && (
                            <>
                              <p className="truncate text-[10px] opacity-80">
                                {a.teacher?.fullName || "—"}
                              </p>
                              <p className="truncate text-[10px] opacity-80">
                                {studentCount(a)} estudiante(s)
                              </p>
                            </>
                          )}
                        </article>
                      ))}
                    </td>
                  );
                })}
              </tr>
            );

            return rows;
          })}
        </tbody>
      </table>
    </div>
  );
}
