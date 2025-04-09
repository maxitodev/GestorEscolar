const db = require('../config/db');

const crearSalon = (no_salon, capacidad, tipo, callback) => {
    const sql = 'INSERT INTO salon (no_salon, capacidad, tipo, dia_sem) VALUES (?, ?, ?, ?)';
    db.query(sql, [no_salon, capacidad, tipo, 0], (err, result) => {
      if (err) return callback(err);
      callback(null, result);
    });
  };  
  

const obtenerSalones = (callback) => {
  const sql = `SELECT * FROM salon`;
  db.query(sql, (err, results) => {
    if (err) return callback(err);
    callback(null, results);
  });
};



module.exports = {
  crearSalon,
  obtenerSalones
};
