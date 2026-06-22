import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../api/axiosConfig";
import ModuloCompetenciasPrimaria from "./ModuloCompetenciasPrimaria";
import ModuloCompetenciasSecundaria from "./ModuloCompetenciasSecundaria";
import ModuloRA from "./ModuloRA";

import {
  FaArrowLeft,
  FaBookOpen,
  FaGraduationCap,
  FaUsers,
  FaRegCalendarAlt,
  FaChartBar
} from "react-icons/fa";

interface DetalleAsignacion {
  idAsignacionDocente: number;
  curso: string;
  grado: string;
  nivel: string;
  usaCompetencias: boolean;
  idGrado: number;
  idMateria: number;
  materia: string;
  anioEscolar: string;
  esTecnica: boolean;
}

interface Estudiante {
  idEstudiante: number;
  matricula: string;
  nombres: string;
  apellidos: string;
}

interface Periodo {
  idPeriodoPublicacion: number;
  nombre: string;
  activo: boolean;
}

const AsignacionMaestroPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [estudiantes, setEstudiantes] = useState<Estudiante[]>([]);
  const [periodos, setPeriodos] = useState<Periodo[]>([]);
  const [idPeriodo, setIdPeriodo] = useState("");
  const [detalle, setDetalle] = useState<DetalleAsignacion | null>(null);

  const cargarEstudiantes = async () => {
    const res = await api.get(`/PanelMaestro/asignacion/${id}/estudiantes`);
    setEstudiantes(res.data);
  };

  const cargarPeriodos = async () => {
    const res = await api.get("/PeriodosPublicacion");
    setPeriodos(res.data);
  };

  const cargarDetalle = async () => {
    const res = await api.get(`/PanelMaestro/asignacion/${id}/detalle`);
    console.log("DETALLE ASIGNACION:", res.data);
    setDetalle(res.data);
  };

  useEffect(() => {
    cargarEstudiantes();
    cargarPeriodos();
    cargarDetalle();
  }, []);

  const nivel = detalle?.nivel?.toLowerCase() ?? "";
  const esPrimaria = nivel.includes("primaria");
  const esSecundaria = nivel.includes("secundaria");
  const esPolitecnico = nivel.includes("pol");
return (
  <div className="asignacion-page">
    <button className="btn-volver" onClick={() => navigate("/maestro/dashboard")}>
      <FaArrowLeft className="icon-back" /> Volver
    </button>

    <h1 className="titulo-page">Gestión de Calificaciones</h1>

    {detalle && (
      <div className="info-curso-card">
        <div className="materia-header">
          <div className="icon-container-materia">
            <FaBookOpen />
          </div>
          <h2>{detalle.materia}</h2>
        </div>

        <div className="info-grid">
          <div className="info-item">
            <div className="icon-container curso-icon">
              <FaGraduationCap />
            </div>
            <div className="info-text">
              <span>Curso</span>
              <strong>{detalle.grado} - {detalle.curso}</strong>
            </div>
          </div>

          <div className="info-item">
            <div className="icon-container nivel-icon">
              <FaUsers />
            </div>
            <div className="info-text">
              <span>Nivel</span>
              <strong>{detalle.nivel.toUpperCase()}</strong>
            </div>
          </div>

          <div className="info-item">
            <div className="icon-container anio-icon">
              <FaRegCalendarAlt />
            </div>
            <div className="info-text">
              <span>Año escolar</span>
              <strong>{detalle.anioEscolar}</strong>
            </div>
          </div>

          <div className="info-item">
            <div className="icon-container eval-icon">
              <FaChartBar />
            </div>
            <div className="info-text">
              <span>Tipo de evaluación</span>
              <strong>
                {detalle.esTecnica
                  ? "Resultados de Aprendizaje (RA)"
                  : "Competencias"}
              </strong>
            </div>
          </div>
        </div>
      </div>
    )}

    <div className="periodo-card">
      <label>Período de evaluación</label>
      <select value={idPeriodo} onChange={(e) => setIdPeriodo(e.target.value)}>
        <option value="">Seleccione período</option>
        {periodos.map((p) => (
          <option key={p.idPeriodoPublicacion} value={p.idPeriodoPublicacion}>
            {p.nombre}
          </option>
        ))}
      </select>
    </div>

 
    {detalle && idPeriodo && esPrimaria && (
      <ModuloCompetenciasPrimaria
        idAsignacionDocente={Number(id)}
        idGrado={detalle.idGrado}
        idMateria={detalle.idMateria}
        idPeriodo={idPeriodo}
        estudiantes={estudiantes}
      />
    )}

    {detalle && idPeriodo && esSecundaria && (
      <ModuloCompetenciasSecundaria
        idAsignacionDocente={Number(id)}
        idGrado={detalle.idGrado}
        idMateria={detalle.idMateria}
        idPeriodo={idPeriodo}
        estudiantes={estudiantes}
      />
    )}

    {detalle && idPeriodo && esPolitecnico && !detalle.esTecnica && (
      <ModuloCompetenciasSecundaria
        idAsignacionDocente={Number(id)}
        idGrado={detalle.idGrado}
        idMateria={detalle.idMateria}
        idPeriodo={idPeriodo}
        estudiantes={estudiantes}
      />
    )}

    {detalle && idPeriodo && esPolitecnico && detalle.esTecnica && (
      <ModuloRA idAsignacionDocente={Number(id)} estudiantes={estudiantes} />
    )}
  </div>
);

}

export default AsignacionMaestroPage;