import { useEffect, useState } from "react";
import api from "../../api/axiosConfig";

interface Estudiante {
  idEstudiante: number;
  matricula: string;
  nombres: string;
  apellidos: string;
  telefono: string | null;
  correo: string | null;
  activo: boolean;
  usuario: string | null;
  cursoActual: string | null;
    Nivel: string | null;
}

interface AnioEscolar {
  idAnioEscolar: number;
  nombre: string;
  activo: boolean;
}

const EstudiantesPage = () => {
  const [estudiantes, setEstudiantes] = useState<Estudiante[]>([]);
  const [anios, setAnios] = useState<AnioEscolar[]>([]);
  const [archivo, setArchivo] = useState<File | null>(null);
  const [idAnioEscolar, setIdAnioEscolar] = useState("");
  const [resultado, setResultado] = useState<any>(null);

  const cargarDatos = async () => {
    const [resEstudiantes, resAnios] = await Promise.all([
      api.get("/Estudiantes"),
      api.get("/AniosEscolares"),
    ]);

    setEstudiantes(resEstudiantes.data);
    setAnios(resAnios.data);
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const importarExcel = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!archivo || !idAnioEscolar) {
      alert("Selecciona un archivo y un año escolar.");
      return;
    }

    const formData = new FormData();
    formData.append("archivo", archivo);

    const res = await api.post(
      `/ImportacionExcel/estudiantes?idAnioEscolar=${idAnioEscolar}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    setResultado(res.data);
    setArchivo(null);
    cargarDatos();
  };

  const cambiarEstado = async (id: number) => {
    await api.put(`/Estudiantes/${id}/estado`);
    cargarDatos();
  };

  return (
    <div>
      <h1>Estudiantes</h1>

      <form onSubmit={importarExcel} className="form-card">
        <select
          value={idAnioEscolar}
          onChange={(e) => setIdAnioEscolar(e.target.value)}
          required
        >
          <option value="">Seleccione año escolar</option>
          {anios.map((anio) => (
            <option key={anio.idAnioEscolar} value={anio.idAnioEscolar}>
              {anio.nombre} {anio.activo ? "(Activo)" : ""}
            </option>
          ))}
        </select>

        <input
          type="file"
          accept=".xlsx,.xls"
          onChange={(e) => setArchivo(e.target.files?.[0] ?? null)}
          required
        />

        <button type="submit">Importar estudiantes</button>
      </form>

      {resultado && (
        <div className="card" style={{ marginBottom: 20 }}>
          <h3>Resultado de importación</h3>
          <p>Total: {resultado.total}</p>
          <p>Exitosos: {resultado.exitosos}</p>
          <p>Fallidos: {resultado.fallidos}</p>

          {resultado.errores?.length > 0 && (
            <ul>
              {resultado.errores.map((err: any, index: number) => (
                <li key={index}>
                  Fila {err.fila}: {err.error}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      <table className="data-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Matrícula</th>
            <th>Usuario</th>
            <th>Estudiante</th>
            <th>Curso</th>
            <th>Nivel</th>
            <th>Teléfono</th>
            <th>Correo</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>

        <tbody>
          {estudiantes.map((e) => (
            <tr key={e.idEstudiante}>
              <td>{e.idEstudiante}</td>
              <td>{e.matricula}</td>
              <td>{e.usuario}</td>
              <td>{e.nombres} {e.apellidos}</td>
              <td>{e.cursoActual}</td>
              <td>{e.Nivel}</td>
              <td>{e.telefono}</td>
              <td>{e.correo}</td>
              <td>{e.activo ? "Activo" : "Inactivo"}</td>
              <td>
                <button onClick={() => cambiarEstado(e.idEstudiante)}>
                  {e.activo ? "Desactivar" : "Activar"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EstudiantesPage;