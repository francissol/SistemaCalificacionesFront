import { useEffect, useState } from "react";
import api from "../../api/axiosConfig";
import { toast } from "react-toastify";

interface Props {
  idAsignacionDocente: number;
  estudiantes: any[];
}

interface RA {
  idResultadoAprendizaje: number;
  codigo: string;
  nombre: string;
  valorMaximo: number;
}

interface ActividadRA {
  idActividadCompetencia: number;
  idResultadoAprendizaje: number;
  ra: string;
  nombre: string;
}

const ModuloRA = ({ idAsignacionDocente, estudiantes }: Props) => {
  const [ras, setRas] = useState<RA[]>([]);
  const [actividades, setActividades] = useState<ActividadRA[]>([]);

  const [nombreRA, setNombreRA] = useState("");
  const [valorMaximo, setValorMaximo] = useState("");

  const [idRA, setIdRA] = useState("");
  const [nombreActividad, setNombreActividad] = useState("");

  const [notas, setNotas] = useState<Record<string, string>>({});
  const [total, setTotal] = useState(0);
  const [faltante, setFaltante] = useState(100);

  const cargarRA = async () => {
    const res = await api.get(
      `/ResultadosAprendizaje/asignacion/${idAsignacionDocente}`
    );

    setRas(res.data.resultados ?? []);
    setTotal(res.data.total ?? 0);
    setFaltante(res.data.faltante ?? 100);
  };

  const cargarActividades = async () => {
    const res = await api.get(
      `/ActividadesCompetencias/ra/asignacion/${idAsignacionDocente}`
    );

    setActividades(res.data);
  };

  useEffect(() => {
    cargarRA();
    cargarActividades();
  }, [idAsignacionDocente]);

  const crearRA = async (e: React.FormEvent) => {
    e.preventDefault();

    const valor = Number(valorMaximo);

    if (!nombreRA.trim()) {
      alert("Escribe el nombre del RA.");
      return;
    }

    if (isNaN(valor) || valor <= 0) {
      alert("El valor debe ser mayor que 0.");
      return;
    }

    try {
      await api.post(
        `/ResultadosAprendizaje/asignacion/${idAsignacionDocente}`,
        {
          nombre: nombreRA,
          valorMaximo: valor,
        }
      );

      setNombreRA("");
      setValorMaximo("");
      cargarRA();
    } catch (error: any) {
      alert(error.response?.data ?? "Error al crear RA.");
    }
  };

  const crearActividad = async (e: React.FormEvent) => {
    e.preventDefault();

    if (total !== 100) {
      alert("Primero debes completar los RA hasta llegar a 100 puntos.");
      return;
    }

    try {
      await api.post("/ActividadesCompetencias/ra", {
        idAsignacionDocente,
        idResultadoAprendizaje: Number(idRA),
        nombre: nombreActividad,
      });

      setIdRA("");
      setNombreActividad("");
      cargarActividades();
    } catch (error: any) {
      alert(error.response?.data ?? "Error al crear actividad.");
    }
  };

  const guardarNota = async (
    idActividadCompetencia: number,
    idEstudiante: number
  ) => {
    const key = `${idActividadCompetencia}-${idEstudiante}`;
    const nota = Number(notas[key]);

    if (isNaN(nota) || nota < 0 || nota > 100) {
      alert("La nota debe estar entre 0 y 100.");
      return;
    }

    try {
      await api.post("/NotasCompetencias", {
        idActividadCompetencia,
        idEstudiante,
        nota,
      });

      alert("Nota guardada.");
    } catch (error: any) {
      alert(error.response?.data ?? "Error al guardar nota.");
    }
  };

  const calcularRA = async () => {
  try {
    await api.post(
      `/CalificacionesRA/calcular?idAsignacionDocente=${idAsignacionDocente}`
    );

      toast.success("Calificación anual por RA calculada.");
  } catch (error: any) {
    alert(error.response?.data ?? "Error al calcular RA.");
  }
};

const publicarRA = async () => {
  try {
    await api.put(
      `/CalificacionesRA/publicar?idAsignacionDocente=${idAsignacionDocente}`
    );

    alert("Calificación anual por RA publicada.");
  } catch (error: any) {
    alert(error.response?.data ?? "Error al publicar RA.");
  }
};

  return (
    <div>
      <h2>Evaluación Anual por Resultados de Aprendizaje (RA)</h2>

      <div className="card" style={{ marginBottom: 20 }}>
        <h3>Distribución de RA</h3>
        <p>
          Total asignado: <strong>{total}</strong> / 100
        </p>
        <p>
          Faltante: <strong>{faltante}</strong>
        </p>

        {total === 100 ? (
          <p style={{ color: "green", fontWeight: "bold" }}>
            RA completos. Ya puedes crear actividades.
          </p>
        ) : (
          <p style={{ color: "orange", fontWeight: "bold" }}>
            Debes completar exactamente 100 puntos.
          </p>
        )}
      </div>

      <form onSubmit={crearRA} className="form-card">
        <input
          placeholder="Nombre del RA"
          value={nombreRA}
          onChange={(e) => setNombreRA(e.target.value)}
        />

        <input
          type="number"
          placeholder="Valor máximo"
          value={valorMaximo}
          onChange={(e) => setValorMaximo(e.target.value)}
          min="1"
          max="100"
        />

        <button type="submit">Agregar RA</button>
      </form>

      <table className="data-table">
        <thead>
          <tr>
            <th>Código</th>
            <th>Resultado de Aprendizaje</th>
            <th>Valor máximo</th>
          </tr>
        </thead>

        <tbody>
          {ras.map((ra) => (
            <tr key={ra.idResultadoAprendizaje}>
              <td>{ra.codigo}</td>
              <td>{ra.nombre}</td>
              <td>{ra.valorMaximo}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3>Crear actividad por RA</h3>

      <form onSubmit={crearActividad} className="form-card">
        <select
          value={idRA}
          onChange={(e) => setIdRA(e.target.value)}
          required
        >
          <option value="">Seleccione RA</option>
          {ras.map((ra) => (
            <option
              key={ra.idResultadoAprendizaje}
              value={ra.idResultadoAprendizaje}
            >
              {ra.codigo} - {ra.nombre} ({ra.valorMaximo} pts)
            </option>
          ))}
        </select>

        <input
          placeholder="Nombre de la actividad"
          value={nombreActividad}
          onChange={(e) => setNombreActividad(e.target.value)}
          required
        />

        <button type="submit">Crear actividad</button>
      </form>

      {ras.map((ra) => {
        const actividadesRA = actividades.filter(
          (a) => a.idResultadoAprendizaje === ra.idResultadoAprendizaje
        );

        return (
            
          <div
            className="card"
            key={ra.idResultadoAprendizaje}
            style={{ marginBottom: 25 }}
          >
            <h3>
              {ra.codigo} - {ra.nombre} ({ra.valorMaximo} pts)
            </h3>

            {actividadesRA.length === 0 && (
              <p>No hay actividades registradas para este RA.</p>
            )}

            {actividadesRA.map((actividad) => (
              <div
                key={actividad.idActividadCompetencia}
                style={{ marginTop: 20 }}
              >
                <h4>{actividad.nombre}</h4>

                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Matrícula</th>
                      <th>Estudiante</th>
                      <th>Nota</th>
                      <th>Acción</th>
                    </tr>
                  </thead>

                  <tbody>
                    {estudiantes.map((est) => {
                      const key = `${actividad.idActividadCompetencia}-${est.idEstudiante}`;

                      return (
                        <tr key={key}>
                          <td>{est.matricula}</td>
                          <td>
                            {est.nombres} {est.apellidos}
                          </td>
                          <td>
                            <input
                              type="number"
                              min="0"
                              max="100"
                              value={notas[key] ?? ""}
                              onChange={(e) =>
                                setNotas({
                                  ...notas,
                                  [key]: e.target.value,
                                })
                              }
                            />
                          </td>
                          <td>
                            <button
                              onClick={() =>
                                guardarNota(
                                  actividad.idActividadCompetencia,
                                  est.idEstudiante
                                )
                              }
                            >
                              Guardar nota
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ))}
            <div className="form-card">
  <button type="button" onClick={calcularRA}>
    Calcular nota anual RA
  </button>

  <button type="button" onClick={publicarRA}>
    Publicar nota anual RA
  </button>
</div>
          </div>
        );
      })}
    </div>
  );
};

export default ModuloRA;