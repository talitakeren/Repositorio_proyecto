/**
 * Seed de usuarios + perfiles de Teacher y Student vinculados.
 * Ejecutar: npm run seed
 */
import "../config/env.js";
import connectDB from "../config/db.js";
import User from "../models/User.js";
import Teacher from "../models/Teacher.js";
import Student from "../models/Student.js";

const USERS = [
  {
    name: "Administrador SGOHA",
    email: "admin@sgoha.edu",
    password: "123456",
    role: "ADMIN",
  },
  {
    name: "Docente Demo",
    email: "docente@sgoha.edu",
    password: "123456",
    role: "TEACHER",
    teacherProfile: {
      fullName: "Docente Demo",
      specialty: "Programación y Base de Datos",
      availability: [],
      availableCourses: [],
    },
  },
  {
    name: "Alumno Demo",
    email: "alumno@sgoha.edu",
    password: "123456",
    role: "STUDENT",
    studentProfile: {
      code: "AL2026001",
      fullName: "Alumno Demo",
      program: "Ingeniería de Software",
      approvedCourses: [],
    },
  },
];

await connectDB();

for (const data of USERS) {
  const { teacherProfile, studentProfile, ...userData } = data;

  let user = await User.findOne({ email: userData.email });
  if (user) {
    user.name = userData.name;
    user.role = userData.role;
    user.active = true;
    user.password = userData.password;
    await user.save();
    console.log(`Usuario actualizado: ${user.email} (${user.role})`);
  } else {
    user = await User.create(userData);
    console.log(`Usuario creado: ${user.email} (${user.role})`);
  }

  if (teacherProfile) {
    const existing = await Teacher.findOne({
      $or: [{ user: user._id }, { email: user.email }],
    });
    if (existing) {
      existing.fullName = teacherProfile.fullName;
      existing.email = user.email;
      existing.specialty = teacherProfile.specialty;
      existing.user = user._id;
      existing.active = true;
      await existing.save();
      console.log(`  → Perfil docente vinculado: ${user.email}`);
    } else {
      await Teacher.create({ ...teacherProfile, email: user.email, user: user._id });
      console.log(`  → Perfil docente creado: ${user.email}`);
    }
  }

  if (studentProfile) {
    const existing = await Student.findOne({
      $or: [{ user: user._id }, { email: user.email }],
    });
    if (existing) {
      existing.fullName = studentProfile.fullName;
      existing.email = user.email;
      existing.program = studentProfile.program;
      existing.user = user._id;
      existing.active = true;
      if (!existing.code) existing.code = studentProfile.code;
      await existing.save();
      console.log(`  → Perfil de alumno vinculado: ${user.email}`);
    } else {
      await Student.create({
        ...studentProfile,
        email: user.email,
        user: user._id,
      });
      console.log(`  → Perfil de alumno creado: ${user.email}`);
    }
  }
}

console.log("\nCredenciales de prueba (contraseña: 123456):");
USERS.forEach((u) => console.log(`  - ${u.email} → ${u.role}`));

process.exit(0);
