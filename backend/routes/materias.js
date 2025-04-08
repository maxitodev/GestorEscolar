const express = require('express');
const router = express.Router();
const materiaModel = require('../models/materia');

// Obtener todas las materias
router.get('/', (req, res) => {
  materiaModel.obtenerMaterias((err, materias) => {
    if (err) {
      console.error("Error al obtener las materias:", err);
      return res.status(500).json({ error: 'Error al obtener las materias.' });
    }
    res.json(materias);
  });
});

// Crear nueva materia
router.post('/', (req, res) => {
  const { nombre_materia, id_carrera, capacidad } = req.body;
  console.log("Datos recibidos en el backend:", { nombre_materia, id_carrera, capacidad });
  
  if (!nombre_materia || !id_carrera || !capacidad) {
    return res.status(400).json({ error: 'Todos los campos son requeridos: nombre_materia, id_carrera, capacidad.' });
  }

  materiaModel.crearMateria(nombre_materia, id_carrera, capacidad, (err, result) => {
    if (err) {
      console.error("Error al crear la materia:", err);
      return res.status(500).json({ error: err.sqlMessage });
    }
    res.status(201).json({ message: 'Materia creada exitosamente', materiaId: result.insertId });
  });
});

module.exports = router;