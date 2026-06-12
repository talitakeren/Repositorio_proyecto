import { getPageTitle, PAGE_TITLES } from "../../../frontend/src/utils/pageTitles.js";

describe("pageTitles", () => {
  test.each(Object.entries(PAGE_TITLES))("ruta exacta %s", (path, title) => {
    expect(getPageTitle(path)).toBe(title);
  });

  test("ruta anidada usa prefijo más específico", () => {
    expect(getPageTitle("/schedules/generate/step-2")).toBe("Horarios académicos");
  });

  test("ruta desconocida retorna SGOHA", () => {
    expect(getPageTitle("/ruta/inexistente")).toBe("SGOHA");
  });
});
