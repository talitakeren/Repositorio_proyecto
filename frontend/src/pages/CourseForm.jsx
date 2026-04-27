import { useState } from "react";

export default function CourseForm() {
  const [form, setForm] = useState({ code: "", name: "", credits: "", classroomType: "" });
  const [saved, setSaved] = useState(false);

  function update(value) {
    setForm(prev => ({ ...prev, ...value }));
    setSaved(false);
  }

  async function save(e) {
    e.preventDefault();
    await fetch("http://localhost:5050/course", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, credits: Number(form.credits), prerequisites: [] }),
    });
    setSaved(true);
    setForm({ code: "", name: "", credits: "", classroomType: "" });
  }

  return (
    <>
      <div className="page-header">
        <h2>Nuevo Curso</h2>
        <p>Registra un nuevo curso en el sistema</p>
      </div>

      <div className="form-card">
        <form onSubmit={save}>
          <div className="form-group">
            <label>Código</label>
            <input
              placeholder="Ej: CS101"
              value={form.code}
              onChange={e => update({ code: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label>Nombre del curso</label>
            <input
              placeholder="Ej: Cálculo Diferencial"
              value={form.name}
              onChange={e => update({ name: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label>Créditos</label>
            <input
              type="number"
              placeholder="Ej: 4"
              value={form.credits}
              onChange={e => update({ credits: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label>Tipo de Aula</label>
            <input
              placeholder="Ej: Laboratorio, Teórica"
              value={form.classroomType}
              onChange={e => update({ classroomType: e.target.value })}
            />
          </div>

          <button type="submit">Guardar curso</button>

          {saved && (
            <div className="alert alert-success">
              ✓ Curso registrado exitosamente
            </div>
          )}
        </form>
      </div>
    </>
  );
}