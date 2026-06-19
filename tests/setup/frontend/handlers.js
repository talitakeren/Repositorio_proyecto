import { http, HttpResponse } from "msw";
import {
  API,
  mockAdmin,
  mockCourses,
  mockEnrollments,
  mockPrecheck,
  mockSettings,
  mockStudent,
  mockTeacher,
} from "../../fixtures/frontend/index.js";

export const handlers = [
  http.post(`${API}/auth/login`, async ({ request }) => {
    const body = await request.json();
    const users = {
      "admin@sgoha.edu": mockAdmin,
      "docente@sgoha.edu": mockTeacher,
      "alumno@sgoha.edu": mockStudent,
    };
    const user = users[body.email];
    if (!user || body.password !== "123456") {
      return HttpResponse.json(
        { success: false, message: "Credenciales incorrectas" },
        { status: 401 }
      );
    }
    return HttpResponse.json({
      success: true,
      data: { token: `mock-token-${user.role}`, user },
    });
  }),

  http.get(`${API}/auth/me`, ({ request }) => {
    const auth = request.headers.get("Authorization");
    if (!auth?.startsWith("Bearer mock-token-")) {
      return HttpResponse.json(
        { success: false, message: "No autorizado" },
        { status: 401 }
      );
    }
    const role = auth.replace("Bearer mock-token-", "");
    const map = { ADMIN: mockAdmin, TEACHER: mockTeacher, STUDENT: mockStudent };
    return HttpResponse.json({ success: true, data: map[role] });
  }),

  http.put(`${API}/auth/me`, async ({ request }) => {
    const body = await request.json();
    return HttpResponse.json({
      success: true,
      data: { ...mockAdmin, ...body },
    });
  }),

  http.get(`${API}/courses`, () =>
    HttpResponse.json({ success: true, data: mockCourses })
  ),

  http.get(`${API}/courses/:id`, ({ params }) => {
    const course = mockCourses.find((c) => c._id === params.id);
    if (!course) {
      return HttpResponse.json(
        { success: false, message: "No encontrado" },
        { status: 404 }
      );
    }
    return HttpResponse.json({ success: true, data: course });
  }),

  http.post(`${API}/courses`, async ({ request }) => {
    const body = await request.json();
    if (!body.code || !body.name) {
      return HttpResponse.json(
        { success: false, message: "Datos incompletos" },
        { status: 400 }
      );
    }
    return HttpResponse.json(
      { success: true, data: { _id: "new-id", ...body, active: true } },
      { status: 201 }
    );
  }),

  http.put(`${API}/courses/:id`, async ({ request, params }) => {
    const body = await request.json();
    return HttpResponse.json({
      success: true,
      data: { _id: params.id, ...mockCourses[0], ...body },
    });
  }),

  http.delete(`${API}/courses/:id`, ({ params }) =>
    HttpResponse.json({
      success: true,
      data: { course: { _id: params.id, active: false } },
    })
  ),

  http.get(`${API}/dashboard/summary`, ({ request }) => {
    if (!request.headers.get("Authorization")?.includes("ADMIN")) {
      return HttpResponse.json(
        { success: false, message: "Sin permisos" },
        { status: 403 }
      );
    }
    return HttpResponse.json({
      success: true,
      data: { courses: 5, teachers: 3, students: 10, classrooms: 4 },
    });
  }),

  http.get(`${API}/dashboard/status`, () =>
    HttpResponse.json({
      success: true,
      data: { status: "ACTIVE", database: "ok", lastSchedule: null },
    })
  ),

  http.get(`${API}/dashboard/activity`, () =>
    HttpResponse.json({
      success: true,
      data: [
        { type: "course", message: "Curso CS101 creado", at: "2026-01-01T00:00:00Z" },
      ],
    })
  ),

  http.get(`${API}/settings`, () =>
    HttpResponse.json({ success: true, data: mockSettings })
  ),

  http.put(`${API}/settings`, async ({ request }) => {
    const body = await request.json();
    if (!body.systemName?.trim()) {
      return HttpResponse.json(
        { success: false, message: "Nombre requerido", errors: { systemName: "Requerido" } },
        { status: 400 }
      );
    }
    return HttpResponse.json({
      success: true,
      data: { ...mockSettings, ...body },
    });
  }),

  http.post(`${API}/settings/reset`, () =>
    HttpResponse.json({ success: true, data: mockSettings })
  ),

  http.get(`${API}/enrollments`, () =>
    HttpResponse.json({ success: true, data: mockEnrollments })
  ),

  http.get(`${API}/enrollments/:id`, ({ params }) => {
    const enr = mockEnrollments.find((e) => e._id === params.id);
    if (!enr) {
      return HttpResponse.json({ success: false, message: "No encontrado" }, { status: 404 });
    }
    return HttpResponse.json({ success: true, data: enr });
  }),

  http.post(`${API}/enrollments/:id/validate`, ({ params }) =>
    HttpResponse.json({
      success: true,
      data: { ...mockEnrollments[0], _id: params.id, status: "VALIDATED" },
    })
  ),

  http.post(`${API}/enrollments/:id/confirm`, ({ params }) =>
    HttpResponse.json({
      success: true,
      data: { ...mockEnrollments[0], _id: params.id, status: "CONFIRMED" },
    })
  ),

  http.get(`${API}/schedules/precheck`, () =>
    HttpResponse.json({ success: true, data: mockPrecheck })
  ),
];

export const errorHandlers = {
  serverError: http.get(`${API}/courses`, () =>
    HttpResponse.json({ success: false, message: "Error interno" }, { status: 500 })
  ),
  emptyList: http.get(`${API}/courses`, () =>
    HttpResponse.json({ success: true, data: [] })
  ),
  unauthorized: http.get(`${API}/auth/me`, () =>
    HttpResponse.json({ success: false, message: "No autorizado" }, { status: 401 })
  ),
  settingsBadRequest: http.put(`${API}/settings`, () =>
    HttpResponse.json(
      { success: false, message: "Datos inválidos", errors: { systemName: "Requerido" } },
      { status: 400 }
    )
  ),
};
