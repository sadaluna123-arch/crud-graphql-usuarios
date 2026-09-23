// Muestra un aviso de éxito o error (RF6)
export default function Mensaje({ mensaje, alCerrar }) {
  if (!mensaje) return null;
  return (
    <div className={`mensaje mensaje-${mensaje.tipo}`} role="status">
      <span>{mensaje.texto}</span>
      <button type="button" className="cerrar" onClick={alCerrar} aria-label="Cerrar mensaje">×</button>
    </div>
  );
}
