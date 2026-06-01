import { useEffect, useState } from "react";
import { X } from "lucide-react";
import Input from "../ui/Input.jsx";
import Select from "../ui/Select.jsx";
import { CLASSROOM_TYPE_OPTIONS } from "../../utils/courseLabels.js";

const emptyForm = {
  code: "",
  name: "",
  credits: "",
  classroomTypeRequired: "STANDARD",
  prerequisites: [],
  active: true,
};

export default function CourseForm({
  initialData = null,
  allCourses = [],
  onSubmit,
  onCancel,
  saving = false,
}) {
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});

  const isEdit = Boolean(initialData?._id);
  const courseId = initialData?._id;

  useEffect(() => {
    if (initialData) {
      setForm({
        code: initialData.code || "",
        name: initialData.name || "",
        credits: String(initialData.credits ?? ""),
        classroomTypeRequired: initialData.classroomTypeRequired || "STANDARD",
        prerequisites: (initialData.prerequisites || []).map((p) =>
          typeof p === "object" ? p._id : p
        ),
        active: initialData.active !== false,
      });
    } else {
      setForm(emptyForm);
    }
    setErrors({});
  }, [initialData]);

  const availablePrereqs = allCourses.filter(
    (c) => String(c._id) !== String(courseId) && c.active !== false
  );

  function validate() {
    const next = {};

    if (!form.code.trim()) {
      next.code = "El código del curso es obligatorio.";
    }
    if (!form.name.trim()) {
      next.name = "El nombre del curso es obligatorio.";
    }
    const credits = Number(form.credits);
    if (!form.credits && form.credits !== 0) {
      next.credits = "Los créditos son obligatorios.";
    } else if (isNaN(credits) || credits <= 0) {
      next.credits = "Los créditos deben ser mayores a 0.";
    }
    if (!form.classroomTypeRequired) {
      next.classroomTypeRequired = "Selecciona el tipo de aula requerida.";
    }
    if (
      isEdit &&
      form.prerequisites.some((p) => String(p) === String(courseId))
    ) {
      next.prerequisites = "Un curso no puede ser prerrequisito de sí mismo.";
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;

    onSubmit({
      code: form.code.trim().toUpperCase(),
      name: form.name.trim(),
      credits: Number(form.credits),
      classroomTypeRequired: form.classroomTypeRequired,
      prerequisites: form.prerequisites,
      active: form.active,
    });
  }

  function togglePrereq(id) {
    const sid = String(id);
    setForm((prev) => ({
      ...prev,
      prerequisites: prev.prerequisites.some((p) => String(p) === sid)
        ? prev.prerequisites.filter((p) => String(p) !== sid)
        : [...prev.prerequisites, id],
    }));
    setErrors((prev) => ({ ...prev, prerequisites: undefined }));
  }

  function removePrereq(id) {
    setForm((prev) => ({
      ...prev,
      prerequisites: prev.prerequisites.filter((p) => String(p) !== String(id)),
    }));
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <Input
        label="Código del curso"
        name="code"
        placeholder="Ej: INF-101"
        value={form.code}
        onChange={(e) => setForm({ ...form, code: e.target.value })}
        error={errors.code}
        disabled={saving}
      />

      <Input
        label="Nombre"
        name="name"
        placeholder="Nombre completo del curso"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
        error={errors.name}
        disabled={saving}
      />

      <Input
        label="Créditos"
        name="credits"
        type="number"
        min={1}
        placeholder="0"
        value={form.credits}
        onChange={(e) => setForm({ ...form, credits: e.target.value })}
        error={errors.credits}
        disabled={saving}
      />

      <Select
        label="Requisito de aula"
        name="classroomTypeRequired"
        value={form.classroomTypeRequired}
        onChange={(e) =>
          setForm({ ...form, classroomTypeRequired: e.target.value })
        }
        error={errors.classroomTypeRequired}
        disabled={saving}
      >
        {CLASSROOM_TYPE_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </Select>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-slate-700">
          Prerrequisitos
        </label>
        {availablePrereqs.length === 0 ? (
          <p className="rounded-lg border border-dashed border-slate-200 bg-slate-50 px-3 py-4 text-sm text-slate-500">
            No hay cursos disponibles para seleccionar como prerrequisito.
          </p>
        ) : (
          <div className="max-h-36 space-y-1 overflow-y-auto rounded-lg border border-slate-200 p-2">
            {availablePrereqs.map((c) => {
              const selected = form.prerequisites.some(
                (p) => String(p) === String(c._id)
              );
              return (
                <label
                  key={c._id}
                  className={`flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm transition hover:bg-slate-50 ${
                    selected ? "bg-blue-50 text-blue-900" : "text-slate-700"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selected}
                    onChange={() => togglePrereq(c._id)}
                    disabled={saving}
                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="font-medium">{c.code}</span>
                  <span className="truncate text-slate-500">{c.name}</span>
                </label>
              );
            })}
          </div>
        )}
        {form.prerequisites.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-2">
            {form.prerequisites.map((pid) => {
              const course = allCourses.find((c) => String(c._id) === String(pid));
              return (
                <span
                  key={pid}
                  className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-2.5 py-1 text-xs font-medium text-blue-800"
                >
                  {course?.code || pid}
                  <button
                    type="button"
                    onClick={() => removePrereq(pid)}
                    className="rounded-full p-0.5 hover:bg-blue-200"
                    disabled={saving}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              );
            })}
          </div>
        )}
        {errors.prerequisites && (
          <p className="mt-1.5 text-xs text-red-600">{errors.prerequisites}</p>
        )}
      </div>

      <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
        <div>
          <p className="text-sm font-medium text-slate-800">Estado del curso</p>
          <p className="text-xs text-slate-500">
            Habilitado para asignación de horarios
          </p>
        </div>
        <button
          type="button"
          role="switch"
          aria-checked={form.active}
          onClick={() => setForm({ ...form, active: !form.active })}
          disabled={saving}
          className={`relative h-6 w-11 shrink-0 rounded-full transition ${
            form.active ? "bg-blue-600" : "bg-slate-300"
          }`}
        >
          <span
            className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition ${
              form.active ? "translate-x-5" : ""
            }`}
          />
        </button>
      </div>

      <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row">
        <button
          type="button"
          onClick={onCancel}
          disabled={saving}
          className="flex-1 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-60"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={saving}
          className="flex-1 rounded-lg bg-[#1E3A8A] px-4 py-2.5 text-sm font-semibold text-white shadow-md transition hover:bg-blue-900 disabled:opacity-60"
        >
          {saving ? "Guardando..." : "Guardar curso"}
        </button>
      </div>
    </form>
  );
}
