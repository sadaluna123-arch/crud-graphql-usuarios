import { useQuery, useMutation } from '@apollo/client/react';
import { OBTENER_USUARIOS, ELIMINAR_USUARIO } from '../graphql/operaciones';
import { mensajeError } from '../graphql/errores';

export default function ListaUsuarios({ alEditar, alNotificar, usuarioEditar }) {
  // RF1: la query trae los usuarios; loading y error controlan los estados (RF6)
  const { loading, error, data, refetch } = useQuery(OBTENER_USUARIOS);

  // RF7: refetchQueries vuelve a consultar la lista después de eliminar
  const [eliminarUsuario, { loading: eliminando }] = useMutation(ELIMINAR_USUARIO, {
    refetchQueries: [{ query: OBTENER_USUARIOS }],
    awaitRefetchQueries: true
  });

  if (loading) return <p className="estado">Cargando usuarios...</p>;

  if (error) {
    return (
      <div className="estado estado-error">
        <p><strong>No fue posible cargar los usuarios.</strong></p>
        <p>Error: {mensajeError(error)}</p>
        <p>Verifique que el backend esté activo en http://localhost:4000/graphql.</p>
        <button type="button" onClick={() => refetch()}>Reintentar</button>
      </div>
    );
  }

  // RF5: solicita confirmación antes de eliminar
  const eliminar = async (usuario) => {
    if (!confirm(`¿Desea eliminar a ${usuario.nombre}?`)) return;
    try {
      await eliminarUsuario({ variables: { id: Number(usuario.id) } });
      if (usuarioEditar && usuarioEditar.id === usuario.id) alEditar(null);
      alNotificar({ tipo: 'exito', texto: `Usuario "${usuario.nombre}" eliminado correctamente.` });
    } catch (err) {
      alNotificar({ tipo: 'error', texto: `No se pudo eliminar: ${mensajeError(err)}` });
    }
  };

  const usuarios = data?.usuarios ?? [];

  return (
    <section className="tarjeta">
      <h2>Usuarios registrados ({usuarios.length})</h2>
      {usuarios.length === 0 ? (
        <p className="estado">No hay usuarios registrados.</p>
      ) : (
        <div className="tabla-scroll">
          <table>
            <thead>
              <tr><th>ID</th><th>Nombre</th><th>Correo</th><th>Edad</th><th>Acciones</th></tr>
            </thead>
            <tbody>
              {usuarios.map((usuario) => (
                <tr key={usuario.id} className={usuarioEditar?.id === usuario.id ? 'seleccionado' : ''}>
                  <td data-label="ID">{usuario.id}</td>
                  <td data-label="Nombre">{usuario.nombre}</td>
                  <td data-label="Correo">{usuario.correo}</td>
                  <td data-label="Edad">{usuario.edad}</td>
                  <td data-label="Acciones" className="acciones">
                    <button type="button" onClick={() => alEditar(usuario)}>Editar</button>
                    <button type="button" className="peligro" disabled={eliminando} onClick={() => eliminar(usuario)}>
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
