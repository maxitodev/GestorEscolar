
const express = require('express');
const router = express.Router();
const horarioModel = require('../models/horarioMateria');


// Convertir hora a bloque numérico
function obtenerBloqueHorario(horaInicio, horaFin) {
  const bloques = {
    '08:00-10:00': 1,
    '10:00-12:00': 2,
    '12:00-14:00': 3,
    '14:00-16:00': 4,
    '16:00-18:00': 5
  };
  const clave = `${horaInicio}-${horaFin}`;
  return bloques[clave] || null;
}

// Día a número
function convertirDiaASem(dia) {
  const mapa = {
    'Lunes': 1,
    'Martes': 2,
    'Miércoles': 3,
    'Miercoles': 3,
    'Jueves': 4,
    'Viernes': 5
  };

  if (typeof dia === 'string') {
    const limpio = dia.charAt(0).toUpperCase() + dia.slice(1).toLowerCase();
    return mapa[limpio] ?? null;
  }

  if (typeof dia === 'number' && dia >= 1 && dia <= 5) {
    return dia;
  }

  return null;
}

router.post('/asignar', (req, res) => {
  const { materiaId, horaInicio, horaFin, diasSemana } = req.body;
  console.log("➡️ Datos recibidos:", req.body);
  

  if (!materiaId || !horaInicio || !horaFin || !Array.isArray(diasSemana) || diasSemana.length === 0) {
    return res.status(400).json({ error: 'Todos los campos son requeridos.' });
  }

  const bloque = obtenerBloqueHorario(horaInicio, horaFin);
  if (!bloque) {
    return res.status(400).json({ error: 'El horario no coincide con ningún bloque válido.' });
  }

  let errores = [];
  let completados = 0;

  diasSemana.forEach((diaTexto) => {
    const diaNumero = convertirDiaASem(diaTexto);

    if (diaNumero === null) {
      errores.push(`Día inválido: ${diaTexto}`);
      completados++;
    } else {
      horarioModel.asignarHorarioAMateria(materiaId, bloque, diaNumero, (err, result) => {
        completados++;
        if (err) errores.push(`Error en ${diaTexto}: ${err.message}`);

        if (completados === diasSemana.length) {
          if (errores.length > 0) {
            res.status(500).json({ error: errores.join(' | ') });
          } else {
            res.status(201).json({ message: 'Horario asignado correctamente para todos los días.' });
          }
        }
      });
    }
  });
});

module.exports = router;
