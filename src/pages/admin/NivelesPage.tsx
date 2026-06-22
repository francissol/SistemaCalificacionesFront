import { useEffect, useState } from "react";
import api from "../../api/axiosConfig";

interface Nivel {
  idNivel: number;
  nombre: string;
}

const NivelesPage = () => {
  const [niveles, setNiveles] = useState<Nivel[]>([]);
  const [nombre, setNombre] = useState("");
  const [editandoId, setEditandoId] = useState<number | null>(null);
  const [mensaje, setMensaje] = useState("");

  const cargarNiveles = async () => {
    const res = await api.get("/Niveles");
    setNiveles(res.data);
  };

  useEffect(() => {
    cargarNiveles();
  }, []);

  const guardar = async (e: React.FormEvent) => {
    e.preventDefault();
    setMensaje("");

    try {
      if (editandoId) {
        await api.put(`/Niveles/${editandoId}`, { nombre });
        setMensaje("Nivel actualizado correctamente.");
      } else {
        await api.post("/Niveles", { nombre });
        setMensaje("Nivel creado correctamente.");
      }

      setNombre("");
      setEditandoId(null);
      cargarNiveles();
    } catch {
      setMensaje("Ocurrió un error al guardar.");
    }
  };

  const editar = (nivel: Nivel) => {
    setNombre(nivel.nombre);
    setEditandoId(nivel.idNivel);
  };

  const eliminar = async (id: number) => {
    if (!confirm("¿Seguro que deseas eliminar este nivel?")) return;

    try {
      await api.delete(`/Niveles/${id}`);
      cargarNiveles();
    } catch {
      alert("No se pudo eliminar. Puede tener grados asociados.");
    }
  };

  return (
    <div>
      <h1>Niveles</h1>

      <form onSubmit={guardar} className="form-card">
        <input
          placeholder="Nombre del nivel"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
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
              setNombre("");
            }}
          >
            Cancelar
          </button>
        )}
      </form>

      {mensaje && <p>{mensaje}</p>}

      <table className="data-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Acciones</th>
          </tr>
        </thead>

        <tbody>
          {niveles.map((nivel) => (
            <tr key={nivel.idNivel}>
              <td>{nivel.idNivel}</td>
              <td>{nivel.nombre}</td>
              <td>
                <button onClick={() => editar(nivel)}>Editar</button>
                <button onClick={() => eliminar(nivel.idNivel)}>
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

export default NivelesPage;