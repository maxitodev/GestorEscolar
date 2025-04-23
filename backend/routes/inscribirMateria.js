const express = require('express');
const router = express.Router();
const inscripcionModel = require('../models/inscribirMateria');  // Asegúrate de que este modelo esté bien importado

// Ruta para inscribir al alumno en una materia
router.post('/inscribir', (req, res) => {
  const { materiaId } = req.body;  // Solo necesitamos la materia

  // Verificar si se envió una materia
  if (!materiaId) {
    return res.status(400).json({ error: 'La materia es obligatoria.' });
  }

  // Llamada al modelo para inscribir al alumno en la materia
  inscripcionModel.inscribirMateria(materiaId, (err, result) => {
    if (err) {
      console.error('Error al inscribir materia:', err.message); // Log the error
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json({ message: result.mensaje });
  });
});

module.exports = router;
