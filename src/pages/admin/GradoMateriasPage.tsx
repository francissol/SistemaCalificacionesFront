import { useEffect, useState } from "react";
import api from "../../api/axiosConfig";

interface Grado {
  idGrado: number;
  nombre: string;
  nivel: string;
}

interface Materia {
  idMateria: number;
  nombre: string;
  abreviatura: string | null;
  activa: boolean;
}

interface GradoMateria {
  idGradoMateria: number;
  idGrado: number;
  grado: string;
  idMateria: number;
  materia: string;
  abreviatura: string | null;
}

interface Curso {
  idCurso: number;
  nombre: string;
  seccion: string;
  grado: string;
  nivel: string;
}

const GradoMateriasPage = () => {
  const [grados, setGrados] = useState<Grado[]>([]);
  const [materias, setMaterias] = useState<Materia[]>([]);
  const [asignaciones, setAsignaciones] = useState<GradoMateria[]>([]);

  const [idGrado, setIdGrado] = useState("");
  const [idMateria, setIdMateria] = useState("");

  const [porSeccion, setPorSeccion] = useState(false);
  const [idCurso, setIdCurso] = useState("");
  const [cursosDelGrado, setCursosDelGrado] = useState<Curso[]>([]);

  const cargarDatos = async () => {
    try {
      const [resGrados, resMaterias, resAsignaciones] = await Promise.all([
        api.get("/Grados"),
        api.get("/Materias"),
        api.get("/GradoMaterias"),
      ]);

      setGrados(resGrados.data);
      setMaterias(resMaterias.data);
      setAsignaciones(resAsignaciones.data);
    } catch (error) {
      console.error("Error cargando datos:", error);
    }
  };

  const cargarCursosDelGrado = async () => {
    if (!idGrado) {
      setCursosDelGrado([]);
      setIdCurso("");
      return;
    }

    try {
      const res = await api.get(`/Cursos/grado/${idGrado}`);
      setCursosDelGrado(res.data);
    } catch (error) {
      console.error("Error cargando cursos del grado:", error);
      setCursosDelGrado([]);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  useEffect(() => {
    cargarCursosDelGrado();
  }, [idGrado]);

  const limpiar = () => {
    setIdGrado("");
    setIdMateria("");
    setPorSeccion(false);
    setIdCurso("");
    setCursosDelGrado([]);
  };

  const asignar = async (e: React.FormEvent) => {
    e.preventDefault();

    if (porSeccion && !idCurso) {
      alert("Debe seleccionar una sección.");
      return;
    }

    const payload = {
      idGrado: Number(idGrado),
      idMateria: Number(idMateria),
      porSeccion,
      idCurso: porSeccion ? Number(idCurso) : null,
    };

    try {
      await api.post("/GradoMaterias", payload);

      alert(
        porSeccion
          ? "Materia asignada correctamente a la sección."
          : "Materia asignada correctamente al grado."
      );

      limpiar();
      cargarDatos();
    } catch (error: any) {
      alert(error.response?.data ?? "Error al asignar la materia.");
    }
  };

  const eliminar = async (id: number) => {
    if (!confirm("¿Seguro que deseas quitar esta materia del grado?")) return;

    try {
      await api.delete(`/GradoMaterias/${id}`);
      cargarDatos();
    } catch (error: any) {
      alert(error.response?.data ?? "Error al eliminar la asignación.");
    }
  };

  return (
    <div>
      <h1>Materias por Grado</h1>

      <form onSubmit={asignar} className="form-card">
        <select
          value={idGrado}
          onChange={(e) => {
            setIdGrado(e.target.value);
            setIdCurso("");
          }}
          required
        >
          <option value="">Seleccione grado</option>

          {grados.map((grado) => (
            <option key={grado.idGrado} value={grado.idGrado}>
              {grado.nivel} - {grado.nombre}
            </option>
          ))}
        </select>

        <select
          value={idMateria}
          onChange={(e) => setIdMateria(e.target.value)}
          required
        >
          <option value="">Seleccione materia</option>

          {materias
            .filter((m) => m.activa)
            .map((materia) => (
              <option key={materia.idMateria} value={materia.idMateria}>
                {materia.nombre}
              </option>
            ))}
        </select>

        <label
          style={{
            display: "flex",
            gap: "8px",
            alignItems: "center",
            marginTop: "10px",
          }}
        >
          <input
            type="checkbox"
            checked={porSeccion}
            onChange={(e) => {
              setPorSeccion(e.target.checked);
              setIdCurso("");
            }}
          />
          Aplicar solo por sección
        </label>

        {porSeccion && (
          <select
            value={idCurso}
            onChange={(e) => setIdCurso(e.target.value)}
            required
          >
            <option value="">Seleccione sección</option>

            {cursosDelGrado.map((curso) => (
              <option key={curso.idCurso} value={curso.idCurso}>
                {curso.nivel} - {curso.grado} - Sección {curso.seccion} -{" "}
                {curso.nombre}
              </option>
            ))}
          </select>
        )}

        <button type="submit">
          {porSeccion ? "Asignar a sección" : "Asignar al grado"}
        </button>
      </form>

      <table className="data-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Grado</th>
            <th>Materia</th>
            <th>Abreviatura</th>
            <th>Acciones</th>
          </tr>
        </thead>

        <tbody>
          {asignaciones.map((item) => (
            <tr key={item.idGradoMateria}>
              <td>{item.idGradoMateria}</td>
              <td>{item.grado}</td>
              <td>{item.materia}</td>
              <td>{item.abreviatura}</td>
              <td>
                <button onClick={() => eliminar(item.idGradoMateria)}>
                  Quitar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default GradoMateriasPage;