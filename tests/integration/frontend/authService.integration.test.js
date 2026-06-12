import { authService } from "../../../frontend/src/services/authService.js";
import { TOKEN_KEY } from "../../../frontend/src/config/api.js";
import { server } from "../../setup/frontend/server.js";
import { errorHandlers } from "../../setup/frontend/handlers.js";

describe("authService — MSW", () => {
  beforeEach(() => localStorage.clear());

  test("login exitoso", async () => {
    const res = await authService.login("admin@sgoha.edu", "123456");
    expect(res.success).toBe(true);
    expect(res.data.token).toBe("mock-token-ADMIN");
  });

  test("login fallido", async () => {
    await expect(authService.login("admin@sgoha.edu", "x")).rejects.toThrow();
  });

  test("getMe con token", async () => {
    localStorage.setItem(TOKEN_KEY, "mock-token-TEACHER");
    const me = await authService.getMe();
    expect(me.role).toBe("TEACHER");
  });

  test("logout limpia token", () => {
    localStorage.setItem(TOKEN_KEY, "t");
    authService.logout();
    expect(localStorage.getItem(TOKEN_KEY)).toBeNull();
  });

  test("401 en getMe", async () => {
    server.use(errorHandlers.unauthorized);
    localStorage.setItem(TOKEN_KEY, "bad");
    await expect(authService.getMe()).rejects.toThrow();
  });
});
