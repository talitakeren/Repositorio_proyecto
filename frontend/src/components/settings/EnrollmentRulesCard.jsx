import Card from "../ui/Card.jsx";
import Input from "../ui/Input.jsx";
import Toggle from "../ui/Toggle.jsx";

export default function EnrollmentRulesCard({
  rules,
  errors,
  onRuleChange,
}) {
  return (
    <Card className="p-5 sm:p-6">
      <h3 className="text-lg font-semibold text-slate-900">Reglas de matrícula</h3>
      <p className="mt-1 text-sm text-slate-500">
        Estas reglas se aplican al validar la matrícula del estudiante antes de
        generar horarios.
      </p>

      <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input
          label="Créditos mínimos"
          type="number"
          min={1}
          value={rules.minCredits}
          onChange={(e) =>
            onRuleChange("minCredits", Number(e.target.value))
          }
          error={errors.minCredits}
        />
        <Input
          label="Créditos máximos"
          type="number"
          min={1}
          value={rules.maxCredits}
          onChange={(e) =>
            onRuleChange("maxCredits", Number(e.target.value))
          }
          error={errors.maxCredits}
        />
      </div>

      <div className="mt-4 divide-y divide-slate-100 rounded-xl border border-slate-200 px-4">
        <Toggle
          label="Validar prerrequisitos"
          checked={rules.validatePrerequisites}
          onChange={(v) => onRuleChange("validatePrerequisites", v)}
        />
        <Toggle
          label="Bloquear cursos ya aprobados"
          checked={rules.blockApprovedCourses}
          onChange={(v) => onRuleChange("blockApprovedCourses", v)}
        />
        <Toggle
          label="Permitir matrícula con observaciones"
          checked={rules.allowObservedEnrollment}
          onChange={(v) => onRuleChange("allowObservedEnrollment", v)}
        />
        <Toggle
          label="Solo matrículas confirmadas para horarios"
          checked={rules.onlyConfirmedForSchedules}
          onChange={(v) => onRuleChange("onlyConfirmedForSchedules", v)}
        />
      </div>
    </Card>
  );
}
