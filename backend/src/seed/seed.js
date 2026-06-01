import "../config/env.js";
import connectDB from "../config/db.js";
import User from "../models/User.js";
import Course from "../models/Course.js";
import Teacher from "../models/Teacher.js";
import Classroom from "../models/Classroom.js";
import Student from "../models/Student.js";
import TimeSlot from "../models/TimeSlot.js";
import {
  TIME_BLOCKS,
  DAYS,
  DAY_KEYS,
  buildAllTimeSlots,
} from "../constants/timeBlocks.js";

await connectDB();

await Promise.all([
  User.deleteMany({}),
  Course.deleteMany({}),
  Teacher.deleteMany({}),
  Classroom.deleteMany({}),
  Student.deleteMany({}),
  TimeSlot.deleteMany({}),
]);

const admin = await User.create({
  name: "Administrador SGOHA",
  email: "admin@sgoha.local",
  password: "admin123",
  role: "ADMIN",
});

const c1 = await Course.create({
  code: "CS101",
  name: "Introducción a la Programación",
  credits: 4,
  classroomTypeRequired: "COMPUTER_ROOM",
  prerequisites: [],
});

const c2 = await Course.create({
  code: "MA201",
  name: "Cálculo Diferencial",
  credits: 5,
  classroomTypeRequired: "STANDARD",
  prerequisites: [],
});

// Disponibilidad demo: lunes a viernes en TODOS los bloques HORALV.
const weekdayKeys = DAY_KEYS.filter(
  (key) => key !== "SATURDAY" && key !== "SUNDAY"
);

await Teacher.create({
  fullName: "Ana García",
  email: "ana.garcia@sgoha.local",
  specialty: "Informática",
  availableCourses: [c1._id],
  availability: weekdayKeys.flatMap((day) =>
    TIME_BLOCKS.map(({ startTime, endTime }) => ({ day, startTime, endTime }))
  ),
});

await Classroom.create([
  { code: "A-101", type: "STANDARD", capacity: 40, location: "Bloque A" },
  { code: "LAB-1", type: "COMPUTER_ROOM", capacity: 30, location: "Bloque B" },
]);

await Student.create({
  code: "EST001",
  fullName: "Juan Pérez",
  email: "juan.perez@sgoha.local",
  program: "Ingeniería de Sistemas",
  approvedCourses: [c2._id],
});

// Genera las 126 franjas oficiales HORALV (7 días × 18 bloques).
const allSlots = buildAllTimeSlots().map((s) => ({ ...s, active: true }));
await TimeSlot.insertMany(allSlots, { ordered: false });

console.log("Seed completado.");
console.log(`Franjas HORALV generadas: ${allSlots.length}`);
console.log(`Días: ${DAYS.length} · Bloques: ${TIME_BLOCKS.length}`);
console.log("Login:", admin.email, "/ admin123");
process.exit(0);
