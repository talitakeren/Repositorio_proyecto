import { enrollmentService } from "../../../frontend/src/services/enrollmentService.js";
import { TOKEN_KEY } from "../../../frontend/src/config/api.js";

describe("enrollmentService — MSW", () => {
  beforeEach(() => {
    localStorage.setItem(TOKEN_KEY, "mock-token-ADMIN");
  });

  test("getEnrollments retorna matrículas", async () => {
    const list = await enrollmentService.getEnrollments();
    expect(list.length).toBeGreaterThan(0);
    expect(list[0].status).toBe("VALIDATED");
  });

  test("getEnrollmentById retorna matrícula específica", async () => {
    const enr = await enrollmentService.getEnrollmentById("enr1");
    expect(enr._id).toBe("enr1");
    expect(enr.totalCredits).toBe(20);
  });

  test("validateEnrollment cambia status a VALIDATED", async () => {
    const enr = await enrollmentService.validateEnrollment("enr1");
    expect(enr.status).toBe("VALIDATED");
  });

  test("confirmEnrollment cambia status a CONFIRMED", async () => {
    const enr = await enrollmentService.confirmEnrollment("enr1");
    expect(enr.status).toBe("CONFIRMED");
  });

  test("alias list/get/validate/confirm funcionan", async () => {
    expect(await enrollmentService.list()).toHaveLength(1);
    expect(await enrollmentService.get("enr1")).toMatchObject({ _id: "enr1" });
    expect((await enrollmentService.validate("enr1")).status).toBe("VALIDATED");
    expect((await enrollmentService.confirm("enr1")).status).toBe("CONFIRMED");
  });
});
