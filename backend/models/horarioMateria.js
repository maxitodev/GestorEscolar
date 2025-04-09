const db = require('../config/db');

const asignarHorarioAMateria = (materiaId, bloqueHorario, diaSemana, callback) => {
  if (!materiaId || !bloqueHorario || !diaSemana) {
    return callback(new Error('Todos los campos son obligatorios.'));
  }

  const verificarSQL = `
    SELECT * FROM Horario
    WHERE materia_FK = ? AND Horario = ? AND dia_sem = ?
  `;

  db.query(verificarSQL, [materiaId, bloqueHorario, diaSemana], (err, results) => {
    if (err) return callback(err);

    if (results.length > 0) {
      return callback(new Error('Ya existe un horario asignado para esta materia en ese día y bloque.'));
    }

    const insertarSQL = `
      INSERT INTO Horario (materia_FK, Horario, dia_sem)
      VALUES (?, ?, ?)
    `;

    db.query(insertarSQL, [materiaId, bloqueHorario, diaSemana], (err, result) => {
      if (err) return callback(err);
      callback(null, {
        mensaje: '✅ Horario asignado exitosamente.',
        id_horario: result.insertId
      });
    });
  });
};

module.exports = {
  asignarHorarioAMateria
};
