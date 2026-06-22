import "./ReportePolitecnicoAnual5to.css";
import logoImage from "../../../imagenes/Captura de pantalla 2026-06-10 122000.png";
import LogoMinerd from "../../../imagenes/download.png";

interface Props {
  reportes: any[];
}

const materiasBase = [
  "Lengua Española",
  "Lenguas Extranjeras - Inglés",
  "Matemática",
  "Ciencias Sociales",
  "Ciencias de la Naturaleza",
  "Educación Artística",
  "Educación Física",
  "Formación Integral Humana y Religiosa",
];

const normalizar = (texto: string) =>
  texto?.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

const ReportePolitecnicoAnual5to = ({ reportes }: Props) => {
  if (!reportes || reportes.length === 0) return null;

  return (
    <div className="reportes-politecnico-anual">
      {reportes.map((r, index) => {
        const normales = r.materiasNormales ?? r.MateriasNormales ?? [];
        const tecnicas = r.materiasTecnicas ?? r.MateriasTecnicas ?? [];

        const buscarMateria = (nombre: string) =>
          normales.find((m: any) =>
            normalizar(m.materia ?? m.Materia ?? "").includes(normalizar(nombre))
          );

        return (
          <div className="reporte-pol-5to" key={r.idEstudiante ?? index}>
            <header className="pol5-header">
              <div className="pol5-logos">
                <div className="pol5-logo-text">
                   <img src={LogoMinerd} alt="Logo institución" className="r4-logo-real" />
                   </div>
                <div className="r5-logos">
                <img src={logoImage} alt="Logo institución" className="r4-logo-real" />
              </div>
              </div>

              <div className="pol5-titulo">
                <h2>Politécnico María Auxiliadora</h2>
                <h3>Año Escolar 2025-2026</h3>
                <h3>CALIFICACIONES DE RENDIMIENTO</h3>
              </div>

              <div className="pol5-grado">
                <span className="pol5-numero">5</span>
                <div>
                  <span className="pol5-to">to</span>
                  <span className="pol5-grado-texto">Grado</span>
                  <p>NIVEL POLITÉCNICO</p>
                </div>
              </div>
            </header>

            <div className="pol5-nombre-container">
              <div className="pol5-nombre-label">NOMBRES Y APELLIDOS</div>
              <div className="pol5-nombre-estudiante">
                {r.estudiante ?? r.Estudiante}
              </div>
            </div>

            <table className="pol5-tabla">
              <thead>
                <tr>
                  <th rowSpan={3} className="pol5-area">
                    ÁREAS<br />CURRICULARES
                  </th>
                  <th colSpan={5}>CALIFICACIONES DE RENDIMIENTO</th>
                  <th rowSpan={3}>%<br />A-A</th>
                  <th colSpan={4}>CALIFICACIÓN COMPLETIVA</th>
                  <th colSpan={4}>CALIFICACIÓN EXTRAORDINARIA</th>
                  <th colSpan={2}>EVALUACIÓN<br />ESPECIAL</th>
                  <th colSpan={2}>SITUACIÓN<br />FINAL</th>
                </tr>

                <tr>
                  <th>PC 1</th>
                  <th>PC 2</th>
                  <th>PC 3</th>
                  <th>PC 4</th>
                  <th className="vertical">CALIFICACIÓN FINAL DEL ÁREA</th>

                  <th className="vertical">50% C.F.</th>
                  <th className="vertical">C.E.C</th>
                  <th className="vertical">50% C.E.C.</th>
                  <th className="vertical shaded">C.C.F.</th>

                  <th className="vertical">30% C.F.</th>
                  <th className="vertical">C.E.EX.</th>
                  <th className="vertical">70% C.E.EX.</th>
                  <th className="vertical shaded">C.EX.F.</th>

                  <th className="vertical">C.F.</th>
                  <th className="vertical shaded">C.E.</th>

                  <th>A</th>
                  <th>R</th>
                </tr>
              </thead>

              <tbody>
                {materiasBase.map((nombreMateria) => {
                  const m = buscarMateria(nombreMateria);

                  return (
                    <tr key={nombreMateria}>
                      <td className="materia-nombre">{nombreMateria}</td>
                      <td>{m?.pC1 ?? m?.PC1 ?? ""}</td>
                      <td>{m?.pC2 ?? m?.PC2 ?? ""}</td>
                      <td>{m?.pC3 ?? m?.PC3 ?? ""}</td>
                      <td>{m?.pC4 ?? m?.PC4 ?? ""}</td>
                      <td className="shaded">{m?.finalArea ?? m?.FinalArea ?? ""}</td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td className="shaded"></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td className="shaded"></td>
                      <td></td>
                      <td className="shaded"></td>
                      <td></td>
                      <td></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            <h3 className="pol5-tecnicas-title">MATERIAS TÉCNICAS</h3>

            <table className="pol5-tabla-tecnica">
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

            <div className="pol5-firmas">
              <div>
                <span></span>
                <p>Maestro/a encargado del curso</p>
              </div>

              <div>
                <span></span>
                <strong>Licda. Yira Cedeño</strong>
                <p>Directora del Centro</p>
              </div>
            </div>

             <div className="pol5-bloque-observacion-competencias">
              <div className="pol5-observaciones">
                <strong>Observaciones:</strong>
              </div>

              <div className="r5-competencias">
                <p>PC1 Comunicativa</p>
                <p>PC2 Pensamiento Lógico, Creativo y Crítico | Resolución de Problema</p>
                <p>PC3 Científica y Tecnológica | Ambiental y de la Salud</p>
                <p>PC4 Ética y Ciudadana | Desarrollo Personal y Espiritual</p>
              </div>
            </div>

            <div className="pol5-footer">
              <div className="pol5-situacion">
                <strong>Situación de la Estudiante (Marcar con una X)</strong>
                <p>□ Promovida</p>
                <p>□ Promovida con asignatura pendiente</p>
                <p>□ Repitente</p>
              </div>

              <div className="pol5-leyenda">
                <strong>Leyenda</strong>
                <p>
                  PC Promedio Grupo de Competencia | % A.A. Porciento Asistencia Anual |
                  C.F. Calificación Final | C.E.C. Calificación Evaluación Completiva |
                  C.C.F. Calificación Completiva Final | C.E.EX. Calificación Evaluación
                  Extraordinaria | C.EX.F Calificación Extraordinaria Final | C.E.
                  Calificación Especial | A. Aprobado | R. Reprobado
                </p>
              </div>
            </div>
                <div className="r7-creditos">
              LICDA.JUANA GIL DE LA ROSA | Coordinadora Pedagógica
            </div>
              </div>
           
        );
      })}
    </div>
  );
};

export default ReportePolitecnicoAnual5to;