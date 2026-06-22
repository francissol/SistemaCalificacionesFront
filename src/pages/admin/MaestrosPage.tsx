import { useEffect, useState } from "react";
import api from "../../api/axiosConfig";

interface Maestro {
  idMaestro: number;
  codigoEmpleado: string | null;
  nombres: string;
  apellidos: string;
  cedula: string | null;
  telefono: string | null;
  correo: string | null;
  direccion: string | null;
  especialidad: string | null;
  fechaIngreso: string | null;
  activo: boolean;
  usuario: string | null;
}

const MaestrosPage = () => {
  const [maestros, setMaestros] = useState<Maestro[]>([]);

  const [codigoEmpleado, setCodigoEmpleado] = useState("");
  const [nombres, setNombres] = useState("");
  const [apellidos, setApellidos] = useState("");
  const [cedula, setCedula] = useState("");
  const [telefono, setTelefono] = useState("");
  const [correo, setCorreo] = useState("");
  const [direccion, setDireccion] = useState("");
  const [especialidad, setEspecialidad] = useState("");
  const [fechaIngreso, setFechaIngreso] = useState("");

  const [editandoId, setEditandoId] = useState<number | null>(null);

  const cargarMaestros = async () => {
    const res = await api.get("/Maestros");
    setMaestros(res.data);
  };

  useEffect(() => {
    cargarMaestros();
  }, []);

  const limpiar = () => {
    setCodigoEmpleado("");
    setNombres("");
    setApellidos("");
    setCedula("");
    setTelefono("");
    setCorreo("");
    setDireccion("");
    setEspecialidad("");
    setFechaIngreso("");
    setEditandoId(null);
  };

  const guardar = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      codigoEmpleado,
      nombres,
      apellidos,
      cedula,
      telefono,
      correo,
      direccion,
      especialidad,
      fechaIngreso: fechaIngreso || null,
    };

    if (editandoId) {
      await api.put(`/Maestros/${editandoId}`, payload);
    } else {
      const res = await api.post("/Maestros", payload);
      alert(
        `Maestro creado.\nUsuario: ${res.data.usuario}\nContraseña temporal: ${res.data.passwordTemporal}`
      );
    }

    limpiar();
    cargarMaestros();
  };

  const editar = (m: Maestro) => {
    setEditandoId(m.idMaestro);
    setCodigoEmpleado(m.codigoEmpleado ?? "");
    setNombres(m.nombres);
    setApellidos(m.apellidos);
    setCedula(m.cedula ?? "");
    setTelefono(m.telefono ?? "");
    setCorreo(m.correo ?? "");
    setDireccion(m.direccion ?? "");
    setEspecialidad(m.especialidad ?? "");
    setFechaIngreso(m.fechaIngreso?.substring(0, 10) ?? "");
  };

  const cambiarEstado = async (id: number) => {
    await api.put(`/Maestros/${id}/estado`);
    cargarMaestros();
  };

  return (
    <div>
      <h1>Maestros</h1>

      <form onSubmit={guardar} className="form-card form-grid">
        <input placeholder="Código" value={codigoEmpleado} onChange={(e) => setCodigoEmpleado(e.target.value)} />
        <input placeholder="Nombres" value={nombres} onChange={(e) => setNombres(e.target.value)} required />
        <input placeholder="Apellidos" value={apellidos} onChange={(e) => setApellidos(e.target.value)} required />
        <input placeholder="Cédula" value={cedula} onChange={(e) => setCedula(e.target.value)} />
        <input placeholder="Teléfono" value={telefono} onChange={(e) => setTelefono(e.target.value)} />
        <input placeholder="Correo" value={correo} onChange={(e) => setCorreo(e.target.value)} />
        <input placeholder="Dirección" value={direccion} onChange={(e) => setDireccion(e.target.value)} />
        <input placeholder="Especialidad" value={especialidad} onChange={(e) => setEspecialidad(e.target.value)} />
        <input type="date" value={fechaIngreso} onChange={(e) => setFechaIngreso(e.target.value)} />

        <button type="submit">{editandoId ? "Actualizar" : "Crear"}</button>

        {editandoId && (
          <button type="button" onClick={limpiar}>
            Cancelar
          </button>
        )}
      </form>

      <table className="data-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Usuario</th>
            <th>Maestro</th>
            <th>Teléfono</th>
            <th>Correo</th>
            <th>Especialidad</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>

        <tbody>
          {maestros.map((m) => (
            <tr key={m.idMaestro}>
              <td>{m.idMaestro}</td>
              <td>{m.usuario}</td>
              <td>{m.nombres} {m.apellidos}</td>
              <td>{m.telefono}</td>
              <td>{m.correo}</td>
              <td>{m.especialidad}</td>
              <td>{m.activo ? "Activo" : "Inactivo"}</td>
              <td>
                <button onClick={() => editar(m)}>Editar</button>
                <button onClick={() => cambiarEstado(m.idMaestro)}>
                  {m.activo ? "Desactivar" : "Activar"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MaestrosPage;