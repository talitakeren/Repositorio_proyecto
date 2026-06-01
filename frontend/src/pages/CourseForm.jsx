import { useState } from "react";
import { apiUrl } from "../config/api";

export default function CourseForm() {
  const [form, setForm] = useState({
    code: "",
    name: "",
    credits: "",
    classroomType: ""
  });

  const [saved, setSaved] = useState(false);
  const [errors, setErrors] = useState({});

  function update(value) {
    setForm(prev => ({ ...prev, ...value }));
    setSaved(false);
  }

  function validate() {
    const newErrors = {};

    // Código: obligatorio, formato tipo CS101
    if (!form.code.trim()) {
      newErrors.code = "El código es obligatorio";
    } else if (!/^[A-Za-z]{2,5}\d{3}$/.test(form.code)) {
      newErrors.code = "Formato inválido (Ej: CS101)";
    }

    // Nombre: obligatorio y mínimo 3 caracteres
    if (!form.name.trim()) {
      newErrors.name = "El nombre es obligatorio";
    } else if (form.name.trim().length < 3) {
      newErrors.name = "Debe tener al menos 3 caracteres";
    }

    // Créditos: obligatorio, número entre 1 y 10
    const credits = Number(form.credits);
    if (!form.credits) {
      newErrors.credits = "Los créditos son obligatorios";
    } else if (isNaN(credits) || credits < 1 || credits > 10) {
      newErrors.credits = "Debe ser un número entre 1 y 10";
    }

    // Tipo de aula: opcional pero si se llena mínimo 3 caracteres
    if (form.classroomType && form.classroomType.trim().length < 3) {
      newErrors.classroomType = "Debe tener al menos 3 caracteres";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function save(e) {
    e.preventDefault();

    if (!validate()) return;

    const res = await fetch(apiUrl("/course"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        credits: Number(form.credits),
        prerequisites: []
      }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      setErrors({
        submit: err.detail || err.message || "No se pudo guardar el curso",
      });
      return;
    }

    setSaved(true);
    setForm({ code: "", name: "", credits: "", classroomType: "" });
    setErrors({});
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
            {errors.code && <small style={{ color: "red" }}>{errors.code}</small>}
          </div>

          <div className="form-group">
            <label>Nombre del curso</label>
            <input
              placeholder="Ej: Cálculo Diferencial"
              value={form.name}
              onChange={e => update({ name: e.target.value })}
              required
            />
            {errors.name && <small style={{ color: "red" }}>{errors.name}</small>}
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
            {errors.credits && <small style={{ color: "red" }}>{errors.credits}</small>}
          </div>

          <div className="form-group">
            <label>Tipo de Aula</label>
            <input
              placeholder="Ej: Laboratorio, Teórica"
              value={form.classroomType}
              onChange={e => update({ classroomType: e.target.value })}
            />
            {errors.classroomType && (
              <small style={{ color: "red" }}>{errors.classroomType}</small>
            )}
          </div>

          <button type="submit">Guardar curso</button>

          {errors.submit && (
            <div className="alert alert-error" style={{ marginTop: "1rem" }}>
              {errors.submit}
            </div>
          )}

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