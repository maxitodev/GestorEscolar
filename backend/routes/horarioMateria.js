const express = require('express');
const router = express.Router();
const horarioModel = require('../models/horarioMateria');
const db = require('../config/db'); // Ensure the database connection is imported


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

// Remove duplicate schedule endpoint to ensure GET /horario/:alumnoId works
// router.get('/horario/:alumnoId', (req, res) => {
//   const { alumnoId } = req.params;
//   console.log(`📥 Request received for alumnoId: ${alumnoId}`); // Debug log

//   const sql = `
//     SELECT m.ID_materia, m.nombre_materia, h.Horario AS horario, h.dia_sem AS dia
//     FROM Inscripcion i
//     JOIN Materia m ON i.ID_materia = m.ID_materia
//     LEFT JOIN Horario h ON m.ID_materia = h.materia_FK
//     WHERE i.ID_alumno = ?
//   `;

//   db.query(sql, [alumnoId], (err, results) => {
//     if (err) {
//       console.error('Error al obtener el horario:', err);
//       return res.status(500).json({ error: 'Error al obtener el horario.' });
//     }
//     if (results.length === 0) {
//       console.warn(`No se encontró horario para el alumno con ID: ${alumnoId}`);
//       return res.status(200).json([]); // Return an empty array instead of 404
//     }
//     res.status(200).json(results);
//   });
// });

// Eliminar materia del horario
router.delete('/eliminar/:materiaId', (req, res) => {
  const { materiaId } = req.params;

  const sql = `DELETE FROM Inscripcion WHERE ID_materia = ?`;

  db.query(sql, [materiaId], (err, result) => {
    if (err) {
      console.error('Error al eliminar la materia:', err);
      return res.status(500).json({ error: 'Error al eliminar la materia.' });
    }
    res.status(200).json({ message: 'Materia eliminada del horario.' });
  });
});

// GET schedule for a student by alumnoId
router.get('/:alumnoId', (req, res) => {
  const alumnoId = parseInt(req.params.alumnoId);
  console.log(`GET /horario/${alumnoId} route hit`); // Debug log to verify route matching
  if (isNaN(alumnoId)) {
    return res.status(400).json({ error: 'ID de alumno no válido.' });
  }
  
  const sql = `
    SELECT m.ID_materia, m.nombre_materia, h.Horario, h.dia_sem as dia
    FROM Inscripcion i
    JOIN Materia m ON i.ID_materia = m.ID_materia
    LEFT JOIN Horario h ON h.materia_FK = m.ID_materia
    WHERE i.ID_alumno = ?
  `;
  
  db.query(sql, [alumnoId], (err, results) => {
    if (err) {
      console.error("Error al obtener el horario:", err);
      return res.status(500).json({ error: 'Error al obtener el horario.' });
    }
    res.json(results);
  });
});

module.exports = router;
