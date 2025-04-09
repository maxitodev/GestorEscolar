const express = require('express');
const router = express.Router();
const salonModel = require('../models/salon');
const db = require('../config/db');

// Obtener todos los salones
router.get('/', (req, res) => {
  salonModel.obtenerSalones((err, salones) => {
    if (err) {
      console.error('Error al obtener salones:', err);
      return res.status(500).json({ error: 'Error al obtener los salones.' });
    }
    res.json(salones);
  });
});

// Crear nuevo salón
router.post('/', (req, res) => {
  const { no_salon, capacidad, tipo } = req.body;
  
  // Validaciones
  if (!no_salon || !capacidad || !tipo) {
    return res.status(400).json({ error: 'Todos los campos son requeridos.' });
  }

  const tiposPermitidos = ['aula', 'laboratorio', 'auditorio'];
  if (!tiposPermitidos.includes(tipo)) {
    return res.status(400).json({ error: 'El tipo de salón no es válido.' });
  }

  // Verificar si ya existe el número de salón
  const checkSql = `SELECT * FROM Salon WHERE no_salon = ?`;
  db.query(checkSql, [no_salon], (err, results) => {
    if (err) {
      console.error('Error en la validación:', err);
      return res.status(500).json({ error: 'Error en la validación.' });
    }

    if (results.length > 0) {
      return res.status(400).json({ error: 'Ya existe un salón con ese número.' });
    }

    salonModel.crearSalon(no_salon, capacidad, tipo, (err, result) => {
      if (err) {
        console.error("Error al crear el salón:", err);
        return res.status(500).json({ error: 'Error al crear el salón.' });
      }
      res.status(201).json({ 
        message: 'Salón registrado exitosamente', 
        salonId: result.insertId 
      });
    });
  });
});

module.exports = router;
