import { Check } from "lucide-react";
import {
  DAYS as AVAILABILITY_DAYS,
  TIME_BLOCKS,
  AVAILABILITY_SHIFTS,
  blocksForShift,
  slotKey,
} from "../../constants/timeBlocks.js";

/**
 * Grilla de disponibilidad docente (7 días × bloques HORALV).
 * Formato de cada celda seleccionada: { day, startTime, endTime }.
 */
export default function AvailabilityGrid({
  value = [],
  onChange,
  readOnly = false,
  groupByShift = true,
}) {
  const selected = new Set(
    value.map((v) => slotKey(v.day, v.startTime, v.endTime))
  );

  function toggle(day, startTime, endTime) {
    if (readOnly || !onChange) return;
    const k = slotKey(day, startTime, endTime);
    const next = selected.has(k)
      ? value.filter((v) => slotKey(v.day, v.startTime, v.endTime) !== k)
      : [...value, { day, startTime, endTime }];
    onChange(next);
  }

  const gridCols =
    "grid gap-1.5 sm:gap-2 [grid-template-columns:minmax(7.5rem,9rem)_repeat(7,minmax(2.75rem,1fr))] sm:[grid-template-columns:minmax(7.5rem,9rem)_repeat(7,minmax(3rem,1fr))]";

  function renderBlockRow(block) {
    return (
      <div key={block.label} className="contents">
        <div className="sticky left-0 z-[1] flex items-center bg-white py-0.5 pr-2 text-[0.65rem] font-medium leading-tight text-slate-500 sm:text-xs">
          {block.label}
        </div>
        {AVAILABILITY_DAYS.map((d) => {
          const on = selected.has(
            slotKey(d.key, block.startTime, block.endTime)
          );
          return (
            <button
              key={`${d.key}-${block.startTime}`}
              type="button"
              disabled={readOnly}
              aria-pressed={on}
              aria-label={`${d.fullLabel || d.label} ${block.label}`}
              onClick={() => toggle(d.key, block.startTime, block.endTime)}
              className={`flex min-h-8 items-center justify-center rounded-lg border transition-all duration-150 sm:min-h-9 ${
                on
                  ? "border-green-600 bg-green-500 text-white shadow-sm hover:bg-green-600"
                  : "border-slate-200 bg-slate-100 text-slate-400 hover:border-blue-200 hover:bg-blue-50"
              } ${readOnly ? "cursor-default opacity-85" : "cursor-pointer active:scale-[0.97]"}`}
            >
              {on && <Check className="h-3.5 w-3.5 sm:h-4 sm:w-4" strokeWidth={3} />}
            </button>
          );
        })}
      </div>
    );
  }

  function renderShiftSeparator(label) {
    return (
      <div
        className="col-span-full flex items-center gap-2 bg-slate-50/80 px-1 py-2"
        role="presentation"
      >
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
          {label}
        </span>
        <span className="h-px flex-1 bg-slate-200" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-center text-[11px] text-slate-400 lg:hidden">
        Desliza horizontalmente para ver los siete días de la semana
      </p>

      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white p-2 sm:p-4">
        <div className={`${gridCols} mx-auto w-full min-w-[52rem] max-w-full`}>
          <div className="sticky left-0 z-[2] bg-white" aria-hidden />
          {AVAILABILITY_DAYS.map((d) => (
            <div
              key={d.key}
              className="py-1 text-center text-[0.65rem] font-semibold text-slate-600 sm:text-xs"
              title={d.fullLabel}
            >
              {d.label}
            </div>
          ))}

          {groupByShift
            ? AVAILABILITY_SHIFTS.map((shift) => (
                <div key={shift.id} className="contents">
                  {renderShiftSeparator(shift.label)}
                  {blocksForShift(shift.id).map((block) => renderBlockRow(block))}
                </div>
              ))
            : TIME_BLOCKS.map((block) => renderBlockRow(block))}
        </div>
      </div>

      <div className="flex flex-col gap-2 rounded-xl border border-slate-100 bg-slate-50/60 px-4 py-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-6">
        <span className="inline-flex items-center gap-2 text-xs text-slate-600">
          <span className="flex h-5 w-8 items-center justify-center rounded border border-green-600 bg-green-500">
            <Check className="h-3 w-3 text-white" strokeWidth={3} />
          </span>
          Disponible
        </span>
        <span className="inline-flex items-center gap-2 text-xs text-slate-600">
          <span className="h-5 w-8 rounded border border-slate-200 bg-slate-100" />
          No disponible
        </span>
        <span className="text-xs text-slate-500">
          Cada bloque representa una franja académica oficial HORALV (
          {TIME_BLOCKS[0]?.startTime} – último bloque del día).
        </span>
      </div>
    </div>
  );
}
