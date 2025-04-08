const db = require('../config/db');

// Crear una nueva carrera con nombre
const crearCarrera = (nombre, callback) => {
  const safeNombre = typeof nombre === 'string' ? nombre : String(nombre); // added
  const sql = `INSERT INTO Carreras (nombre_carrera) VALUES (?)`;
  db.query(sql, [safeNombre], (err, result) => {
    if (err) return callback(err);
    callback(null, result);
  });
};

// Obtener todas las carreras
const obtenerCarreras = (callback) => {
  const sql = `SELECT * FROM Carreras`;
  db.query(sql, (err, results) => {
    if (err) return callback(err);
    callback(null, results);
  });
};

module.exports = {
  crearCarrera,
  obtenerCarreras
};
