const express = require('express');
const router = express.Router();
const inscripcionModel = require('../models/inscribirMateria');
const db = require('../config/db'); // Added the db import

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

// Agregar endpoint para obtener inscripciones de un alumno
router.get('/inscripciones/:alumnoId', (req, res) => {
  const { alumnoId } = req.params;
  if (!alumnoId) {
    return res.status(400).json({ error: 'El ID del alumno es obligatorio.' });
  }
  const sql = `
    SELECT i.ID_inscripcion, i.ID_materia, m.nombre_materia, i.fecha_inscripcion, i.confirmada
    FROM Inscripcion i
    JOIN Materia m ON i.ID_materia = m.ID_materia
    WHERE i.ID_alumno = ?
  `;
  db.query(sql, [alumnoId], (err, results) => {
    if (err) {
      console.error('Error al obtener inscripciones:', err);
      return res.status(500).json({ error: 'Error al obtener las inscripciones.' });
    }
    res.status(200).json(results);
  });
});

module.exports = router;
