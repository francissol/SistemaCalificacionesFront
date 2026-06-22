import { useEffect, useState } from "react";
import api from "../../api/axiosConfig";
import { toast, ToastContainer } from 'react-toastify';

interface Props {
  idAsignacionDocente: number;
  idGrado: number;
  idMateria: number;
  idPeriodo: string;
  estudiantes: any[];
}

interface Competencia {
  idCompetencia: number;
  codigo: string;
  nombre: string;
}

interface ActividadCompetencia {
  idActividadCompetencia: number;
  idCompetencia: number;
  competencia: string;
  nombre: string;
}

const ModuloCompetenciasPrimaria = ({
  idAsignacionDocente,
  idGrado,
  idMateria,
  idPeriodo,
  estudiantes,
}: Props) => {
  const [competencias, setCompetencias] = useState<Competencia[]>([]);
  const [actividades, setActividades] = useState<ActividadCompetencia[]>([]);
  const [idCompetencia, setIdCompetencia] = useState("");
  const [nombreActividad, setNombreActividad] = useState("");
  const [notas, setNotas] = useState<Record<string, string>>({});
  const [mostrarAyuda, setMostrarAyuda] = useState(false);

  const cargarCompetencias = async () => {
    try {
      const res = await api.get(
        `/CompetenciasGradoMateria/grado/${idGrado}/materia/${idMateria}`
      );

      const dataNormalizada = res.data.map((c: any) => ({
        idCompetencia: c.idCompetencia ?? c.IdCompetencia,
        codigo: c.codigo ?? c.Codigo,
        nombre: c.nombre ?? c.Nombre,
      }));

      setCompetencias(dataNormalizada);
    } catch (error: any) {
      console.error(
        "ERROR COMPETENCIAS:",
        error.response?.status,
        error.response?.data
      );
    }
  };

  const cargarActividades = async () => {
    if (!idPeriodo) return;

    try {
      const res = await api.get(
        `/ActividadesCompetencias/asignacion/${idAsignacionDocente}/periodo/${idPeriodo}`
      );

      const dataNormalizada = res.data.map((a: any) => ({
        idActividadCompetencia:
          a.idActividadCompetencia ?? a.IdActividadCompetencia,
        idCompetencia: a.idCompetencia ?? a.IdCompetencia,
        competencia: a.competencia ?? a.Competencia,
        nombre: a.nombre ?? a.Nombre,
      }));

      setActividades(dataNormalizada);
    } catch (error) {
      console.error("Error cargando actividades:", error);
    }
  };

  const cargarNotasGuardadas = async () => {
    if (!idPeriodo) return;

    try {
      const res = await api.get(
        `/NotasCompetencias/asignacion/${idAsignacionDocente}/periodo/${idPeriodo}`
      );

      const notasCargadas: Record<string, string> = {};

      res.data.forEach((n: any) => {
        const idActividad =
          n.idActividadCompetencia ?? n.IdActividadCompetencia;
        const idEstudiante = n.idEstudiante ?? n.IdEstudiante;
        const nota = n.nota ?? n.Nota;

        const key = `${idActividad}-${idEstudiante}`;
        notasCargadas[key] = String(nota);
      });

      setNotas(notasCargadas);
    } catch (error) {
     toast.error('¡Calificaciones No guardadas!');
    }
  };

  useEffect(() => {
    cargarCompetencias();
  }, [idGrado, idMateria]);

  useEffect(() => {
    cargarActividades();
    cargarNotasGuardadas();
  }, [idPeriodo, idAsignacionDocente]);

  const crearActividad = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!idPeriodo) {
      alert("Debe seleccionar un período.");
      return;
    }

    try {
      await api.post("/ActividadesCompetencias", {
        idAsignacionDocente,
        idPeriodoPublicacion: Number(idPeriodo),
        idCompetencia: Number(idCompetencia),
        nombre: nombreActividad,
      });

      setIdCompetencia("");
      setNombreActividad("");

      await cargarActividades();
      await cargarNotasGuardadas();
    } catch (error: any) {
      alert(error.response?.data ?? "Error al crear actividad.");
    }
  };

  const guardarCalificaciones = async () => {
    const notasEnviar: any[] = [];

    for (const actividad of actividades) {
      for (const est of estudiantes) {
        const key = `${actividad.idActividadCompetencia}-${est.idEstudiante}`;
        const valor = notas[key];

        if (valor === "" || valor === undefined) {
          continue;
        }

        const nota = Number(valor);

        if (isNaN(nota) || nota < 0 || nota > 100) {
          alert("Todas las notas deben estar entre 0 y 100.");
          return;
        }

        notasEnviar.push({
          idActividadCompetencia: actividad.idActividadCompetencia,
          idEstudiante: est.idEstudiante,
          nota,
        });
      }
    }

    try {
      await api.post("/NotasCompetencias/guardar-masivo", notasEnviar);
     toast.success('¡Calificaciones guardadas exitosamente!');
      await cargarNotasGuardadas();
    } catch (error: any) {
      alert(error.response?.data ?? "Error al guardar calificaciones.");
    }
  };

  const calcular = async () => {
    try {
      await api.post(
        `/CalificacionesCompetenciasPeriodo/calcular?idAsignacionDocente=${idAsignacionDocente}&idPeriodoPublicacion=${idPeriodo}`
      );

      toast.success('¡Calificaciones calculadas exitosamente!');
    } catch (error: any) {
      alert(error.response?.data ?? "Error al calcular.");
    }
  };

  const publicar = async () => {
    try {
      await api.put(
        `/CalificacionesCompetenciasPeriodo/publicar?idAsignacionDocente=${idAsignacionDocente}&idPeriodoPublicacion=${idPeriodo}`
      );

      toast.success('¡Calificaciones publicadas exitosamente!');
    } catch (error: any) {
      alert(error.response?.data ?? "Error al publicar.");
    }
  };

  return (
    <div className="modulo-competencias">
      <div className="modulo-header">
        <h2>Evaluación por Competencias - Primaria</h2>

        <button
          type="button"
          className="btn-ayuda"
          onClick={() => setMostrarAyuda(true)}
          title="Ayuda"
        >
          🔍
        </button>
      </div>

      <form onSubmit={crearActividad} className="form-card">
        <h3>Añadir actividades por competencia</h3>

        <select
          value={idCompetencia}
          onChange={(e) => setIdCompetencia(e.target.value)}
          required
        >
          <option value="">Seleccione la competencia</option>

          {competencias.map((c) => (
            <option key={c.idCompetencia} value={c.idCompetencia}>
              {c.codigo} - {c.nombre}
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

      <div className="competencias-grid">
        {competencias.map((competencia) => {
          const actividadesCompetencia = actividades.filter(
            (a) => a.idCompetencia === competencia.idCompetencia
          );

          return (
            <div className="card competencia-card" key={competencia.idCompetencia}>
              <h3>
                {competencia.codigo} - {competencia.nombre}
              </h3>

              <p>
                Actividades registradas: {actividadesCompetencia.length} / mínimo
                3
              </p>

              {actividadesCompetencia.length === 0 && (
                <p style={{ color: "#6b7280" }}>
                  Aún no hay actividades registradas.
                </p>
              )}

              {actividadesCompetencia.map((actividad) => (
                <div
                  key={actividad.idActividadCompetencia}
                  style={{ marginTop: 20 }}
                >
                  <h4>{actividad.nombre}</h4>

                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Matrícula</th>
                        <th>Estudiantes</th>
                        <th>Nota</th>
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
                                  setNotas((prev) => ({
                                    ...prev,
                                    [key]: e.target.value,
                                  }))
                                }
                              />
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ))}
            </div>
          );
        })}
      </div>

      <div className="form-card">
        <button type="button" onClick={guardarCalificaciones}>
          Guardar calificaciones
        </button>

        <button type="button" onClick={calcular}>
          Calcular competencias
        </button>

        <button type="button" onClick={publicar}>
          Publicar competencias
        </button>
      </div>

      {mostrarAyuda && (
        <div className="modal-ayuda">
          <div className="modal-contenido">
            <h3>¿Cómo publicar calificaciones?</h3>

            <p>
              <strong>1.</strong> Seleccione el período correspondiente.
            </p>

            <p>
              <strong>2.</strong> Cree las actividades de cada competencia.
            </p>

            <p>
              <strong>3.</strong> Registre las notas de los estudiantes.
            </p>

            <p>
              <strong>4.</strong> Presione <strong>Guardar calificaciones</strong>.
            </p>

            <p>
              <strong>5.</strong> Presione <strong>Calcular competencias</strong>.
            </p>

            <p>
              <strong>6.</strong> Finalmente presione{" "}
              <strong>Publicar competencias</strong>.
            </p>
            

            <button type="button" onClick={() => setMostrarAyuda(false)}>
              Cerrar
            </button>
          </div>
        </div>
      )}

      <ToastContainer 
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
};

export default ModuloCompetenciasPrimaria;