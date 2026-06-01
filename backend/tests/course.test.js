/**
 * course.test.js
 * Validaciones del modelo de datos de Cursos
 *
 * Trazabilidad con Documento Especificación Técnica (PDF):
 *   TC-01: Registro de curso válido
 *   TC-02: Código duplicado → error
 *   TC-03: Campo vacío → error de validación
 *   TC-04: Prerrequisito inexistente → error
 */

// Función de validación que simula las reglas de negocio de RF-01
function validarCurso(curso, cursosExistentes = []) {
  const errores = [];

  // Campo nombre obligatorio
  if (!curso.nombre || curso.nombre.trim() === '') {
    errores.push('El nombre del curso es obligatorio');
  }

  // Campo codigo obligatorio y único
  if (!curso.codigo || curso.codigo.trim() === '') {
    errores.push('El código del curso es obligatorio');
  } else if (cursosExistentes.some(c => c.codigo === curso.codigo)) {
    errores.push('El código del curso ya existe');
  }

  // Créditos en rango 1-6
  if (curso.creditos === undefined || curso.creditos === null) {
    errores.push('Los créditos son obligatorios');
  } else if (curso.creditos < 1 || curso.creditos > 6) {
    errores.push('Los créditos deben estar entre 1 y 6');
  }

  // Tipo de aula válido
  const tiposValidos = ['estándar', 'laboratorio'];
  if (!curso.tipo_aula || !tiposValidos.includes(curso.tipo_aula)) {
    errores.push('El tipo de aula debe ser "estándar" o "laboratorio"');
  }

  // Prerrequisitos deben existir
  if (curso.prerrequisitos && curso.prerrequisitos.length > 0) {
    for (const pre of curso.prerrequisitos) {
      if (!cursosExistentes.some(c => c.codigo === pre)) {
        errores.push(`Prerrequisito inexistente: ${pre}`);
      }
    }
  }

  return { valido: errores.length === 0, errores };
}

describe('RF-01 — Registro de Cursos', () => {

  const cursosExistentes = [
    { codigo: 'MAT01', nombre: 'Cálculo I', creditos: 4, tipo_aula: 'estándar', prerrequisitos: [] },
  ];

  test('TC-01: registro de curso con datos completos y válidos', () => {
    const curso = {
      nombre:       'Álgebra Lineal',
      codigo:       'MAT02',
      creditos:     4,
      tipo_aula:    'estándar',
      prerrequisitos: [],
    };

    const resultado = validarCurso(curso, cursosExistentes);

    expect(resultado.valido).toBe(true);
    expect(resultado.errores).toHaveLength(0);
  });

  test('TC-02: código duplicado genera error', () => {
    const curso = {
      nombre:    'Otro Cálculo',
      codigo:    'MAT01',           // ← duplicado
      creditos:  3,
      tipo_aula: 'estándar',
      prerrequisitos: [],
    };

    const resultado = validarCurso(curso, cursosExistentes);

    expect(resultado.valido).toBe(false);
    expect(resultado.errores).toContain('El código del curso ya existe');
  });

  test('TC-03: campo nombre vacío genera error de validación', () => {
    const curso = {
      nombre:    '',               // ← vacío
      codigo:    'MAT03',
      creditos:  3,
      tipo_aula: 'estándar',
      prerrequisitos: [],
    };

    const resultado = validarCurso(curso, cursosExistentes);

    expect(resultado.valido).toBe(false);
    expect(resultado.errores).toContain('El nombre del curso es obligatorio');
  });

  test('TC-04: prerrequisito inexistente genera error', () => {
    const curso = {
      nombre:         'Cálculo III',
      codigo:         'MAT04',
      creditos:       4,
      tipo_aula:      'estándar',
      prerrequisitos: ['MAT99'],   // ← no existe
    };

    const resultado = validarCurso(curso, cursosExistentes);

    expect(resultado.valido).toBe(false);
    expect(resultado.errores.some(e => e.includes('MAT99'))).toBe(true);
  });

  test('TC-CURSO-CRED: créditos fuera de rango (0) generan error', () => {
    const curso = {
      nombre:    'Curso Inválido',
      codigo:    'INV01',
      creditos:  0,              // ← fuera de rango [1-6]
      tipo_aula: 'estándar',
      prerrequisitos: [],
    };

    const resultado = validarCurso(curso, []);
    expect(resultado.valido).toBe(false);
    expect(resultado.errores).toContain('Los créditos deben estar entre 1 y 6');
  });

  test('TC-CURSO-TIPO: tipo de aula inválido genera error', () => {
    const curso = {
      nombre:    'Curso X',
      codigo:    'CURX01',
      creditos:  3,
      tipo_aula: 'auditorio',   // ← no válido
      prerrequisitos: [],
    };

    const resultado = validarCurso(curso, []);
    expect(resultado.valido).toBe(false);
    expect(resultado.errores).toContain('El tipo de aula debe ser "estándar" o "laboratorio"');
  });

  test('TC-CURSO-PRE-OK: prerrequisitos existentes son aceptados', () => {
    const curso = {
      nombre:         'Cálculo II',
      codigo:         'MAT02B',
      creditos:       4,
      tipo_aula:      'estándar',
      prerrequisitos: ['MAT01'],   // ← existe en cursosExistentes
    };

    const resultado = validarCurso(curso, cursosExistentes);
    expect(resultado.valido).toBe(true);
  });

});