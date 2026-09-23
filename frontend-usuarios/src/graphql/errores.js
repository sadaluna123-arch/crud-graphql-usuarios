// Convierte los errores de Apollo en un mensaje comprensible para el usuario
export function mensajeError(err) {
  if (!err) return 'Error desconocido';
  // Errores GraphQL devueltos por los resolvers (validaciones, correo repetido...)
  if (Array.isArray(err.errors) && err.errors.length) {
    return err.errors.map((e) => e.message).join('. ');
  }
  // Algunos servidores responden 500 pero incluyen el detalle en el cuerpo
  if (err.bodyText) {
    try {
      const cuerpo = JSON.parse(err.bodyText);
      if (cuerpo.errors?.length) return cuerpo.errors.map((e) => e.message).join('. ');
    } catch { /* el cuerpo no era JSON */ }
  }
  if (/fetch|network/i.test(err.message)) {
    return 'No hay conexión con el servidor GraphQL (Failed to fetch).';
  }
  return err.message;
}
