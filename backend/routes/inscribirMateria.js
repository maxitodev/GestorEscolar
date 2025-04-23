const express = require('express');
const router = express.Router();
const inscripcionModel = require('../models/inscribirMateria');  // Asegúrate de que este modelo esté bien importado

// Ruta para inscribir al alumno en una materia
router.post('/inscribir', (req, res) => {
  const { materiaId, alumnoId } = req.body;  // Ahora también necesitamos el alumnoId

  // Verificar si se envió una materia y un alumno
  if (!materiaId || !alumnoId) {
    return res.status(400).json({ error: 'La materia y el alumno son obligatorios.' });
  }

  // Llamada al modelo para inscribir al alumno en la materia
  inscripcionModel.inscribirMateria(materiaId, alumnoId, (err, result) => {
    if (err) {
      console.error('Error al inscribir materia:', err.message); // Log the error
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json({ message: result.mensaje });
  });
});

// Confirmar inscripción
router.post('/confirmar', (req, res) => {
  const { alumnoId } = req.body;

  if (!alumnoId) {
    return res.status(400).json({ error: 'El ID del alumno es obligatorio.' });
  }

  const sql = `UPDATE Inscripcion SET confirmada = 1 WHERE ID_alumno = ?`;

  db.query(sql, [alumnoId], (err, result) => {
    if (err) {
      console.error('Error al confirmar inscripción:', err);
      return res.status(500).json({ error: 'Error al confirmar la inscripción.' });
    }
    res.status(200).json({ message: 'Inscripción confirmada exitosamente.' });
  });
});

module.exports = router;
