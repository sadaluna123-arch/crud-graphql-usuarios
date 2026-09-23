// Resolvers: cada función atiende una query o mutation y consulta MySQL
const pool = require('./db');

function validar(datos) {
  const nombre = (datos.nombre || '').trim();
  const correo = (datos.correo || '').trim();
  const edad = Number(datos.edad);
  if (!nombre) throw new Error('El nombre es obligatorio');
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) throw new Error('El correo no es válido');
  if (!Number.isInteger(edad) || edad <= 0) throw new Error('La edad debe ser un número entero mayor que 0');
  return { nombre, correo, edad };
}

async function buscarPorId(id) {
  const [filas] = await pool.query('SELECT id, nombre, correo, edad FROM usuarios WHERE id = ?', [id]);
  return filas[0] || null;
}

function traducirError(err) {
  if (err.code === 'ER_DUP_ENTRY') return new Error('Ya existe un usuario con ese correo');
  return err;
}

const root = {
  usuarios: async () => {
    const [filas] = await pool.query('SELECT id, nombre, correo, edad FROM usuarios ORDER BY id');
    return filas;
  },

  usuario: async ({ id }) => buscarPorId(id),

  crearUsuario: async ({ datos }) => {
    const { nombre, correo, edad } = validar(datos);
    try {
      const [res] = await pool.query(
        'INSERT INTO usuarios (nombre, correo, edad) VALUES (?, ?, ?)',
        [nombre, correo, edad]
      );
      return buscarPorId(res.insertId);
    } catch (err) {
      throw traducirError(err);
    }
  },

  actualizarUsuario: async ({ id, datos }) => {
    const { nombre, correo, edad } = validar(datos);
    const existente = await buscarPorId(id);
    if (!existente) throw new Error(`No existe un usuario con id ${id}`);
    try {
      await pool.query(
        'UPDATE usuarios SET nombre = ?, correo = ?, edad = ? WHERE id = ?',
        [nombre, correo, edad, id]
      );
      return buscarPorId(id);
    } catch (err) {
      throw traducirError(err);
    }
  },

  eliminarUsuario: async ({ id }) => {
    const existente = await buscarPorId(id);
    if (!existente) throw new Error(`No existe un usuario con id ${id}`);
    await pool.query('DELETE FROM usuarios WHERE id = ?', [id]);
    return existente;
  }
};

module.exports = root;
