import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Input from "../../../frontend/src/components/ui/Input.jsx";

describe("Input", () => {
  test("label asociado al campo", () => {
    render(<Input label="Correo" id="email" />);
    expect(screen.getByLabelText("Correo")).toBeInTheDocument();
  });

  test("muestra error", () => {
    render(<Input label="Nombre" id="n" error="Obligatorio" />);
    expect(screen.getByText("Obligatorio")).toBeInTheDocument();
  });

  test("acepta texto", async () => {
    const user = userEvent.setup();
    const fn = jest.fn();
    render(<Input label="Código" id="code" onChange={fn} />);
    await user.type(screen.getByLabelText("Código"), "CS");
    expect(fn).toHaveBeenCalled();
  });
});
