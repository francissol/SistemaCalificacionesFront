import { useEffect, useState } from "react";
import api from "../../api/axiosConfig";
import { useAuth } from "../../auth/AuthContext";
import { useNavigate } from "react-router-dom";

interface Perfil {
  idEstudiante: number;
  matricula: string;
  nombres: string;
  apellidos: string;
  correo: string | null;
  telefono: string | null;
  curso: string | null;
  grado: string | null;
  nivel: string | null;
  usaCompetencias: boolean;
}

interface ProgresoAnualPrimaria {
  idAsignacionDocente: number;
  materia: string;
  finalArea: number;
  competencias: {
    idCompetencia: number;
    codigo: string;
    nombre: string;
    promedioCompetencia: number;
    periodos: {
      periodo: string;
      promedio: number;
    }[];
  }[];
}

interface CalificacionPrimaria {
  idAsignacionDocente: number;
  idPeriodoPublicacion: number;
  materia: string;
  periodo: string;
  notaFinal: number;
  fechaPublicacion: string;
  competencias: {
    idCompetencia: number;
    codigo: string;
    nombre: string;
    promedio: number;
  }[];
}

interface DesglosePrimaria {
  materia: string;
  periodo: string;
  finalPeriodo: number;
  competencias: {
    idCompetencia: number;
    codigo: string;
    nombre: string;
    promedio: number;
    actividades: {
      actividad: string;
      nota: number;
    }[];
  }[];
}

interface Materia {
  idAsignacionDocente: number;
  materia: string;
  maestro: string;
}

interface Calificacion {
  idAsignacionDocente: number;
  idPeriodoPublicacion: number;
  materia: string;
  periodo: string;
  notaFinal: number;
  fechaPublicacion: string;
}

interface Observacion {
  materia: string;
  periodo: string;
  comentario: string;
  fechaRegistro: string;
}

const DashboardEstudiante = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [perfil, setPerfil] = useState<Perfil | null>(null);
  const [materias, setMaterias] = useState<Materia[]>([]);
  const [calificaciones, setCalificaciones] = useState<Calificacion[]>([]);
  const [calificacionesPrimaria, setCalificacionesPrimaria] = useState<CalificacionPrimaria[]>([]);
  const [progresoAnualPrimaria, setProgresoAnualPrimaria] = useState<ProgresoAnualPrimaria[]>([]);
  const [observaciones, setObservaciones] = useState<Observacion[]>([]);

  const [desglose, setDesglose] = useState<any>(null);
  const [desglosePrimariaDetalle, setDesglosePrimariaDetalle] =
    useState<DesglosePrimaria | null>(null);

  useEffect(() => {
    const cargarDatos = async () => {
      const [resPerfil, resMaterias, resCalificaciones, resObservaciones] =
        await Promise.all([
          api.get("/PanelEstudiante/mi-perfil"),
          api.get("/PanelEstudiante/mis-materias"),
          api.get("/PanelEstudiante/mis-calificaciones"),
          api.get("/PanelEstudiante/mis-observaciones"),
        ]);

      setPerfil(resPerfil.data);
      setMaterias(resMaterias.data);
      setCalificaciones(resCalificaciones.data);
      setObservaciones(resObservaciones.data);

      if (resPerfil.data.usaCompetencias) {
        const [resPrimaria, resProgreso] = await Promise.all([
          api.get("/PanelEstudiante/mis-calificaciones-primaria"),
          api.get("/PanelEstudiante/progreso-anual-primaria"),
        ]);

        setCalificacionesPrimaria(resPrimaria.data);
        setProgresoAnualPrimaria(resProgreso.data);
      }
    };

    cargarDatos();
  }, []);

  const cerrarSesion = () => {
    logout();
    navigate("/");
  };

  const verDesglose = async (calificacion: Calificacion) => {
    const res = await api.get(
      `/PanelEstudiante/desglose-calificacion?idAsignacionDocente=${calificacion.idAsignacionDocente}&idPeriodoPublicacion=${calificacion.idPeriodoPublicacion}`
    );

    setDesglose({
      materia: calificacion.materia,
      periodo: calificacion.periodo,
      ...res.data,
    });
  };

  

  const verDesglosePrimaria = async (
    idAsignacionDocente: number,
    idPeriodoPublicacion: number
  ) => {
    const res = await api.get(
      `/PanelEstudiante/desglose-primaria?idAsignacionDocente=${idAsignacionDocente}&idPeriodoPublicacion=${idPeriodoPublicacion}`
    );

    setDesglosePrimariaDetalle(res.data);
  };

  return (
    <div style={{ padding: 30 }}>
      <header style={{ display: "flex", justifyContent: "space-between" }}>
        <div>
          <h1>Panel Estudiante</h1>
          <p>Usuario: {user?.nombreUsuario}</p>
        </div>

        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={() => navigate("/cambiar-password")}>
            Cambiar contraseña
          </button>

          <button onClick={cerrarSesion}>Cerrar sesión</button>
        </div>
      </header>

      {perfil && (
        <div className="card" style={{ marginBottom: 20 }}>
          <h2>
            {perfil.nombres} {perfil.apellidos}
          </h2>
          <p>Matrícula: {perfil.matricula}</p>
          <p>Curso: {perfil.curso}</p>
          <p>Grado: {perfil.grado}</p>
          <p>Nivel: {perfil.nivel ?? "No registrado"}</p>
          <p>Correo: {perfil.correo ?? "No registrado"}</p>
          <p>Teléfono: {perfil.telefono ?? "No registrado"}</p>
        </div>
      )}

      <h2>Mis materias</h2>

      <div className="card-grid">
        {materias.map((m) => (
          <div className="card" key={m.idAsignacionDocente}>
            <h3>{m.materia}</h3>
            <p>Maestro: {m.maestro}</p>
          </div>
        ))}
      </div>

      {perfil && perfil.usaCompetencias && (
        <>
          <h2 style={{ marginTop: 30 }}>Calificaciones por período</h2>

          <table className="data-table">
            <thead>
              <tr>
                <th>Materia</th>
                <th>Período</th>
                <th>Nota final</th>
                <th>Publicada</th>
                <th>Acción</th>
              </tr>
            </thead>

            <tbody>
              {calificacionesPrimaria.map((c, index) => (
                <tr key={index}>
                  <td>{c.materia}</td>
                  <td>{c.periodo}</td>
                  <td>{c.notaFinal}</td>
                  <td>{c.fechaPublicacion?.substring(0, 10)}</td>
                  <td>
                    <button
                      onClick={() =>
                        verDesglosePrimaria(
                          c.idAsignacionDocente,
                          c.idPeriodoPublicacion
                        )
                      }
                    >
                      Ver desglose
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {desglosePrimariaDetalle && (
            <div className="card" style={{ marginTop: 20 }}>
              <h3>
                Desglose - {desglosePrimariaDetalle.materia} /{" "}
                {desglosePrimariaDetalle.periodo}
              </h3>

              <table className="data-table">
                <thead>
                  <tr>
                    <th>Competencia</th>
                    <th>Promedio</th>
                  </tr>
                </thead>

                <tbody>
                  {desglosePrimariaDetalle.competencias.map((comp) => (
                    <tr key={comp.idCompetencia}>
                      <td>
                        {comp.codigo} - {comp.nombre}
                      </td>
                      <td>{comp.promedio}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <h3>Final del período: {desglosePrimariaDetalle.finalPeriodo}</h3>

              <h3>Desglose de actividades</h3>

              {desglosePrimariaDetalle.competencias.map((comp) => (
                <div key={comp.idCompetencia} style={{ marginBottom: 20 }}>
                  <h4>
                    {comp.codigo} - {comp.nombre}
                  </h4>

                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Actividad</th>
                        <th>Nota</th>
                      </tr>
                    </thead>

                    <tbody>
                      {comp.actividades.map((act, index) => (
                        <tr key={index}>
                          <td>{act.actividad}</td>
                          <td>{act.nota}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ))}

              <button onClick={() => setDesglosePrimariaDetalle(null)}>
                Cerrar desglose
              </button>
            </div>
          )}

          <h2 style={{ marginTop: 30 }}>Progreso anual por área</h2>

          {progresoAnualPrimaria.map((area) => (
            <div
              className="card"
              key={area.idAsignacionDocente}
              style={{ marginBottom: 25 }}
            >
              <h3>{area.materia}</h3>

              <table className="data-table">
                <thead>
                  <tr>
                    <th>Competencia</th>
                    <th>P1</th>
                    <th>P2</th>
                    <th>P3</th>
                    <th>P4</th>
                    <th>Promedio competencia</th>
                  </tr>
                </thead>

                <tbody>
                  {area.competencias.map((comp) => {
                    const [p1, p2, p3, p4] = comp.periodos;

                    return (
                      <tr key={comp.idCompetencia}>
                        <td>{comp.codigo}</td>
                        <td>{p1?.promedio ?? "-"}</td>
                        <td>{p2?.promedio ?? "-"}</td>
                        <td>{p3?.promedio ?? "-"}</td>
                        <td>{p4?.promedio ?? "-"}</td>
                        <td>{comp.promedioCompetencia}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              <h3>Final del área: {area.finalArea}</h3>
            </div>
          ))}
        </>
      )}

      {perfil && !perfil.usaCompetencias && (
        <>
          <h2 style={{ marginTop: 30 }}>Mis calificaciones</h2>

          <table className="data-table">
            <thead>
              <tr>
                <th>Materia</th>
                <th>Período</th>
                <th>Nota</th>
                <th>Publicada</th>
                <th>Acción</th>
              </tr>
            </thead>

            <tbody>
              {calificaciones.map((c, index) => (
                <tr key={index}>
                  <td>{c.materia}</td>
                  <td>{c.periodo}</td>
                  <td>{c.notaFinal}</td>
                  <td>{c.fechaPublicacion?.substring(0, 10)}</td>
                  <td>
                    <button onClick={() => verDesglose(c)}>
                      Ver desglose
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {desglose && (
            <div className="card" style={{ marginTop: 20 }}>
              <h3>
                Desglose - {desglose.materia} / {desglose.periodo}
              </h3>

              <table className="data-table">
                <thead>
                  <tr>
                    <th>Actividad</th>
                    <th>Porcentaje</th>
                    <th>Nota</th>
                    <th>Valor calculado</th>
                  </tr>
                </thead>

                <tbody>
                  {desglose.desglose.map((d: any, index: number) => (
                    <tr key={index}>
                      <td>{d.actividad}</td>
                      <td>{d.porcentaje}%</td>
                      <td>{d.nota}</td>
                      <td>{d.valorCalculado}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <h3>Nota final: {desglose.notaFinal}</h3>

              <button onClick={() => setDesglose(null)}>Cerrar</button>
            </div>
          )}
        </>
      )}

      <h2 style={{ marginTop: 30 }}>Mis observaciones</h2>

      <table className="data-table">
        <thead>
          <tr>
            <th>Materia</th>
            <th>Período</th>
            <th>Observación</th>
            <th>Fecha</th>
          </tr>
        </thead>

        <tbody>
          {observaciones.map((o, index) => (
            <tr key={index}>
              <td>{o.materia}</td>
              <td>{o.periodo}</td>
              <td>{o.comentario}</td>
              <td>{o.fechaRegistro?.substring(0, 10)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DashboardEstudiante;
