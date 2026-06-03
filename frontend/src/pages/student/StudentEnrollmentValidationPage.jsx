import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ClipboardCheck,
  GraduationCap,
  BookOpenCheck,
} from "lucide-react";
import PageHeader from "../../components/ui/PageHeader.jsx";
import Card from "../../components/ui/Card.jsx";
import StepIndicator from "../../components/enrollment/StepIndicator.jsx";
import StudentInfoCard from "../../components/enrollment/StudentInfoCard.jsx";
import CourseSelectionTable from "../../components/enrollment/CourseSelectionTable.jsx";
import ValidationResults from "../../components/enrollment/ValidationResults.jsx";
import EnrollmentSummary from "../../components/enrollment/EnrollmentSummary.jsx";
import { studentPortalService } from "../../services/studentPortalService.js";
import { courseService } from "../../services/courseService.js";
import {
  MIN_CREDITS,
  MAX_CREDITS,
} from "../../utils/enrollmentConstants.js";

const STEPS = [
  { id: "student", label: "Estudiante" },
  { id: "courses", label: "Cursos" },
  { id: "validation", label: "Validación" },
];

/**
 * Pantalla unificada de Validación de matrícula para el rol STUDENT.
 *
 * Reusa los endpoints existentes:
 *   GET    /enrollments/me               → estudiante + matrícula actual
 *   PUT    /enrollments/me               → guarda selección (DRAFT/VALID)
 *   POST   /enrollments/me/validate      → valida sin guardar
 *   POST   /enrollments/me/confirm       → confirma si es válida
 *
 * El flujo se presenta como pasos (Estudiante → Cursos → Validación) con un
 * resumen lateral persistente que muestra créditos, rango permitido y
 * acciones (Validar / Confirmar / Limpiar).
 */
export default function StudentEnrollmentValidationPage() {
  const [student, setStudent] = useState(null);
  const [enrollment, setEnrollment] = useState(null);
  const [allCourses, setAllCourses] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [validation, setValidation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [validating, setValidating] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");
  const [toast, setToast] = useState(null);

  const showToast = useCallback((text, type = "success") => {
    setToast({ text, type });
    setTimeout(() => setToast(null), 3500);
  }, []);

  const refreshEnrollment = useCallback(async () => {
    const bundle = await studentPortalService.getMyEnrollment();
    setStudent(bundle?.student || null);
    setEnrollment(bundle?.enrollment || null);
    return bundle;
  }, []);

  useEffect(() => {
    async function bootstrap() {
      try {
        const [bundle, catalog] = await Promise.all([
          studentPortalService.getMyEnrollment().catch(() => null),
          courseService
            .getCourses({ active: "true" })
            .catch(() => []),
        ]);
        const initialStudent = bundle?.student || null;
        const initialEnrollment = bundle?.enrollment || null;
        setStudent(initialStudent);
        setEnrollment(initialEnrollment);
        setAllCourses(Array.isArray(catalog) ? catalog : []);
        const initialIds = (initialEnrollment?.courses || []).map((c) =>
          String(c._id)
        );
        setSelectedIds(initialIds);
        if (initialIds.length > 0) {
          try {
            const r =
              await studentPortalService.validateMySelection(initialIds);
            setValidation(r);
          } catch {
            setValidation(null);
          }
        }
      } catch {
        showToast("No se pudo cargar la información de matrícula.", "error");
      } finally {
        setLoading(false);
      }
    }
    bootstrap();
  }, [showToast]);

  const approvedSet = useMemo(() => {
    const ids = (student?.approvedCourses || []).map((c) =>
      typeof c === "object" ? String(c._id) : String(c)
    );
    return new Set(ids);
  }, [student]);

  const selectedSet = useMemo(
    () => new Set(selectedIds.map(String)),
    [selectedIds]
  );

  const courseMap = useMemo(() => {
    const map = new Map();
    for (const c of allCourses) map.set(String(c._id), c);
    return map;
  }, [allCourses]);

  const selectedCourses = useMemo(
    () =>
      selectedIds
        .map((id) => courseMap.get(String(id)))
        .filter(Boolean),
    [selectedIds, courseMap]
  );

  const totalCredits = useMemo(
    () => selectedCourses.reduce((sum, c) => sum + (c.credits || 0), 0),
    [selectedCourses]
  );

  function toggleCourse(courseId) {
    const id = String(courseId);
    setSelectedIds((prev) =>
      prev.map(String).includes(id)
        ? prev.filter((p) => String(p) !== id)
        : [...prev, id]
    );
    // Cualquier cambio invalida el último resultado oficial.
    setValidation(null);
  }

  async function handleValidate() {
    if (!selectedIds.length) return;
    setValidating(true);
    try {
      setSaving(true);
      await studentPortalService.saveMySelection(selectedIds);
      const result = await studentPortalService.validateMySelection(
        selectedIds
      );
      setValidation(result);
      await refreshEnrollment();
      if (result.valid) {
        showToast("Selección válida. Puedes confirmar tu matrícula.");
      } else {
        showToast("Aún no es válida. Revisa los mensajes.", "error");
      }
    } catch (e) {
      const msg =
        e?.response?.data?.message || "No se pudo validar tu selección.";
      showToast(msg, "error");
    } finally {
      setValidating(false);
      setSaving(false);
    }
  }

  async function handleConfirm() {
    if (!validation?.valid) return;
    setConfirming(true);
    try {
      await studentPortalService.saveMySelection(selectedIds);
      const result = await studentPortalService.validateMySelection(selectedIds);
      setValidation(result);
      if (!result.valid) {
        showToast("La selección ya no es válida. Revise los mensajes.", "error");
        return;
      }
      await studentPortalService.confirmMyEnrollment();
      const bundle = await refreshEnrollment();
      if (bundle?.enrollment?.courses?.length) {
        const ids = bundle.enrollment.courses.map((c) => String(c._id));
        setSelectedIds(ids);
      }
      setValidation(result);
      showToast("Matrícula confirmada correctamente.");
    } catch (e) {
      const msg =
        e?.response?.data?.message || "No se pudo confirmar la matrícula.";
      showToast(msg, "error");
    } finally {
      setConfirming(false);
    }
  }

  async function handleClear() {
    if (!selectedIds.length) return;
    if (!window.confirm("¿Limpiar tu selección actual?")) return;
    setSaving(true);
    try {
      setSelectedIds([]);
      setValidation(null);
      await studentPortalService.saveMySelection([]);
      await refreshEnrollment();
      showToast("Selección limpiada.");
    } catch {
      showToast("No se pudo limpiar la selección.", "error");
    } finally {
      setSaving(false);
    }
  }

  const enrollmentStatus = enrollment?.status;
  const isConfirmed = enrollmentStatus === "CONFIRMED";
  const canConfirm =
    Boolean(validation?.valid) &&
    enrollmentStatus !== "CONFIRMED" &&
    totalCredits >= MIN_CREDITS &&
    totalCredits <= MAX_CREDITS;
  // Avance de pasos:
  //  - Paso 1 completado siempre que haya estudiante autenticado.
  //  - Paso 2 completado cuando ya seleccionó al menos un curso.
  //  - Paso 3 completado cuando la validación oficial sea VÁLIDA.
  const completed = [
    Boolean(student),
    selectedIds.length > 0,
    Boolean(validation?.valid),
  ];
  const current = !student ? 0 : selectedIds.length === 0 ? 1 : 2;

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
        title="Validación de matrícula"
        subtitle="Selecciona cursos y verifica prerrequisitos y límite de créditos."
      />

      <Card className="p-4 sm:p-5">
        <StepIndicator
          steps={STEPS}
          current={current}
          completed={completed}
        />
      </Card>

      {loading ? (
        <div className="flex min-h-[40vh] items-center justify-center text-slate-500">
          Cargando información de matrícula...
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="space-y-5">
            <StepCard
              icon={GraduationCap}
              step={1}
              title="Identificación del estudiante"
            >
              <StudentInfoCard student={student} />
            </StepCard>

            <StepCard
              icon={BookOpenCheck}
              step={2}
              title="Selección de asignaturas"
              subtitle="Agrega o quita cursos y vuelve a validar y confirmar si realizas cambios."
            >
              {isConfirmed && (
                <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
                  Tu matrícula está confirmada. Si modificas cursos, deberás
                  validar y confirmar de nuevo.
                </div>
              )}
              <CourseSelectionTable
                courses={allCourses}
                approvedSet={approvedSet}
                selectedSet={selectedSet}
                isNewStudent={student?.isNewStudent === true}
                onToggle={toggleCourse}
                search={search}
                onSearchChange={setSearch}
              />
            </StepCard>

            <StepCard
              icon={ClipboardCheck}
              step={3}
              title="Resultado de validaciones"
              subtitle="Resumen de prerrequisitos, créditos y disponibilidad."
            >
              <ValidationResults
                validation={validation}
                totalCredits={totalCredits}
                isNewStudent={student?.isNewStudent === true}
              />
            </StepCard>
          </div>

          <EnrollmentSummary
            selectedCourses={selectedCourses}
            totalCredits={totalCredits}
            validation={validation}
            enrollmentStatus={enrollmentStatus}
            canConfirm={canConfirm}
            onValidate={handleValidate}
            onConfirm={handleConfirm}
            onClear={handleClear}
            validating={validating}
            confirming={confirming}
            saving={saving}
          />
        </div>
      )}
    </div>
  );
}

function StepCard({ icon: Icon, step, title, subtitle, children }) {
  return (
    <Card className="overflow-hidden">
      <header className="flex items-start gap-3 border-b border-slate-100 px-5 py-4">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-sgoha-primary">
          <Icon className="h-4 w-4" />
        </span>
        <div className="min-w-0">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
            Paso {step}
          </p>
          <h2 className="text-base font-semibold text-slate-900">{title}</h2>
          {subtitle && (
            <p className="mt-0.5 text-xs text-slate-500">{subtitle}</p>
          )}
        </div>
      </header>
      <div className="p-5">{children}</div>
    </Card>
  );
}
