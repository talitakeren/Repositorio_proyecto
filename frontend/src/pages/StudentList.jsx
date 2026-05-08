import { useEffect, useState, useMemo } from "react";

export default function StudentList() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Estados del filtro
  const [searchQuery, setSearchQuery] = useState("");

  // Estados del formulario
  const [editingId, setEditingId] = useState(null);
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  
  // Estados de feedback
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const fetchStudents = () => {
    setLoading(true);
    fetch("http://localhost:5050/student")
      .then(res => res.json())
      .then(d => { setData(d); setLoading(false); })
      .catch(() => { setError("Error al cargar los estudiantes"); setLoading(false); });
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // --- VALIDACIONES EN TIEMPO REAL ---
  const handleNameChange = (e) => {
    const value = e.target.value;
    // Solo permite letras, tildes, ñ y espacios
    if (/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]*$/.test(value)) {
      setName(value);
    }
  };

  // --- LÓGICA DE FILTRADO ---
  const filteredData = useMemo(() => {
    return data.filter(student => 
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      student.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (student.email && student.email.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [data, searchQuery]);

  // --- LÓGICA CRUD ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // Validación de duplicados en el frontend para respuesta rápida
    const isDuplicate = data.some(s => 
      (s.code.toLowerCase() === code.toLowerCase() || 
      (s.email && s.email.toLowerCase() === email.toLowerCase())) && 
      s._id !== editingId
    );

    if (isDuplicate) {
      setError("El código o el correo electrónico ya están registrados en otro estudiante.");
      return;
    }

    const payload = { code: code.toUpperCase(), name: name.trim(), email: email.trim() };
    const url = editingId ? `http://localhost:5050/student/${editingId}` : "http://localhost:5050/student";
    const method = editingId ? "PATCH" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Error al procesar la solicitud");
      }

      setSuccess(editingId ? "Estudiante actualizado correctamente" : "Estudiante matriculado correctamente");
      resetForm();
      fetchStudents();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = (student) => {
    setEditingId(student._id);
    setCode(student.code);
    setName(student.name);
    setEmail(student.email || "");
    setError(null);
    setSuccess(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id, studentName) => {
    if (!window.confirm(`¿Seguro que deseas dar de baja al estudiante ${studentName}?`)) return;
    try {
      const res = await fetch(`http://localhost:5050/student/${id}`, { method: "DELETE" });
      if (res.ok) {
        setData(prev => prev.filter(s => s._id !== id));
        if (editingId === id) resetForm();
      }
    } catch (err) {
      alert("Error al eliminar el estudiante.");
    }
  };

  const resetForm = () => {
    setEditingId(null); setCode(""); setName(""); setEmail("");
  };

  // --- ESTILOS REUTILIZABLES ---
  const inputStyle = {
    width: "100%", padding: "10px 14px", borderRadius: "8px",
    border: "1px solid rgba(255, 255, 255, 0.1)", background: "rgba(255, 255, 255, 0.05)",
    color: "#f8fafc", outline: "none", boxSizing: "border-box", fontSize: "0.9rem"
  };

  return (
    <>
      <div className="page-header" style={{ marginBottom: "20px" }}>
        <h2 style={{ color: "#f8fafc" }}>Estudiantes</h2>
        <p style={{ color: "#94a3b8" }}>Gestión de matrículas y listado de alumnos</p>
      </div>

      {/* --- FORMULARIO (Agregar / Editar) --- */}
      <div style={{ 
        background: "rgba(255, 255, 255, 0.03)", padding: "24px", borderRadius: "12px", 
        border: "1px solid rgba(255, 255, 255, 0.08)", marginBottom: "30px", maxWidth: "800px" 
      }}>
        <h3 style={{ marginTop: 0, color: "#cbd5e1", fontSize: "1.1rem", marginBottom: "16px" }}>
          {editingId ? "✏️ Editar Estudiante" : "🎓 Matricular Estudiante"}
        </h3>
        
        <form onSubmit={handleSubmit} style={{ display: "flex", flexWrap: "wrap", gap: "16px", alignItems: "flex-end" }}>
          <div style={{ flex: "1 1 120px" }}>
            <label style={{ color: "#94a3b8", display: "block", marginBottom: "6px", fontSize: "0.85rem" }}>Código</label>
            <input type="text" placeholder="Ej: 20230154" value={code} onChange={e => setCode(e.target.value)} required style={inputStyle} />
          </div>

          <div style={{ flex: "2 1 200px" }}>
            <label style={{ color: "#94a3b8", display: "block", marginBottom: "6px", fontSize: "0.85rem" }}>Nombre Completo</label>
            <input type="text" placeholder="Ej: Carlos Mendoza" value={name} onChange={handleNameChange} required style={inputStyle} />
          </div>

          <div style={{ flex: "2 1 200px" }}>
            <label style={{ color: "#94a3b8", display: "block", marginBottom: "6px", fontSize: "0.85rem" }}>Correo Electrónico</label>
            <input type="email" placeholder="Ej: cmendoza@uni.edu" value={email} onChange={e => setEmail(e.target.value)} required style={inputStyle} />
          </div>

          <div style={{ display: "flex", gap: "8px", width: "100%", marginTop: "8px" }}>
            <button type="submit" style={{ padding: "10px 24px", background: "#6366f1", color: "#fff", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: 600 }}>
              {editingId ? "Guardar Cambios" : "Registrar"}
            </button>
            {editingId && (
              <button type="button" onClick={resetForm} style={{ padding: "10px 16px", background: "rgba(255,255,255,0.1)", color: "#cbd5e1", border: "none", borderRadius: "8px", cursor: "pointer" }}>
                Cancelar
              </button>
            )}
          </div>
        </form>

        {error && <div style={{ marginTop: 16, padding: "10px", background: "rgba(255,79,106,0.1)", border: "1px solid rgba(255,79,106,0.3)", color: "#ff4f6a", borderRadius: "8px", fontSize: "0.85rem" }}>⚠️ {error}</div>}
        {success && <div style={{ marginTop: 16, padding: "10px", background: "rgba(52, 211, 153, 0.1)", border: "1px solid rgba(52, 211, 153, 0.3)", color: "#34d399", borderRadius: "8px", fontSize: "0.85rem" }}>✓ {success}</div>}
      </div>

      {/* --- BUSCADOR --- */}
      <div style={{ marginBottom: "20px", position: "relative", maxWidth: "400px" }}>
        <span style={{ position: "absolute", left: "14px", top: "10px", fontSize: "1rem" }}>🔍</span>
        <input 
          type="text" 
          placeholder="Buscar por nombre, código o correo..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{...inputStyle, paddingLeft: "40px"}}
        />
      </div>

      {/* --- LISTA DE ESTUDIANTES --- */}
      {loading ? (
        <div style={{ color: "#94a3b8", textAlign: "center", padding: "40px" }}>Cargando estudiantes…</div>
      ) : data.length === 0 ? (
        <div style={{ color: "#94a3b8", textAlign: "center", padding: "40px", background: "rgba(255,255,255,0.02)", borderRadius: "12px" }}>
          No hay estudiantes registrados.
        </div>
      ) : filteredData.length === 0 ? (
        <div style={{ color: "#94a3b8", textAlign: "center", padding: "40px", border: "1px dashed rgba(255,255,255,0.1)", borderRadius: "12px" }}>
          No se encontraron coincidencias para "{searchQuery}".
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {filteredData.map(item => (
            <div key={item._id} style={{ 
              background: "rgba(255, 255, 255, 0.02)", padding: "16px", borderRadius: "10px", 
              border: "1px solid rgba(255, 255, 255, 0.05)", display: "flex", alignItems: "center", gap: "16px",
              transition: "background 0.2s"
            }}>
              {/* Avatar */}
              <div style={{ 
                width: 42, height: 42, borderRadius: "50%", background: "linear-gradient(135deg, #10b981, #3b82f6)", 
                display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: "bold", fontSize: "1.1rem", flexShrink: 0
              }}>
                {item.name.charAt(0).toUpperCase()}
              </div>

              {/* Info */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "4px" }}>
                  <h4 style={{ margin: 0, color: "#f8fafc", fontSize: "1rem", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {item.name}
                  </h4>
                  <span style={{ fontSize: "0.75rem", color: "#6366f1", background: "rgba(99, 102, 241, 0.1)", padding: "2px 8px", borderRadius: "12px", fontWeight: 600 }}>
                    {item.code}
                  </span>
                </div>
                <div style={{ fontSize: "0.85rem", color: "#94a3b8" }}>
                  {item.email || "Sin correo registrado"}
                </div>
              </div>

              {/* Acciones */}
              <div style={{ display: "flex", gap: "8px" }}>
                <button onClick={() => handleEdit(item)} style={{ 
                  padding: "6px 12px", background: "transparent", color: "#cbd5e1", border: "1px solid rgba(255,255,255,0.15)", borderRadius: "6px", cursor: "pointer", fontSize: "0.8rem" 
                }}>
                  Editar
                </button>
                <button onClick={() => handleDelete(item._id, item.name)} style={{ 
                  padding: "6px 12px", background: "rgba(255,79,106,0.1)", color: "#ff4f6a", border: "1px solid rgba(255,79,106,0.3)", borderRadius: "6px", cursor: "pointer", fontSize: "0.8rem" 
                }}>
                  Borrar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}