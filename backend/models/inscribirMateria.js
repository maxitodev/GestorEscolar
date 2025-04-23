const db = require('../config/db');

// Inscribir a un alumno en una materia
const inscribirMateria = (materiaId, callback) => {
  if (!materiaId) {
    return callback(new Error('La materia es obligatoria.'));
  }

  // Verificar si hay capacidad disponible en la materia
  const sqlVerificarCupo = `SELECT capacidad FROM Materia WHERE ID_materia = ?`; // Use capacidad
  db.query(sqlVerificarCupo, [materiaId], (err, result) => {
    if (err) {
      console.error('Error ejecutando sqlVerificarCupo:', err); // Log the SQL error
      return callback(new Error('Error al verificar la capacidad disponible.'));
    }
    if (result.length === 0) {
      console.error('Materia no encontrada para ID:', materiaId); // Log missing data
      return callback(new Error('La materia no existe.'));
    }

    if (result[0].capacidad > 0) { // Check capacidad
      // Disminuir la capacidad disponible de la materia
      const sqlActualizarCupo = `UPDATE Materia SET capacidad = capacidad - 1 WHERE ID_materia = ?`; // Update capacidad
      db.query(sqlActualizarCupo, [materiaId], (err, result) => {
        if (err) {
          console.error('Error ejecutando sqlActualizarCupo:', err); // Log the SQL error
          return callback(new Error('Error al actualizar la capacidad disponible.'));
        }
        callback(null, {
          mensaje: '✅ Inscripción exitosa.',
          id_inscripcion: result.insertId
        });
      });
    } else {
      console.warn('No hay capacidad disponible para la materia con ID:', materiaId); // Log no available slots
      callback(new Error('No hay capacidad disponible para esta materia.'));
    }
  });
};

module.exports = {
  inscribirMateria
};
