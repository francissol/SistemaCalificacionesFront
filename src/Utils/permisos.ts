export const esAdministradorGeneral = (rol?: string) => {
  return rol === "Administrador";
};

export const esCoordinador = (rol?: string) => {
  return (
    rol === "CoordinadorPrimaria" ||
    rol === "CoordinadorSecundaria" ||
    rol === "CoordinadorPolitecnico"
  );
};

export const esAdminOCoordinador = (rol?: string) => {
  return esAdministradorGeneral(rol) || esCoordinador(rol);
};

export const obtenerNivelCoordinador = (rol?: string) => {
  if (rol === "CoordinadorPrimaria") return "Primaria";
  if (rol === "CoordinadorSecundaria") return "Secundaria";
  if (rol === "CoordinadorPolitecnico") return "Politécnico";

  return null;
};