import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import AvailabilityGrid from "../../components/availability/AvailabilityGrid.jsx";
import { teacherService } from "../../services/teacherService.js";
import Card from "../../components/ui/Card.jsx";

/**
 * Ruta admin: /teachers/:id/availability
 * Permite actualizar solo la grilla (datos usados por el motor CSP).
 */
export default function TeacherAvailabilityPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [teacher, setTeacher] = useState(null);
  const [availability, setAvailability] = useState([]);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState(null);

  useEffect(() => {
    if (!id) return;
    teacherService.getTeacherById(id).then((t) => {
      setTeacher(t);
      setAvailability(t?.availability || []);
    });
  }, [id]);

  async function save() {
    setSaving(true);
    setMsg(null);
    try {
      await teacherService.updateTeacherAvailability(id, availability);
      setMsg({ type: "success", text: "Disponibilidad actualizada correctamente." });
    } catch {
      setMsg({ type: "error", text: "No se pudo guardar la disponibilidad." });
    } finally {
      setSaving(false);
    }
  }

  if (!teacher) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center text-slate-500">
        Cargando...
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <button
        type="button"
        onClick={() => navigate("/teachers")}
        className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900"
      >
        <ArrowLeft className="h-4 w-4" />
        Volver a docentes
      </button>

      <div>
        <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">
          Disponibilidad — {teacher.fullName}
        </h2>
        <p className="mt-1 text-sm text-slate-500">{teacher.email}</p>
      </div>

      <Card className="p-4 sm:p-6">
        <AvailabilityGrid value={availability} onChange={setAvailability} />
        <button
          type="button"
          onClick={save}
          disabled={saving}
          className="mt-6 inline-flex w-full items-center justify-center rounded-xl bg-[#1E3A8A] px-5 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-blue-900 disabled:opacity-60 sm:w-auto"
        >
          {saving ? "Guardando..." : "Guardar disponibilidad"}
        </button>
        {msg && (
          <p
            className={`mt-3 text-sm font-medium ${
              msg.type === "error" ? "text-red-600" : "text-green-600"
            }`}
          >
            {msg.text}
          </p>
        )}
      </Card>
    </div>
  );
}
