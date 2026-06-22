import { useEffect, useState } from "react";
import api from "../../api/axiosConfig";
import { useAuth } from "../../auth/AuthContext";
import { useNavigate } from "react-router-dom";
import "../../Styles/DashboardMaestro.css";
import "../../imagenes/Gemini_Generated_Image_vm4u0uvm4u0uvm4u.png"

import miLogo from "../../imagenes/Gemini_Generated_Image_vm4u0uvm4u0uvm4u.png";

interface Asignacion {
  idAsignacionDocente: number;
  curso: string;
  grado: string;
  materia: string;
  anioEscolar: string;
  nivel: string;
}

const DashboardMaestro = () => {
  const [asignaciones, setAsignaciones] = useState<Asignacion[]>([]);
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/PanelMaestro/mis-asignaciones")
      .then((res) => setAsignaciones(res.data))
      .catch((err) => {
        console.error("ERROR ASIGNACIONES:", err.response?.status);
        console.error("DATA:", err.response?.data);
      });
  }, []);

  const cerrarSesion = () => {
    logout();
    navigate("/");
  };

  const anioAcademico =
    asignaciones.length > 0 ? asignaciones[0].anioEscolar : "No asignado";

  const materiasUnicas = new Set(asignaciones.map((a) => a.materia)).size;

  const cursosUnicos = new Set(
    asignaciones.map((a) => `${a.grado}-${a.curso}`)
  ).size;

  return (
    <div className="maestro-layout">
      <header className="maestro-navbar">
        
            
<div className="logo-area"><div className="maestro-logo">
  <img src={miLogo} alt="Logo" />
          </div>
        
          
        </div>

        <nav>
          <button className="nav-activo">Inicio</button>
          <button onClick={() => navigate("/maestro/materias")}>
            Materias
          </button>
        
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
        <section className="maestro-info">
          <p>
            <strong>MAESTRO:</strong> {user?.nombreUsuario ?? "Usuario"}
          </p>
          <p>
            <strong>Usuario:</strong> {user?.nombreUsuario}
          </p>
        </section>

        <section className="maestro-cards">
          <div className="maestro-card">
            <div className="card-numero">{anioAcademico}</div>
            <p>AÑO ACADÉMICO</p>
          </div>

          <div className="maestro-card">
            <div className="card-numero">{cursosUnicos}</div>
            <p>CANTIDAD DE CURSOS</p>
          </div>

          <div className="maestro-card">
            <div className="card-numero">{materiasUnicas}</div>
            <p>MATERIAS</p>
          </div>
        </section>
      </main>
    </div>
  );
};

export default DashboardMaestro;