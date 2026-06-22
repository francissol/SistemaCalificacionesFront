import { useEffect, useState } from "react";
import api from "../../api/axiosConfig";

interface Maestro {
  idMaestro: number;
  nombres: string;
  apellidos: string;
  activo: boolean;
}

interface Curso {
  idCurso: number;
  nombre: string;
  grado: string;
  nivel: string;
  activo: boolean;
}

interface Materia {
  idMateria: number;
  nombre: string;
  activa: boolean;
}

interface AnioEscolar {
  idAnioEscolar: number;
  nombre: string;
  activo: boolean;
  cerrado: boolean;
}

interface Asignacion {
  idAsignacionDocente: number;
  idMaestro: number;
  maestro: string;
  idCurso: number;
  curso: string;
  grado: string;
  idMateria: number;
  materia: string;
  idAnioEscolar: number;
  anioEscolar: string;
  activo: boolean;
  fechaAsignacion: string;
}

const AsignacionesDocentesPage = () => {
  const [asignaciones, setAsignaciones] = useState<Asignacion[]>([]);
  const [maestros, setMaestros] = useState<Maestro[]>([]);
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [materias, setMaterias] = useState<Materia[]>([]);
  const [anios, setAnios] = useState<AnioEscolar[]>([]);

  const [idMaestro, setIdMaestro] = useState("");
  const [idCurso, setIdCurso] = useState("");
  const [idMateria, setIdMateria] = useState("");
  const [idAnioEscolar, setIdAnioEscolar] = useState("");
  const [editandoId, setEditandoId] = useState<number | null>(null);

  const cargarDatos = async () => {
    const [resAsignaciones, resMaestros, resCursos, resMaterias, resAnios] =
      await Promise.all([
        api.get("/AsignacionesDocentes"),
        api.get("/Maestros"),
        api.get("/Cursos"),
        api.get("/Materias"),
        api.get("/AniosEscolares"),
      ]);

    setAsignaciones(resAsignaciones.data);
    setMaestros(resMaestros.data);
    setCursos(resCursos.data);
    setMaterias(resMaterias.data);
    setAnios(resAnios.data);
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const limpiar = () => {
    setIdMaestro("");
    setIdCurso("");
    setIdMateria("");
    setIdAnioEscolar("");
    setEditandoId(null);
  };

  const guardar = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      idMaestro: Number(idMaestro),
      idCurso: Number(idCurso),
      idMateria: Number(idMateria),
      idAnioEscolar: Number(idAnioEscolar),
    };

    try {
      if (editandoId) {
        await api.put(`/AsignacionesDocentes/${editandoId}`, payload);
      } else {
        await api.post("/AsignacionesDocentes", payload);
      }

      limpiar();
      cargarDatos();
    } catch (error: any) {
      alert(error.response?.data ?? "Error al guardar la asignación.");
    }
  };

  const editar = (a: Asignacion) => {
    setEditandoId(a.idAsignacionDocente);
    setIdMaestro(String(a.idMaestro));
    setIdCurso(String(a.idCurso));
    setIdMateria(String(a.idMateria));
    setIdAnioEscolar(String(a.idAnioEscolar));
  };

  const cambiarEstado = async (id: number) => {
    await api.put(`/AsignacionesDocentes/${id}/estado`);
    cargarDatos();
  };

  return (
    <div>
      <h1>Asignaciones Docentes</h1>

      <form onSubmit={guardar} className="form-card">
        <select value={idMaestro} onChange={(e) => setIdMaestro(e.target.value)} required>
          <option value="">Seleccione maestro</option>
          {maestros
            .filter((m) => m.activo)
            .map((m) => (
              <option key={m.idMaestro} value={m.idMaestro}>
                {m.nombres} {m.apellidos}
              </option>
            ))}
        </select>

        <select value={idCurso} onChange={(e) => setIdCurso(e.target.value)} required>
          <option value="">Seleccione curso</option>
          {cursos
            .filter((c) => c.activo)
            .map((c) => (
              <option key={c.idCurso} value={c.idCurso}>
                {c.nivel} - {c.grado} - {c.nombre}
              </option>
            ))}
        </select>

        <select value={idMateria} onChange={(e) => setIdMateria(e.target.value)} required>
          <option value="">Seleccione materia</option>
          {materias
            .filter((m) => m.activa)
            .map((m) => (
              <option key={m.idMateria} value={m.idMateria}>
                {m.nombre}
              </option>
            ))}
        </select>

        <select value={idAnioEscolar} onChange={(e) => setIdAnioEscolar(e.target.value)} required>
          <option value="">Seleccione año</option>
          {anios
            .filter((a) => !a.cerrado)
            .map((a) => (
              <option key={a.idAnioEscolar} value={a.idAnioEscolar}>
                {a.nombre} {a.activo ? "(Activo)" : ""}
              </option>
            ))}
        </select>

        <button type="submit">{editandoId ? "Actualizar" : "Asignar"}</button>

        {editandoId && (
          <button type="button" onClick={limpiar}>
            Cancelar
          </button>
        )}
      </form>

      <table className="data-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Maestro</th>
            <th>Curso</th>
            <th>Grado</th>
            <th>Materia</th>
            <th>Año</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>

        <tbody>
          {asignaciones.map((a) => (
            <tr key={a.idAsignacionDocente}>
              <td>{a.idAsignacionDocente}</td>
              <td>{a.maestro}</td>
              <td>{a.curso}</td>
              <td>{a.grado}</td>
              <td>{a.materia}</td>
              <td>{a.anioEscolar}</td>
              <td>{a.activo ? "Activa" : "Inactiva"}</td>
              <td>
                <button onClick={() => editar(a)}>Editar</button>
                <button onClick={() => cambiarEstado(a.idAsignacionDocente)}>
                  {a.activo ? "Desactivar" : "Activar"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AsignacionesDocentesPage;