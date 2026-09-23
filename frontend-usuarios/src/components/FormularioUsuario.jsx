import { useEffect, useState } from 'react';
import { useMutation } from '@apollo/client/react';
import { CREAR_USUARIO, ACTUALIZAR_USUARIO, OBTENER_USUARIOS } from '../graphql/operaciones';
import { mensajeError } from '../graphql/errores';

const inicial = { nombre: '', correo: '', edad: '' };

export default function FormularioUsuario({ usuarioEditar, alTerminar, alNotificar }) {
  // RF2: formulario controlado, sus valores viven en el estado
  const [formulario, setFormulario] = useState(inicial);

  // RF7: ambas mutaciones vuelven a consultar la lista al terminar
  const opciones = { refetchQueries: [{ query: OBTENER_USUARIOS }], awaitRefetchQueries: true };
  const [crear, { loading: creando }] = useMutation(CREAR_USUARIO, opciones);
  const [actualizar, { loading: actualizando }] = useMutation(ACTUALIZAR_USUARIO, opciones);
  const guardando = creando || actualizando;

  // RF3: al seleccionar un usuario se cargan sus datos en el formulario
  useEffect(() => {
    setFormulario(usuarioEditar ? {
      nombre: usuarioEditar.nombre,
      correo: usuarioEditar.correo,
      edad: String(usuarioEditar.edad)
    } : inicial);
  }, [usuarioEditar]);

  const cambiar = (e) => setFormulario({ ...formulario, [e.target.name]: e.target.value });

  const guardar = async (e) => {
    e.preventDefault();
    // Validación básica adicional a los atributos required del HTML
    const datos = {
      nombre: formulario.nombre.trim(),
      correo: formulario.correo.trim(),
      edad: Number(formulario.edad) // GraphQL espera Int, el input entrega texto
    };
    if (!datos.nombre || !datos.correo || !Number.isInteger(datos.edad) || datos.edad < 1) {
      alNotificar({ tipo: 'error', texto: 'Complete todos los campos. La edad debe ser un número entero mayor que 0.' });
      return;
    }

    try {
      if (usuarioEditar) {
        // RF4: actualización mediante mutation
        await actualizar({ variables: { id: Number(usuarioEditar.id), datos } });
        alNotificar({ tipo: 'exito', texto: `Usuario "${datos.nombre}" actualizado correctamente.` });
      } else {
        await crear({ variables: { datos } });
        alNotificar({ tipo: 'exito', texto: `Usuario "${datos.nombre}" registrado correctamente.` });
      }
      setFormulario(inicial);
      alTerminar();
    } catch (err) {
      alNotificar({ tipo: 'error', texto: `No se pudo guardar: ${mensajeError(err)}` });
    }
  };

  const cancelar = () => {
    setFormulario(inicial);
    alTerminar();
  };

  return (
    <form onSubmit={guardar} className="tarjeta">
      <h2>{usuarioEditar ? `Editar usuario #${usuarioEditar.id}` : 'Nuevo usuario'}</h2>
      <label>
        Nombre
        <input name="nombre" placeholder="Nombre completo" value={formulario.nombre}
          onChange={cambiar} required maxLength={100} />
      </label>
      <label>
        Correo
        <input name="correo" type="email" placeholder="correo@ejemplo.com" value={formulario.correo}
          onChange={cambiar} required maxLength={150} />
      </label>
      <label>
        Edad
        <input name="edad" type="number" min="1" step="1" placeholder="Edad" value={formulario.edad}
          onChange={cambiar} required />
      </label>
      <div className="botones">
        <button type="submit" disabled={guardando}>
          {guardando ? 'Guardando...' : usuarioEditar ? 'Actualizar' : 'Guardar'}
        </button>
        {usuarioEditar && (
          <button type="button" className="secundario" onClick={cancelar} disabled={guardando}>Cancelar</button>
        )}
      </div>
    </form>
  );
}
