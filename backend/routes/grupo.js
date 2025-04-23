const express = require('express');
const router = express.Router();
const grupoModel = require('../models/grupo');

// Obtener todos los grupos
router.get('/', (req, res) => {
  grupoModel.obtenerGrupos((err, grupos) => {
    if (err) {
      console.error("Error al obtener los grupos:", err);
      return res.status(500).json({ error: 'Error al obtener los grupos.' });
    }
    res.json(grupos);
  });
});

// Crear grupo manualmente
router.post('/manual', (req, res) => {
  const { carreraId, materias } = req.body;
  console.log('Datos recibidos:', { carreraId, materias });

  if (!carreraId || !materias || !Array.isArray(materias) || materias.length !== 4) {
    return res.status(400).json({ 
      error: 'Datos inválidos o incompletos',
      received: { carreraId, materias }
    });
  }

  grupoModel.crearGrupoManual(carreraId, materias, (err, result) => {
    if (err) {
      console.error("Error al crear grupo manual:", err);
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json(result);
  });
});

// Crear nuevo grupo automáticamente para una carrera
router.post('/:carreraId', (req, res) => {
  const carreraId = parseInt(req.params.carreraId);
  
  if (isNaN(carreraId)) {
    return res.status(400).json({ error: 'ID de carrera no válido.' });
  }

  grupoModel.crearGrupo(carreraId, (err, result) => {
    if (err) {
      console.error("Error al crear el grupo:", err);
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json(result);
  });
});

// Obtener materias por carrera
router.get('/materias/:carreraId', async (req, res) => {
  const carreraId = parseInt(req.params.carreraId);

  if (isNaN(carreraId)) {
    return res.status(400).json({ error: 'ID de carrera no válido.' });
  }

  try {
    const materias = await grupoModel.obtenerMateriasPorCarrera(carreraId);
    res.json(materias);
  } catch (err) {
    console.error("Error al obtener materias:", err);
    res.status(500).json({ error: 'Error al obtener materias.' });
  }
});

// Obtener horarios de un grupo
router.get('/:grupoId/horarios', (req, res) => {
  const grupoId = parseInt(req.params.grupoId);

  if (isNaN(grupoId) || grupoId <= 0) {
    return res.status(400).json({ error: 'ID de grupo no válido.' });
  }

  grupoModel.obtenerHorariosDeGrupo(grupoId, (err, horarios) => {
    if (err) {
      console.error("Error al obtener los horarios del grupo:", err);
      return res.status(500).json({ error: 'Error al obtener los horarios del grupo.' });
    }
    res.json(horarios);
  });
});

module.exports = router;