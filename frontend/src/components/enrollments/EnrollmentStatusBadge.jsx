import Badge from "../ui/Badge.jsx";

export const ENROLLMENT_STATUS_LABELS = {
  DRAFT: "Borrador",
  PENDING: "Pendiente",
  VALID: "Válida",
  VALIDATED: "Validada",
  CONFIRMED: "Confirmada",
  OBSERVED: "Observada",
  REJECTED: "Rechazada",
  INVALID: "Inválida",
};

const ENROLLMENT_STATUS_VARIANT = {
  DRAFT: "neutral",
  PENDING: "warning",
  VALID: "success",
  VALIDATED: "success",
  CONFIRMED: "info",
  OBSERVED: "warning",
  REJECTED: "error",
  INVALID: "error",
};

export default function EnrollmentStatusBadge({ status }) {
  return (
    <Badge variant={ENROLLMENT_STATUS_VARIANT[status] || "neutral"}>
      {ENROLLMENT_STATUS_LABELS[status] || status || "—"}
    </Badge>
  );
}
