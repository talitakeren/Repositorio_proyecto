/**
 * teacher.test.js
 * Validaciones del modelo de datos de Docentes
 *
 * Trazabilidad con Documento Especificación Técnica (PDF):
 *   TC-05: Registro de docente válido
 *   TC-06: Correo duplicado → error
 *   TC-07: Correo con formato inválido → error
 *   TC-08: Disponibilidad con formato incorrecto → error
 *   TC-09: Horario solapado en availability → error
 */

// Bloques válidos del dominio (definidos en el modelo de timetabling)
const BLOQUES_VALIDOS = [
  'Lunes-8-10','Lunes-10-12','Lunes-14-16','Lunes-16-18',
  'Martes-8-10','Martes-10-12','Martes-14-16','Martes-16-18',
  'Miércoles-8-10','Miércoles-10-12','Miércoles-14-16','Miércoles-16-18',
  'Jueves-8-10','Jueves-10-12','Jueves-14-16','Jueves-16-18',
  'Viernes-8-10','Viernes-10-12','Viernes-14-16','Viernes-16-18',
];

// Función de validación que simula las reglas de negocio de RF-02
function validarDocente(docente, docentesExistentes = []) {
  const errores = [];

  // Nombre obligatorio
  if (!docente.nombre || docente.nombre.trim() === '') {
    errores.push('El nombre del docente es obligatorio');
  }

  // Correo obligatorio y con formato válido
  if (!docente.correo || docente.correo.trim() === '') {
    errores.push('El correo es obligatorio');
  } else {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(docente.correo)) {
      errores.push('El correo no tiene un formato válido');
    } else if (docentesExistentes.some(d => d.correo === docente.correo)) {
      errores.push('El correo ya está registrado');
    }
  }

  // Availability debe estar definida
  if (!docente.availability || !Array.isArray(docente.availability)) {
    errores.push('La disponibilidad debe ser un arreglo');
  } else {
    // Cada bloque debe pertenecer al dominio válido
    for (const bloque of docente.availability) {
      if (!BLOQUES_VALIDOS.includes(bloque)) {
        errores.push(`Bloque de disponibilidad inválido: "${bloque}"`);
      }
    }

    // No debe haber duplicados (solapamiento)
    const unicos = new Set(docente.availability);
    if (unicos.size !== docente.availability.length) {
      errores.push('La disponibilidad contiene bloques duplicados (solapamiento)');
    }
  }

  // Preferences deben ser subconjunto de availability (si se proveen)
  if (docente.preferences && docente.preferences.length > 0) {
    for (const pref of docente.preferences) {
      if (!docente.availability.includes(pref)) {
        errores.push(`La preferencia "${pref}" no está en la disponibilidad del docente`);
      }
    }
  }

  return { valido: errores.length === 0, errores };
}

describe('RF-02 — Registro de Docentes', () => {

  const docentesExistentes = [
    { nombre: 'Ana Torres', correo: 'ana.torres@uni.edu', availability: ['Lunes-8-10'], preferences: [] },
  ];

  test('TC-05: registro de docente con datos completos y válidos', () => {
    const docente = {
      nombre:       'Juan Pérez',
      correo:       'juan.perez@uni.edu',
      availability: ['Lunes-8-10', 'Martes-10-12'],
      preferences:  ['Lunes-8-10'],
    };

    const resultado = validarDocente(docente, docentesExistentes);

    expect(resultado.valido).toBe(true);
    expect(resultado.errores).toHaveLength(0);
  });

  test('TC-06: correo duplicado genera error', () => {
    const docente = {
      nombre:       'Otro Docente',
      correo:       'ana.torres@uni.edu',  // ← ya existe
      availability: ['Martes-8-10'],
      preferences:  [],
    };

    const resultado = validarDocente(docente, docentesExistentes);

    expect(resultado.valido).toBe(false);
    expect(resultado.errores).toContain('El correo ya está registrado');
  });

  test('TC-07: correo con formato inválido genera error', () => {
    const docente = {
      nombre:       'María López',
      correo:       'correo-sin-arroba',  // ← formato inválido
      availability: ['Lunes-10-12'],
      preferences:  [],
    };

    const resultado = validarDocente(docente, docentesExistentes);

    expect(resultado.valido).toBe(false);
    expect(resultado.errores).toContain('El correo no tiene un formato válido');
  });

  test('TC-08: bloque de disponibilidad con formato incorrecto genera error', () => {
    const docente = {
      nombre:       'Carlos Ruiz',
      correo:       'carlos.ruiz@uni.edu',
      availability: ['lunes 8am'],   // ← formato incorrecto (no pertenece al dominio)
      preferences:  [],
    };

    const resultado = validarDocente(docente, docentesExistentes);

    expect(resultado.valido).toBe(false);
    expect(resultado.errores.some(e => e.includes('lunes 8am'))).toBe(true);
  });

  test('TC-09: disponibilidad con bloques duplicados genera error de solapamiento', () => {
    const docente = {
      nombre:       'Luis García',
      correo:       'luis.garcia@uni.edu',
      availability: ['Lunes-8-10', 'Lunes-8-10'],  // ← duplicado = solapamiento
      preferences:  [],
    };

    const resultado = validarDocente(docente, docentesExistentes);

    expect(resultado.valido).toBe(false);
    expect(resultado.errores).toContain('La disponibilidad contiene bloques duplicados (solapamiento)');
  });

  test('TC-DOC-PREF: preferences fuera de availability genera error', () => {
    // SC1: las preferencias deben ser subconjunto de availability (restricción blanda)
    const docente = {
      nombre:       'Rosa Díaz',
      correo:       'rosa.diaz@uni.edu',
      availability: ['Lunes-8-10'],
      preferences:  ['Miércoles-14-16'],  // ← no está en availability
    };

    const resultado = validarDocente(docente, docentesExistentes);

    expect(resultado.valido).toBe(false);
    expect(resultado.errores.some(e => e.includes('Miércoles-14-16'))).toBe(true);
  });

  test('TC-DOC-AVAIL-VACIA: docente con availability vacía es válido estructuralmente', () => {
    // Tener availability vacía es válido en el modelo; solo produce conflictos al generar horario
    const docente = {
      nombre:       'Pedro Sin Horas',
      correo:       'pedro@uni.edu',
      availability: [],
      preferences:  [],
    };

    const resultado = validarDocente(docente, docentesExistentes);
    expect(resultado.valido).toBe(true);
  });

});