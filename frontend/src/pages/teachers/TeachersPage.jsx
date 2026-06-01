import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Search,
  Plus,
  Pencil,
  Trash2,
  CalendarClock,
  UserRound,
  Filter,
} from "lucide-react";
import Card from "../../components/ui/Card.jsx";
import Badge from "../../components/ui/Badge.jsx";
import Modal from "../../components/ui/Modal.jsx";
import InitialCredentialsModal from "../../components/ui/InitialCredentialsModal.jsx";
import TeacherForm, { TEACHER_FORM_ID } from "../../components/forms/TeacherForm.jsx";
import { teacherService } from "../../services/teacherService.js";
import { courseService } from "../../services/courseService.js";
import { getInitials } from "../../utils/getInitials.js";
import { countAvailabilityStats } from "../../utils/availabilityConstants.js";
import {
  matchesShiftFilter,
  computeTeacherSummary,
} from "../../utils/teacherFilters.js";

export default function TeachersPage() {
  const [teachers, setTeachers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("true");
  const [shiftFilter, setShiftFilter] = useState("ALL");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState(null);
  const [focusAvailability, setFocusAvailability] = useState(false);
  const [toast, setToast] = useState(null);
  const [credentialsInfo, setCredentialsInfo] = useState(null);

  const loadTeachers = useCallback(async () => {
    setLoading(true);
    try {
      const data = await teacherService.getTeachers({
        search: search.trim() || undefined,
        active: statusFilter === "all" ? undefined : statusFilter,
      });
      setTeachers(Array.isArray(data) ? data : []);
    } catch {
      setTeachers([]);
      showToast("No se pudo cargar los docentes.", "error");
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter]);

  useEffect(() => {
    const t = setTimeout(loadTeachers, 300);
    return () => clearTimeout(t);
  }, [loadTeachers]);

  useEffect(() => {
    courseService.getCourses({ active: "true" }).then((data) => {
      setCourses(Array.isArray(data) ? data : []);
    });
  }, []);

  const filteredTeachers = useMemo(
    () =>
      teachers.filter((t) => matchesShiftFilter(t.availability, shiftFilter)),
    [teachers, shiftFilter]
  );

  const summary = useMemo(
    () => computeTeacherSummary(teachers),
    [teachers]
  );

  function showToast(message, type = "success") {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  }

  function openCreate() {
    setEditingTeacher(null);
    setFocusAvailability(false);
    setModalOpen(true);
  }

  function openEdit(teacher) {
    setEditingTeacher(teacher);
    setFocusAvailability(false);
    setModalOpen(true);
  }

  function openAvailability(teacher) {
    setEditingTeacher(teacher);
    setFocusAvailability(true);
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
    setEditingTeacher(null);
    setFocusAvailability(false);
  }

  async function handleSave(payload) {
    setSaving(true);
    try {
      if (editingTeacher?._id) {
        await teacherService.updateTeacher(editingTeacher._id, {
          fullName: payload.fullName,
          email: payload.email,
          specialty: payload.specialty,
          active: payload.active,
        });
        await teacherService.updateTeacherCourses(
          editingTeacher._id,
          payload.availableCourses
        );
        await teacherService.updateTeacherAvailability(
          editingTeacher._id,
          payload.availability
        );
        showToast("Docente actualizado correctamente.");
      } else {
        const created = await teacherService.createTeacher(payload);
        const account = created?._account;
        if (account?.conflictRole) {
          showToast(
            "Docente registrado, pero el correo ya pertenecía a otro rol.",
            "error"
          );
          setCredentialsInfo({
            email: payload.email,
            conflictRole: account.conflictRole,
          });
        } else if (account?.created && account?.initialPassword) {
          showToast("Docente registrado. Se generó su cuenta de acceso.");
          setCredentialsInfo({
            wasCreated: true,
            credentials: {
              email: payload.email,
              password: account.initialPassword,
            },
          });
        } else if (account && !account.created) {
          showToast(
            "Docente registrado y vinculado a una cuenta existente."
          );
          setCredentialsInfo({
            linkedExisting: true,
            email: payload.email,
          });
        } else {
          showToast("Docente registrado correctamente.");
        }
      }
      closeModal();
      loadTeachers();
    } catch (err) {
      showToast(
        err.response?.data?.message || "No se pudo guardar el docente.",
        "error"
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(teacher) {
    if (
      !window.confirm(
        `¿Desactivar a ${teacher.fullName}? Ya no estará disponible para asignación de horarios.`
      )
    ) {
      return;
    }
    try {
      await teacherService.deleteTeacher(teacher._id);
      showToast("Docente desactivado correctamente.");
      loadTeachers();
    } catch {
      showToast("No se pudo desactivar el docente.", "error");
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
          role="alert"
        >
          {toast.message}
        </div>
      )}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h2 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
            Gestión de docentes
          </h2>
          <p className="mt-1 text-sm text-slate-500 sm:text-base">
            Administra docentes y define su disponibilidad horaria.
          </p>
        </div>
        <button
          type="button"
          onClick={openCreate}
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#1E3A8A] px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-blue-900/20 transition hover:bg-blue-900 sm:w-auto"
        >
          <Plus className="h-4 w-4" />
          Nuevo docente
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_280px]">
        <Card className="overflow-hidden">
          <div className="border-b border-slate-100 p-4 lg:p-5">
            <div className="flex flex-col gap-3">
              <div className="relative flex-1">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="search"
                  placeholder="Buscar por nombre o email..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
              <div className="grid grid-cols-1 gap-2 min-[400px]:grid-cols-2 sm:flex sm:flex-wrap">
                <Filter className="hidden h-4 w-4 text-slate-400 sm:block sm:self-center" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm sm:w-auto"
                >
                  <option value="all">Todos</option>
                  <option value="true">Activos</option>
                  <option value="false">Inactivos</option>
                </select>
                <select
                  value={shiftFilter}
                  onChange={(e) => setShiftFilter(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm sm:w-auto"
                >
                  <option value="ALL">Todos los turnos</option>
                  <option value="MORNING">Mañana</option>
                  <option value="AFTERNOON">Tarde</option>
                  <option value="NIGHT">Noche</option>
                  <option value="WEEKEND">Fin de semana</option>
                </select>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="flex min-h-[280px] items-center justify-center text-slate-500">
              Cargando docentes...
            </div>
          ) : filteredTeachers.length === 0 ? (
            <EmptyState onCreate={openCreate} />
          ) : (
            <>
              <div className="divide-y divide-slate-100 lg:hidden">
                {filteredTeachers.map((teacher) => (
                  <TeacherCard
                    key={teacher._id}
                    teacher={teacher}
                    onEdit={() => openEdit(teacher)}
                    onAvailability={() => openAvailability(teacher)}
                    onDelete={() => handleDelete(teacher)}
                  />
                ))}
              </div>
              <div className="hidden overflow-x-auto lg:block">
                <table className="w-full min-w-[960px] text-left text-sm">
                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50/80 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      <th className="px-5 py-3">Docente</th>
                      <th className="px-5 py-3">Especialidad</th>
                      <th className="px-5 py-3">Cursos asignados</th>
                      <th className="px-5 py-3">Disponibilidad</th>
                      <th className="px-5 py-3">Estado</th>
                      <th className="px-5 py-3 text-right">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredTeachers.map((teacher) => (
                      <TeacherRow
                        key={teacher._id}
                        teacher={teacher}
                        onEdit={() => openEdit(teacher)}
                        onAvailability={() => openAvailability(teacher)}
                        onDelete={() => handleDelete(teacher)}
                      />
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="border-t border-slate-100 px-5 py-3 text-xs text-slate-500">
                Mostrando {filteredTeachers.length} de {teachers.length} docentes
              </p>
            </>
          )}
        </Card>

        <SummaryCard summary={summary} />
      </div>

      <Modal
        open={modalOpen}
        onClose={closeModal}
        size="xl"
        title={editingTeacher ? "Editar docente" : "Nuevo docente"}
        subtitle="Completa los datos, asigna cursos y define la disponibilidad semanal."
        footer={
          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={closeModal}
              disabled={saving}
              className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-60 sm:min-w-[120px]"
            >
              Cancelar
            </button>
            <button
              type="submit"
              form={TEACHER_FORM_ID}
              disabled={saving}
              className="rounded-xl bg-[#1E3A8A] px-5 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-blue-900 disabled:opacity-60 sm:min-w-[160px]"
            >
              {saving ? "Guardando..." : "Guardar docente"}
            </button>
          </div>
        }
      >
        <TeacherForm
          initialData={editingTeacher}
          allCourses={courses}
          onSubmit={handleSave}
          onCancel={closeModal}
          saving={saving}
          focusAvailability={focusAvailability}
          hideActions
        />
      </Modal>

      <InitialCredentialsModal
        data={credentialsInfo}
        onClose={() => setCredentialsInfo(null)}
      />
    </div>
  );
}

function CoursesCell({ courses }) {
  if (!courses?.length) {
    return <span className="italic text-slate-400">Sin cursos asignados</span>;
  }
  return (
    <div className="flex flex-wrap gap-1">
      {courses.map((c) => (
        <span
          key={c._id || c}
          className="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-700"
        >
          {typeof c === "object" ? c.code : c}
        </span>
      ))}
    </div>
  );
}

function AvailabilitySummary({ availability }) {
  const { blocks, hours } = countAvailabilityStats(availability);
  if (!blocks) {
    return <span className="text-slate-400">Sin disponibilidad</span>;
  }
  return (
    <span className="text-slate-700">
      {blocks} bloques / {hours}h semanales
    </span>
  );
}

function TeacherRow({ teacher, onEdit, onAvailability, onDelete }) {
  return (
    <tr className="hover:bg-slate-50/80">
      <td className="px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#1E3A8A] text-xs font-bold text-white">
            {getInitials(teacher.fullName)}
          </div>
          <div className="min-w-0">
            <p className="font-medium text-slate-900">{teacher.fullName}</p>
            <p className="truncate text-xs text-slate-500">{teacher.email}</p>
          </div>
        </div>
      </td>
      <td className="max-w-[180px] px-5 py-4 text-slate-600">{teacher.specialty}</td>
      <td className="px-5 py-4">
        <CoursesCell courses={teacher.availableCourses} />
      </td>
      <td className="px-5 py-4">
        <AvailabilitySummary availability={teacher.availability} />
      </td>
      <td className="px-5 py-4">
        <Badge variant={teacher.active !== false ? "success" : "neutral"}>
          {teacher.active !== false ? "Activo" : "Inactivo"}
        </Badge>
      </td>
      <td className="px-5 py-4">
        <div className="flex justify-end gap-1">
          <ActionBtn onClick={onEdit} title="Editar" hover="blue">
            <Pencil className="h-4 w-4" />
          </ActionBtn>
          <ActionBtn onClick={onAvailability} title="Disponibilidad" hover="green">
            <CalendarClock className="h-4 w-4" />
          </ActionBtn>
          <ActionBtn onClick={onDelete} title="Desactivar" hover="red">
            <Trash2 className="h-4 w-4" />
          </ActionBtn>
        </div>
      </td>
    </tr>
  );
}

function TeacherCard({ teacher, onEdit, onAvailability, onDelete }) {
  return (
    <article className="p-4">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#1E3A8A] text-xs font-bold text-white">
          {getInitials(teacher.fullName)}
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-medium text-slate-900">{teacher.fullName}</p>
          <p className="truncate text-xs text-slate-500">{teacher.email}</p>
          <p className="mt-1 text-sm text-slate-600">{teacher.specialty}</p>
        </div>
        <div className="flex gap-1">
          <ActionBtn onClick={onEdit} title="Editar" hover="blue">
            <Pencil className="h-4 w-4" />
          </ActionBtn>
          <ActionBtn onClick={onAvailability} title="Disponibilidad" hover="green">
            <CalendarClock className="h-4 w-4" />
          </ActionBtn>
          <ActionBtn onClick={onDelete} title="Desactivar" hover="red">
            <Trash2 className="h-4 w-4" />
          </ActionBtn>
        </div>
      </div>
      <div className="mt-3 space-y-2 text-sm">
        <CoursesCell courses={teacher.availableCourses} />
        <AvailabilitySummary availability={teacher.availability} />
        <Badge variant={teacher.active !== false ? "success" : "neutral"}>
          {teacher.active !== false ? "Activo" : "Inactivo"}
        </Badge>
      </div>
    </article>
  );
}

function ActionBtn({ children, onClick, title, hover }) {
  const hoverClass =
    hover === "blue"
      ? "hover:bg-blue-50 hover:text-blue-700"
      : hover === "green"
        ? "hover:bg-green-50 hover:text-green-700"
        : "hover:bg-red-50 hover:text-red-600";
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={`rounded-lg p-2 text-slate-500 transition ${hoverClass}`}
    >
      {children}
    </button>
  );
}

function SummaryCard({ summary }) {
  const items = [
    { label: "Total docentes activos", value: summary.totalActive },
    { label: "Total docentes inactivos", value: summary.totalInactive },
    { label: "Bloques de disponibilidad registrados", value: summary.totalBlocks },
    { label: "Docentes sin disponibilidad", value: summary.withoutAvailability },
    { label: "Docentes sin cursos asignados", value: summary.withoutCourses },
  ];

  return (
    <div className="rounded-2xl bg-gradient-to-br from-[#1E3A8A] to-[#172554] p-5 text-white shadow-lg xl:sticky xl:top-20 xl:self-start">
      <div className="mb-4 flex items-center gap-2">
        <UserRound className="h-5 w-5 text-blue-200" />
        <h3 className="text-base font-semibold">Resumen docente</h3>
      </div>
      <ul className="space-y-3">
        {items.map(({ label, value }) => (
          <li
            key={label}
            className="rounded-lg border border-white/10 bg-white/10 px-3 py-2.5"
          >
            <p className="text-xs text-blue-100/90">{label}</p>
            <p className="mt-0.5 text-2xl font-bold">{value}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

function EmptyState({ onCreate }) {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-[#3B82F6]">
        <UserRound className="h-8 w-8" />
      </div>
      <h3 className="text-lg font-semibold text-slate-900">
        No hay docentes registrados
      </h3>
      <p className="mt-2 max-w-sm text-sm text-slate-500">
        Registra docentes con su disponibilidad y cursos habilitados para el
        motor CSP.
      </p>
      <button
        type="button"
        onClick={onCreate}
        className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#1E3A8A] px-5 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-blue-900"
      >
        <Plus className="h-4 w-4" />
        Nuevo docente
      </button>
    </div>
  );
}
