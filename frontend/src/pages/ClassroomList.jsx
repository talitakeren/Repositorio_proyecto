import { useEffect, useState, useMemo } from "react";
import { apiUrl } from "../config/api";

export default function ClassroomList() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Estados del catálogo (Filtros)
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("Todos");

  // Estados del formulario (CRUD)
  const [editingId, setEditingId] = useState(null);
  const [code, setCode] = useState("");
  const [capacity, setCapacity] = useState("");
  const [type, setType] = useState("Teoría");
  
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const classroomTypes = ["Todos", "Teoría", "Laboratorio", "Taller", "Auditorio"];

  const fetchClassrooms = () => {
    setLoading(true);
    fetch(apiUrl("/classroom"))
      .then(res => res.json())
      .then(d => { setData(d); setLoading(false); })
      .catch(() => { setError("Error al cargar las aulas"); setLoading(false); });
  };

  useEffect(() => {
    fetchClassrooms();
  }, []);

  // --- LÓGICA DE FILTRADO (Catálogo) ---
  const filteredCatalog = useMemo(() => {
    return data.filter(item => {
      const matchesType = selectedType === "Todos" || item.type === selectedType;
      const matchesSearch = item.code.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesType && matchesSearch;
    });
  }, [data, selectedType, searchQuery]);

  // --- LÓGICA CRUD ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const payload = { code: code.toUpperCase(), capacity: Number(capacity), type };
    const url = editingId ? apiUrl(`/classroom/${editingId}`) : apiUrl("/classroom");
    const method = editingId ? "PATCH" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error("Error al procesar la solicitud");
      setSuccess(editingId ? "Aula actualizada" : "Aula creada");
      resetForm();
      fetchClassrooms();
    } catch (err) { setError(err.message); }
  };

  const handleEdit = (classroom) => {
    setEditingId(classroom._id);
    setCode(classroom.code);
    setCapacity(classroom.capacity);
    setType(classroom.type || "Teoría");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id, codeStr) => {
    if (!window.confirm(`¿Eliminar aula ${codeStr}?`)) return;
    await fetch(apiUrl(`/classroom/${id}`), { method: "DELETE" });
    fetchClassrooms();
  };

  const resetForm = () => {
    setEditingId(null); setCode(""); setCapacity(""); setType("Teoría");
  };

  // --- ESTILOS REUTILIZABLES ---
  const inputStyle = {
    width: "100%", padding: "10px 14px", borderRadius: "8px",
    border: "1px solid rgba(255, 255, 255, 0.1)", background: "rgba(255, 255, 255, 0.05)",
    color: "#f8fafc", outline: "none"
  };

  const getTypeColor = (t) => {
    switch(t) {
      case 'Laboratorio': return '#34d399'; // Verde
      case 'Taller': return '#fbbf24';      // Ámbar
      case 'Auditorio': return '#f472b6';   // Rosa
      default: return '#60a5fa';            // Azul (Teoría)
    }
  };

  return (
    <>
      <div className="page-header" style={{ marginBottom: "20px" }}>
        <h2 style={{ color: "#f8fafc" }}>Catálogo de Aulas</h2>
        <p style={{ color: "#94a3b8" }}>Explora y gestiona los espacios físicos disponibles</p>
      </div>

      {(error || success) && (
        <div
          role="alert"
          style={{
            marginBottom: "16px",
            padding: "12px 16px",
            borderRadius: "8px",
            background: error ? "rgba(239, 68, 68, 0.15)" : "rgba(52, 211, 153, 0.15)",
            color: error ? "#fca5a5" : "#6ee7b7",
            border: `1px solid ${error ? "rgba(239, 68, 68, 0.3)" : "rgba(52, 211, 153, 0.3)"}`,
          }}
        >
          {error || success}
        </div>
      )}

      {/* --- SECCIÓN 1: FORMULARIO (ADMIN) --- */}
      <div style={{ 
        background: "rgba(99, 102, 241, 0.05)", padding: "20px", borderRadius: "12px", 
        border: "1px solid rgba(99, 102, 241, 0.2)", marginBottom: "30px" 
      }}>
        <form onSubmit={handleSubmit} style={{ display: "flex", flexWrap: "wrap", gap: "15px", alignItems: "flex-end" }}>
          <div style={{ flex: 1, minWidth: "120px" }}>
            <label style={{ color: "#94a3b8", fontSize: "0.8rem", marginBottom: "5px", display: "block" }}>Código</label>
            <input type="text" value={code} onChange={e => setCode(e.target.value)} required style={inputStyle} />
          </div>
          <div style={{ flex: 1, minWidth: "100px" }}>
            <label style={{ color: "#94a3b8", fontSize: "0.8rem", marginBottom: "5px", display: "block" }}>Capacidad</label>
            <input type="number" value={capacity} onChange={e => setCapacity(e.target.value)} required style={inputStyle} />
          </div>
          <div style={{ flex: 1, minWidth: "150px" }}>
            <label style={{ color: "#94a3b8", fontSize: "0.8rem", marginBottom: "5px", display: "block" }}>Tipo</label>
            <select value={type} onChange={e => setType(e.target.value)} style={{...inputStyle, appearance: "auto"}}>
              {classroomTypes.filter(t => t !== "Todos").map(t => <option key={t} value={t} style={{color:"#000"}}>{t}</option>)}
            </select>
          </div>
          <button type="submit" style={{ padding: "10px 20px", background: "#6366f1", color: "#fff", border: "none", borderRadius: "8px", fontWeight: 600, cursor: "pointer" }}>
            {editingId ? "Actualizar" : "Añadir Aula"}
          </button>
          {editingId && <button onClick={resetForm} type="button" style={{ background: "transparent", color: "#94a3b8", border: "none", cursor: "pointer" }}>Cancelar</button>}
        </form>
      </div>

      {/* --- SECCIÓN 2: FILTROS DEL CATÁLOGO --- */}
      <div style={{ marginBottom: "25px", display: "flex", flexDirection: "column", gap: "15px" }}>
        {/* Buscador */}
        <div style={{ position: "relative", maxWidth: "400px" }}>
           <input 
            type="text" 
            placeholder="Buscar por código (ej: A-101)..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={inputStyle}
          />
        </div>

        {/* Píldoras de Filtro */}
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          {classroomTypes.map(t => (
            <button
              key={t}
              onClick={() => setSelectedType(t)}
              style={{
                padding: "8px 16px",
                borderRadius: "20px",
                border: "1px solid",
                borderColor: selectedType === t ? getTypeColor(t) : "rgba(255,255,255,0.1)",
                background: selectedType === t ? `${getTypeColor(t)}20` : "rgba(255,255,255,0.05)",
                color: selectedType === t ? getTypeColor(t) : "#94a3b8",
                cursor: "pointer",
                fontSize: "0.85rem",
                fontWeight: 600,
                transition: "all 0.3s"
              }}
            >
              {t} {selectedType === t && "•"}
            </button>
          ))}
        </div>
      </div>

      {/* --- SECCIÓN 3: GRILLA DE CATÁLOGO --- */}
      {loading ? (
        <div style={{ color: "#94a3b8", textAlign: "center", padding: "40px" }}>Cargando catálogo...</div>
      ) : filteredCatalog.length === 0 ? (
        <div style={{ color: "#475569", textAlign: "center", padding: "60px", background: "rgba(255,255,255,0.01)", borderRadius: "12px", border: "1px dashed rgba(255,255,255,0.1)" }}>
          No se encontraron aulas con los filtros seleccionados.
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "20px" }}>
          {filteredCatalog.map(item => (
            <div key={item._id} style={{ 
              background: "rgba(255, 255, 255, 0.03)", 
              borderRadius: "15px", 
              border: "1px solid rgba(255,255,255,0.08)",
              overflow: "hidden",
              display: "flex",
              flexDirection: "column"
            }}>
              {/* Header de la Card con color según tipo */}
              <div style={{ height: "4px", background: getTypeColor(item.type) }}></div>
              
              <div style={{ padding: "20px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "15px" }}>
                  <div>
                    <h3 style={{ margin: 0, color: "#f8fafc", fontSize: "1.2rem" }}>Aula {item.code}</h3>
                    <span style={{ fontSize: "0.75rem", color: getTypeColor(item.type), fontWeight: 700, textTransform: "uppercase" }}>
                      {item.type}
                    </span>
                  </div>
                  <div style={{ background: "rgba(255,255,255,0.05)", padding: "8px", borderRadius: "10px", textAlign: "center" }}>
                    <div style={{ color: "#f8fafc", fontWeight: "bold" }}>{item.capacity}</div>
                    <div style={{ color: "#64748b", fontSize: "0.6rem" }}>CAPACIDAD</div>
                  </div>
                </div>

                <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
                  <button 
                    onClick={() => handleEdit(item)}
                    style={{ flex: 1, padding: "8px", borderRadius: "8px", background: "rgba(255,255,255,0.05)", color: "#cbd5e1", border: "1px solid rgba(255,255,255,0.1)", cursor: "pointer", fontSize: "0.8rem" }}
                  >
                    Editar
                  </button>
                  <button 
                    onClick={() => handleDelete(item._id, item.code)}
                    style={{ padding: "8px 12px", borderRadius: "8px", background: "rgba(239, 68, 68, 0.1)", color: "#ef4444", border: "1px solid rgba(239, 68, 68, 0.2)", cursor: "pointer" }}
                  >
                    🗑️
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}