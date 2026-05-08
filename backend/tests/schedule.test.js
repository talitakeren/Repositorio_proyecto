/**
 * schedule.test.js
 * Tests del algoritmo de generación de horarios (scheduler.js)
 *
 * Cada test corresponde a un caso verificable definido en:
 *   /docs/specs/schedule-generation.spec.md
 *
 * Formato de trazabilidad: "ID_CASO: descripción"
 * Restricciones implementadas: HC1, HC2, HC3 (duras) | SC1, SC2 (blandas)
 * Función objetivo: objectiveScore = 0.7*(asignados/total) + 0.3*(preferencias/asignados)
 */

import { generateSchedule } from '../services/scheduler.js';

// ─────────────────────────────────────────────────────────────────
// Utilidades de ayuda para verificar restricciones
// ─────────────────────────────────────────────────────────────────

/** HC1: verifica que ningún docente aparezca dos veces en el mismo día+bloque */
function hasTeacherConflict(schedule) {
  const seen = new Set();
  for (const s of schedule) {
    const key = `${s.teacher}|${s.day}|${s.block}`;
    if (seen.has(key)) return true;
    seen.add(key);
  }
  return false;
}

/** HC2: verifica que ningún aula aparezca dos veces en el mismo día+bloque */
function hasClassroomConflict(schedule) {
  const seen = new Set();
  for (const s of schedule) {
    const key = `${s.classroom}|${s.day}|${s.block}`;
    if (seen.has(key)) return true;
    seen.add(key);
  }
  return false;
}

/** Genera N docentes con availability en todos los bloques (para tests de escala) */
function makeTeachers(n) {
  const allBlocks = [
    'Lunes-8-10','Lunes-10-12','Lunes-14-16','Lunes-16-18',
    'Martes-8-10','Martes-10-12','Martes-14-16','Martes-16-18',
    'Miércoles-8-10','Miércoles-10-12','Miércoles-14-16','Miércoles-16-18',
    'Jueves-8-10','Jueves-10-12','Jueves-14-16','Jueves-16-18',
    'Viernes-8-10','Viernes-10-12','Viernes-14-16','Viernes-16-18',
  ];
  return Array.from({ length: n }, (_, i) => ({
    name: `Docente${i + 1}`,
    availability: [...allBlocks],
    preferences: [],
  }));
}

/** Genera N cursos */
function makeCourses(n) {
  return Array.from({ length: n }, (_, i) => ({
    name: `Curso${i + 1}`,
    code: `C${String(i + 1).padStart(2, '0')}`,
  }));
}

/** Genera N aulas */
function makeClassrooms(n) {
  return Array.from({ length: n }, (_, i) => ({
    code: `A${i + 1}`,
    capacity: 30,
  }));
}

// ─────────────────────────────────────────────────────────────────
// GRUPO 1 — Restricciones DURAS (Hard Constraints)
// ─────────────────────────────────────────────────────────────────

describe('Grupo 1 — Restricciones DURAS (HC1, HC2, HC3)', () => {

  test('TC-32: genera horario sin conflictos', () => {
    const courses    = makeCourses(3);
    const teachers   = makeTeachers(2);
    const classrooms = makeClassrooms(2);

    const result = generateSchedule(courses, teachers, classrooms);

    // Estructura correcta
    expect(result).toHaveProperty('schedule');
    expect(result).toHaveProperty('conflicts');
    expect(Array.isArray(result.schedule)).toBe(true);

    // Sin conflictos, todos asignados
    expect(result.conflicts).toBe(0);
    expect(result.schedule.length).toBe(3);
    expect(result.objectiveScore).toBeGreaterThanOrEqual(0.7);
  });

  test('TC-33: HC1 sin solapamiento de docente', () => {
    // 1 docente con muchos bloques → debe distribuirse sin solapamiento
    const courses = makeCourses(4);
    const teachers = [{
      name: 'ProfesorUnico',
      availability: [
        'Lunes-8-10','Lunes-10-12','Martes-8-10','Martes-10-12'
      ],
      preferences: [],
    }];
    const classrooms = makeClassrooms(4);

    const result = generateSchedule(courses, teachers, classrooms);

    // HC1: ningún docente en el mismo día+bloque dos veces
    expect(hasTeacherConflict(result.schedule)).toBe(false);
  });

  test('TC-34: HC2 sin solapamiento de aula', () => {
    // 1 sola aula con 2 docentes distintos → no puede compartirse en el mismo bloque
    const courses = makeCourses(2);
    const teachers = [
      { name: 'Docente1', availability: ['Lunes-8-10','Lunes-10-12'], preferences: [] },
      { name: 'Docente2', availability: ['Lunes-8-10','Lunes-10-12'], preferences: [] },
    ];
    const classrooms = [{ code: 'AulaUnica', capacity: 30 }];

    const result = generateSchedule(courses, teachers, classrooms);

    // HC2: ningún aula en el mismo día+bloque dos veces
    expect(hasClassroomConflict(result.schedule)).toBe(false);
  });

  test('TC-35: HC3 respeta availability del docente', () => {
    // Docente solo disponible en Lunes-8-10 → la asignación debe ser ese bloque
    const courses = [{ name: 'MatemáticaI', code: 'MAT01' }];
    const teachers = [{
      name: 'Profesor Limitado',
      availability: ['Lunes-8-10'],
      preferences: [],
    }];
    const classrooms = [{ code: 'B1', capacity: 30 }];

    const result = generateSchedule(courses, teachers, classrooms);

    expect(result.schedule.length).toBe(1);
    expect(result.schedule[0].day).toBe('Lunes');
    expect(result.schedule[0].block).toBe('8-10');
  });

  test('TC-36: HC3 docente sin availability produce conflicto', () => {
    // Docente sin ningún bloque disponible → no se puede asignar ningún curso
    const courses = [{ name: 'CálculoII', code: 'MAT02' }];
    const teachers = [{
      name: 'Sin Disponibilidad',
      availability: [],  // ← sin bloques
      preferences: [],
    }];
    const classrooms = [{ code: 'C1', capacity: 30 }];

    const result = generateSchedule(courses, teachers, classrooms);

    expect(result.schedule.length).toBe(0);
    expect(result.conflicts).toBe(1);
    expect(result.unassigned).toContain('CálculoII');
  });

  test('TC-37: sin solución completa devuelve conflictos parciales', () => {
    // 1 docente + 1 aula + 1 bloque → solo puede asignarse 1 de los 2 cursos
    const courses = makeCourses(2);
    const teachers = [{
      name: 'ProfesorUnico',
      availability: ['Lunes-8-10'],  // ← solo 1 bloque
      preferences: [],
    }];
    const classrooms = [{ code: 'D1', capacity: 30 }];

    const result = generateSchedule(courses, teachers, classrooms);

    expect(result.schedule.length).toBe(1);
    expect(result.conflicts).toBe(1);
    expect(result.unassigned.length).toBe(1);
    expect(result.objectiveScore).toBeLessThan(1.0);
  });

});

// ─────────────────────────────────────────────────────────────────
// GRUPO 2 — Restricciones BLANDAS (Soft Constraints)
// ─────────────────────────────────────────────────────────────────

describe('Grupo 2 — Restricciones BLANDAS (SC1, SC2)', () => {

  test('TC-SC1: SC1 registra preferencia cumplida', () => {
    const courses = [{ name: 'FísicaI', code: 'FIS01' }];
    const teachers = [{
      name: 'ProfesorPreferente',
      availability: ['Lunes-8-10', 'Martes-10-12'],
      preferences: ['Lunes-8-10'],  // ← prefiere lunes mañana
    }];
    const classrooms = [{ code: 'E1', capacity: 30 }];

    const result = generateSchedule(courses, teachers, classrooms);

    expect(result.schedule.length).toBe(1);
    expect(result.schedule[0].meetsPreference).toBe(true);
    expect(result.preferencesMet).toBe(1);
  });

  test('TC-SC2: SC2 distribuye cursos uniformemente entre días', () => {
    // 10 cursos, suficientes docentes y aulas → no debe acumularse todo en un día
    const courses    = makeCourses(10);
    const teachers   = makeTeachers(5);
    const classrooms = makeClassrooms(5);

    const result = generateSchedule(courses, teachers, classrooms);

    // Contar cuántos cursos hay por día
    const perDay = {};
    for (const s of result.schedule) {
      perDay[s.day] = (perDay[s.day] || 0) + 1;
    }

    // Ningún día debe concentrar más del 50% (5 de 10)
    const maxInOneDay = Math.max(...Object.values(perDay));
    expect(maxInOneDay).toBeLessThanOrEqual(5);
  });

});

// ─────────────────────────────────────────────────────────────────
// GRUPO 3 — Función Objetivo
// ─────────────────────────────────────────────────────────────────

describe('Grupo 3 — Función Objetivo (objectiveScore)', () => {

  test('TC-FO1: objectiveScore en rango válido [0, 1]', () => {
    const result = generateSchedule(makeCourses(3), makeTeachers(2), makeClassrooms(2));

    expect(result.objectiveScore).toBeGreaterThanOrEqual(0);
    expect(result.objectiveScore).toBeLessThanOrEqual(1);
  });

  test('TC-FO2: objectiveScore es 1.0 en caso óptimo (sin conflictos + preferencias cumplidas)', () => {
    // 1 curso, 1 docente con availability Y preference en el mismo bloque
    const courses = [{ name: 'QuímicaI', code: 'QUI01' }];
    const teachers = [{
      name: 'ProfesorOptimo',
      availability: ['Lunes-8-10'],
      preferences: ['Lunes-8-10'],
    }];
    const classrooms = [{ code: 'F1', capacity: 30 }];

    const result = generateSchedule(courses, teachers, classrooms);

    expect(result.conflicts).toBe(0);
    expect(result.preferencesMet).toBe(1);
    expect(result.objectiveScore).toBe(1.0);
  });

  test('TC-FO3: objectiveScore baja cuando hay conflictos', () => {
    // 2 cursos, pero solo 1 bloque posible → 1 conflicto
    const courses = makeCourses(2);
    const teachers = [{
      name: 'ProfesorLimitado',
      availability: ['Lunes-8-10'],
      preferences: [],
    }];
    const classrooms = [{ code: 'G1', capacity: 30 }];

    const result = generateSchedule(courses, teachers, classrooms);

    expect(result.conflicts).toBe(1);
    expect(result.objectiveScore).toBeLessThan(1.0);
    // 0.7 * (1/2) + 0.3 * (0/1) = 0.35
    expect(result.objectiveScore).toBeCloseTo(0.35, 1);
  });

});

// ─────────────────────────────────────────────────────────────────
// GRUPO 4 — Rendimiento y escala (RNF: ≤ 10 segundos)
// ─────────────────────────────────────────────────────────────────

describe('Grupo 4 — Rendimiento (RF-07 escenario máximo)', () => {

  test('TC-36-PERF: escenario máximo (30 cursos, 15 docentes, 10 aulas) ≤ 10s', () => {
    const courses    = makeCourses(30);
    const teachers   = makeTeachers(15);
    const classrooms = makeClassrooms(10);

    const inicio = Date.now();
    const result = generateSchedule(courses, teachers, classrooms);
    const duracion = Date.now() - inicio;

    expect(duracion).toBeLessThanOrEqual(10000);  // ≤ 10 segundos
    expect(result.schedule.length).toBeGreaterThan(0);
  }, 15000); // timeout Jest: 15s para dar margen

});

// ─────────────────────────────────────────────────────────────────
// GRUPO 5 — Casos borde y estructura de salida
// ─────────────────────────────────────────────────────────────────

describe('Grupo 5 — Casos borde y estructura de salida', () => {

  test('TC-EDGE1: entradas vacías devuelven estructura válida sin excepciones', () => {
    const result = generateSchedule([], [], []);

    expect(result).toBeDefined();
    expect(result.schedule).toEqual([]);
    expect(result.conflicts).toBe(0);
    expect(result.objectiveScore).toBe(0);
  });

  test('TC-EDGE2: cada asignación tiene los campos obligatorios del contrato', () => {
    const result = generateSchedule(makeCourses(2), makeTeachers(1), makeClassrooms(1));

    for (const asignacion of result.schedule) {
      expect(asignacion).toHaveProperty('course');
      expect(asignacion).toHaveProperty('teacher');
      expect(asignacion).toHaveProperty('classroom');
      expect(asignacion).toHaveProperty('day');
      expect(asignacion).toHaveProperty('block');
      expect(asignacion).toHaveProperty('meetsPreference');
    }
  });

  test('TC-EDGE3: metrics contiene todos los campos del contrato', () => {
    const result = generateSchedule(makeCourses(1), makeTeachers(1), makeClassrooms(1));

    expect(result).toHaveProperty('totalAssigned');
    expect(result).toHaveProperty('conflicts');
    expect(result).toHaveProperty('unassigned');
    expect(result).toHaveProperty('preferencesMet');
    expect(result).toHaveProperty('objectiveScore');
  });

});