import { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  Save,
  RotateCcw,
  UserRound,
  CalendarCheck,
  Clock,
  CheckCircle2,
  Sun,
  Sunset,
  Moon,
  Eraser,
  CalendarDays,
  Info,
} from "lucide-react";
import PageHeader from "../../components/ui/PageHeader.jsx";
import Card from "../../components/ui/Card.jsx";
import Badge from "../../components/ui/Badge.jsx";
import StatCard from "../../components/ui/StatCard.jsx";
import AvailabilityGrid from "../../components/availability/AvailabilityGrid.jsx";
import { teacherPortalService } from "../../services/teacherPortalService.js";
import {
  BLOCK_MINUTES,
  countAvailabilityStats,
  formatAvailabilityDuration,
} from "../../constants/timeBlocks.js";
import {
  buildSlotsForShift,
  buildSlotsForFullWeek,
  mergeAvailabilitySlots,
} from "../../utils/availabilityHelpers.js";

/**
 * Disponibilidad horaria del docente autenticado.
 * Usa /api/teachers/me — sin selector de perfil.
 */
export default function TeacherAvailabilityPage() {
  const [teacher, setTeacher] = useState(null);
  const [availability, setAvailability] = useState([]);
  const [savedAvailability, setSavedAvailability] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState(null);
  const [linkError, setLinkError] = useState(false);

  useEffect(() => {
    teacherPortalService
      .getMyProfile()
      .then((data) => {
        setTeacher(data);
        const initial = data?.availability || [];
        setSavedAvailability(initial);
        setAvailability(initial);
      })
      .catch(() => setLinkError(true))
      .finally(() => setLoading(false));
  }, []);

  const { blocks, minutes } = countAvailabilityStats(availability);
  const durationLabel = formatAvailabilityDuration(availability);
  const hasBlocks = blocks > 0;

  const isDirty = useMemo(() => {
    const a = JSON.stringify(
      [...availability].sort((x, y) =>
        `${x.day}${x.startTime}`.localeCompare(`${y.day}${y.startTime}`)
      )
    );
    const b = JSON.stringify(
      [...savedAvailability].sort((x, y) =>
        `${x.day}${x.startTime}`.localeCompare(`${y.day}${y.startTime}`)
      )
    );
    return a !== b;
  }, [availability, savedAvailability]);

  function applyQuickAction(nextOrFn) {
    setMsg(null);
    if (typeof nextOrFn === "function") {
      setAvailability(nextOrFn);
    } else {
      setAvailability(nextOrFn);
    }
  }

  function selectShift(shiftId) {
    applyQuickAction((prev) =>
      mergeAvailabilitySlots(prev, buildSlotsForShift(shiftId))
    );
  }

  function selectFullWeek() {
    applyQuickAction(buildSlotsForFullWeek());
  }

  function clearSelection() {
    applyQuickAction([]);
  }

  function cancelChanges() {
    setAvailability([...savedAvailability]);
    setMsg(null);
  }

  async function save() {
    setSaving(true);
    setMsg(null);
    try {
      const updated =
        await teacherPortalService.updateMyAvailability(availability);
      setTeacher(updated);
      const saved = updated?.availability || availability;
      setSavedAvailability(saved);
      setAvailability(saved);
      setMsg({
        type: "success",
        text: "Disponibilidad actualizada correctamente.",
      });
    } catch {
      setMsg({
        type: "error",
        text: "No se pudo guardar la disponibilidad. Inténtalo nuevamente.",
      });
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center text-slate-500">
        Cargando disponibilidad...
      </div>
    );
  }

  if (linkError) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Mi disponibilidad horaria"
          subtitle="Marca las franjas en las que puedes dictar clases."
        />
        <Card className="flex items-start gap-3 border-amber-200 bg-amber-50 p-5 text-amber-900">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" />
          <div>
            <p className="font-semibold">
              No se encontró el perfil docente asociado a tu usuario
            </p>
            <p className="mt-1 text-sm">
              Pide al administrador que registre tu perfil en{" "}
              <strong>Gestión de docentes</strong> usando tu correo
              institucional.
            </p>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {msg && (
        <div
          className={`fixed left-4 right-4 top-[4.25rem] z-[60] rounded-lg px-4 py-3 text-center text-sm font-medium shadow-lg sm:left-auto sm:right-6 sm:top-20 sm:max-w-md sm:text-left ${
            msg.type === "error"
              ? "bg-red-600 text-white"
              : "bg-green-600 text-white"
          }`}
        >
          {msg.text}
        </div>
      )}

      <header className="space-y-2">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          Mi disponibilidad horaria
        </h1>
        <p className="max-w-3xl text-sm text-slate-500 sm:text-base">
          Marca las franjas en las que puedes dictar clases. Esta información
          será usada para la generación automática de horarios.
        </p>
        <p className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600">
          <Info className="h-3.5 w-3.5 text-sgoha-secondary" />
          Puedes seleccionar o deseleccionar bloques haciendo clic en cada
          celda.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Card className="p-5 sm:col-span-2 xl:col-span-1">
          <div className="flex items-start gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-sgoha-secondary">
              <UserRound className="h-5 w-5" />
            </span>
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Docente
              </p>
              <p className="mt-1 truncate text-base font-semibold text-slate-900">
                {teacher?.fullName}
              </p>
              <p className="truncate text-xs text-slate-500">{teacher?.email}</p>
              {teacher?.specialty && (
                <p className="mt-1 text-xs text-slate-600">
                  {teacher.specialty}
                </p>
              )}
            </div>
          </div>
        </Card>

        <StatCard
          icon={CalendarCheck}
          label="Bloques seleccionados"
          value={blocks}
          hint={`${blocks === 1 ? "bloque" : "bloques"} marcados`}
          accent="blue"
        />

        <StatCard
          icon={Clock}
          label="Horas disponibles"
          value={durationLabel.replace(" disponibles", "")}
          hint={`${minutes} min · ${BLOCK_MINUTES} min por bloque`}
          accent="green"
        />

        <StatCard
          icon={hasBlocks ? CheckCircle2 : AlertTriangle}
          label="Estado"
          value={hasBlocks ? "Registrada" : "Sin datos"}
          hint={
            hasBlocks
              ? "Disponibilidad registrada"
              : "Sin disponibilidad"
          }
          accent={hasBlocks ? "green" : "amber"}
        />
      </div>

      {!hasBlocks && (
        <Card className="flex items-start gap-3 border-amber-200 bg-amber-50 p-4 text-amber-900">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" />
          <p className="text-sm">
            No has seleccionado ninguna franja. Puedes guardar una
            disponibilidad vacía, pero no serás considerado para asignación de
            horarios.
          </p>
        </Card>
      )}

      <Card className="p-4 sm:p-5">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
          Acciones rápidas
        </p>
        <div className="flex flex-wrap gap-2">
          <QuickActionBtn
            icon={Sun}
            label="Seleccionar mañana"
            onClick={() => selectShift("MORNING")}
          />
          <QuickActionBtn
            icon={Sunset}
            label="Seleccionar tarde"
            onClick={() => selectShift("AFTERNOON")}
          />
          <QuickActionBtn
            icon={Moon}
            label="Seleccionar noche"
            onClick={() => selectShift("NIGHT")}
          />
          <QuickActionBtn
            icon={CalendarDays}
            label="Seleccionar toda la semana"
            onClick={selectFullWeek}
          />
          <QuickActionBtn
            icon={Eraser}
            label="Limpiar selección"
            onClick={clearSelection}
            variant="danger"
          />
        </div>
      </Card>

      <Card className="overflow-hidden p-4 sm:p-6">
        <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-base font-semibold text-slate-900">
              Grilla semanal
            </h2>
            <p className="text-xs text-slate-500">
              Bloques oficiales HORALV · Lunes a domingo
            </p>
          </div>
          {isDirty && (
            <Badge variant="warning">Cambios sin guardar</Badge>
          )}
        </div>

        <AvailabilityGrid
          value={availability}
          onChange={(next) => {
            setMsg(null);
            setAvailability(next);
          }}
          groupByShift
        />

        <p className="mt-4 rounded-xl border border-blue-100 bg-blue-50/70 px-3 py-2 text-xs font-medium text-blue-800">
          Tu disponibilidad será considerada por el sistema al momento de
          generar horarios académicos.
        </p>

        <div className="mt-6 flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:items-center sm:justify-between">
          <button
            type="button"
            onClick={cancelChanges}
            disabled={saving || !isDirty}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <RotateCcw className="h-4 w-4" />
            Cancelar cambios
          </button>
          <button
            type="button"
            onClick={save}
            disabled={saving}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-sgoha-primary px-6 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-blue-900 disabled:opacity-60"
          >
            <Save className="h-4 w-4" />
            {saving ? "Guardando..." : "Guardar disponibilidad"}
          </button>
        </div>
      </Card>
    </div>
  );
}

function QuickActionBtn({ icon: Icon, label, onClick, variant = "default" }) {
  const styles =
    variant === "danger"
      ? "border-red-200 text-red-700 hover:bg-red-50"
      : "border-slate-200 text-slate-700 hover:border-blue-200 hover:bg-blue-50/50";
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 rounded-lg border bg-white px-3 py-2 text-xs font-semibold transition sm:text-sm ${styles}`}
    >
      <Icon className="h-3.5 w-3.5 shrink-0 opacity-70" />
      {label}
    </button>
  );
}
