const express = require('express');
const router = express.Router();
const carreraModel = require('../models/carrera');

// Obtener todas las carreras
router.get('/', (req, res) => {
  carreraModel.obtenerCarreras((err, carreras) => {
    if (err) {
      console.error("Error al obtener las carreras:", err);
      return res.status(500).json({ error: 'Error al obtener las carreras.' });
    }
    res.json(carreras);
  });
});

// Crear nueva carrera
router.post('/', (req, res) => {
  const { nombre_carrera } = req.body;

  if (!nombre_carrera) {
    return res.status(400).json({ error: 'Nombre de carrera es requerido' });
  }

  carreraModel.crearCarrera(nombre_carrera, (err, result) => {
    if (err) return res.status(500).json({ error: err.sqlMessage });
    res.status(201).json({ message: 'Carrera creada exitosamente', carreraId: result.insertId });
  });
});

module.exports = router;
