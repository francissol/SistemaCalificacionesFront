import { Navigate, Route, Routes } from "react-router-dom";
import Login from "../pages/Login";
import DashboardAdmin from "../pages/admin/DashboardAdmin";
import DashboardMaestro from "../pages/maestro/DashboardMaestro";
import DashboardEstudiante from "../pages/estudiante/DashboardEstudiante";
import DashboardPadre from "../pages/padre/DashboardPadre";
import AdminLayout from "../layouts/AdminLayout";
import { useAuth } from "../auth/AuthContext";
import NivelesPage from "../pages/admin/NivelesPage";
import GradosPage from "../pages/admin/GradosPage";
import CursosPage from "../pages/admin/CursosPage";
import MateriasPage from "../pages/admin/MateriasPage";
import GradoMateriasPage from "../pages/admin/GradoMateriasPage";
import AniosEscolaresPage from "../pages/admin/AniosEscolaresPage";
import MaestrosPage from "../pages/admin/MaestrosPage";
import EstudiantesPage from "../pages/admin/EstudiantesPage";
import AsignacionesDocentesPage from "../pages/admin/AsignacionesDocentesPage";
import PeriodosPublicacionPage from "../pages/admin/PeriodosPublicacionPage";
import PadresPage from "../pages/admin/PadresPage";
import ReportesPage from "../pages/admin/ReportesPage";
import AsignacionMaestroPage from "../pages/maestro/AsignacionMaestroPage";
import CambiarPasswordPage from "../pages/CambiarPassword";
import MateriasMaestroPage from "../pages/maestro/MateriasMaestroPage";

const ProtectedRoute = ({
  children,
  roles,
}: {
  children: React.ReactNode;
  roles: string[];
}) => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) return <Navigate to="/" />;

  if (!user?.rol || !roles.includes(user.rol)) {
    return <Navigate to="/" />;
  }

  return children;
};

const rolesAdmin = [
  "Administrador",
  "CoordinadorPrimaria",
  "CoordinadorSecundaria",
  "CoordinadorPolitecnico",
];

const AppRoutes = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route path="/" element={<Login />} />

      <Route
        path="/admin"
        element={
          <ProtectedRoute roles={rolesAdmin}>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<DashboardAdmin />} />
        <Route path="niveles" element={<NivelesPage />} />
        <Route path="grados" element={<GradosPage />} />
        <Route path="cursos" element={<CursosPage />} />
        <Route path="materias" element={<MateriasPage />} />
        <Route path="grado-materias" element={<GradoMateriasPage />} />
        <Route path="anios-escolares" element={<AniosEscolaresPage />} />
        <Route path="maestros" element={<MaestrosPage />} />
        <Route path="estudiantes" element={<EstudiantesPage />} />
        <Route path="asignaciones-docentes" element={<AsignacionesDocentesPage />} />
        <Route path="periodos-publicacion" element={<PeriodosPublicacionPage />} />
        <Route path="padres" element={<PadresPage />} />
        <Route path="reportes" element={<ReportesPage />} />
      </Route>

      <Route
        path="/maestro/dashboard"
        element={
          <ProtectedRoute roles={["Maestro"]}>
            <DashboardMaestro />
          </ProtectedRoute>
        }
      />

      <Route
        path="/maestro/asignacion/:id"
        element={
          <ProtectedRoute roles={["Maestro"]}>
            <AsignacionMaestroPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/maestro/materias"
        element={
          <ProtectedRoute roles={["Maestro"]}>
            <MateriasMaestroPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/estudiante/dashboard"
        element={
          <ProtectedRoute roles={["Estudiante"]}>
            <DashboardEstudiante />
          </ProtectedRoute>
        }
      />

      <Route
        path="/padre/dashboard"
        element={
          <ProtectedRoute roles={["Padre"]}>
            <DashboardPadre />
          </ProtectedRoute>
        }
      />

      <Route
        path="/cambiar-password"
        element={
          isAuthenticated ? <CambiarPasswordPage /> : <Navigate to="/" />
        }
      />
    </Routes>
  );
};

export default AppRoutes;