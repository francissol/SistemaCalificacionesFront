import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axiosConfig";
import { useAuth } from "../auth/AuthContext";

const CambiarPasswordPage = () => {
  const [passwordActual, setPasswordActual] = useState("");
  const [passwordNueva, setPasswordNueva] = useState("");
  const [confirmarPassword, setConfirmarPassword] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");

  const { user } = useAuth();
  const navigate = useNavigate();

  const cambiarPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setMensaje("");
    setError("");

    if (passwordNueva !== confirmarPassword) {
      setError("Las contraseñas nuevas no coinciden.");
      return;
    }

    try {
      await api.post("/Auth/cambiar-mi-password", {
        passwordActual,
        passwordNueva,
        confirmarPassword,
      });

      setMensaje("Contraseña cambiada correctamente.");

      setTimeout(() => {
        if (user?.rol === "Administrador") navigate("/admin/dashboard");
        else if (user?.rol === "Maestro") navigate("/maestro/dashboard");
        else if (user?.rol === "Estudiante") navigate("/estudiante/dashboard");
        else if (user?.rol === "Padre") navigate("/padre/dashboard");
        else navigate("/");
      }, 1000);
    } catch (err: any) {
      setError(err.response?.data ?? "Error al cambiar contraseña.");
    }
  };

  return (
    <div style={{ maxWidth: 420, margin: "100px auto" }}>
      <h2>Cambiar contraseña</h2>

      <form onSubmit={cambiarPassword} className="form-card" style={{ flexDirection: "column" }}>
        <input
          type="password"
          placeholder="Contraseña actual"
          value={passwordActual}
          onChange={(e) => setPasswordActual(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Nueva contraseña"
          value={passwordNueva}
          onChange={(e) => setPasswordNueva(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Confirmar nueva contraseña"
          value={confirmarPassword}
          onChange={(e) => setConfirmarPassword(e.target.value)}
          required
        />

        {error && <p style={{ color: "red" }}>{error}</p>}
        {mensaje && <p style={{ color: "green" }}>{mensaje}</p>}

        <button type="submit">Cambiar contraseña</button>
      </form>
    </div>
  );
};

export default CambiarPasswordPage;