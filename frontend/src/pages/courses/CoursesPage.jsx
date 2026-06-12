import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Search,
  Plus,
  Pencil,
  Trash2,
  BookOpen,
  Filter,
} from "lucide-react";
import Card from "../../components/ui/Card.jsx";
import Badge from "../../components/ui/Badge.jsx";
import Drawer from "../../components/ui/Drawer.jsx";
import CourseForm from "../../components/forms/CourseForm.jsx";
import { courseService } from "../../services/courseService.js";
import {
  getClassroomLabel,
  CLASSROOM_TYPE_BADGE,
} from "../../utils/courseLabels.js";

export default function CoursesPage() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");
  const [classroomFilter, setClassroomFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("true");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [prereqOptions, setPrereqOptions] = useState([]);
  const [toast, setToast] = useState(null);

  const loadCourses = useCallback(async () => {
    setLoading(true);
    try {
      const data = await courseService.getCourses({
        search: search.trim() || undefined,
        classroomType: classroomFilter,
        active: statusFilter,
      });
      setCourses(Array.isArray(data) ? data : []);
    } catch {
      setCourses([]);
      showToast("No se pudo cargar los cursos.", "error");
    } finally {
      setLoading(false);
    }
  }, [search, classroomFilter, statusFilter]);

  useEffect(() => {
    const t = setTimeout(loadCourses, 300);
    return () => clearTimeout(t);
  }, [loadCourses]);

  function showToast(message, type = "success") {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  }

  async function loadPrereqOptions() {
    try {
      const data = await courseService.getCourses({ active: "all" });
      setPrereqOptions(Array.isArray(data) ? data : []);
    } catch {
      setPrereqOptions([]);
    }
  }

  function openCreate() {
    setEditingCourse(null);
    setDrawerOpen(true);
    loadPrereqOptions();
  }

  function openEdit(course) {
    setEditingCourse(course);
    setDrawerOpen(true);
    loadPrereqOptions();
  }

  function closeDrawer() {
    setDrawerOpen(false);
    setEditingCourse(null);
  }

  async function handleSave(payload) {
    setSaving(true);
    try {
      if (editingCourse?._id) {
        await courseService.updateCourse(editingCourse._id, payload);
        showToast("Curso guardado correctamente.");
      } else {
        await courseService.createCourse(payload);
        showToast("Curso guardado correctamente.");
      }
      closeDrawer();
      loadCourses();
    } catch (err) {
      const msg =
        err.response?.data?.message || "No se pudo guardar el curso.";
      showToast(msg, "error");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(course) {
    if (
      !window.confirm(
        `¿Desactivar el curso ${course.code}? Ya no estará disponible para horarios.`
      )
    ) {
      return;
    }
    try {
      await courseService.deleteCourse(course._id);
      showToast("Curso desactivado correctamente.");
      loadCourses();
    } catch {
      showToast("No se pudo desactivar el curso.", "error");
    }
  }

  const prereqCourses = useMemo(() => {
    if (prereqOptions.length) return prereqOptions;
    return courses;
  }, [prereqOptions, courses]);

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
            Gestión de cursos
          </h2>
          <p className="mt-1 text-sm text-slate-500 sm:text-base">
            Registra y administra los cursos disponibles para la generación de
            horarios.
          </p>
        </div>
        <button
          type="button"
          onClick={openCreate}
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#1E3A8A] px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-blue-900/20 transition hover:bg-blue-900 sm:w-auto"
        >
          <Plus className="h-4 w-4" />
          Nuevo curso
        </button>
      </div>

      <Card className="overflow-hidden">
        <div className="border-b border-slate-100 p-4 lg:p-5">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="search"
                placeholder="Buscar por código o nombre..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
            <div className="grid grid-cols-1 gap-2 min-[400px]:grid-cols-2 sm:flex sm:flex-wrap sm:items-center">
              <Filter className="hidden h-4 w-4 shrink-0 text-slate-400 sm:block" />
              <select
                value={classroomFilter}
                onChange={(e) => setClassroomFilter(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 sm:w-auto"
              >
                <option value="ALL">Todos los tipos</option>
                <option value="STANDARD">Aula estándar</option>
                <option value="LAB">Laboratorio</option>
                <option value="COMPUTER_ROOM">Sala de cómputo</option>
              </select>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 sm:w-auto"
              >
                <option value="true">Activos</option>
                <option value="false">Inactivos</option>
                <option value="all">Todos</option>
              </select>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex min-h-[280px] items-center justify-center text-slate-500">
            Cargando cursos...
          </div>
        ) : courses.length === 0 ? (
          <EmptyState onCreate={openCreate} />
        ) : (
          <>
            <div className="divide-y divide-slate-100 lg:hidden">
              {courses.map((course) => (
                <CourseCard
                  key={course._id}
                  course={course}
                  onEdit={() => openEdit(course)}
                  onDelete={() => handleDelete(course)}
                />
              ))}
            </div>
            <div className="hidden overflow-x-auto lg:block">
              <table className="w-full min-w-[900px] text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/80 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    <th className="px-5 py-3">Código</th>
                    <th className="px-5 py-3">Nombre del curso</th>
                    <th className="px-5 py-3">Créditos</th>
                    <th className="px-5 py-3">Prerrequisitos</th>
                    <th className="px-5 py-3">Tipo de aula</th>
                    <th className="px-5 py-3">Estado</th>
                    <th className="px-5 py-3 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {courses.map((course) => (
                    <CourseRow
                      key={course._id}
                      course={course}
                      onEdit={() => openEdit(course)}
                      onDelete={() => handleDelete(course)}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </Card>

      <Drawer
        open={drawerOpen}
        onClose={closeDrawer}
        title={editingCourse ? "Editar curso" : "Nuevo curso"}
      >
        <CourseForm
          initialData={editingCourse}
          allCourses={prereqCourses}
          onSubmit={handleSave}
          onCancel={closeDrawer}
          saving={saving}
        />
      </Drawer>
    </div>
  );
}

function PrereqChips({ prerequisites }) {
  if (!prerequisites?.length) {
    return (
      <span className="text-slate-400 italic">Sin prerrequisitos</span>
    );
  }
  return (
    <div className="flex flex-wrap gap-1">
      {prerequisites.map((p) => (
        <span
          key={p._id || p}
          className="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-700"
        >
          {typeof p === "object" ? p.code : p}
        </span>
      ))}
    </div>
  );
}

function CourseCard({ course, onEdit, onDelete }) {
  const typeVariant = CLASSROOM_TYPE_BADGE[course.classroomTypeRequired] || "info";

  return (
    <article className="p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="font-semibold text-[#1E3A8A]">{course.code}</p>
          <p className="mt-0.5 truncate font-medium text-slate-900">{course.name}</p>
          <p className="mt-1 text-xs text-slate-500">{course.credits} créditos</p>
        </div>
        <div className="flex shrink-0 gap-1">
          <button
            type="button"
            onClick={onEdit}
            className="rounded-lg p-2 text-slate-500 hover:bg-blue-50 hover:text-blue-700"
            aria-label="Editar"
          >
            <Pencil className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={onDelete}
            className="rounded-lg p-2 text-slate-500 hover:bg-red-50 hover:text-red-600"
            aria-label="Desactivar"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
      <div className="mt-3 space-y-2">
        <div>
          <p className="text-xs font-medium text-slate-400">Prerrequisitos</p>
          <div className="mt-1">
            <PrereqChips prerequisites={course.prerequisites} />
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Badge variant={typeVariant}>
            {getClassroomLabel(course.classroomTypeRequired)}
          </Badge>
          <Badge variant={course.active !== false ? "success" : "neutral"}>
            {course.active !== false ? "Activo" : "Inactivo"}
          </Badge>
        </div>
      </div>
    </article>
  );
}

function CourseRow({ course, onEdit, onDelete }) {
  const typeVariant = CLASSROOM_TYPE_BADGE[course.classroomTypeRequired] || "info";

  return (
    <tr className="transition hover:bg-slate-50/80">
      <td className="whitespace-nowrap px-5 py-4">
        <span className="font-semibold text-[#1E3A8A]">{course.code}</span>
      </td>
      <td className="max-w-[220px] px-5 py-4 font-medium text-slate-900">
        {course.name}
      </td>
      <td className="px-5 py-4 text-slate-600">{course.credits}</td>
      <td className="px-5 py-4">
        <PrereqChips prerequisites={course.prerequisites} />
      </td>
      <td className="px-5 py-4">
        <Badge variant={typeVariant}>
          {getClassroomLabel(course.classroomTypeRequired)}
        </Badge>
      </td>
      <td className="px-5 py-4">
        <Badge variant={course.active !== false ? "success" : "neutral"}>
          {course.active !== false ? "Activo" : "Inactivo"}
        </Badge>
      </td>
      <td className="px-5 py-4">
        <div className="flex justify-end gap-1">
          <button
            type="button"
            onClick={onEdit}
            className="rounded-lg p-2 text-slate-500 transition hover:bg-blue-50 hover:text-blue-700"
            title="Editar"
          >
            <Pencil className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={onDelete}
            className="rounded-lg p-2 text-slate-500 transition hover:bg-red-50 hover:text-red-600"
            title="Desactivar"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </td>
    </tr>
  );
}

function EmptyState({ onCreate }) {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-[#3B82F6]">
        <BookOpen className="h-8 w-8" />
      </div>
      <h3 className="text-lg font-semibold text-slate-900">
        No hay cursos registrados
      </h3>
      <p className="mt-2 max-w-sm text-sm text-slate-500">
        Crea tu primer curso para comenzar a configurar la generación de
        horarios.
      </p>
      <button
        type="button"
        onClick={onCreate}
        className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#1E3A8A] px-5 py-2.5 text-sm font-semibold text-white shadow-md transition hover:bg-blue-900"
      >
        <Plus className="h-4 w-4" />
        Nuevo curso
      </button>
    </div>
  );
}
