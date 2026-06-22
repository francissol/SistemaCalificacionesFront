import { useEffect, useState } from "react";
import api from "../../api/axiosConfig";
import { useAuth } from "../../auth/AuthContext";
import { useNavigate } from "react-router-dom";
import DetalleHijo from "./DetalleHijo";

interface Hijo {
  idEstudiante: number;
  matricula: string;
  nombres: string;
  apellidos: string;
  curso: string;
}

const DashboardPadre = () => {
  const [hijos, setHijos] = useState<Hijo[]>([]);
  const [hijoSeleccionado, setHijoSeleccionado] = useState<Hijo | null>(null);

  const { logout, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/PanelPadre/mis-hijos")
      .then((res) => setHijos(res.data));
  }, []);

  const cerrarSesion = () => {
    logout();
    navigate("/");
  };

  return (
    <div style={{ padding: 30 }}>
      <header style={{ display: "flex", justifyContent: "space-between" }}>
        <div>
          <h1>Panel Padre</h1>
          <p>{user?.nombreUsuario}</p>
        </div>
<button onClick={() => navigate("/cambiar-password")}>
  Cambiar contraseña
</button>

        <button onClick={cerrarSesion}>
          Cerrar sesión
        </button>
      </header>

      <h2>Mis hijos</h2>

      <div className="card-grid">
        {hijos.map((hijo) => (
          <div className="card" key={hijo.idEstudiante}>
            <h3>
              {hijo.nombres} {hijo.apellidos}
            </h3>

            <p>{hijo.matricula}</p>

            <p>{hijo.curso}</p>

            <button
              onClick={() => setHijoSeleccionado(hijo)}
            >
              Ver detalle
            </button>
          </div>
        ))}
      </div>

      {hijoSeleccionado && (
        <DetalleHijo
          hijo={hijoSeleccionado}
        />
      )}
    </div>
  );
};

export default DashboardPadre;