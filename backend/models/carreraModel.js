const db = require('../config/db');

// Función para crear una carrera
const crearCarrera = (nombre_carrera, callback) => {
  const sql = `INSERT INTO Carreras (nombre_carrera) VALUES (?)`;
  db.query(sql, [nombre_carrera], (err, result) => {
    if (err) return callback(err);
    callback(null, result);
  });
};

// Función para obtener todas las carreras
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
