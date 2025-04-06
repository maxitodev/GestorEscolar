const db = require('../config/db');

const getUsuarioPorCorreo = (correo, callback) => {
  db.query('SELECT * FROM usuarios WHERE correo = ?', [correo], (err, results) => {
    if (err) return callback(err);
    callback(null, results[0]);
  });
};

const crearUsuario = (usuario, callback) => {
  const { nombre, correo, contrasena, rol } = usuario;
  db.query(
    'INSERT INTO usuarios (nombre, correo, contrasena, rol) VALUES (?, ?, ?, ?)',
    [nombre, correo, contrasena, rol],
    (err, result) => {
      if (err) return callback(err);
      callback(null, result);
    }
  );
};

module.exports = {
  getUsuarioPorCorreo,
  crearUsuario,
};
