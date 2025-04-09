const express = require('express');
const router = express.Router();
const salonModel = require('../models/salon');
const db = require('../config/db'); 

// Obtener todos los salones
router.get('/', (req, res) => {
  salonModel.obtenerSalones((err, salones) => {
    if (err) return res.status(500).json({ error: 'Error al obtener los salones.' });
    res.json(salones);
  });
});

// Crear nuevo salón
router.post('/', (req, res) => {
  const { no_salon, capacidad, tipo } = req.body;

  if (!no_salon || !capacidad || !tipo) {
    return res.status(400).json({ error: 'Todos los campos son requeridos.' });
  }


  const checkSql = `SELECT * FROM salon WHERE no_salon = ?`;
  db.query(checkSql, [no_salon], (err, results) => {
    if (err) return res.status(500).json({ error: 'Error en la validación.' });

    if (results.length > 0) {
      return res.status(400).json({ error: 'Ya existe un salón con ese número.' });
    }

    salonModel.crearSalon(no_salon, capacidad, tipo, (err, result) => {
      if (err) return res.status(500).json({ error: err.sqlMessage });
      res.status(201).json({ message: 'Salón creado exitosamente', salonId: result.insertId });
    });
  });
});

module.exports = router;
