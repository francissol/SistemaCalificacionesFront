import { useEffect, useState } from "react";
import api from "../../api/axiosConfig";

interface Materia {
  idMateria: number;
  nombre: string;
  abreviatura: string | null;
  esTecnica: boolean;
  activa: boolean;
}

const MateriasPage = () => {
  const [materias, setMaterias] = useState<Materia[]>([]);
  const [nombre, setNombre] = useState("");
  const [abreviatura, setAbreviatura] = useState("");
  const [esTecnica, setEsTecnica] = useState(false);
  const [editandoId, setEditandoId] = useState<number | null>(null);

  const cargarMaterias = async () => {
    const res = await api.get("/Materias");
    setMaterias(res.data);
  };

  useEffect(() => {
    cargarMaterias();
  }, []);

  const limpiarFormulario = () => {
    setNombre("");
    setAbreviatura("");
    setEsTecnica(false);
    setEditandoId(null);
  };

  const guardar = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      nombre,
      abreviatura,
      esTecnica,
    };

    if (editandoId) {
      await api.put(`/Materias/${editandoId}`, payload);
    } else {
      await api.post("/Materias", payload);
    }

    limpiarFormulario();
    cargarMaterias();
  };

  const editar = (materia: Materia) => {
    setEditandoId(materia.idMateria);
    setNombre(materia.nombre);
    setAbreviatura(materia.abreviatura ?? "");
    setEsTecnica(materia.esTecnica ?? false);
  };

  const cambiarEstado = async (id: number) => {
    await api.put(`/Materias/${id}/estado`);
    cargarMaterias();
  };

  const eliminar = async (id: number) => {
    if (!confirm("¿Seguro que deseas eliminar esta materia?")) return;

    try {
      await api.delete(`/Materias/${id}`);
      cargarMaterias();
    } catch {
      alert("No se pudo eliminar. Puede estar asignada a grados o docentes.");
    }
  };

  return (
    <div>
      <h1>Materias</h1>

      <form onSubmit={guardar} className="form-card">
        <input
          placeholder="Nombre de la materia"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
        />

        <input
          placeholder="Abreviatura"
          value={abreviatura}
          onChange={(e) => setAbreviatura(e.target.value)}
        />

        <label style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <input
            type="checkbox"
            checked={esTecnica}
            onChange={(e) => setEsTecnica(e.target.checked)}
          />
          Materia técnica
        </label>

        <button type="submit">{editandoId ? "Actualizar" : "Crear"}</button>

        {editandoId && (
          <button type="button" onClick={limpiarFormulario}>
            Cancelar
          </button>
        )}
      </form>

      <table className="data-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Materia</th>
            <th>Abreviatura</th>
            <th>Tipo</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>

        <tbody>
          {materias.map((materia) => (
            <tr key={materia.idMateria}>
              <td>{materia.idMateria}</td>
              <td>{materia.nombre}</td>
              <td>{materia.abreviatura}</td>
              <td>
                {materia.esTecnica
                  ? "Técnica / RA"
                  : "Normal / Competencias"}
              </td>
              <td>{materia.activa ? "Activa" : "Inactiva"}</td>
              <td>
                <button onClick={() => editar(materia)}>Editar</button>

                <button onClick={() => cambiarEstado(materia.idMateria)}>
                  {materia.activa ? "Desactivar" : "Activar"}
                </button>

                <button onClick={() => eliminar(materia.idMateria)}>
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

export default MateriasPage;