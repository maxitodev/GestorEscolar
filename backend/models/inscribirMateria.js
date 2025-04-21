const db = require('../config/db');

// Inscribir a un alumno en una materia
const inscribirMateria = (materiaId, callback) => {
  if (!materiaId) {
    return callback(new Error('La materia es obligatoria.'));
  }

  // Verificar si hay cupo disponible en la materia
  const sqlVerificarCupo = `SELECT cupo_disponible FROM Materia WHERE ID_materia = ?`;
  db.query(sqlVerificarCupo, [materiaId], (err, result) => {
    if (err) return callback(err);

    if (result.length > 0 && result[0].cupo_disponible > 0) {
      // Disminuir el cupo disponible de la materia
      const sqlActualizarCupo = `UPDATE Materia SET cupo_disponible = cupo_disponible - 1 WHERE ID_materia = ?`;
      db.query(sqlActualizarCupo, [materiaId], (err, result) => {
        if (err) return callback(err);

        callback(null, {
          mensaje: '✅ Inscripción exitosa.',
          id_inscripcion: result.insertId
        });
      });
    } else {
      callback(new Error('No hay cupo disponible para esta materia.'));
    }
  });
};

module.exports = {
  inscribirMateria
};
