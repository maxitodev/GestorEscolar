const db = require('../config/db');

// Recupera un usuario usando la dirección de correo
const getUsuarioPorCorreo = (correo, callback) => {
  // Usamos "Usuarios" (con mayúscula) y alias para el ID
  const query = 'SELECT ID_usuario AS id, nombre, correo, contrasena, rol FROM Usuarios WHERE correo = ?';
  db.query(query, [correo], (err, results) => {
    if (err) return callback(err);
    callback(null, results[0]);
  });
};

// Crea un nuevo usuario; incluye carrera_FK si se envía
const crearUsuario = (usuario, callback) => {
  const { nombre, correo, contrasena, rol, carrera_FK } = usuario;
  
  // Si se provee carrera_FK, se inserta la carrera, de lo contrario no se incluye la columna
  if (carrera_FK) {
    db.query(
      'INSERT INTO Usuarios (nombre, correo, contrasena, rol, carrera_FK) VALUES (?, ?, ?, ?, ?)',
      [nombre, correo, contrasena, rol, carrera_FK],
      (err, result) => {
        if (err) return callback(err);
        callback(null, result);
      }
    );
  } else {
    db.query(
      'INSERT INTO Usuarios (nombre, correo, contrasena, rol) VALUES (?, ?, ?, ?)',
      [nombre, correo, contrasena, rol],
      (err, result) => {
        if (err) return callback(err);
        callback(null, result);
      }
    );
  }
};

module.exports = {
  getUsuarioPorCorreo,
  crearUsuario,
};
