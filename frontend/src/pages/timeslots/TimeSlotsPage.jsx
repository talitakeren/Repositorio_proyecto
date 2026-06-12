import { useCallback, useEffect, useMemo, useState } from "react";
import {
  CalendarRange,
  RefreshCcw,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
import PageHeader from "../../components/ui/PageHeader.jsx";
import Card from "../../components/ui/Card.jsx";
import Badge from "../../components/ui/Badge.jsx";
import Button from "../../components/ui/Button.jsx";
import StatCard from "../../components/ui/StatCard.jsx";
import { timeslotService } from "../../services/timeslotService.js";
import {
  TIME_BLOCKS,
  DAYS,
  slotKey,
} from "../../constants/timeBlocks.js";

/**
 * Catálogo oficial HORALV: 7 días × 18 bloques = 126 franjas.
 * El admin puede ver el estado de cada franja en una matriz y regenerar
 * el catálogo si la BD quedó incompleta o desactualizada.
 */
export default function TimeSlotsPage() {
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = useCallback((text, type = "success") => {
    setToast({ text, type });
    setTimeout(() => setToast(null), 3500);
  }, []);

  const load = useCallback(async () => {
    try {
      const data = await timeslotService.list();
      setSlots(Array.isArray(data) ? data : []);
    } catch {
      showToast("No se pudieron cargar las franjas horarias", "error");
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    load();
  }, [load]);

  const slotsByKey = useMemo(() => {
    const map = new Map();
    for (const s of slots) {
      map.set(slotKey(s.day, s.startTime, s.endTime), s);
    }
    return map;
  }, [slots]);

  const stats = useMemo(() => {
    const expected = DAYS.length * TIME_BLOCKS.length;
    const created = slots.length;
    const active = slots.filter((s) => s.active !== false).length;
    const missing = expected - created;
    return { expected, created, active, missing };
  }, [slots]);

  async function syncOfficial() {
    setSyncing(true);
    try {
      const result = await timeslotService.syncOfficial();
      showToast(
        `Catálogo sincronizado · ${result.created} creadas · ${result.removed} eliminadas`
      );
      load();
    } catch (e) {
      const msg =
        e?.response?.data?.message ||
        "No se pudo sincronizar el catálogo oficial.";
      showToast(msg, "error");
    } finally {
      setSyncing(false);
    }
  }

  return (
    <div className="space-y-6">
      {toast && (
        <div
          className={`fixed left-4 right-4 top-[4.25rem] z-[60] rounded-lg px-4 py-3 text-center text-sm font-medium shadow-lg sm:left-auto sm:right-6 sm:top-20 sm:max-w-sm sm:text-left ${
            toast.type === "error"
              ? "bg-red-600 text-white"
              : "bg-green-600 text-white"
          }`}
        >
          {toast.text}
        </div>
      )}

      <PageHeader
        title="Franjas horarias HORALV"
        subtitle="Catálogo oficial de bloques académicos usados por el motor CSP."
      >
        <Button onClick={syncOfficial} disabled={syncing} className="w-full sm:w-auto">
          <RefreshCcw className={`h-4 w-4 ${syncing ? "animate-spin" : ""}`} />
          {syncing ? "Sincronizando..." : "Sincronizar catálogo"}
        </Button>
      </PageHeader>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard
          icon={CalendarRange}
          label="FRANJAS ESPERADAS"
          value={stats.expected}
          hint={`${DAYS.length} días × ${TIME_BLOCKS.length} bloques`}
        />
        <StatCard
          icon={CheckCircle2}
          label="FRANJAS REGISTRADAS"
          value={stats.created}
          accent="green"
        />
        <StatCard
          icon={CheckCircle2}
          label="FRANJAS ACTIVAS"
          value={stats.active}
          accent="blue"
        />
        <StatCard
          icon={AlertTriangle}
          label="FALTANTES"
          value={Math.max(0, stats.missing)}
          accent={stats.missing > 0 ? "red" : "slate"}
          hint={
            stats.missing > 0
              ? "Pulsa Sincronizar catálogo"
              : "Catálogo completo"
          }
        />
      </div>

      {stats.missing > 0 && (
        <Card className="flex items-start gap-3 border-amber-200 bg-amber-50 p-4 text-amber-900">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" />
          <div>
            <p className="text-sm font-semibold">
              Catálogo HORALV incompleto
            </p>
            <p className="mt-1 text-sm">
              Hay {stats.missing} franjas faltantes. Pulsa{" "}
              <strong>Sincronizar catálogo</strong> para regenerarlas. Es seguro
              hacerlo varias veces.
            </p>
          </div>
        </Card>
      )}

      <Card className="overflow-hidden">
        <div className="border-b border-slate-100 px-5 py-4">
          <h3 className="text-base font-semibold text-slate-900">
            Matriz semanal oficial
          </h3>
          <p className="mt-1 text-xs text-slate-500">
            Las celdas marcadas en verde corresponden a franjas registradas y
            activas en la base de datos.
          </p>
        </div>

        {loading ? (
          <div className="flex min-h-[240px] items-center justify-center text-slate-500">
            Cargando franjas...
          </div>
        ) : (
          <div className="overflow-x-auto p-3">
            <div className="timeslot-grid">
              <div className="timeslot-corner">Bloque</div>
              {DAYS.map((d) => (
                <div key={d.key} className="timeslot-day">
                  {d.label}
                </div>
              ))}
              {TIME_BLOCKS.map((block) => (
                <div key={block.label} className="contents">
                  <div className="timeslot-time">{block.label}</div>
                  {DAYS.map((d) => {
                    const key = slotKey(d.key, block.startTime, block.endTime);
                    const item = slotsByKey.get(key);
                    const isActive = item?.active !== false;
                    const registered = Boolean(item);
                    return (
                      <div
                        key={`${d.key}-${block.startTime}`}
                        className={`timeslot-cell ${
                          registered
                            ? isActive
                              ? "timeslot-cell--on"
                              : "timeslot-cell--inactive"
                            : "timeslot-cell--missing"
                        }`}
                        title={`${d.fullLabel} ${block.label}${
                          registered
                            ? isActive
                              ? ""
                              : " (inactiva)"
                            : " (faltante)"
                        }`}
                      />
                    );
                  })}
                </div>
              ))}
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-slate-600">
              <Legend color="bg-green-500 border-green-600" label="Registrada y activa" />
              <Legend color="bg-amber-200 border-amber-400" label="Registrada inactiva" />
              <Legend color="bg-slate-100 border-slate-200 border-dashed" label="No registrada" />
            </div>
          </div>
        )}
      </Card>

      <Card className="overflow-hidden">
        <div className="border-b border-slate-100 px-5 py-4">
          <h3 className="text-base font-semibold text-slate-900">
            Bloques oficiales HORALV
          </h3>
          <p className="mt-1 text-xs text-slate-500">
            Estos {TIME_BLOCKS.length} bloques se aplican todos los días de la
            semana.
          </p>
        </div>
        <div className="grid grid-cols-1 divide-y divide-slate-100 sm:grid-cols-2 sm:divide-x sm:divide-y-0 lg:grid-cols-4">
          {TIME_BLOCKS.map((b, i) => (
            <div
              key={b.label}
              className="flex items-center justify-between gap-3 px-5 py-3"
            >
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-400">
                  Bloque {i + 1}
                </p>
                <p className="font-semibold text-slate-900">{b.label}</p>
              </div>
              <Badge variant="info">44 min</Badge>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function Legend({ color, label }) {
  return (
    <span className="inline-flex items-center gap-2">
      <span className={`h-3 w-6 rounded border ${color}`} />
      {label}
    </span>
  );
}
