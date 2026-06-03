import Card from "../ui/Card.jsx";
import Input from "../ui/Input.jsx";
import Select from "../ui/Select.jsx";
import Toggle from "../ui/Toggle.jsx";

export default function AcademicPeriodCard({
  period,
  errors,
  onPeriodChange,
}) {
  return (
    <Card className="p-5 sm:p-6">
      <h3 className="text-lg font-semibold text-slate-900">Periodo académico</h3>
      <p className="mt-1 text-sm text-slate-500">
        El periodo activo será usado para registrar matrículas y generar
        horarios.
      </p>

      <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
        <Input
          label="Periodo activo"
          name="periodName"
          placeholder="2024-I"
          value={period.name}
          onChange={(e) => onPeriodChange("name", e.target.value)}
          error={errors.periodName}
        />
        <Select
          label="Estado del periodo"
          value={period.status}
          onChange={(e) => onPeriodChange("status", e.target.value)}
        >
          <option value="ACTIVE">Activo</option>
          <option value="CLOSED">Cerrado</option>
          <option value="PREPARING">En preparación</option>
        </Select>
        <Input
          label="Fecha de inicio"
          type="date"
          value={period.startDate || ""}
          onChange={(e) => onPeriodChange("startDate", e.target.value)}
        />
        <Input
          label="Fecha de fin"
          type="date"
          value={period.endDate || ""}
          onChange={(e) => onPeriodChange("endDate", e.target.value)}
        />
      </div>

      <div className="mt-4 divide-y divide-slate-100 rounded-xl border border-slate-200 px-4">
        <Toggle
          label="Permitir matrícula"
          checked={period.enrollmentEnabled}
          onChange={(v) => onPeriodChange("enrollmentEnabled", v)}
        />
        <Toggle
          label="Permitir generación de horarios"
          checked={period.scheduleGenerationEnabled}
          onChange={(v) => onPeriodChange("scheduleGenerationEnabled", v)}
        />
      </div>
    </Card>
  );
}
