describe('Cursos', () => {

  test('crear curso con datos válidos', () => {
    const curso = {
      nombre: 'Matemática',
      horas: 3
    };

    expect(curso.nombre).toBeDefined();
    expect(curso.horas).toBeGreaterThan(0);
  });

  test('no permitir curso sin nombre', () => {
    const curso = {
      horas: 3
    };

    expect(curso.nombre).toBeUndefined();
  });

});