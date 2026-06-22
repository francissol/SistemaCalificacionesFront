import { useEffect, useState } from "react";
import api from "../../api/axiosConfig";

interface Nivel {
  idNivel: number;
  nombre: string;
}

interface Grado {
  idGrado: number;
  nombre: string;
  orden: number;
  idNivel: number;
  nivel: string;
}

const GradosPage = () => {
  const [grados, setGrados] = useState<Grado[]>([]);
  const [niveles, setNiveles] = useState<Nivel[]>([]);

  const [idNivel, setIdNivel] = useState("");
  const [nombre, setNombre] = useState("");
  const [orden, setOrden] = useState("");
  const [editandoId, setEditandoId] = useState<number | null>(null);

  const cargarDatos = async () => {
    const [resGrados, resNiveles] = await Promise.all([
      api.get("/Grados"),
      api.get("/Niveles"),
    ]);

    setGrados(resGrados.data);
    setNiveles(resNiveles.data);
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const guardar = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      idNivel: Number(idNivel),
      nombre,
      orden: Number(orden),
    };

    if (editandoId) {
      await api.put(`/Grados/${editandoId}`, payload);
    } else {
      await api.post("/Grados", payload);
    }

    setIdNivel("");
    setNombre("");
    setOrden("");
    setEditandoId(null);
    cargarDatos();
  };

  const editar = (grado: Grado) => {
    setEditandoId(grado.idGrado);
    setIdNivel(String(grado.idNivel));
    setNombre(grado.nombre);
    setOrden(String(grado.orden));
  };

  const eliminar = async (id: number) => {
    if (!confirm("¿Seguro que deseas eliminar este grado?")) return;

    try {
      await api.delete(`/Grados/${id}`);
      cargarDatos();
    } catch {
      alert("No se pudo eliminar. Puede tener cursos asociados.");
    }
  };

  return (
    <div>
      <h1>Grados</h1>

      <form onSubmit={guardar} className="form-card">
        <select
          value={idNivel}
          onChange={(e) => setIdNivel(e.target.value)}
          required
        >
          <option value="">Seleccione nivel</option>
          {niveles.map((nivel) => (
            <option key={nivel.idNivel} value={nivel.idNivel}>
              {nivel.nombre}
            </option>
          ))}
        </select>

        <input
          placeholder="Nombre del grado"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
        />

        <input
          type="number"
          placeholder="Orden"
          value={orden}
          onChange={(e) => setOrden(e.target.value)}
          required
        />

        <button type="submit">
          {editandoId ? "Actualizar" : "Crear"}
        </button>

        {editandoId && (
          <button
            type="button"
            onClick={() => {
              setEditandoId(null);
              setIdNivel("");
              setNombre("");
              setOrden("");
            }}
          >
            Cancelar
          </button>
        )}
      </form>

      <table className="data-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nivel</th>
            <th>Grado</th>
            <th>Orden</th>
            <th>Acciones</th>
          </tr>
        </thead>

        <tbody>
          {grados.map((grado) => (
            <tr key={grado.idGrado}>
              <td>{grado.idGrado}</td>
              <td>{grado.nivel}</td>
              <td>{grado.nombre}</td>
              <td>{grado.orden}</td>
              <td>
                <button onClick={() => editar(grado)}>Editar</button>
                <button onClick={() => eliminar(grado.idGrado)}>
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default GradosPage;