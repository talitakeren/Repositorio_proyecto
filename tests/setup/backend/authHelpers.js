import request from "supertest";
import app from "../../../backend/src/app.js";
import User from "../../../backend/src/models/User.js";

export async function seedUser(overrides = {}) {
  const password = overrides.password || "123456";
  const user = await User.create({
    name: "Usuario Test",
    email: "test@sgoha.edu",
    password,
    role: "ADMIN",
    active: true,
    ...overrides,
  });
  return { user, password: overrides.password || "123456" };
}

export async function seedAdmin() {
  return seedUser({ name: "Admin Test", email: "admin-test@sgoha.edu", role: "ADMIN" });
}

export async function seedTeacher() {
  return seedUser({
    name: "Docente Test",
    email: "teacher-test@sgoha.edu",
    role: "TEACHER",
  });
}

export async function seedStudent() {
  return seedUser({
    name: "Alumno Test",
    email: "student-test@sgoha.edu",
    role: "STUDENT",
  });
}

export async function loginAs(email, password = "123456") {
  return request(app).post("/api/auth/login").send({ email, password });
}

export async function getToken(email = "admin-test@sgoha.edu", password = "123456") {
  const res = await loginAs(email, password);
  return res.body.data?.token;
}

export async function getAdminToken() {
  await seedAdmin();
  return getToken("admin-test@sgoha.edu");
}

export { app };
