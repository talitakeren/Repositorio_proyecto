import Card from "../ui/Card.jsx";
import Input from "../ui/Input.jsx";
import Select from "../ui/Select.jsx";
import Button from "../ui/Button.jsx";

export default function InstitutionSettingsCard({
  form,
  errors,
  onChange,
  onSave,
  saving,
}) {
  return (
    <Card className="p-5 sm:p-6">
      <h3 className="text-lg font-semibold text-slate-900">
        Datos institucionales
      </h3>
      <p className="mt-1 text-sm text-slate-500">
        Identidad del sistema y datos de contacto institucional.
      </p>

      <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
        <Input
          label="Nombre del sistema"
          name="systemName"
          value={form.systemName}
          onChange={(e) => onChange("systemName", e.target.value)}
          error={errors.systemName}
        />
        <Input
          label="Nombre completo"
          name="fullName"
          value={form.fullName}
          onChange={(e) => onChange("fullName", e.target.value)}
        />
        <Input
          label="Nombre de la institución"
          name="institutionName"
          placeholder="Ej. Universidad / Instituto / Facultad"
          value={form.institutionName}
          onChange={(e) => onChange("institutionName", e.target.value)}
        />
        <Input
          label="Correo de soporte"
          name="supportEmail"
          type="email"
          placeholder="soporte@sgoha.edu"
          value={form.supportEmail}
          onChange={(e) => onChange("supportEmail", e.target.value)}
          error={errors.supportEmail}
        />
        <Select
          label="Estado del sistema"
          name="systemStatus"
          value={form.systemStatus}
          onChange={(e) => onChange("systemStatus", e.target.value)}
        >
          <option value="ACTIVE">Activo</option>
          <option value="MAINTENANCE">Mantenimiento</option>
        </Select>
      </div>

      <div className="mt-5 flex justify-end">
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={onSave}
          disabled={saving}
        >
          {saving ? "Guardando..." : "Guardar datos institucionales"}
        </Button>
      </div>
    </Card>
  );
}
