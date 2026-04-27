const { generateSchedule } = require('../services/scheduler');

describe('Generador de Horarios', () => {

  const courses = [
    { name: 'Matemática' },
    { name: 'Comunicación' }
  ];

  const teachers = [
    { name: 'Juan' },
    { name: 'Ana' }
  ];

  const classrooms = [
    { code: 'A1' },
    { code: 'A2' }
  ];

  test('genera un horario', () => {
    const resultado = generateSchedule(courses, teachers, classrooms);
    expect(resultado).toBeDefined();
  });

  test('retorna un arreglo', () => {
    const resultado = generateSchedule(courses, teachers, classrooms);
    expect(Array.isArray(resultado)).toBe(true);
  });

  test('asigna todos los cursos', () => {
    const resultado = generateSchedule(courses, teachers, classrooms);
    expect(resultado.length).toBe(courses.length);
  });

  test('estructura correcta', () => {
    const resultado = generateSchedule(courses, teachers, classrooms);

    expect(resultado[0]).toHaveProperty('course');
    expect(resultado[0]).toHaveProperty('teacher');
    expect(resultado[0]).toHaveProperty('classroom');
    expect(resultado[0]).toHaveProperty('day');
    expect(resultado[0]).toHaveProperty('hour');
  });

  test('no falla con datos vacíos', () => {
    const resultado = generateSchedule([], [], []);
    expect(resultado).toEqual([]);
  });

});