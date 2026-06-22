import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import "../Styles/Login.css";

const Login = () => {
  const [nombreUsuario, setNombreUsuario] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setError("");

 try {
  await login(nombreUsuario, password);

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  console.log("USUARIO LOGIN:", user);
  console.log("ROL:", user.rol);
  console.log("ROLE:", user.role);
  console.log("NOMBRE:", user.nombre);

  const rol = user.rol ?? user.role ?? user.nombre;

  if (
    rol === "Administrador" ||
    rol === "CoordinadorPrimaria" ||
    rol === "CoordinadorSecundaria" ||
    rol === "CoordinadorPolitecnico"
  ) {
    navigate("/admin/dashboard");
  } else if (rol === "Maestro") {
    navigate("/maestro/dashboard");
  } else if (rol === "Estudiante") {
    navigate("/estudiante/dashboard");
  } else if (rol === "Padre") {
    navigate("/padre/dashboard");
  } else {
    console.log("ROL NO RECONOCIDO:", rol);
    navigate("/");
  }
} catch {
  setError("Usuario o contraseña incorrectos.");
}};

 return (
    <div className="login-page">
      {/* Franja azul superior */}
      <div className="top-bar"></div>

      <div className="login-container">
        {/* Logo de MIR */}
        <div className="logo-wrapper">
          <img 
            src="src\imagenes\Gemini_Generated_Image_vm4u0uvm4u0uvm4u.png" /* Cambia esto por la ruta real de tu logo */
            alt="MIR Calificaciones" 
            className="login-logo" 
          />
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <input
            type="text"
            placeholder="Username"
            value={nombreUsuario}
            onChange={(e) => setNombreUsuario(e.target.value)}
            className="login-input"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="login-input"
          />

          {error && <p className="error-message">{error}</p>}

          {/* Botón de inicio de sesión agregado */}
          <button type="submit" className="login-button">
            Iniciar Sesión
          </button>
        </form>

        {/* Enlace inferior */}
        <div className="lost-password-wrapper">
          <a href="#lost" className="lost-password-link">Lost password?</a>
        </div>
      </div>

      {/* Franja azul inferior */}
      <div className="bottom-bar"></div>
    </div>
  );
};

export default Login;
