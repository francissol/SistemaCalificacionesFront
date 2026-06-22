import { useEffect, useState } from "react";
import api from "../../api/axiosConfig";

interface Padre {
  idPadre: number;
  nombres: string;
  apellidos: string;
  telefono: string | null;
  correo: string | null;
  direccion: string | null;
  ocupacion: string | null;
  activo: boolean;
  usuario: string | null;
  cantidadHijos: number;
}

interface Hijo {
  idEstudiante: number;
  matricula: string;
  nombres: string;
  apellidos: string;
  parentesco: string;
  cursoActual: string | null;
}

const PadresPage = () => {
  const [padres, setPadres] = useState<Padre[]>([]);
  const [hijos, setHijos] = useState<Hijo[]>([]);
  const [padreSeleccionado, setPadreSeleccionado] = useState<Padre | null>(null);

  const cargarPadres = async () => {
    const res = await api.get("/Padres");
    setPadres(res.data);
  };

  useEffect(() => {
    cargarPadres();
  }, []);

  const verHijos = async (padre: Padre) => {
    setPadreSeleccionado(padre);
    const res = await api.get(`/Padres/${padre.idPadre}/hijos`);
    setHijos(res.data);
  };

  const cambiarEstado = async (id: number) => {
    await api.put(`/Padres/${id}/estado`);
    cargarPadres();
  };

  return (
    <div>
      <h1>Padres</h1>

      {padreSeleccionado && (
        <div className="card" style={{ marginBottom: 20 }}>
          <h3>
            Hijos de {padreSeleccionado.nombres} {padreSeleccionado.apellidos}
          </h3>

          {hijos.length === 0 ? (
            <p>No tiene hijos asociados.</p>
          ) : (
            <ul>
              {hijos.map((hijo) => (
                <li key={hijo.idEstudiante}>
                  {hijo.nombres} {hijo.apellidos} - {hijo.cursoActual} -{" "}
                  {hijo.parentesco}
                </li>
              ))}
            </ul>
          )}

          <button onClick={() => setPadreSeleccionado(null)}>Cerrar</button>
        </div>
      )}

      <table className="data-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Usuario</th>
            <th>Padre</th>
            <th>Teléfono</th>
            <th>Correo</th>
            <th>Hijos</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>

        <tbody>
          {padres.map((p) => (
            <tr key={p.idPadre}>
              <td>{p.idPadre}</td>
              <td>{p.usuario}</td>
              <td>
                {p.nombres} {p.apellidos}
              </td>
              <td>{p.telefono}</td>
              <td>{p.correo}</td>
              <td>
                <button onClick={() => verHijos(p)}>
                  {p.cantidadHijos} hijos
                </button>
              </td>
              <td>{p.activo ? "Activo" : "Inactivo"}</td>
              <td>
                <button onClick={() => cambiarEstado(p.idPadre)}>
                  {p.activo ? "Desactivar" : "Activar"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PadresPage;