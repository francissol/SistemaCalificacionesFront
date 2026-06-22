import "./ReportePrimariaAnual5to.css";
import logoImage from "../../../imagenes/Captura de pantalla 2026-06-10 122000.png";

interface Props {
  reportes: any[];
}

const materiasBase = [
  "Lengua Española",
  "Matemática",
  "Ciencias Sociales",
  "Ciencias de la Naturaleza",
  "Lenguas Extranjeras",
  "Educación Física",
  "Formación Integral Humana y Religiosa",
  "Educación Artística",
];

const normalizar = (texto: string) =>
  texto?.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

const valor = (obj: any, prop: string) =>
  obj?.[prop] ?? obj?.[prop.toUpperCase()] ?? "";

const ReportePrimariaAnual5to = ({ reportes }: Props) => {
  if (!reportes || reportes.length === 0) return null;

  return (
    <div className="reportes-primaria-anual">
      {reportes.map((r, index) => {
        const materias = r.materias ?? r.Materias ?? [];

        const buscarMateria = (nombre: string) =>
          materias.find((m: any) =>
            normalizar(m.materia ?? m.Materia ?? "").includes(normalizar(nombre))
          );

        const celdaPeriodo = (m: any, comp: string, periodo: string) => {
          const c = m?.[comp] ?? m?.[comp.toUpperCase()];
          return valor(c, periodo);
        };

        const finalComp = (m: any, comp: string) => {
          const c = m?.[comp] ?? m?.[comp.toUpperCase()];
          return valor(c, "final");
        };

        return (
          <div className="reporte-5to-primaria" key={r.idEstudiante ?? index}>
            <div className="p5-header">
              <div className="p5-logos">
                <img src={logoImage} alt="Logo institución" className="p5-logo" />
              </div>

              <div className="p5-titulo">
                <h2>Politécnico María Auxiliadora</h2>
                <h3>Año Escolar {r.anioEscolar ?? r.AnioEscolar ?? "2025-2026"}</h3>
                <h3>CALIFICACIONES DE RENDIMIENTO</h3>
              </div>

              <div className="p5-grado">
                <div className="p5-icono">✿</div>
                <h2>QUINTO GRADO</h2>
                <h3>NIVEL PRIMARIO</h3>
              </div>
            </div>

            <div className="p5-nombre-container">
              <div className="p5-nombre-label">NOMBRES Y APELLIDOS</div>
              <div className="p5-nombre-linea">
                <strong>{r.estudiante ?? r.Estudiante}</strong>
              </div>
            </div>

            <div className="p5-barra">DESEMPEÑO INDIVIDUAL DEL/LA ESTUDIANTE</div>

            <table className="p5-tabla">
              <thead>
                <tr>
                  <th colSpan={2}>COMPETENCIAS<br />FUNDAMENTALES</th>
                  <th colSpan={8}>Comunicativa</th>
                  <th colSpan={8}>
                    Pensamiento Lógico, Creativo y Crítico; Resolución de Problemas;
                    Científica y Tecnológica
                  </th>
                  <th colSpan={8}>
                    Ética y Ciudadana; Desarrollo Personal y Espiritual; Ambiental y de la Salud
                  </th>
                  <th colSpan={3}>Calificación final por competencia</th>
                  <th rowSpan={3} className="vertical">Calificación final</th>
                  <th rowSpan={3} className="vertical">Calificación recuperada</th>
                </tr>

                <tr>
                  <th colSpan={2}>PERÍODOS</th>

                  {["C1", "C2", "C3"].map((c) =>
                    ["P1", "RP1", "P2", "RP2", "P3", "RP3", "P4", "RP4"].map((p) => (
                      <th key={`${c}-${p}`}>{p}</th>
                    ))
                  )}

                  <th>C1</th>
                  <th>C2</th>
                  <th>C3</th>
                </tr>
              </thead>

              <tbody>
                {materiasBase.map((nombreMateria, i) => {
                  const m = buscarMateria(nombreMateria);

                  return (
                    <tr key={nombreMateria}>
                      {i === 0 && (
                        <td rowSpan={materiasBase.length} className="p5-area-vertical">
                          ÁREAS CURRICULARES
                        </td>
                      )}

                      <td className="p5-materia">{nombreMateria}</td>

                      {["c1", "c2", "c3"].map((comp) =>
                        ["p1", "rp1", "p2", "rp2", "p3", "rp3", "p4", "rp4"].map((p) => (
                          <td key={`${nombreMateria}-${comp}-${p}`}>
                            {celdaPeriodo(m, comp, p)}
                          </td>
                        ))
                      )}

                      <td>{finalComp(m, "c1")}</td>
                      <td>{finalComp(m, "c2")}</td>
                      <td>{finalComp(m, "c3")}</td>
                      <td>{m?.finalArea ?? m?.FinalArea ?? ""}</td>
                      <td></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            <table className="p5-observaciones">
              <tbody>
                {["P1", "P2", "P3", "P4"].map((p, i) => (
                  <tr key={p}>
                    {i === 0 && (
                      <td rowSpan={4} className="p5-observaciones-title">
                        OBSERVACIONES
                      </td>
                    )}
                    <td className="p5-periodo-label">{p}</td>
                    <td></td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="p5-footer">
              <table className="p5-asistencia">
                <thead>
                  <tr>
                    <th colSpan={5}>Resumen de asistencia del/la estudiante</th>
                  </tr>
                  <tr>
                    <th>Períodos</th>
                    <th>Asistencia</th>
                    <th>Ausencia</th>
                    <th>% Asistencia</th>
                    <th>% Ausencia</th>
                  </tr>
                </thead>
                <tbody>
                  {["P1", "P2", "P3", "P4"].map((p) => (
                    <tr key={p}>
                      <td>{p}</td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="p5-leyenda">
                <strong>Leyenda:</strong>
                <p>(P1) Período 1</p>
                <p>(P2) Período 2</p>
                <p>(P3) Período 3</p>
                <p>(P4) Período 4</p>
                <br />
                <p>(RP1) Recuperación pedagógica 1</p>
                <p>(RP2) Recuperación pedagógica 2</p>
                <p>(RP3) Recuperación pedagógica 3</p>
                <p>(RP4) Recuperación pedagógica 4</p>
                <br />
                <p>(C1) Competencia 1</p>
                <p>(C2) Competencia 2</p>
                <p>(C3) Competencia 3</p>
              </div>

              <table className="p5-escala">
                <thead>
                  <tr>
                    <th>Escala numérica</th>
                    <th>Descripción</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>89-100</td>
                    <td>Evidencia que el estudiante ha alcanzado un desempeño destacado.</td>
                  </tr>
                  <tr>
                    <td>77-88</td>
                    <td>Evidencia que el estudiante ha logrado los aprendizajes esperados.</td>
                  </tr>
                  <tr>
                    <td>65-76</td>
                    <td>Evidencia que el estudiante aún se encuentra en proceso.</td>
                  </tr>
                  <tr>
                    <td>Menos de 65</td>
                    <td>Evidencia un desempeño insuficiente.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ReportePrimariaAnual5to;