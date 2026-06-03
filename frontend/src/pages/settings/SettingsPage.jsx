import { useCallback, useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import PageHeader from "../../components/ui/PageHeader.jsx";
import Card from "../../components/ui/Card.jsx";
import Button from "../../components/ui/Button.jsx";
import SettingsSummaryCards from "../../components/settings/SettingsSummaryCards.jsx";
import InstitutionSettingsCard from "../../components/settings/InstitutionSettingsCard.jsx";
import AcademicPeriodCard from "../../components/settings/AcademicPeriodCard.jsx";
import EnrollmentRulesCard from "../../components/settings/EnrollmentRulesCard.jsx";
import ScheduleRulesCard from "../../components/settings/ScheduleRulesCard.jsx";
import CspSettingsCard from "../../components/settings/CspSettingsCard.jsx";
import SecurityInfoCard from "../../components/settings/SecurityInfoCard.jsx";
import { settingsService } from "../../services/settingsService.js";
import { validateSettings } from "../../utils/settingsValidation.js";
import { TIME_BLOCKS } from "../../constants/timeBlocks.js";

export default function SettingsPage() {
  const [form, setForm] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = useCallback((text, type = "success") => {
    setToast({ text, type });
    setTimeout(() => setToast(null), 3500);
  }, []);

  useEffect(() => {
    settingsService
      .getSettings()
      .then(setForm)
      .catch(() => showToast("No se pudo cargar la configuración.", "error"))
      .finally(() => setLoading(false));
  }, [showToast]);

  const patchField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
  };

  const patchPeriod = (key, value) => {
    setForm((prev) => ({
      ...prev,
      academicPeriod: { ...prev.academicPeriod, [key]: value },
    }));
    if (key === "name") {
      setErrors((prev) => {
        const next = { ...prev };
        delete next.periodName;
        return next;
      });
    }
  };

  const patchRules = (key, value) => {
    setForm((prev) => ({
      ...prev,
      enrollmentRules: { ...prev.enrollmentRules, [key]: value },
    }));
    setErrors((prev) => {
      const next = { ...prev };
      delete next.minCredits;
      delete next.maxCredits;
      return next;
    });
  };

  const persist = async (payload, successMsg) => {
    const { valid, errors: validationErrors } = validateSettings(payload);
    if (!valid) {
      setErrors(validationErrors);
      showToast("Revisa los valores ingresados antes de guardar.", "warning");
      return false;
    }

    setSaving(true);
    try {
      const updated = await settingsService.updateSettings(payload);
      setForm(updated);
      setErrors({});
      showToast(successMsg);
      return true;
    } catch (err) {
      const apiErrors = err?.response?.data?.errors;
      if (apiErrors) setErrors(apiErrors);
      showToast(
        err?.response?.data?.message ||
          "No se pudo guardar la configuración.",
        "error"
      );
      return false;
    } finally {
      setSaving(false);
    }
  };

  const handleSaveAll = () => {
    if (!form) return;
    persist(form, "Configuración guardada correctamente.");
  };

  const handleSaveInstitution = () => {
    if (!form) return;
    persist(form, "Datos institucionales guardados correctamente.");
  };

  const handleReset = async () => {
    const confirmed = window.confirm(
      "¿Restaurar los valores predeterminados del sistema? Los cambios no guardados se perderán."
    );
    if (!confirmed) return;

    setSaving(true);
    try {
      const data = await settingsService.resetSettings();
      setForm(data);
      setErrors({});
      showToast("Valores predeterminados restaurados.");
    } catch {
      showToast("No se pudo restaurar la configuración.", "error");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center gap-2 text-slate-500">
        <Loader2 className="h-5 w-5 animate-spin" />
        Cargando configuración...
      </div>
    );
  }

  if (!form) {
    return (
      <Card className="p-6 text-center text-sm text-slate-500">
        No se pudo cargar la configuración del sistema.
      </Card>
    );
  }

  return (
    <div className="space-y-8 pb-24">
      {toast && (
        <div
          className={`fixed right-4 top-20 z-50 max-w-sm rounded-xl border px-4 py-3 text-sm font-medium shadow-lg ${
            toast.type === "error"
              ? "border-red-200 bg-red-50 text-red-800"
              : toast.type === "warning"
                ? "border-amber-200 bg-amber-50 text-amber-900"
                : "border-green-200 bg-green-50 text-green-800"
          }`}
        >
          {toast.text}
        </div>
      )}

      <PageHeader
        title="Configuración"
        subtitle="Administra los parámetros generales del sistema académico."
      />

      <SettingsSummaryCards settings={form} />

      <InstitutionSettingsCard
        form={form}
        errors={errors}
        onChange={patchField}
        onSave={handleSaveInstitution}
        saving={saving}
      />

      <AcademicPeriodCard
        period={form.academicPeriod}
        errors={errors}
        onPeriodChange={patchPeriod}
      />

      <EnrollmentRulesCard
        rules={form.enrollmentRules}
        errors={errors}
        onRuleChange={patchRules}
      />

      <ScheduleRulesCard
        scheduleRules={form.scheduleRules}
        timeBlocks={TIME_BLOCKS}
      />

      <CspSettingsCard csp={form.csp} />

      <SecurityInfoCard />

      <div className="sticky bottom-0 -mx-1 flex flex-col-reverse gap-3 rounded-2xl border border-slate-200 bg-white/95 p-4 shadow-lg backdrop-blur sm:flex-row sm:justify-end">
        <Button
          type="button"
          variant="secondary"
          onClick={handleReset}
          disabled={saving}
        >
          Restaurar valores
        </Button>
        <Button type="button" onClick={handleSaveAll} disabled={saving}>
          {saving ? "Guardando..." : "Guardar configuración"}
        </Button>
      </div>
    </div>
  );
}
