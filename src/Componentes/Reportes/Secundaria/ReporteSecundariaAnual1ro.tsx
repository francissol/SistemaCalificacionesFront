import "./ReporteSecundariaAnual1ro.css";
import logoImage from "../../../imagenes/Captura de pantalla 2026-06-10 122000.png";

interface Props {
  reportes: any[];
}

const materiasBase = [
  "Lengua Española",
  "Lenguas Extranjeras - Inglés",
  "Matemática",
  "Ciencias Sociales",
  "Naturales",
  "Educación Artística",
  "Educación Física",
  "Formación Integral Humana y Religiosa",
];

const normalizar = (texto: string) =>
  texto?.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

const ReporteSecundariaAnual1ro = ({ reportes }: Props) => {
  if (!reportes || reportes.length === 0) return null;

  return (
    <div className="reportes-anuales-secundaria">
      {reportes.map((r, index) => {
        const materias = r.materias ?? r.Materias ?? [];

        const buscarMateria = (nombre: string) =>
          materias.find((m: any) =>
            normalizar(m.materia ?? m.Materia ?? "").includes(normalizar(nombre))
          );

        return (
          <div className="reporte-1ro-secundaria" key={r.idEstudiante ?? index}>
            <div className="r5-header">
              <div className="r5-logos">
                <img src={logoImage} alt="Logo institución" className="r4-logo-real" />
              </div>

              <div className="r5-titulo">
                <h2>Politécnico María Auxiliadora</h2>
                <h3>Año Escolar {r.anioEscolar ?? r.AnioEscolar ?? "2025-2026"}</h3>
                <h3>CALIFICACIONES DE RENDIMIENTO</h3>
              </div>

              <div className="r5-grado">
                <span className="r5-numero">1</span>
                <div>
                  <span className="r5-er">ro</span>
                  <span className="r5-grado-texto">Grado</span>
                  <p>PRIMER CICLO</p>
                  <p>NIVEL SECUNDARIO</p>
                </div>
              </div>
            </div>

            <div className="r5-nombre-container">
              <div className="r5-nombre-label">NOMBRES Y APELLIDOS</div>
              <div className="r5-nombre-linea">
                <strong>{r.estudiante ?? r.Estudiante}</strong>
              </div>
            </div>

            <table className="r5-tabla">
              <thead>
                <tr>
                  <th rowSpan={4} className="r5-area">
                    ÁREAS<br />CURRICULARES
                  </th>
                  <th colSpan={5}>CALIFICACIONES DE RENDIMIENTO</th>
                  <th rowSpan={4}>%<br />A-A</th>
                  <th colSpan={4}>CALIFICACIÓN COMPLETIVA</th>
                  <th colSpan={4}>CALIFICACIÓN EXTRAORDINARIA</th>
                  <th colSpan={2}>EVALUACIÓN<br />ESPECIAL</th>
                  <th colSpan={2}>SITUACIÓN<br />FINAL EN LA<br />ASIGNATURA</th>
                </tr>

                <tr>
                  <th colSpan={4}>
                    PROMEDIO GRUPO DE<br />COMPETENCIAS ESPECÍFICAS
                  </th>
                  <th rowSpan={3} className="vertical">
                    CALIFICACIÓN<br />FINAL DEL ÁREA
                  </th>

                  <th rowSpan={3} className="vertical">50% C.F.</th>
                  <th rowSpan={3} className="vertical">C.E.C</th>
                  <th rowSpan={3} className="vertical">50% C.E.C.</th>
                  <th rowSpan={3} className="vertical shaded">C.C.F.</th>

                  <th rowSpan={3} className="vertical">30% C.F.</th>
                  <th rowSpan={3} className="vertical">C.E.EX.</th>
                  <th rowSpan={3} className="vertical">70% C.E.EX.</th>
                  <th rowSpan={3} className="vertical shaded">C.EX.F.</th>

                  <th rowSpan={3} className="vertical">C.F.</th>
                  <th rowSpan={3} className="vertical shaded">C.E.</th>

                  <th rowSpan={3}>A</th>
                  <th rowSpan={3}>R</th>
                </tr>

                <tr>
                  <th>PC 1</th>
                  <th>PC 2</th>
                  <th>PC 3</th>
                  <th>PC 4</th>
                </tr>
              </thead>

              <tbody>
                {materiasBase.map((nombreMateria) => {
                  const m = buscarMateria(nombreMateria);

                  return (
                    <tr key={nombreMateria}>
                      <td className="materia-nombre">{nombreMateria}</td>
                      <td>{m?.pc1 ?? m?.pC1 ?? m?.PC1 ?? ""}</td>
                      <td>{m?.pc2 ?? m?.pC2 ?? m?.PC2 ?? ""}</td>
                      <td>{m?.pc3 ?? m?.pC3 ?? m?.PC3 ?? ""}</td>
                      <td>{m?.pc4 ?? m?.pC4 ?? m?.PC4 ?? ""}</td>
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

            <div className="r5-firmas">
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

            <div className="r5-bloque-observacion-competencias">
              <div className="r5-observaciones">
                <strong>Observaciones:</strong>
              </div>

              <div className="r5-competencias">
                <p>PC1 Comunicativa</p>
                <p>PC2 Pensamiento Lógico, Creativo y Crítico | Resolución de Problema</p>
                <p>PC3 Científica y Tecnológica | Ambiental y de la Salud</p>
                <p>PC4 Ética y Ciudadana | Desarrollo Personal y Espiritual</p>
              </div>
            </div>

            <div className="r5-footer">
              <div className="r5-situacion">
                <strong>Situación de la Estudiante (Marcar con una X)</strong>
                <p>□ Promovida</p>
                <p>□ Promovida con asignatura pendiente</p>
                <p>□ Repitente</p>
              </div>

              <div className="r5-leyenda">
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

            <div className="r5-creditos">
              Mtra. Kaira Herrera | Coordinadora Pedagógica
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ReporteSecundariaAnual1ro;