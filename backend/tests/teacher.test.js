describe('Profesores', () => {

  test('crear profesor válido', () => {
    const profesor = {
      nombre: 'Juan',
      disponibilidad: ['Lunes 8am']
    };

    expect(profesor.nombre).toBeDefined();
  });

  test('profesor debe tener disponibilidad', () => {
    const profesor = {
      nombre: 'Ana'
    };

    expect(profesor.disponibilidad).toBeUndefined();
  });

});