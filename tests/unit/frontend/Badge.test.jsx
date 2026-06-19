import { render, screen } from "@testing-library/react";
import Badge from "../../../frontend/src/components/ui/Badge.jsx";

describe("Badge", () => {
  test.each([
    ["success", "bg-green-100"],
    ["warning", "bg-amber-100"],
    ["error", "bg-red-100"],
    ["info", "bg-blue-100"],
    ["neutral", "bg-slate-100"],
  ])("variant %s aplica clase correcta", (variant, classFragment) => {
    render(<Badge variant={variant}>Etiqueta</Badge>);
    expect(screen.getByText("Etiqueta").className).toContain(classFragment);
  });

  test("variant desconocido usa info por defecto", () => {
    render(<Badge variant="custom">X</Badge>);
    expect(screen.getByText("X").className).toContain("bg-blue-100");
  });
});
