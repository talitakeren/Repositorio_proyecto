import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

const DAYS   = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"];
const BLOCKS = ["8-10", "10-12", "14-16", "16-18"];

export default function TeacherForm() {

  const { id } = useParams();
  const isEdit = Boolean(id);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [availability, setAvailability] = useState([]);
  const [preferences, setPreferences] = useState([]);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState(null);

  // 🔥 CARGAR DATOS SI ES EDICIÓN
  useEffect(() => {
    if (isEdit) {
      fetch("http://localhost:5050/teacher")
        .then(res => res.json())
        .then(data => {
          const teacher = data.find(t => t._id === id);
          if (teacher) {
            setName(teacher.name);
            setEmail(teacher.email);
            setAvailability(teacher.availability || []);
            setPreferences(teacher.preferences || []);
          }
        });
    }
  }, [id]);

  // 🔥 NUEVO: Función para validar que solo se ingresen letras en el nombre
  const handleNameChange = (e) => {
    const value = e.target.value;
    // La expresión regular permite letras (mayúsculas, minúsculas), tildes, la 'ñ' y espacios.
    if (/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]*$/.test(value)) {
      setName(value);
    }
  };

  // 🔥 TOGGLE DISPONIBILIDAD
  function toggleAvailability(slot) {
    setAvailability(prev => {
      const next = prev.includes(slot)
        ? prev.filter(s => s !== slot)
        : [...prev, slot];

      // SC1: preferencias siempre dentro de disponibilidad
      setPreferences(p => p.filter(s => next.includes(s)));

      return next;
    });

    setSaved(false);
  }

  // 🔥 TOGGLE PREFERENCIA (solo si está disponible)
  function togglePreference(slot) {
    if (!availability.includes(slot)) return;

    setPreferences(prev =>
      prev.includes(slot)
        ? prev.filter(s => s !== slot)
        : [...prev, slot]
    );

    setSaved(false);
  }

  // 🔥 CREATE + UPDATE
  async function save(e) {
    e.preventDefault();
    setError(null);
    setSaved(false); // Reiniciar el estado de guardado al intentar de nuevo

    if (availability.length === 0) {
      setError("Debe seleccionar al menos un bloque de disponibilidad.");
      return;
    }

    try {
      // 🔥 NUEVO: Verificar si el correo ya existe antes de guardar
      const checkRes = await fetch("http://localhost:5050/teacher");
      const allTeachers = await checkRes.json();
      
      const emailInUse = allTeachers.some(t => 
        t.email.toLowerCase() === email.toLowerCase() && t._id !== id
      );

      if (emailInUse) {
        setError("Este correo electrónico ya se encuentra registrado en otro docente.");
        return; // Detenemos la ejecución aquí, no se guarda.
      }

      // Si pasa la validación, procedemos a guardar
      const url = isEdit
        ? `http://localhost:5050/teacher/${id}`
        : "http://localhost:5050/teacher";

      const method = isEdit ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(), // Limpiamos espacios extra al final/inicio
          email: email.trim(),
          availability,
          preferences
        }),
      });

      if (!res.ok) throw new Error();

      setSaved(true);

      // Limpiar el formulario solo si es creación nueva
      if (!isEdit) {
        setName("");
        setEmail("");
        setAvailability([]);
        setPreferences([]);
      }

    } catch {
      setError("Error al comunicarse con el servidor. Inténtalo de nuevo.");
    }
  }

  return (
    <>
      <div className="page-header" style={{ marginBottom: "20px" }}>
        <h2 style={{ color: "#f8fafc" }}>{isEdit ? "Editar Docente" : "Nuevo Docente"}</h2>
        <p style={{ color: "#94a3b8" }}>Registra un docente con su disponibilidad horaria y preferencias</p>
      </div>

      <div className="form-card" style={{ maxWidth: 680, background: "rgba(255, 255, 255, 0.03)", padding: "24px", borderRadius: "12px", border: "1px solid rgba(255, 255, 255, 0.08)" }}>
        <form onSubmit={save}>

          {/* ───────── NOMBRE ───────── */}
          <div className="form-group" style={{ marginBottom: "16px" }}>
            <label style={{ color: "#cbd5e1", marginBottom: "8px", display: "block", fontSize: "0.9rem" }}>Nombre completo</label>
            <input
              placeholder="Ej: María López"
              value={name}
              onChange={handleNameChange} // 🔥 NUEVO: Usamos nuestra función validadora
              required
              style={{
                width: "100%", padding: "10px 14px", borderRadius: "8px",
                border: "1px solid rgba(255, 255, 255, 0.1)", background: "rgba(255, 255, 255, 0.05)",
                color: "#f8fafc", boxSizing: "border-box"
              }}
            />
          </div>

          {/* ───────── EMAIL ───────── */}
          <div className="form-group" style={{ marginBottom: "16px" }}>
            <label style={{ color: "#cbd5e1", marginBottom: "8px", display: "block", fontSize: "0.9rem" }}>Correo electrónico</label>
            <input
              type="email"
              placeholder="Ej: docente@uni.edu"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              style={{
                width: "100%", padding: "10px 14px", borderRadius: "8px",
                border: "1px solid rgba(255, 255, 255, 0.1)", background: "rgba(255, 255, 255, 0.05)",
                color: "#f8fafc", boxSizing: "border-box"
              }}
            />
          </div>

          {/* ───────── DISPONIBILIDAD ───────── */}
          <div className="form-group" style={{ marginTop: 24 }}>
            <label style={{ color: "#cbd5e1", marginBottom: 6, display: "block", fontSize: "0.9rem" }}>
              Disponibilidad horaria
              <span style={{ color: "#ff4f6a", marginLeft: 4 }}>*</span>
            </label>

            <p style={{
              fontSize: "0.8rem",
              color: "#94a3b8",
              marginBottom: 16
            }}>
              Marca disponibilidad (HC3) y luego preferencias (SC1)
            </p>

            {/* HEADER BLOQUES */}
            <div style={{
              display: "grid",
              gridTemplateColumns: "90px repeat(4, 1fr)",
              gap: 6,
              marginBottom: 8,
            }}>
              <div />
              {BLOCKS.map(b => (
                <div key={b} style={{
                  fontSize: "0.75rem",
                  textAlign: "center",
                  color: "#94a3b8",
                  fontWeight: 600,
                  background: "rgba(255,255,255,0.05)",
                  padding: "4px",
                  borderRadius: "4px"
                }}>
                  {b}
                </div>
              ))}
            </div>

            {/* GRID */}
            {DAYS.map(day => (
              <div
                key={day}
                style={{
                  display: "grid",
                  gridTemplateColumns: "90px repeat(4, 1fr)",
                  gap: 6,
                  marginBottom: 6,
                }}
              >
                <div style={{
                  fontSize: "0.8rem",
                  fontWeight: 600,
                  color: "#cbd5e1",
                  display: "flex",
                  alignItems: "center",
                }}>
                  {day}
                </div>

                {BLOCKS.map(block => {
                  const slot = `${day}-${block}`;
                  const isAvail = availability.includes(slot);
                  const isPref = preferences.includes(slot);

                  return (
                    <div key={slot} style={{ display: "flex", flexDirection: "column", gap: 3 }}>

                      {/* DISPONIBILIDAD */}
                      <button
                        type="button"
                        onClick={() => toggleAvailability(slot)}
                        style={{
                          padding: "8px 4px",
                          fontSize: "0.75rem",
                          borderRadius: 6,
                          border: `1px solid ${isAvail ? "rgba(129, 140, 248, 0.5)" : "rgba(255,255,255,0.1)"}`,
                          background: isAvail
                            ? "rgba(99, 102, 241, 0.15)"
                            : "rgba(255,255,255,0.02)",
                          color: isAvail ? "#818cf8" : "#64748b",
                          cursor: "pointer",
                          transition: "all 0.2s"
                        }}
                      >
                        {isAvail ? "✓ Disponible" : "—"}
                      </button>

                      {/* PREFERENCIA */}
                      {isAvail && (
                        <button
                          type="button"
                          onClick={() => togglePreference(slot)}
                          style={{
                            padding: "4px",
                            fontSize: "0.7rem",
                            borderRadius: 5,
                            border: `1px solid ${isPref ? "rgba(52, 211, 153, 0.5)" : "rgba(255,255,255,0.1)"}`,
                            background: isPref
                              ? "rgba(52, 211, 153, 0.15)"
                              : "transparent",
                            color: isPref ? "#34d399" : "#64748b",
                            cursor: "pointer",
                            transition: "all 0.2s"
                          }}
                        >
                          {isPref ? "⭐ Preferido" : "☆ Preferir"}
                        </button>
                      )}

                    </div>
                  );
                })}
              </div>
            ))}

            {/* RESUMEN */}
            <div style={{
              marginTop: 16,
              padding: "12px 16px",
              background: "rgba(255,255,255,0.05)",
              borderRadius: "8px",
              fontSize: "0.85rem",
              color: "#cbd5e1",
              display: "flex",
              gap: 24,
            }}>
              <span>
                <strong style={{ color: "#818cf8" }}>
                  {availability.length}
                </strong>{" "}
                disponibles
              </span>

              <span>
                <strong style={{ color: "#34d399" }}>
                  {preferences.length}
                </strong>{" "}
                preferidos
              </span>
            </div>
          </div>

          {/* ───────── ERROR ───────── */}
          {error && (
            <div style={{
              marginTop: 16,
              padding: "12px 16px",
              background: "rgba(255,79,106,0.1)",
              border: "1px solid rgba(255,79,106,0.3)",
              borderRadius: "8px",
              color: "#ff4f6a",
              fontSize: "0.85rem",
              fontWeight: 500
            }}>
              ⚠️ {error}
            </div>
          )}

          {/* ───────── BOTÓN ───────── */}
          <button type="submit" style={{ 
            marginTop: 24, 
            padding: "12px 24px", 
            background: "#6366f1", 
            color: "#fff", 
            border: "none", 
            borderRadius: "8px", 
            cursor: "pointer", 
            fontWeight: 600,
            fontSize: "0.95rem"
          }}>
            {isEdit ? "Actualizar docente" : "Guardar docente"}
          </button>

          {/* ───────── SUCCESS ───────── */}
          {saved && (
            <div style={{ 
              marginTop: 16, 
              padding: "12px 16px", 
              background: "rgba(52, 211, 153, 0.1)", 
              border: "1px solid rgba(52, 211, 153, 0.3)",
              color: "#34d399", 
              borderRadius: "8px",
              fontSize: "0.85rem",
              fontWeight: 500
            }}>
              ✓ Docente {isEdit ? "actualizado" : "registrado"} correctamente
            </div>
          )}

        </form>
      </div>
    </>
  );
}