const db = require('../config/db');

// Inscribir a un alumno en una materia
const inscribirMateria = (materiaId, alumnoId, callback) => {
  if (!materiaId || !alumnoId) {
    return callback(new Error('La materia y el alumno son obligatorios.'));
  }

  // Verificar si el alumno ya está inscrito en la materia
  const sqlVerificarInscripcion = `SELECT * FROM Inscripcion WHERE ID_materia = ? AND ID_alumno = ?`;
  db.query(sqlVerificarInscripcion, [materiaId, alumnoId], (err, result) => {
    if (err) {
      console.error('Error ejecutando sqlVerificarInscripcion:', err.sqlMessage || err);
      return callback(new Error('Error al verificar la inscripción.'));
    }
    if (result.length > 0) {
      console.warn('El alumno ya está inscrito en la materia con ID:', materiaId);
      return callback(null, {
        mensaje: 'Ya estás inscrito en esta materia.',
        id_inscripcion: null
      });
    }

    // Verificar si hay cupo disponible en la materia
    const sqlVerificarCupo = `SELECT cupo_disponible FROM Materia WHERE ID_materia = ?`;
    db.query(sqlVerificarCupo, [materiaId], (err, result) => {
      if (err) {
        console.error('Error ejecutando sqlVerificarCupo:', err.sqlMessage || err); // Log detailed SQL error
        return callback(new Error('Error al verificar el cupo disponible.'));
      }
      if (result.length === 0) {
        console.error('Materia no encontrada para ID:', materiaId); // Log missing data
        return callback(new Error('La materia no existe.'));
      }

      if (result[0].cupo_disponible > 0) {
        // Disminuir el cupo disponible de la materia
        const sqlActualizarCupo = `UPDATE Materia SET cupo_disponible = cupo_disponible - 1 WHERE ID_materia = ?`;
        db.query(sqlActualizarCupo, [materiaId], (err, result) => {
          if (err) {
            console.error('Error ejecutando sqlActualizarCupo:', err.sqlMessage || err); // Log detailed SQL error
            return callback(new Error('Error al actualizar el cupo disponible.'));
          }

          // Registrar la inscripción
          const sqlRegistrarInscripcion = `INSERT INTO Inscripcion (ID_materia, ID_alumno) VALUES (?, ?)`;
          db.query(sqlRegistrarInscripcion, [materiaId, alumnoId], (err, result) => {
            if (err) {
              console.error('Error ejecutando sqlRegistrarInscripcion:', err.sqlMessage || err);
              return callback(new Error('Error al registrar la inscripción.'));
            }
            callback(null, {
              mensaje: '✅ Inscripción exitosa.',
              id_inscripcion: result.insertId
            });
          });
        });
      } else {
        console.warn('No hay cupo disponible para la materia con ID:', materiaId);
        callback(new Error('No hay cupo disponible para esta materia.'));
      }
    });
  });
};

module.exports = {
  inscribirMateria
};
