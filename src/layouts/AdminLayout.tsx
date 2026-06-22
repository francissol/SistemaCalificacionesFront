import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import {
  LayoutDashboard,
  School,
  BookOpen,
  Users,
  GraduationCap,
  UserCheck,
  LogOut,
  Menu,
  Key,
} from "lucide-react";

import logoMireducacion from "../imagenes/Gemini_Generated_Image_vm4u0uvm4u0uvm4u.png";


import React, { useState } from "react";



import "../Styles/AdminLayout.css";

const AdminLayout = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const cerrarSesion = () => {
    logout();
    navigate("/");
  };

 return (
  <div className={`admin-layout ${isCollapsed ? "collapsed" : ""}`}>
    
    {/* SIDEBAR FIJA Y PLEGLABLE */}
    <aside className="sidebar">
      <div className="sidebar-header">
        {/* SÓLO EL LOGO ENTRA AQUÍ, EL BOTÓN SE ELIMINÓ DE AQUÍ */}
        {!isCollapsed && (
          <div className="logo-area">
            <img 
              src={logoMireducacion}
              alt="Logo" 
              className="logo-img"
            />
            <h2>MIR Calificaciones</h2>

{user?.rol === "Administrador" ? (
  <p className="sidebar-role">Administrador General</p>
) : user?.rol === "CoordinadorPrimaria" ? (
  <p className="sidebar-role">Coordinador Primaria</p>
) : user?.rol === "CoordinadorSecundaria" ? (
  <p className="sidebar-role">Coordinador Secundaria</p>
) : user?.rol === "CoordinadorPolitecnico" ? (
  <p className="sidebar-role">Coordinador Politécnico</p>
) : null}
          </div>
        )}
      </div>

      {/* Menú con scroll independiente */}
      <nav className="sidebar-menu">
        <NavLink to="/admin/dashboard"><LayoutDashboard size={20} /> {!isCollapsed && <span>Dashboard</span>}</NavLink>
        {user?.rol === "Administrador" && (
  <NavLink to="/admin/niveles">
    <School size={20} /> {!isCollapsed && <span>Niveles</span>}
  </NavLink>
)}
        
        {user?.rol === "Administrador" && (
  <NavLink to="/admin/grados">
    <School size={20} /> {!isCollapsed && <span>Grados</span>}
  </NavLink>
)}
        <NavLink to="/admin/cursos"><School size={20} /> {!isCollapsed && <span>Cursos</span>}</NavLink>
        <NavLink to="/admin/materias"><BookOpen size={20} /> {!isCollapsed && <span>Materias</span>}</NavLink>
        <NavLink to="/admin/grado-materias"><BookOpen size={20} /> {!isCollapsed && <span>GradoMaterias</span>}</NavLink>
        <NavLink to="/admin/anios-escolares"><BookOpen size={20} /> {!isCollapsed && <span>Años escolares</span>}</NavLink>
        <NavLink to="/admin/asignaciones-docentes"><BookOpen size={20} /> {!isCollapsed && <span>Asignaciones Docentes</span>}</NavLink>
        <NavLink to="/admin/periodos-publicacion"><BookOpen size={20} /> {!isCollapsed && <span>Periodos Publicación</span>}</NavLink>
        <NavLink to="/admin/padres"><Users size={20} /> {!isCollapsed && <span>Padres</span>}</NavLink>
        <NavLink to="/admin/reportes"><BookOpen size={20} /> {!isCollapsed && <span>Reportes</span>}</NavLink>
        <NavLink to="/admin/maestros"><UserCheck size={20} /> {!isCollapsed && <span>Maestros</span>}</NavLink>
        <NavLink to="/admin/estudiantes"><Users size={20} /> {!isCollapsed && <span>Estudiantes</span>}</NavLink>
      </nav>
    </aside>

   
    <main className="main-content">
      <header className="topbar">
        <div className="topbar-left">
        
          <button className="toggle-btn" onClick={() => setIsCollapsed(!isCollapsed)}>
            <Menu size={24} />
          </button>
        <h3>
  {user?.rol === "Administrador"
    ? "Panel Administrador General"
    : user?.rol === "CoordinadorPrimaria"
    ? "Panel Coordinador Primaria"
    : user?.rol === "CoordinadorSecundaria"
    ? "Panel Coordinador Secundaria"
    : user?.rol === "CoordinadorPolitecnico"
    ? "Panel Coordinador Politécnico"
    : "Panel"}
</h3>
        </div>
        
        <div className="topbar-right">
          <div className="user-profile">
            <div className="user-info">
              <span className="user-name">{user?.nombreUsuario || "Mario Y"}</span>
            <span className="user-role">
  {user?.rol === "Administrador"
    ? "Administrador General"
    : user?.rol === "CoordinadorPrimaria"
    ? "Coordinador Primaria"
    : user?.rol === "CoordinadorSecundaria"
    ? "Coordinador Secundaria"
    : user?.rol === "CoordinadorPolitecnico"
    ? "Coordinador Politécnico"
    : user?.rol}
</span>
            </div>
            
            <div className="topbar-actions">
              <button 
                onClick={() => navigate("/cambiar-password")} 
                title="Cambiar Contraseña" 
                className="action-icon-btn"
              >
                <Key size={18} />
              </button>
              <button 
                onClick={cerrarSesion} 
                title="Cerrar Sesión" 
                className="action-icon-btn logout"
              >
                <LogOut size={18} />
              </button>
            </div>
          </div>
        </div>
      </header>

      <section className="content">
        <Outlet />
      </section>
    </main>
  </div>
);
};


export default AdminLayout;