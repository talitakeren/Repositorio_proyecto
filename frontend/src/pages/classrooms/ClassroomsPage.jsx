import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  Filter,
  Building2,
  FlaskConical,
  Monitor,
  Users,
  Eye,
  X,
} from "lucide-react";
import PageHeader from "../../components/ui/PageHeader.jsx";
import Card from "../../components/ui/Card.jsx";
import Badge from "../../components/ui/Badge.jsx";
import Button from "../../components/ui/Button.jsx";
import Modal from "../../components/ui/Modal.jsx";
import EmptyState from "../../components/ui/EmptyState.jsx";
import StatCard from "../../components/ui/StatCard.jsx";
import ClassroomForm, {
  CLASSROOM_FORM_ID,
} from "../../components/forms/ClassroomForm.jsx";
import { classroomService } from "../../services/classroomService.js";
import {
  CLASSROOM_TYPE_LABELS,
  CLASSROOM_TYPE_BADGE,
  CLASSROOM_STATUS_LABELS,
  CLASSROOM_STATUS_BADGE,
  CAPACITY_RANGES,
  findCapacityRange,
} from "../../utils/classroomLabels.js";

export default function ClassroomsPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [capacityFilter, setCapacityFilter] = useState("ALL");

  const [editing, setEditing] = useState(null);
  const [editorOpen, setEditorOpen] = useState(false);
  const [viewing, setViewing] = useState(null);

  const [toast, setToast] = useState(null);

  const showToast = useCallback((text, type = "success") => {
    setToast({ text, type });
    setTimeout(() => setToast(null), 3500);
  }, []);

  const load = useCallback(async () => {
    try {
      const data = await classroomService.getClassrooms();
      setItems(Array.isArray(data) ? data : []);
    } catch {
      showToast("No se pudieron cargar las aulas.", "error");
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    load();
  }, [load]);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    const range = findCapacityRange(capacityFilter);
    return items.filter((c) => {
      if (typeFilter !== "ALL" && c.type !== typeFilter) return false;
      if (statusFilter !== "ALL" && c.status !== statusFilter) return false;
      if (capacityFilter !== "ALL") {
        if (c.capacity < range.min || c.capacity > range.max) return false;
      }
      if (!term) return true;
      return (
        (c.code || "").toLowerCase().includes(term) ||
        (c.location || "").toLowerCase().includes(term)
      );
    });
  }, [items, search, typeFilter, statusFilter, capacityFilter]);

  const stats = useMemo(() => {
    const total = items.length;
    const standard = items.filter((c) => c.type === "STANDARD").length;
    const lab = items.filter((c) => c.type === "LAB").length;
    const computer = items.filter((c) => c.type === "COMPUTER_ROOM").length;
    const totalCapacity = items
      .filter((c) => c.active !== false)
      .reduce((sum, c) => sum + (c.capacity || 0), 0);
    return { total, standard, lab, computer, totalCapacity };
  }, [items]);

  const activeFilters =
    (typeFilter !== "ALL" ? 1 : 0) +
    (statusFilter !== "ALL" ? 1 : 0) +
    (capacityFilter !== "ALL" ? 1 : 0);

  function openCreate() {
    setEditing(null);
    setEditorOpen(true);
  }
  function openEdit(c) {
    setEditing(c);
    setEditorOpen(true);
  }
  function closeEditor() {
    if (saving) return;
    setEditorOpen(false);
    setEditing(null);
  }

  async function handleSubmit(payload) {
    setSaving(true);
    try {
      if (editing) {
        await classroomService.updateClassroom(editing._id, payload);
        showToast("Aula actualizada correctamente.");
      } else {
        await classroomService.createClassroom(payload);
        showToast("Aula registrada correctamente.");
      }
      setEditorOpen(false);
      setEditing(null);
      load();
    } catch (e) {
      const msg =
        e?.response?.data?.message || "No se pudo guardar el aula.";
      showToast(msg, "error");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(c) {
    if (
      !window.confirm(
        `¿Desactivar el aula ${c.code}? Dejará de considerarse en la generación de horarios.`
      )
    )
      return;
    try {
      await classroomService.deleteClassroom(c._id);
      showToast("Aula desactivada.");
      load();
    } catch {
      showToast("No se pudo desactivar el aula.", "error");
    }
  }

  function resetFilters() {
    setSearch("");
    setTypeFilter("ALL");
    setStatusFilter("ALL");
    setCapacityFilter("ALL");
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
        title="Gestión de aulas"
        subtitle="Administra los ambientes físicos disponibles para la asignación de horarios."
      >
        <Button onClick={openCreate} className="w-full sm:w-auto">
          <Plus className="h-4 w-4" />
          Nueva aula
        </Button>
      </PageHeader>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
        <StatCard
          icon={Building2}
          label="TOTAL DE AULAS"
          value={stats.total}
          hint="Registradas en sistema"
        />
        <StatCard
          icon={Building2}
          label="AULAS ESTÁNDAR"
          value={stats.standard}
          accent="blue"
        />
        <StatCard
          icon={FlaskConical}
          label="LABORATORIOS"
          value={stats.lab}
          accent="amber"
        />
        <StatCard
          icon={Monitor}
          label="SALAS DE CÓMPUTO"
          value={stats.computer}
          accent="green"
        />
        <Card className="bg-gradient-to-br from-[#1E3A8A] to-[#172554] p-5 text-white shadow-md">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-blue-200/90">
                CAPACIDAD TOTAL
              </p>
              <p className="mt-2 text-2xl font-bold">
                {stats.totalCapacity}
              </p>
              <p className="mt-1 text-xs text-blue-100/80">
                estudiantes (aulas activas)
              </p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15 text-white ring-1 ring-white/20">
              <Users className="h-5 w-5" />
            </div>
          </div>
        </Card>
      </div>

      <Card className="overflow-hidden">
        <div className="space-y-3 border-b border-slate-100 p-4 lg:p-5">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              placeholder="Buscar por código o ubicación..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="hidden items-center gap-2 text-xs font-semibold uppercase text-slate-500 sm:inline-flex">
              <Filter className="h-3.5 w-3.5" /> Filtros
            </span>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm"
            >
              <option value="ALL">Todos los tipos</option>
              <option value="STANDARD">Aula estándar</option>
              <option value="LAB">Laboratorio</option>
              <option value="COMPUTER_ROOM">Sala de cómputo</option>
            </select>
            <select
              value={capacityFilter}
              onChange={(e) => setCapacityFilter(e.target.value)}
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm"
            >
              {CAPACITY_RANGES.map((r) => (
                <option key={r.value} value={r.value}>
                  {r.label}
                </option>
              ))}
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm"
            >
              <option value="ALL">Todos los estados</option>
              <option value="AVAILABLE">Disponible</option>
              <option value="IN_USE">En uso</option>
              <option value="MAINTENANCE">Mantenimiento</option>
              <option value="INACTIVE">Inactiva</option>
            </select>
            {activeFilters > 0 && (
              <button
                type="button"
                onClick={resetFilters}
                className="inline-flex items-center gap-1 rounded-lg bg-slate-100 px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-200"
              >
                <X className="h-3 w-3" /> Limpiar filtros
              </button>
            )}
          </div>
        </div>

        {loading ? (
          <div className="flex min-h-[240px] items-center justify-center text-slate-500">
            Cargando aulas...
          </div>
        ) : items.length === 0 ? (
          <EmptyState
            icon={Building2}
            title="No hay aulas registradas"
            description="Registra las aulas disponibles para que el sistema pueda asignarlas en la generación de horarios."
            action={
              <Button onClick={openCreate}>
                <Plus className="h-4 w-4" />
                Nueva aula
              </Button>
            }
          />
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={Building2}
            title="Sin coincidencias"
            description="No hay aulas que coincidan con los filtros actuales."
          />
        ) : (
          <>
            <div className="divide-y divide-slate-100 lg:hidden">
              {filtered.map((c) => (
                <ClassroomCard
                  key={c._id}
                  classroom={c}
                  onView={() => setViewing(c)}
                  onEdit={() => openEdit(c)}
                  onDelete={() => handleDelete(c)}
                />
              ))}
            </div>
            <div className="hidden overflow-x-auto lg:block">
              <table className="w-full min-w-[960px] text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/80 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    <th className="px-5 py-3">Código</th>
                    <th className="px-5 py-3">Tipo</th>
                    <th className="px-5 py-3">Capacidad</th>
                    <th className="px-5 py-3">Ubicación</th>
                    <th className="px-5 py-3">Estado</th>
                    <th className="px-5 py-3">Uso actual</th>
                    <th className="px-5 py-3 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filtered.map((c) => (
                    <ClassroomRow
                      key={c._id}
                      classroom={c}
                      onView={() => setViewing(c)}
                      onEdit={() => openEdit(c)}
                      onDelete={() => handleDelete(c)}
                    />
                  ))}
                </tbody>
              </table>
            </div>
            <div className="border-t border-slate-100 px-5 py-3 text-xs text-slate-500">
              Mostrando {filtered.length} de {items.length} aulas
            </div>
          </>
        )}
      </Card>

      <Modal
        open={editorOpen}
        onClose={closeEditor}
        size="lg"
        title={editing ? "Editar aula" : "Nueva aula"}
        subtitle={
          editing
            ? "Actualiza la información del aula."
            : "Registra un nuevo ambiente disponible para horarios."
        }
        footer={
          <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
            <Button variant="secondary" onClick={closeEditor} disabled={saving}>
              Cancelar
            </Button>
            <button
              type="submit"
              form={CLASSROOM_FORM_ID}
              disabled={saving}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-sgoha-primary px-4 py-2 text-sm font-semibold text-white shadow-md hover:bg-blue-900 disabled:opacity-60"
            >
              {saving
                ? "Guardando..."
                : editing
                  ? "Guardar cambios"
                  : "Guardar aula"}
            </button>
          </div>
        }
      >
        <ClassroomForm
          classroom={editing}
          onSubmit={handleSubmit}
          submitting={saving}
        />
      </Modal>

      <Modal
        open={Boolean(viewing)}
        onClose={() => setViewing(null)}
        size="md"
        title={viewing ? `Aula ${viewing.code}` : "Detalle de aula"}
        subtitle="Información operativa del aula."
      >
        {viewing && (
          <dl className="space-y-3 text-sm">
            <DetailRow label="Tipo">
              <Badge variant={CLASSROOM_TYPE_BADGE[viewing.type] || "info"}>
                {CLASSROOM_TYPE_LABELS[viewing.type] || viewing.type}
              </Badge>
            </DetailRow>
            <DetailRow
              label="Capacidad"
              value={`${viewing.capacity} estudiantes`}
            />
            <DetailRow label="Ubicación" value={viewing.location || "—"} />
            <DetailRow label="Estado">
              <Badge variant={CLASSROOM_STATUS_BADGE[viewing.status] || "neutral"}>
                {CLASSROOM_STATUS_LABELS[viewing.status] || viewing.status}
              </Badge>
            </DetailRow>
            <DetailRow label="Habilitada">
              <Badge variant={viewing.active ? "success" : "neutral"}>
                {viewing.active ? "Sí" : "No"}
              </Badge>
            </DetailRow>
          </dl>
        )}
      </Modal>
    </div>
  );
}

function ClassroomRow({ classroom, onView, onEdit, onDelete }) {
  const usage = classroom.currentUsage; // pendiente: se calculará desde horarios
  return (
    <tr className="hover:bg-slate-50/80">
      <td className="px-5 py-3 font-semibold text-sgoha-primary">
        {classroom.code}
      </td>
      <td className="px-5 py-3">
        <Badge variant={CLASSROOM_TYPE_BADGE[classroom.type] || "info"}>
          {CLASSROOM_TYPE_LABELS[classroom.type] || classroom.type}
        </Badge>
      </td>
      <td className="px-5 py-3 text-slate-700">
        {classroom.capacity}{" "}
        <span className="text-xs text-slate-400">estudiantes</span>
      </td>
      <td className="px-5 py-3 text-slate-600">
        {classroom.location || "—"}
      </td>
      <td className="px-5 py-3">
        <Badge variant={CLASSROOM_STATUS_BADGE[classroom.status] || "neutral"}>
          {CLASSROOM_STATUS_LABELS[classroom.status] || classroom.status}
        </Badge>
      </td>
      <td className="px-5 py-3">
        <UsageBar usage={usage} />
      </td>
      <td className="px-5 py-3">
        <div className="flex justify-end gap-1">
          <IconBtn title="Ver" onClick={onView} icon={Eye} />
          <IconBtn title="Editar" onClick={onEdit} icon={Pencil} />
          <IconBtn title="Desactivar" onClick={onDelete} icon={Trash2} danger />
        </div>
      </td>
    </tr>
  );
}

function ClassroomCard({ classroom, onView, onEdit, onDelete }) {
  return (
    <article className="space-y-3 p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="font-semibold text-sgoha-primary">{classroom.code}</p>
          <p className="mt-0.5 text-xs text-slate-500">
            {classroom.location || "Ubicación no registrada"}
          </p>
        </div>
        <Badge variant={CLASSROOM_STATUS_BADGE[classroom.status] || "neutral"}>
          {CLASSROOM_STATUS_LABELS[classroom.status] || classroom.status}
        </Badge>
      </div>
      <div className="flex flex-wrap items-center gap-2 text-xs">
        <Badge variant={CLASSROOM_TYPE_BADGE[classroom.type] || "info"}>
          {CLASSROOM_TYPE_LABELS[classroom.type] || classroom.type}
        </Badge>
        <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600">
          <Users className="h-3 w-3" />
          {classroom.capacity} estudiantes
        </span>
      </div>
      <UsageBar usage={classroom.currentUsage} />
      <div className="flex flex-wrap gap-2 pt-1">
        <IconBtn title="Ver" onClick={onView} icon={Eye} />
        <IconBtn title="Editar" onClick={onEdit} icon={Pencil} />
        <IconBtn title="Desactivar" onClick={onDelete} icon={Trash2} danger />
      </div>
    </article>
  );
}

function UsageBar({ usage }) {
  if (usage === undefined || usage === null) {
    return (
      <span className="text-xs italic text-slate-400">Sin uso registrado</span>
    );
  }
  const pct = Math.max(0, Math.min(100, Number(usage)));
  const tone =
    pct >= 80
      ? "bg-red-500"
      : pct >= 40
        ? "bg-amber-500"
        : "bg-emerald-500";
  return (
    <div className="space-y-1">
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
        <div className={`h-full ${tone}`} style={{ width: `${pct}%` }} />
      </div>
      <p className="text-[10px] uppercase tracking-wide text-slate-400">
        {pct}% en uso
      </p>
    </div>
  );
}

function IconBtn({ icon: Icon, danger, title, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={`rounded-lg p-2 transition ${
        danger
          ? "text-slate-500 hover:bg-red-50 hover:text-red-600"
          : "text-slate-500 hover:bg-slate-100 hover:text-sgoha-primary"
      }`}
    >
      <Icon className="h-4 w-4" />
    </button>
  );
}

function DetailRow({ label, value, children }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-lg bg-slate-50 px-3 py-2">
      <dt className="text-slate-500">{label}</dt>
      <dd className="text-right font-medium text-slate-900">
        {children ?? value}
      </dd>
    </div>
  );
}
