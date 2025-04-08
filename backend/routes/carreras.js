const express = require('express');
const router = express.Router();
const carreraModel = require('../models/carreraModel');

// Ruta: Obtener todas las carreras
router.get('/', (req, res) => {
  carreraModel.obtenerCarreras((err, carreras) => {
    if (err) return res.status(500).json({ error: err.sqlMessage });
    res.json(carreras);
  });
});

// Ruta: Crear una nueva carrera
router.post('/', (req, res) => {
  const { nombre_carrera } = req.body;
  if (!nombre_carrera) {
    return res.status(400).json({ error: 'El nombre de la carrera es requerido' });
  }
  carreraModel.crearCarrera(nombre_carrera, (err, result) => {
    if (err) return res.status(500).json({ error: err.sqlMessage });
    res.json({ message: 'Carrera creada exitosamente', carreraId: result.insertId });
  });
});

module.exports = router;
