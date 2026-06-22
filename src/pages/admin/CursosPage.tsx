import { useEffect, useState } from "react";
import api from "../../api/axiosConfig";

interface Grado {
  idGrado: number;
  nombre: string;
  nivel: string;
}

interface Curso {
  idCurso: number;
  nombre: string;
  seccion: string;
  activo: boolean;
  idGrado: number;
  grado: string;
  nivel: string;
}

const CursosPage = () => {
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [grados, setGrados] = useState<Grado[]>([]);

  const [idGrado, setIdGrado] = useState("");
  const [nombre, setNombre] = useState("");
  const [seccion, setSeccion] = useState("");
  const [editandoId, setEditandoId] = useState<number | null>(null);

  const cargarDatos = async () => {
    const [resCursos, resGrados] = await Promise.all([
      api.get("/Cursos"),
      api.get("/Grados"),
    ]);

    setCursos(resCursos.data);
    setGrados(resGrados.data);
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const guardar = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      idGrado: Number(idGrado),
      nombre,
      seccion,
    };

    if (editandoId) {
      await api.put(`/Cursos/${editandoId}`, payload);
    } else {
      await api.post("/Cursos", payload);
    }

    setIdGrado("");
    setNombre("");
    setSeccion("");
    setEditandoId(null);
    cargarDatos();
  };

  const editar = (curso: Curso) => {
    setEditandoId(curso.idCurso);
    setIdGrado(String(curso.idGrado));
    setNombre(curso.nombre);
    setSeccion(curso.seccion ?? "");
  };

  const cambiarEstado = async (id: number) => {
    await api.put(`/Cursos/${id}/estado`);
    cargarDatos();
  };

  const eliminar = async (id: number) => {
    if (!confirm("¿Seguro que deseas eliminar este curso?")) return;

    try {
      await api.delete(`/Cursos/${id}`);
      cargarDatos();
    } catch {
      alert("No se pudo eliminar. Puede tener estudiantes inscritos.");
    }
  };

  return (
    <div>
      <h1>Cursos</h1>

      <form onSubmit={guardar} className="form-card">
        <select
          value={idGrado}
          onChange={(e) => setIdGrado(e.target.value)}
          required
        >
          <option value="">Seleccione grado</option>
          {grados.map((grado) => (
            <option key={grado.idGrado} value={grado.idGrado}>
              {grado.nivel} - {grado.nombre}
            </option>
          ))}
        </select>

        <input
          placeholder="Nombre del curso"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
        />

        <input
          placeholder="Sección"
          value={seccion}
          onChange={(e) => setSeccion(e.target.value)}
        />

        <button type="submit">{editandoId ? "Actualizar" : "Crear"}</button>

        {editandoId && (
          <button
            type="button"
            onClick={() => {
              setEditandoId(null);
              setIdGrado("");
              setNombre("");
              setSeccion("");
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
            <th>Curso</th>
            <th>Sección</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>

        <tbody>
          {cursos.map((curso) => (
            <tr key={curso.idCurso}>
              <td>{curso.idCurso}</td>
              <td>{curso.nivel}</td>
              <td>{curso.grado}</td>
              <td>{curso.nombre}</td>
              <td>{curso.seccion}</td>
              <td>{curso.activo ? "Activo" : "Inactivo"}</td>
              <td>
                <button onClick={() => editar(curso)}>Editar</button>
                <button onClick={() => cambiarEstado(curso.idCurso)}>
                  {curso.activo ? "Desactivar" : "Activar"}
                </button>
                <button onClick={() => eliminar(curso.idCurso)}>
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

export default CursosPage;