import { jest } from "@jest/globals";

// ─── Helpers de req / res / next ────────────────────────────────────────────
const mockRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

const mockReq = (overrides = {}) => ({
  body: {},
  params: {},
  query: {},
  user: { _id: "user-id-mock", role: "ADMIN" },
  ...overrides,
});

// ════════════════════════════════════════════════════════════════════════════
// 1. auth.controller
// ════════════════════════════════════════════════════════════════════════════
describe("auth.controller", () => {
  let authService, login, me;

  beforeEach(async () => {
    jest.resetModules();

    // Mock del servicio antes de importar el controlador
    authService = { login: jest.fn(), me: jest.fn() };
    jest.unstable_mockModule(
      "../../../backend/src/services/auth.service.js",
      () => ({ authService })
    );

    const ctrl = await import(
      "../../../backend/src/controllers/auth.controller.js"
    );
    login = ctrl.login;
    me = ctrl.me;
  });

  test("login → 400 si falta email", async () => {
    const req = mockReq({ body: { password: "123" } });
    const res = mockRes();
    await login(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  test("login → 400 si falta password", async () => {
    const req = mockReq({ body: { email: "a@b.com" } });
    const res = mockRes();
    await login(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  test("login → 200 y llama authService.login con credenciales", async () => {
    authService.login.mockResolvedValue({
      token: "tok",
      user: { email: "a@b.com", role: "ADMIN" },
    });
    const req = mockReq({ body: { email: "a@b.com", password: "pass" } });
    const res = mockRes();
    await login(req, res);
    expect(authService.login).toHaveBeenCalledWith({
      email: "a@b.com",
      password: "pass",
    });
    expect(res.status).toHaveBeenCalledWith(200);
  });

  test("login → 401 si authService lanza status 401", async () => {
    const err = new Error("Credenciales incorrectas");
    err.status = 401;
    authService.login.mockRejectedValue(err);
    const req = mockReq({ body: { email: "x@b.com", password: "mal" } });
    const res = mockRes();
    await login(req, res);
    expect(res.status).toHaveBeenCalledWith(401);
  });

  test("me → delega en authService.me y responde 200", async () => {
    authService.me.mockResolvedValue({ email: "a@b.com", role: "ADMIN" });
    const req = mockReq();
    const res = mockRes();
    await me(req, res);
    expect(authService.me).toHaveBeenCalledWith("user-id-mock");
    expect(res.json).toHaveBeenCalled();
  });
});

// ════════════════════════════════════════════════════════════════════════════
// 2. classroom.controller
// ════════════════════════════════════════════════════════════════════════════
describe("classroom.controller", () => {
  let classroomService, listClassrooms, getClassroom, createClassroom, deleteClassroom;

  beforeEach(async () => {
    jest.resetModules();

    classroomService = {
      list: jest.fn(),
      getById: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
    };
    jest.unstable_mockModule(
      "../../../backend/src/services/classroom.service.js",
      () => ({ classroomService })
    );

    const ctrl = await import(
      "../../../backend/src/controllers/classroom.controller.js"
    );
    listClassrooms = ctrl.listClassrooms;
    getClassroom = ctrl.getClassroom;
    createClassroom = ctrl.createClassroom;
    deleteClassroom = ctrl.deleteClassroom;
  });

  test("listClassrooms → responde con array del servicio", async () => {
    const items = [{ code: "A101" }, { code: "B202" }];
    classroomService.list.mockResolvedValue(items);
    const req = mockReq({ query: {} });
    const res = mockRes();
    await listClassrooms(req, res);
    expect(classroomService.list).toHaveBeenCalledWith({});
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ data: items })
    );
  });

  test("getClassroom → 404 si el servicio retorna null", async () => {
    classroomService.getById.mockResolvedValue(null);
    const req = mockReq({ params: { id: "id-inexistente" } });
    const res = mockRes();
    await getClassroom(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
  });

  test("getClassroom → 200 con datos del aula", async () => {
    const aula = { code: "LAB-01", capacity: 30 };
    classroomService.getById.mockResolvedValue(aula);
    const req = mockReq({ params: { id: "id-ok" } });
    const res = mockRes();
    await getClassroom(req, res);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ data: aula })
    );
  });

  test("createClassroom → 201 con aula creada (spy sobre create)", async () => {
    const nueva = { code: "C303", capacity: 20 };
    classroomService.create.mockResolvedValue(nueva);
    const spy = jest.spyOn(classroomService, "create");
    const req = mockReq({ body: nueva });
    const res = mockRes();
    await createClassroom(req, res);
    expect(spy).toHaveBeenCalledWith(nueva);
    expect(res.status).toHaveBeenCalledWith(201);
  });

  test("createClassroom → 409 si código duplicado (error 11000)", async () => {
    const err = new Error("dup");
    err.code = 11000;
    classroomService.create.mockRejectedValue(err);
    const req = mockReq({ body: { code: "DUP" } });
    const res = mockRes();
    await createClassroom(req, res);
    expect(res.status).toHaveBeenCalledWith(409);
  });

  test("deleteClassroom → 404 si no existe el aula", async () => {
    classroomService.remove.mockResolvedValue(null);
    const req = mockReq({ params: { id: "no-existe" } });
    const res = mockRes();
    await deleteClassroom(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
  });
});

// ════════════════════════════════════════════════════════════════════════════
// 3. course.controller
// ════════════════════════════════════════════════════════════════════════════
describe("course.controller", () => {
  let courseService, listCourses, getCourse, createCourse, deleteCourse;

  beforeEach(async () => {
    jest.resetModules();

    courseService = {
      list: jest.fn(),
      getById: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
    };
    jest.unstable_mockModule(
      "../../../backend/src/services/course.service.js",
      () => ({ courseService })
    );

    const ctrl = await import(
      "../../../backend/src/controllers/course.controller.js"
    );
    listCourses = ctrl.listCourses;
    getCourse = ctrl.getCourse;
    createCourse = ctrl.createCourse;
    deleteCourse = ctrl.deleteCourse;
  });

  test("listCourses → llama al servicio con los query params", async () => {
    courseService.list.mockResolvedValue([]);
    const req = mockReq({ query: { search: "mat", active: "true" } });
    const res = mockRes();
    await listCourses(req, res);
    expect(courseService.list).toHaveBeenCalledWith(
      expect.objectContaining({ search: "mat", active: "true" })
    );
  });

  test("getCourse → 404 si curso no existe", async () => {
    courseService.getById.mockResolvedValue(null);
    const req = mockReq({ params: { id: "bad-id" } });
    const res = mockRes();
    await getCourse(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
  });

  test("createCourse → 201 con datos del curso (spy sobre create)", async () => {
    const curso = { code: "MAT101", name: "Matemáticas", credits: 4 };
    courseService.create.mockResolvedValue(curso);
    const spy = jest.spyOn(courseService, "create");
    const req = mockReq({ body: curso });
    const res = mockRes();
    await createCourse(req, res);
    expect(spy).toHaveBeenCalledWith(curso);
    expect(res.status).toHaveBeenCalledWith(201);
  });

  test("createCourse → 409 por código duplicado", async () => {
    const err = new Error("dup");
    err.code = 11000;
    courseService.create.mockRejectedValue(err);
    const req = mockReq({ body: { code: "DUP" } });
    const res = mockRes();
    await createCourse(req, res);
    expect(res.status).toHaveBeenCalledWith(409);
  });

  test("deleteCourse → 404 si curso no existe", async () => {
    courseService.remove.mockResolvedValue(null);
    const req = mockReq({ params: { id: "no-existe" } });
    const res = mockRes();
    await deleteCourse(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
  });
});

// ════════════════════════════════════════════════════════════════════════════
// 4. student.controller
// ════════════════════════════════════════════════════════════════════════════
describe("student.controller", () => {
  let studentService, enrollmentService, getStudent, createStudent;

  beforeEach(async () => {
    jest.resetModules();

    studentService = {
      list: jest.fn(),
      getById: jest.fn(),
      getByUserId: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
      updateApprovedCourses: jest.fn(),
    };
    enrollmentService = { repairAll: jest.fn().mockResolvedValue(undefined) };

    jest.unstable_mockModule(
      "../../../backend/src/services/student.service.js",
      () => ({ studentService })
    );
    jest.unstable_mockModule(
      "../../../backend/src/services/enrollment.service.js",
      () => ({ enrollmentService })
    );

    const ctrl = await import(
      "../../../backend/src/controllers/student.controller.js"
    );
    getStudent = ctrl.getStudent;
    createStudent = ctrl.createStudent;
  });

  test("getStudent → 404 si estudiante no existe", async () => {
    studentService.getById.mockResolvedValue(null);
    const req = mockReq({ params: { id: "no-existe" } });
    const res = mockRes();
    await getStudent(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
  });

  test("getStudent → 200 con datos del estudiante", async () => {
    const est = { name: "Juan", code: "EST001" };
    studentService.getById.mockResolvedValue(est);
    const req = mockReq({ params: { id: "id-ok" } });
    const res = mockRes();
    await getStudent(req, res);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ data: est })
    );
  });

  test("createStudent → 201 y adjunta _account si el servicio lo retorna", async () => {
    const student = {
      _id: "s1",
      name: "Ana",
      toObject: () => ({ _id: "s1", name: "Ana" }),
    };
    const account = { password: "init123" };
    studentService.create.mockResolvedValue({ student, account });
    const req = mockReq({ body: { name: "Ana", code: "EST002" } });
    const res = mockRes();
    await createStudent(req, res);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ _account: account }),
      })
    );
  });

  test("createStudent → 409 por código duplicado (spy sobre create)", async () => {
    const err = new Error("dup");
    err.code = 11000;
    err.keyPattern = { code: 1 };
    studentService.create.mockRejectedValue(err);
    const spy = jest.spyOn(studentService, "create");
    const req = mockReq({ body: { code: "DUP" } });
    const res = mockRes();
    await createStudent(req, res);
    expect(spy).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(409);
  });
});