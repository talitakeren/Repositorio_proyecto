import { authService } from "../../../backend/src/services/auth.service.js";
import User from "../../../backend/src/models/User.js";
import { seedAdmin, seedUser } from "../../setup/backend/authHelpers.js";

describe("authService", () => {
  test("login exitoso retorna token y usuario público", async () => {
    await seedAdmin();
    const result = await authService.login({
      email: "admin-test@sgoha.edu",
      password: "123456",
    });
    expect(result.token).toBeTruthy();
    expect(result.user).toMatchObject({
      email: "admin-test@sgoha.edu",
      role: "ADMIN",
    });
    expect(result.user.password).toBeUndefined();
  });

  test("login normaliza email a minúsculas", async () => {
    await seedAdmin();
    const result = await authService.login({
      email: "  ADMIN-TEST@SGOHA.EDU  ",
      password: "123456",
    });
    expect(result.user.email).toBe("admin-test@sgoha.edu");
  });

  test("login contraseña incorrecta → 401", async () => {
    await seedAdmin();
    await expect(
      authService.login({ email: "admin-test@sgoha.edu", password: "wrong" })
    ).rejects.toMatchObject({ status: 401, message: "Credenciales incorrectas" });
  });

  test("login usuario inactivo → 403", async () => {
    await seedUser({
      name: "Inactivo Test",
      email: "inactive@sgoha.edu",
      role: "STUDENT",
      active: false,
    });
    await expect(
      authService.login({ email: "inactive@sgoha.edu", password: "123456" })
    ).rejects.toMatchObject({ status: 403, message: "Usuario inactivo" });
  });

  test("me retorna perfil sin password", async () => {
    const { user } = await seedAdmin();
    const profile = await authService.me(user._id);
    expect(profile.email).toBe("admin-test@sgoha.edu");
    expect(profile.role).toBe("ADMIN");
  });

  test("me usuario inexistente → 404", async () => {
    const fakeId = new User()._id;
    await expect(authService.me(fakeId)).rejects.toMatchObject({
      status: 404,
      message: "Usuario no encontrado",
    });
  });
});
