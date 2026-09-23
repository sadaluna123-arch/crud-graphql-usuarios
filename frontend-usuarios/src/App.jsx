import { useEffect, useState } from 'react';
import FormularioUsuario from './components/FormularioUsuario';
import ListaUsuarios from './components/ListaUsuarios';
import Mensaje from './components/Mensaje';
import './App.css';

export default function App() {
  // usuarioEditar comunica la fila seleccionada en la tabla con el formulario
  const [usuarioEditar, setUsuarioEditar] = useState(null);
  const [mensaje, setMensaje] = useState(null);

  // El mensaje de éxito o error desaparece solo después de unos segundos
  useEffect(() => {
    if (!mensaje) return;
    const t = setTimeout(() => setMensaje(null), 4000);
    return () => clearTimeout(t);
  }, [mensaje]);

  return (
    <main className="contenedor">
      <h1>Gestión de usuarios</h1>
      <p className="subtitulo">React + Apollo Client + GraphQL + MySQL</p>
      <Mensaje mensaje={mensaje} alCerrar={() => setMensaje(null)} />
      <FormularioUsuario
        usuarioEditar={usuarioEditar}
        alTerminar={() => setUsuarioEditar(null)}
        alNotificar={setMensaje}
      />
      <ListaUsuarios
        alEditar={setUsuarioEditar}
        alNotificar={setMensaje}
        usuarioEditar={usuarioEditar}
      />
    </main>
  );
}
