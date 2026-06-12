import { render, screen } from "@testing-library/react";
import EnrollmentStatusBadge from "../../../frontend/src/components/enrollments/EnrollmentStatusBadge.jsx";

describe("EnrollmentStatusBadge", () => {
  test.each([
    ["CONFIRMED", "Confirmada"],
    ["VALID", "Válida"],
    ["REJECTED", "Rechazada"],
    ["DRAFT", "Borrador"],
    ["PENDING", "Pendiente"],
  ])("status %s muestra etiqueta %s", (status, label) => {
    render(<EnrollmentStatusBadge status={status} />);
    expect(screen.getByText(label)).toBeInTheDocument();
  });

  test("status desconocido muestra el valor crudo", () => {
    render(<EnrollmentStatusBadge status="CUSTOM" />);
    expect(screen.getByText("CUSTOM")).toBeInTheDocument();
  });
});
