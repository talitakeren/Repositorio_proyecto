import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Button from "../../../frontend/src/components/ui/Button.jsx";

describe("Button", () => {
  test("renderiza children", () => {
    render(<Button>Guardar</Button>);
    expect(screen.getByRole("button", { name: "Guardar" })).toBeInTheDocument();
  });

  test("onClick", async () => {
    const user = userEvent.setup();
    const fn = jest.fn();
    render(<Button onClick={fn}>Click</Button>);
    await user.click(screen.getByRole("button"));
    expect(fn).toHaveBeenCalledTimes(1);
  });

  test("disabled", () => {
    render(<Button disabled>Off</Button>);
    expect(screen.getByRole("button")).toBeDisabled();
  });
});
