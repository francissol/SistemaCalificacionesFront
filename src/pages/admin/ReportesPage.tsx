import { useEffect, useState } from "react";
import api from "../../api/axiosConfig";
import ReporteSecundariaAnual3ro from "../../Componentes/Reportes/Secundaria/ReporteSecundariaAnual3ro";
import ReportePrimariaAnual4to from "../../Componentes/Reportes/Primaria/ReportePrimariaAnual4to";
import ReportePrimariaAnual5to from "../../Componentes/Reportes/Primaria/ReportePrimariaAnual5to";
import ReportePrimariaAnual6to from "../../Componentes/Reportes/Primaria/ReportePrimariaAnual6to";
import ReporteSecundariaAnual2do from "../../Componentes/Reportes/Secundaria/ReporteSecundariaAnual2do";
import ReporteSecundariaAnual1ro from "../../Componentes/Reportes/Secundaria/ReporteSecundariaAnual1ro";
import ReportePolitecnicoAnual6to from "../../Componentes/Reportes/Politecnico/ReportePolitecnicoAnual6to";
import ReportePolitecnicoAnual5to from "../../Componentes/Reportes/Politecnico/ReportePolitecnicoAnual5to";
import ReportePolitecnicoAnual4to from "../../Componentes/Reportes/Politecnico/ReportePolitecnicoAnual4to";
import "../../Styles/ReportesPrint.css";
interface Estudiante {
  idEstudiante: number;
  matricula: string;
  nombres: string;
  apellidos: string;
}

interface Curso {
  idCurso: number;
  nombre: string;
  grado: string;
  nivel: string;
}

interface Periodo {
  idPeriodoPublicacion: number;
  nombre: string;
}

interface MateriaReporte {
  materia?: string;
  Materia?: string;
  c1?: number | null;
  C1?: number | null;
  c2?: number | null;
  C2?: number | null;
  c3?: number | null;
  C3?: number | null;
  c4?: number | null;
  C4?: number | null;
  promedioFinal?: number;
  PromedioFinal?: number;
}

interface ReporteEstudiante {
  idEstudiante?: number;
  IdEstudiante?: number;
  estudiante?: string;
  Estudiante?: string;
  grado?: string;
  Grado?: string;
  periodo?: string;
  Periodo?: string;
  materias?: MateriaReporte[];
  Materias?: MateriaReporte[];
}

const ReportesPage = () => {
  const [estudiantes, setEstudiantes] = useState<Estudiante[]>([]);
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [periodos, setPeriodos] = useState<Periodo[]>([]);

  const [idEstudiante, setIdEstudiante] = useState("");
  const [idCurso, setIdCurso] = useState("");
  const [idPeriodo, setIdPeriodo] = useState("");

  const [resultado, setResultado] = useState<any>(null);
  const [mostrarTablaPendientes, setMostrarTablaPendientes] = useState(false);
  
  const [reportesPrimaria, setReportesPrimaria] = useState<ReporteEstudiante[]>([]);
  const [reportesSecundaria, setReportesSecundaria] = useState<ReporteEstudiante[]>([]);
  const [reportesSecundariaAnual, setReportesSecundariaAnual] = useState<any[]>([]);
  const [tituloReporte, setTituloReporte] = useState("");
  const [reportesPrimariaAnual, setReportesPrimariaAnual] = useState<any[]>([]);
  const [gradoReporteSecundaria, setGradoReporteSecundaria] = useState("");
  const [reportesPolitecnico, setReportesPolitecnico] = useState<any[]>([]);
  const [reportesPolitecnicoAnual, setReportesPolitecnicoAnual] = useState<any[]>([]);
  const [gradoReportePolitecnico, setGradoReportePolitecnico] = useState("");
  const [gradoReportePrimaria, setGradoReportePrimaria] = useState("");

  useEffect(() => {
    const cargar = async () => {
      const [resEstudiantes, resCursos, resPeriodos] = await Promise.all([
        api.get("/Estudiantes"),
        api.get("/Cursos"),
        api.get("/PeriodosPublicacion"),
      ]);
      setEstudiantes(resEstudiantes.data);
      setCursos(resCursos.data);
      setPeriodos(resPeriodos.data);
    };
    cargar();
  }, []);

  const limpiarReportes = () => {
    setReportesPrimaria([]);
    setReportesSecundaria([]);
    setReportesSecundariaAnual([]);
    setReportesPrimariaAnual([]);
    setGradoReportePrimaria("");
    setGradoReporteSecundaria("");
    setReportesPolitecnico([]);
    setReportesPolitecnicoAnual([]);
    setGradoReportePolitecnico("");
    setTituloReporte("");
    setMostrarTablaPendientes(false);
  };

  const boletinEstudiante = async () => {
    if (!idEstudiante) return alert("Selecciona un estudiante.");
    const res = await api.get(`/Reportes/boletin-estudiante/${idEstudiante}`);
    setResultado(res.data);
    limpiarReportes();
    setTituloReporte("Boletín de estudiante");
  };

  const calificacionesCurso = async () => {
    if (!idCurso || !idPeriodo) return alert("Selecciona curso y período.");
    const res = await api.get(`/Reportes/calificaciones-curso?idCurso=${idCurso}&idPeriodoPublicacion=${idPeriodo}`);
    setResultado(res.data);
    limpiarReportes();
    setTituloReporte("Calificaciones por curso");
  };

  const reporteAnualPrimaria = async () => {
    if (!idCurso) return alert("Selecciona un curso.");
    try {
      const res = await api.get(`/Reportes/primaria/anual/curso/${idCurso}`);
      const data = res.data;
      setReportesPrimariaAnual(data.reportes ?? data.Reportes ?? []);
      setGradoReportePrimaria(data.grado ?? data.Grado ?? "");
      setReportesPrimaria([]);
      setReportesSecundaria([]);
      setGradoReporteSecundaria(data.grado ?? data.Grado ?? "");
      setReportesSecundariaAnual([]);
      setResultado(null);
      setMostrarTablaPendientes(false);
      setTituloReporte(`${data.grado ?? data.Grado} - ${data.curso ?? data.Curso} / Reporte anual primaria`);
    } catch (error: any) {
      alert(error.response?.data ?? "Error al generar reporte anual de primaria.");
    }
  };

  const reportePrimariaCursoPeriodo = async () => {
    if (!idCurso || !idPeriodo) return alert("Selecciona curso y período.");
    try {
      const res = await api.get(`/Reportes/primaria/curso/${idCurso}/periodo/${idPeriodo}`);
      const data = res.data;

      
      setReportesPrimaria(data.reportes ?? data.Reportes ?? []);

       console.log("DATA REPORTE PRIMARIA:", data);
       console.log("REPORTES:", data.reportes ?? data.Reportes);
    console.log("CANTIDAD:", (data.reportes ?? data.Reportes).length);
      setReportesSecundaria([]);
      setReportesSecundariaAnual([]);
      setResultado(null);
      setMostrarTablaPendientes(false);
      setTituloReporte(`${data.grado ?? data.Grado} - ${data.curso ?? data.Curso} / ${data.periodo ?? data.Periodo}`);
    } catch (error: any) {
      alert(error.response?.data ?? "Error al generar reporte de primaria.");
    }
  };

  const reporteSecundariaCursoPeriodo = async () => {
    if (!idCurso || !idPeriodo) return alert("Selecciona curso y período.");
    try {
      const res = await api.get(`/Reportes/secundaria/curso/${idCurso}/periodo/${idPeriodo}`);
      const data = res.data;
      setReportesSecundaria(data.reportes ?? data.Reportes ?? []);
      setReportesPrimaria([]);
      setReportesSecundariaAnual([]);
      setResultado(null);
      setMostrarTablaPendientes(false);
      setTituloReporte(`${data.grado ?? data.Grado} - ${data.curso ?? data.Curso} / ${data.periodo ?? data.Periodo}`);
    } catch (error: any) {
      alert(error.response?.data ?? "Error al generar reporte de secundaria.");
    }
  };

  const reporteAnualSecundaria = async () => {
    if (!idCurso) return alert("Selecciona un curso.");
    try {
      const res = await api.get(`/Reportes/secundaria/anual/curso/${idCurso}`);
      const data = res.data;
      setReportesSecundariaAnual(data.reportes ?? data.Reportes ?? []);
      setGradoReporteSecundaria(data.grado ?? data.Grado ?? "");
      setReportesPrimaria([]);
      setReportesSecundaria([]);
      setResultado(null);
      setMostrarTablaPendientes(false);
      setTituloReporte(`${data.grado ?? data.Grado} - ${data.curso ?? data.Curso} / Reporte anual`);
    } catch (error: any) {
      alert(error.response?.data ?? "Error al generar reporte anual.");
    }
  };

  const reportePolitecnicoCursoPeriodo = async () => {
    if (!idCurso || !idPeriodo) return alert("Selecciona curso y período.");
    try {
      const res = await api.get(`/Reportes/politecnico/curso/${idCurso}/periodo/${idPeriodo}`);
      const data = res.data;
      setReportesPolitecnico(data.reportes ?? data.Reportes ?? []);
      setReportesPrimaria([]);
      setReportesSecundaria([]);
      setReportesPrimariaAnual([]);
      setReportesSecundariaAnual([]);
      setResultado(null);
      setMostrarTablaPendientes(false);
      setTituloReporte(`${data.grado ?? data.Grado} - ${data.curso ?? data.Curso} / ${data.periodo ?? data.Periodo} / Reporte politécnico`);
    } catch (error: any) {
      alert(error.response?.data ?? "Error al generar reporte politécnico.");
    }
  };

  const reporteAnualPolitecnico = async () => {
    if (!idCurso) return alert("Selecciona un curso.");
    try {
      const res = await api.get(`/Reportes/politecnico/anual/curso/${idCurso}`);
      const data = res.data;
      setReportesPolitecnicoAnual(data.reportes ?? data.Reportes ?? []);
      setGradoReportePolitecnico(data.grado ?? data.Grado ?? "");
      setReportesPrimaria([]);
      setReportesSecundaria([]);
      setReportesPolitecnico([]);
      setReportesPrimariaAnual([]);
      setReportesSecundariaAnual([]);
      setResultado(null);
      setMostrarTablaPendientes(false);
      setTituloReporte(`${data.grado ?? data.Grado} - ${data.curso ?? data.Curso} / Reporte anual politécnico`);
    } catch (error: any) {
      alert(error.response?.data ?? "Error al generar reporte anual politécnico.");
    }
  };

  const maestrosPendientes = async () => {
    if (!idPeriodo) return alert("Selecciona un período.");
    const res = await api.get(`/Reportes/maestros-pendientes?idPeriodoPublicacion=${idPeriodo}`);
    setResultado(res.data);
    setMostrarTablaPendientes(true);
    
    // Reseteamos las vistas de impresión
    setReportesPrimaria([]);
    setReportesSecundaria([]);
    setReportesSecundariaAnual([]);
    setReportesPrimariaAnual([]);
    setReportesPolitecnico([]);
    setReportesPolitecnicoAnual([]);
    setTituloReporte("Listado de Maestros con Calificaciones Pendientes");
  };

  const imprimir = () => {
    window.print();
  };

  const tieneReportesParaImprimir = 
    reportesPrimaria.length > 0 ||
    reportesSecundaria.length > 0 ||
    reportesSecundariaAnual.length > 0 ||
    reportesPolitecnico.length > 0 ||
    reportesPolitecnicoAnual.length > 0 ||
    reportesPrimariaAnual.length > 0;

    const user = JSON.parse(localStorage.getItem("user") || "{}");
const rol = user?.rol;

const puedeVerPrimaria =
  rol === "Administrador" || rol === "CoordinadorPrimaria";

const puedeVerSecundaria =
  rol === "Administrador" || rol === "CoordinadorSecundaria";

const puedeVerPolitecnico =
  rol === "Administrador" || rol === "CoordinadorPolitecnico";


  return (
   
  <div className="reportes-container">
    <div className="no-print">
      <div className="reportes-view-header">
        <h1>Gestión de Reportes</h1>

        {tieneReportesParaImprimir && (
          <button className="btn-print-main" onClick={imprimir}>
            🖨️ Imprimir Reportes Generados
          </button>
        )}
      </div>

      <div className="reportes-grid-niveles">
        {puedeVerPrimaria && (
          <div className="card-reporte-modulo primaria">
            <div className="modulo-badge badge-primaria">Nivel Primario</div>
            <h3>Calificaciones de Primaria</h3>
            <p className="modulo-desc">
              Filtra por curso y periodo para generar reportes regulares o por competencias.
            </p>

            <div className="form-vertical-reporte">
              <select value={idCurso} onChange={(e) => setIdCurso(e.target.value)}>
                <option value="">Seleccione curso</option>
                {cursos
                  .filter(
                    (c) =>
                      c.nivel.toLowerCase().includes("prim") ||
                      c.nivel.toLowerCase().includes("bás")
                  )
                  .map((c) => (
                    <option key={c.idCurso} value={c.idCurso}>
                      {c.nivel} - {c.grado} - {c.nombre}
                    </option>
                  ))}
              </select>

              <select value={idPeriodo} onChange={(e) => setIdPeriodo(e.target.value)}>
                <option value="">Seleccione período</option>
                {periodos.map((p) => (
                  <option key={p.idPeriodoPublicacion} value={p.idPeriodoPublicacion}>
                    {p.nombre}
                  </option>
                ))}
              </select>

              <button className="btn-accion-modulo" onClick={reportePrimariaCursoPeriodo}>
                Reporte por Período (Competencias)
              </button>

              <button className="btn-accion-modulo btn-anual" onClick={reporteAnualPrimaria}>
                Generar Reporte Anual Primaria
              </button>
            </div>
          </div>
        )}

        {puedeVerSecundaria && (
          <div className="card-reporte-modulo secundaria">
            <div className="modulo-badge badge-secundaria">Nivel Secundario</div>
            <h3>Calificaciones de Secundaria</h3>
            <p className="modulo-desc">
              Reportes de rendimiento enfocados en los cuatro bloques de competencias fundamentales.
            </p>

            <div className="form-vertical-reporte">
              <select value={idCurso} onChange={(e) => setIdCurso(e.target.value)}>
                <option value="">Seleccione curso</option>
                {cursos
                  .filter((c) => c.nivel.toLowerCase().includes("sec"))
                  .map((c) => (
                    <option key={c.idCurso} value={c.idCurso}>
                      {c.nivel} - {c.grado} - {c.nombre}
                    </option>
                  ))}
              </select>

              <select value={idPeriodo} onChange={(e) => setIdPeriodo(e.target.value)}>
                <option value="">Seleccione período</option>
                {periodos.map((p) => (
                  <option key={p.idPeriodoPublicacion} value={p.idPeriodoPublicacion}>
                    {p.nombre}
                  </option>
                ))}
              </select>

              <button className="btn-accion-modulo" onClick={reporteSecundariaCursoPeriodo}>
                Reporte por Período (Competencias)
              </button>

              <button className="btn-accion-modulo btn-anual" onClick={reporteAnualSecundaria}>
                Generar Reporte Anual Secundaria
              </button>
            </div>
          </div>
        )}

        {puedeVerPolitecnico && (
          <div className="card-reporte-modulo politecnico">
            <div className="modulo-badge badge-politecnico">Politécnico</div>
            <h3>Calificaciones de Politécnico</h3>
            <p className="modulo-desc">
              Gestión que incluye módulos de asignaturas regulares y Resultados de Aprendizaje (RA).
            </p>

            <div className="form-vertical-reporte">
              <select value={idCurso} onChange={(e) => setIdCurso(e.target.value)}>
                <option value="">Seleccione curso</option>
                {cursos
                  .filter(
                    (c) =>
                      c.nivel.toLowerCase().includes("pol") ||
                      c.nivel.toLowerCase().includes("téc")
                  )
                  .map((c) => (
                    <option key={c.idCurso} value={c.idCurso}>
                      {c.nivel} - {c.grado} - {c.nombre}
                    </option>
                  ))}
              </select>

              <select value={idPeriodo} onChange={(e) => setIdPeriodo(e.target.value)}>
                <option value="">Seleccione período</option>
                {periodos.map((p) => (
                  <option key={p.idPeriodoPublicacion} value={p.idPeriodoPublicacion}>
                    {p.nombre}
                  </option>
                ))}
              </select>

              <button className="btn-accion-modulo" onClick={reportePolitecnicoCursoPeriodo}>
                Reporte Politécnico por Período
              </button>

              <button className="btn-accion-modulo btn-anual" onClick={reporteAnualPolitecnico}>
                Generar Reporte Anual Politécnico
              </button>
            </div>
          </div>
        )}
      </div>

      {(rol === "Administrador" || rol === "CoordinadorSecundaria" || rol === "CoordinadorPrimaria" || rol === "CoordinadorPolitecnico" ) && (
        <div className="card-reporte-modulo pendientes-seccion">
          <div className="pendientes-header">
            <h3>⚠️ Control de Maestros Pendientes</h3>
            <p>
              Monitoreo en tiempo real de docentes que faltan por publicar sus notas en el sistema.
            </p>
          </div>

          <div className="form-row-reporte">
            <select value={idPeriodo} onChange={(e) => setIdPeriodo(e.target.value)}>
              <option value="">Seleccione período a auditar</option>
              {periodos.map((p) => (
                <option key={p.idPeriodoPublicacion} value={p.idPeriodoPublicacion}>
                  {p.nombre}
                </option>
              ))}
            </select>

            <button className="btn-pendiente" onClick={maestrosPendientes}>
              Auditar Periodo
            </button>
          </div>
        </div>
      )}

      {resultado && resultado.detalle && (
  <div className="auditoria-card">

    <div className="auditoria-header">
      <div>
        <h2>Auditoría de Publicación de Calificaciones</h2>
        <p>
          Período: <strong>{resultado.periodo}</strong>
        </p>
      </div>

      <div className="auditoria-resumen">
        <div className="resumen-item">
          <span>Total</span>
          <strong>{resultado.totalAsignaciones}</strong>
        </div>

        <div className="resumen-item completado">
          <span>Completadas</span>
          <strong>{resultado.completadas}</strong>
        </div>

        <div className="resumen-item pendiente">
          <span>Pendientes</span>
          <strong>{resultado.pendientes}</strong>
        </div>
      </div>
    </div>

    <table className="auditoria-table">
      <thead>
        <tr>
          <th>Docente</th>
          <th>Materia</th>
          <th>Curso</th>
          <th>Grado</th>
          <th>Nivel</th>
          <th>Publicadas</th>
          <th>Estudiantes</th>
          <th>Estado</th>
        </tr>
      </thead>

      <tbody>
        {resultado.detalle.map((item: any, index: number) => (
         <tr
  key={index}
  className={
    (item.estado ?? item.Estado) === "Completado"
      ? "fila-completada"
      : "fila-pendiente"
  }
>
            <td>{item.maestro ?? item.Maestro}</td>

            <td>{item.materia ?? item.Materia}</td>

            <td>{item.curso ?? item.Curso}</td>

            <td>{item.grado ?? item.Grado}</td>

            <td>
              <span className="nivel-tag">
                {item.nivel ?? item.Nivel}
              </span>
            </td>

            <td>
              {item.totalPublicadas ?? item.TotalPublicadas}
            </td>

            <td>
              {item.totalEstudiantes ?? item.TotalEstudiantes}
            </td>

            <td>
              <span
                className={
                  (item.estado ?? item.Estado) === "Completado"
                    ? "estado-ok"
                    : "estado-pendiente"
                }
              >
                {item.estado ?? item.Estado}
              </span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)}
      
      
    </div>

    <div id="area-impresion">
      {reportesPrimaria.length > 0 && (
        <div className="reportes-print">
          {reportesPrimaria.map((r, index) => {
            const materias = r.materias ?? r.Materias ?? [];

            return (
              <div className="reporte-estudiante" key={r.idEstudiante ?? r.IdEstudiante ?? index}>
                <div className="reporte-header">
                  <div>
                    <strong>Fundación MIR María Auxiliadora</strong>
                    <p>Año Escolar 2025-2026 | Distrito Educativo 05-03</p>
                    <p>Calificaciones de Rendimiento | Nivel Primario</p>
                  </div>
                  <div className="fecha-reporte">{new Date().toLocaleDateString()}</div>
                </div>

                <div className="reporte-info">
                  <div>
                    <strong>Docente:</strong>
                  </div>
                  <div>
                    <strong>Grado:</strong> {r.grado ?? r.Grado}
                  </div>
                  <div>
                    <strong>Alumno/a:</strong> {r.estudiante ?? r.Estudiante}
                  </div>
                  <div>
                    <strong>No.:</strong> {index + 1}
                  </div>
                </div>

                <table className="boletin-tabla">
                  <thead>
                    <tr>
                      <th rowSpan={2}>Asignaturas</th>
                      <th colSpan={2}>C1 Comunicativa</th>
                      <th colSpan={2}>C2 Pensamiento lógico</th>
                      <th colSpan={2}>C3 Ética y ciudadana</th>
                      <th rowSpan={2}>Promedio final</th>
                      <th rowSpan={2}>Observaciones</th>
                    </tr>
                    <tr>
                      <th>{r.periodo ?? r.Periodo}</th>
                      <th>RP</th>
                      <th>{r.periodo ?? r.Periodo}</th>
                      <th>RP</th>
                      <th>{r.periodo ?? r.Periodo}</th>
                      <th>RP</th>
                    </tr>
                  </thead>

                  <tbody>
                    {materias.map((m, i) => (
                      <tr key={i}>
                        <td>{m.materia ?? m.Materia}</td>
                        <td>{m.c1 ?? m.C1 ?? "-"}</td>
                        <td></td>
                        <td>{m.c2 ?? m.C2 ?? "-"}</td>
                        <td></td>
                        <td>{m.c3 ?? m.C3 ?? "-"}</td>
                        <td></td>
                        <td>{m.promedioFinal ?? m.PromedioFinal ?? "-"}</td>
                        <td></td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <p className="recorte-texto">Recorte por estudiante</p>
              </div>
            );
          })}
        </div>
      )}

      {reportesSecundaria.length > 0 && (
        <div className="reportes-print">
          {reportesSecundaria.map((r, index) => {
            const materias = r.materias ?? r.Materias ?? [];

            return (
              <div className="reporte-estudiante" key={r.idEstudiante ?? r.IdEstudiante ?? index}>
                <div className="reporte-header">
                  <div>
                    <strong>Fundación MIR María Auxiliadora</strong>
                    <p>Año Escolar 2025-2026 | Distrito Educativo 05-03</p>
                    <p>Calificaciones de Rendimiento | Nivel Secundario</p>
                  </div>
                  <div className="fecha-reporte">{new Date().toLocaleDateString()}</div>
                </div>

                <div className="reporte-info">
                  <div>
                    <strong>Docente:</strong>
                  </div>
                  <div>
                    <strong>Grado:</strong> {r.grado ?? r.Grado}
                  </div>
                  <div>
                    <strong>Alumno/a:</strong> {r.estudiante ?? r.Estudiante}
                  </div>
                  <div>
                    <strong>No.:</strong> {index + 1}
                  </div>
                </div>

                <table className="boletin-tabla">
                  <thead>
                    <tr>
                      <th rowSpan={3} className="asignaturas-cell">
                        ASIGNATURAS
                      </th>

                      <th colSpan={8} className="titulo-competencias">
                        Calificaciones / Competencias Fundamentales
                      </th>

                      <th rowSpan={3} className="observaciones-cell">
                        Observaciones
                      </th>
                    </tr>

                    <tr>
                      <th colSpan={2}>• Comunicativa</th>
                      <th colSpan={2}>
                        • Pensamiento Lógico, Creativo y Crítico
                        <br />
                        • Resolución de Problemas
                        <br />
                        • Científica y Tecnológica
                      </th>
                      <th colSpan={2}>
                        • Ética y Ciudadana
                        <br />
                        • Desarrollo Personal y Espiritual
                        <br />
                        • Ambiental y de la Salud
                      </th>
                      <th colSpan={2}>
                        • Ética y Ciudadana
                        <br />
                        • Desarrollo Personal y Espiritual
                      </th>
                    </tr>

                    <tr>
                      <th>{r.periodo ?? r.Periodo}</th>
                      <th>RP</th>
                      <th>{r.periodo ?? r.Periodo}</th>
                      <th>RP</th>
                      <th>{r.periodo ?? r.Periodo}</th>
                      <th>RP</th>
                      <th>{r.periodo ?? r.Periodo}</th>
                      <th>RP</th>
                    </tr>
                  </thead>

                  <tbody>
                    {materias.map((m, i) => (
                      <tr key={i}>
                        <td>{m.materia ?? m.Materia}</td>
                        <td>{m.c1 ?? m.C1 ?? ""}</td>
                        <td></td>
                        <td>{m.c2 ?? m.C2 ?? ""}</td>
                        <td></td>
                        <td>{m.c3 ?? m.C3 ?? ""}</td>
                        <td></td>
                        <td>{m.c4 ?? m.C4 ?? ""}</td>
                        <td></td>
                        <td></td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <p className="recorte-texto">Recorte por estudiante</p>
              </div>
            );
          })}
        </div>
      )}

      {reportesPolitecnico.length > 0 && (
        <div className="reportes-print">
          {reportesPolitecnico.map((r, index) => {
            const normales = r.materiasNormales ?? r.MateriasNormales ?? [];
            const tecnicas = r.materiasTecnicas ?? r.MateriasTecnicas ?? [];

            return (
              <div className="reporte-estudiante" key={r.idEstudiante ?? index}>
                <div className="reporte-header">
                  <div>
                    <strong>Fundación MIR María Auxiliadora</strong>
                    <p>Año Escolar 2025-2026 | Distrito Educativo 05-03</p>
                    <p>Calificaciones de Rendimiento | Nivel Politécnico</p>
                  </div>
                  <div className="fecha-reporte">{new Date().toLocaleDateString()}</div>
                </div>

                <div className="reporte-info">
                  <div>
                    <strong>Alumno/a:</strong> {r.estudiante ?? r.Estudiante}
                  </div>
                  <div>
                    <strong>No.:</strong> {index + 1}
                  </div>
                </div>

                <table className="boletin-tabla">
                  <thead>
                    <tr>
                      <th rowSpan={2}>Asignaturas</th>
                      <th colSpan={2}>C1</th>
                      <th colSpan={2}>C2</th>
                      <th colSpan={2}>C3</th>
                      <th colSpan={2}>C4</th>
                      <th rowSpan={2}>Promedio</th>
                    </tr>
                    <tr>
                      <th>{idPeriodo}</th>
                      <th>RP</th>
                      <th>{idPeriodo}</th>
                      <th>RP</th>
                      <th>{idPeriodo}</th>
                      <th>RP</th>
                      <th>{idPeriodo}</th>
                      <th>RP</th>
                    </tr>
                  </thead>

                  <tbody>
                    {normales.map((m: any, i: number) => (
                      <tr key={i}>
                        <td>{m.materia ?? m.Materia}</td>
                        <td>{m.c1 ?? m.C1 ?? "-"}</td>
                        <td></td>
                        <td>{m.c2 ?? m.C2 ?? "-"}</td>
                        <td></td>
                        <td>{m.c3 ?? m.C3 ?? "-"}</td>
                        <td></td>
                        <td>{m.c4 ?? m.C4 ?? "-"}</td>
                        <td></td>
                        <td>{m.promedioFinal ?? m.PromedioFinal ?? "-"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <h3 style={{ marginTop: 25 }}>MATERIAS TÉCNICAS</h3>

                <table className="boletin-tabla">
                  <thead>
                    <tr>
                      <th>Materia técnica</th>
                      {Array.from({ length: 12 }, (_, i) => (
                        <th key={i}>RA{i + 1}</th>
                      ))}
                      <th>Total</th>
                    </tr>
                  </thead>

                  <tbody>
                    {tecnicas.map((m: any, i: number) => (
                      <tr key={i}>
                        <td>{m.materia ?? m.Materia}</td>
                        <td>{m.rA1 ?? m.RA1 ?? ""}</td>
                        <td>{m.rA2 ?? m.RA2 ?? ""}</td>
                        <td>{m.rA3 ?? m.RA3 ?? ""}</td>
                        <td>{m.rA4 ?? m.RA4 ?? ""}</td>
                        <td>{m.rA5 ?? m.RA5 ?? ""}</td>
                        <td>{m.rA6 ?? m.RA6 ?? ""}</td>
                        <td>{m.rA7 ?? m.RA7 ?? ""}</td>
                        <td>{m.rA8 ?? m.RA8 ?? ""}</td>
                        <td>{m.rA9 ?? m.RA9 ?? ""}</td>
                        <td>{m.rA10 ?? m.RA10 ?? ""}</td>
                        <td>{m.rA11 ?? m.RA11 ?? ""}</td>
                        <td>{m.rA12 ?? m.RA12 ?? ""}</td>
                        <td>{m.total ?? m.Total ?? ""}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          })}
        </div>
      )}

      {reportesPrimariaAnual.length > 0 &&
        gradoReportePrimaria.includes("4") && (
          <ReportePrimariaAnual4to reportes={reportesPrimariaAnual} />
        )}

      {reportesPrimariaAnual.length > 0 &&
        gradoReportePrimaria.includes("5") && (
          <ReportePrimariaAnual5to reportes={reportesPrimariaAnual} />
        )}

      {reportesPrimariaAnual.length > 0 &&
        gradoReportePrimaria.includes("6") && (
          <ReportePrimariaAnual6to reportes={reportesPrimariaAnual} />
        )}

      {reportesSecundariaAnual.length > 0 &&
        gradoReporteSecundaria.includes("1") && (
          <ReporteSecundariaAnual1ro reportes={reportesSecundariaAnual} />
        )}

      {reportesSecundariaAnual.length > 0 &&
        gradoReporteSecundaria.includes("2") && (
          <ReporteSecundariaAnual2do reportes={reportesSecundariaAnual} />
        )}

      {reportesSecundariaAnual.length > 0 &&
        gradoReporteSecundaria.includes("3") && (
          <ReporteSecundariaAnual3ro reportes={reportesSecundariaAnual} />
        )}

      {reportesPolitecnicoAnual.length > 0 &&
        gradoReportePolitecnico.includes("4") && (
          <ReportePolitecnicoAnual4to reportes={reportesPolitecnicoAnual} />
        )}

      {reportesPolitecnicoAnual.length > 0 &&
        gradoReportePolitecnico.includes("5") && (
          <ReportePolitecnicoAnual5to reportes={reportesPolitecnicoAnual} />
        )}

      {reportesPolitecnicoAnual.length > 0 &&
        gradoReportePolitecnico.includes("6") && (
          <ReportePolitecnicoAnual6to reportes={reportesPolitecnicoAnual} />
        )}
    </div>
  </div>
);
}
export default ReportesPage;