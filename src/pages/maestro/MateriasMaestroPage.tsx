import { useEffect, useState } from "react";
import api from "../../api/axiosConfig";
import { useAuth } from "../../auth/AuthContext";
import { useNavigate } from "react-router-dom";
import "../../Styles/DashboardMaestro.css";

interface Asignacion {
  idAsignacionDocente: number;
  curso: string;
  grado: string;
  materia: string;
  anioEscolar: string;
}

const MateriasMaestroPage = () => {
  const [asignaciones, setAsignaciones] = useState<Asignacion[]>([]);
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    api
      .get("/PanelMaestro/mis-asignaciones")
      .then((res) => setAsignaciones(res.data))
      .catch((err) => console.error(err.response?.data));
  }, []);

  const cerrarSesion = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="maestro-layout">
      <header className="maestro-navbar">
        <div className="maestro-logo">
          <span>MIR</span>
        </div>

        <nav>
          <button onClick={() => navigate("/maestro/dashboard")}>Inicio</button>
          <button className="nav-activo">Materias</button>
          <button onClick={() => navigate("/maestro/reportes")}>Reportes</button>
        </nav>

        <div className="maestro-actions">
          <button onClick={() => navigate("/cambiar-password")} title="Cambiar contraseña">
            🔑
          </button>
          <button onClick={cerrarSesion} title="Cerrar sesión">
            ↪
          </button>
        </div>
      </header>

      <main className="maestro-dashboard">
  <div className="materias-title-row">
    <h1>MIS CURSOS Y MATERIAS</h1>
    <span></span>
  </div>

  <p className="materias-maestro">
    Año académico:{" "}
  </p>

  <div className="materias-grid-simple">
    {asignaciones.map((a) => (
      <div className="materia-card-simple" key={a.idAsignacionDocente}>
        <h2>{a.materia.toUpperCase()}</h2>

        <h3>{a.curso.toUpperCase()}</h3>

        <p>DE {a.grado.toUpperCase()}</p>

        <h3>{a.anioEscolar}</h3>

        <button
          onClick={() =>
            navigate(`/maestro/asignacion/${a.idAsignacionDocente}`)
          }
        >
          ENTRAR
        </button>
      </div>
    ))}
  </div>
</main>

    </div>
  );
};
export default MateriasMaestroPage;