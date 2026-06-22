import { useEffect, useState } from "react";
import api from "../../api/axiosConfig";
import { obtenerNivelCoordinador } from "../../Utils/permisos";

interface DashboardData {
  estudiantes: number;
  maestros: number;
  padres: number;
  cursos: number;
  materias: number;
  publicacionesAbiertas: number;
  anioActivo: string | null;
}

const DashboardAdmin = () => {
  const [data, setData] = useState<DashboardData | null>(null);

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const nivel = obtenerNivelCoordinador(user?.rol);

  useEffect(() => {
    api.get("/Dashboard").then((res) => {
      setData(res.data);
    });
  }, []);

  if (!data) return <p>Cargando dashboard...</p>;

  return (
    <div>
      <h1>
        {user?.rol === "Administrador"
          ? "Dashboard Administrador General"
          : `Dashboard Coordinador ${nivel}`}
      </h1>

      <p>
        Año escolar activo: {data.anioActivo ?? "No definido"}
      </p>

      {nivel && (
        <p>
          Mostrando únicamente información de{" "}
          <strong>{nivel}</strong>
        </p>
      )}

      <div className="card-grid">
        <div className="card">
          <h4>Estudiantes</h4>
          <p>{data.estudiantes}</p>
        </div>

        <div className="card">
          <h4>Maestros</h4>
          <p>{data.maestros}</p>
        </div>

        <div className="card">
          <h4>Padres</h4>
          <p>{data.padres}</p>
        </div>

        <div className="card">
          <h4>Cursos</h4>
          <p>{data.cursos}</p>
        </div>

        <div className="card">
          <h4>Materias</h4>
          <p>{data.materias}</p>
        </div>

        <div className="card">
          <h4>Publicaciones abiertas</h4>
          <p>{data.publicacionesAbiertas}</p>
        </div>
      </div>
    </div>
  );
};

export default DashboardAdmin;