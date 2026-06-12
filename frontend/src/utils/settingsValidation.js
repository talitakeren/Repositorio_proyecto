export function validateSettings(form) {
  const errors = {};

  if (!form?.systemName?.trim()) {
    errors.systemName = "El nombre del sistema es obligatorio.";
  }

  if (!form?.academicPeriod?.name?.trim()) {
    errors.periodName = "El periodo académico es obligatorio.";
  }

  const min = Number(form?.enrollmentRules?.minCredits);
  const max = Number(form?.enrollmentRules?.maxCredits);

  if (!(min > 0)) {
    errors.minCredits = "Debe ser mayor a 0.";
  }
  if (!(max > 0)) {
    errors.maxCredits = "Debe ser mayor a 0.";
  }
  if (min > 0 && max > 0 && min > max) {
    errors.minCredits = "No puede ser mayor que el máximo.";
    errors.maxCredits = "No puede ser menor que el mínimo.";
  }

  const email = form?.supportEmail?.trim();
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.supportEmail = "Ingrese un correo válido.";
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}
