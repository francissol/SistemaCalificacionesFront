import { useEffect, useState } from "react";
import api from "../../api/axiosConfig";

interface AnioEscolar {
  idAnioEscolar: number;
  nombre: string;
  activo: boolean;
  cerrado: boolean;
}

interface Periodo {
  idPeriodoPublicacion: number;
  nombre: string;
  fechaInicio: string;
  fechaCierre: string;
  activo: boolean;
  idAnioEscolar: number;
  anioEscolar: string;
  diasRestantes: number;
}

const PeriodosPublicacionPage = () => {
  const [periodos, setPeriodos] = useState<Periodo[]>([]);
  const [anios, setAnios] = useState<AnioEscolar[]>([]);

  const [idAnioEscolar, setIdAnioEscolar] = useState("");
  const [nombre, setNombre] = useState("");
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaCierre, setFechaCierre] = useState("");
  const [editandoId, setEditandoId] = useState<number | null>(null);

  const cargarDatos = async () => {
    const [resPeriodos, resAnios] = await Promise.all([
      api.get("/PeriodosPublicacion"),
      api.get("/AniosEscolares"),
    ]);

    setPeriodos(resPeriodos.data);
    setAnios(resAnios.data);
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const limpiar = () => {
    setIdAnioEscolar("");
    setNombre("");
    setFechaInicio("");
    setFechaCierre("");
    setEditandoId(null);
  };

  const guardar = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      idAnioEscolar: Number(idAnioEscolar),
      nombre,
      fechaInicio,
      fechaCierre,
    };

    try {
      if (editandoId) {
        await api.put(`/PeriodosPublicacion/${editandoId}`, payload);
      } else {
        await api.post("/PeriodosPublicacion", payload);
      }

      limpiar();
      cargarDatos();
    } catch (error: any) {
      alert(error.response?.data ?? "Error al guardar el período.");
    }
  };

  const editar = (periodo: Periodo) => {
    setEditandoId(periodo.idPeriodoPublicacion);
    setIdAnioEscolar(String(periodo.idAnioEscolar));
    setNombre(periodo.nombre);
    setFechaInicio(periodo.fechaInicio.substring(0, 10));
    setFechaCierre(periodo.fechaCierre.substring(0, 10));
  };

  const cambiarEstado = async (id: number) => {
    await api.put(`/PeriodosPublicacion/${id}/estado`);
    cargarDatos();
  };

  return (
    <div>
      <h1>Períodos de Publicación</h1>

      <form onSubmit={guardar} className="form-card">
        <select
          value={idAnioEscolar}
          onChange={(e) => setIdAnioEscolar(e.target.value)}
          required
        >
          <option value="">Seleccione año escolar</option>
          {anios
            .filter((a) => !a.cerrado)
            .map((anio) => (
              <option key={anio.idAnioEscolar} value={anio.idAnioEscolar}>
                {anio.nombre} {anio.activo ? "(Activo)" : ""}
              </option>
            ))}
        </select>

        <input
          placeholder="Ej: Primer Período"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
        />

        <input
          type="date"
          value={fechaInicio}
          onChange={(e) => setFechaInicio(e.target.value)}
          required
        />

        <input
          type="date"
          value={fechaCierre}
          onChange={(e) => setFechaCierre(e.target.value)}
          required
        />

        <button type="submit">{editandoId ? "Actualizar" : "Crear"}</button>

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
            <th>Año escolar</th>
            <th>Período</th>
            <th>Inicio</th>
            <th>Cierre</th>
            <th>Días restantes</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>

        <tbody>
          {periodos.map((p) => (
            <tr key={p.idPeriodoPublicacion}>
              <td>{p.idPeriodoPublicacion}</td>
              <td>{p.anioEscolar}</td>
              <td>{p.nombre}</td>
              <td>{p.fechaInicio.substring(0, 10)}</td>
              <td>{p.fechaCierre.substring(0, 10)}</td>
              <td>{p.diasRestantes}</td>
              <td>{p.activo ? "Activo" : "Inactivo"}</td>
              <td>
                <button onClick={() => editar(p)}>Editar</button>
                <button onClick={() => cambiarEstado(p.idPeriodoPublicacion)}>
                  {p.activo ? "Desactivar" : "Activar"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PeriodosPublicacionPage;