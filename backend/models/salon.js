const db = require('../config/db');

const crearSalon = (no_salon, capacidad, tipo, callback) => {
  const sql = 'INSERT INTO Salon (no_salon, capacidad, tipo) VALUES (?, ?, ?)';
  db.query(sql, [no_salon, capacidad, tipo], (err, result) => {
    if (err) return callback(err);
    callback(null, result);
  });
};

const obtenerSalones = (callback) => {
  const sql = `SELECT ID_salon, no_salon, capacidad, tipo FROM Salon`;
  db.query(sql, (err, results) => {
    if (err) return callback(err);
    callback(null, results);
  });
};

module.exports = {
  crearSalon,
  obtenerSalones
};
