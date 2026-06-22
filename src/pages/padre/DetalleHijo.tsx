import { useEffect, useState } from "react";
import api from "../../api/axiosConfig";

interface Hijo {
  idEstudiante: number;
  matricula: string;
  nombres: string;
  apellidos: string;
  curso: string;
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

const DetalleHijo = ({ hijo }: { hijo: Hijo }) => {
  const [calificaciones, setCalificaciones] = useState<Calificacion[]>([]);
  const [observaciones, setObservaciones] = useState<Observacion[]>([]);
  const [desglose, setDesglose] = useState<any>(null);

  useEffect(() => {
    const cargar = async () => {
      const [resCalificaciones, resObservaciones] = await Promise.all([
        api.get(`/PanelPadre/hijo/${hijo.idEstudiante}/calificaciones`),
        api.get(`/PanelPadre/hijo/${hijo.idEstudiante}/observaciones`),
      ]);

      setCalificaciones(resCalificaciones.data);
      setObservaciones(resObservaciones.data);
      setDesglose(null);
    };

    cargar();
  }, [hijo.idEstudiante]);

  const verDesglose = async (calificacion: Calificacion) => {
    const res = await api.get(
      `/PanelPadre/hijo/${hijo.idEstudiante}/desglose-calificacion?idAsignacionDocente=${calificacion.idAsignacionDocente}&idPeriodoPublicacion=${calificacion.idPeriodoPublicacion}`
    );

    setDesglose({
      materia: calificacion.materia,
      periodo: calificacion.periodo,
      ...res.data,
    });
  };

  return (
    <div style={{ marginTop: 30 }}>
      <div className="card" style={{ marginBottom: 20 }}>
        <h2>
          Detalle de {hijo.nombres} {hijo.apellidos}
        </h2>
        <p>Matrícula: {hijo.matricula}</p>
        <p>Curso: {hijo.curso}</p>
      </div>

      <h2>Calificaciones</h2>

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

          <button onClick={() => setDesglose(null)}>
            Cerrar desglose
          </button>
        </div>
      )}

      <h2 style={{ marginTop: 30 }}>Observaciones para padres</h2>

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

export default DetalleHijo;