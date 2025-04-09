const db = require('../config/db');

// Función para verificar conflictos de horario y salón entre materias
const verificarConflictos = async (materiaIds) => {
  const sql = `
    SELECT COUNT(DISTINCT h1.Horario) as horarios
    FROM Horario h1
    JOIN Horario h2 ON h1.Horario = h2.Horario AND h1.dia_sem = h2.dia_sem AND h1.materia_FK != h2.materia_FK
    WHERE h1.materia_FK IN (?) AND h2.materia_FK IN (?)
  `;
  
  return new Promise((resolve, reject) => {
    db.query(sql, [materiaIds, materiaIds], (err, results) => {
      if (err) return reject(err);
      resolve(results[0].horarios === 0);
    });
  });
};

// Función para verificar que todas las materias pertenecen a la misma carrera
const verificarMismaCarrera = async (materiaIds) => {
  const sql = `
    SELECT COUNT(DISTINCT carrera_FK) as carreras
    FROM Materia
    WHERE ID_materia IN (?)
  `;
  
  return new Promise((resolve, reject) => {
    db.query(sql, [materiaIds], (err, results) => {
      if (err) return reject(err);
      resolve(results[0].carreras === 1);
    });
  });
};

// Crear un nuevo grupo con 4 materias sin conflictos
const crearGrupo = async (carreraId, callback) => {
  try {
    // Paso 1: Obtener todas las materias de la carrera
    const obtenerMaterias = () => {
      return new Promise((resolve, reject) => {
        const sql = `SELECT ID_materia FROM Materia WHERE carrera_FK = ?`;
        db.query(sql, [carreraId], (err, results) => {
          if (err) return reject(err);
          resolve(results.map(m => m.ID_materia));
        });
      });
    };

    const materiasDisponibles = await obtenerMaterias();
    
    if (materiasDisponibles.length < 4) {
      return callback(new Error('No hay suficientes materias para formar un grupo (mínimo 4)'));
    }

    // Paso 2: Generar combinaciones y verificar conflictos
    let grupoValido = null;
    
    // Función para generar combinaciones (simplificado para ejemplo)
    const generarCombinaciones = (arr, size) => {
      let result = [];
      for (let i = 0; i < arr.length; i++) {
        for (let j = i + 1; j < arr.length; j++) {
          for (let k = j + 1; k < arr.length; k++) {
            for (let l = k + 1; l < arr.length; l++) {
              result.push([arr[i], arr[j], arr[k], arr[l]]);
              // Limitar el número de combinaciones para no sobrecargar el sistema
              if (result.length >= 100) return result;
            }
          }
        }
      }
      return result;
    };

    const combinaciones = generarCombinaciones(materiasDisponibles, 4);
    
    // Verificar cada combinación hasta encontrar una válida
    for (const combinacion of combinaciones) {
      const mismaCarrera = await verificarMismaCarrera(combinacion);
      if (!mismaCarrera) continue;
      
      const sinConflictos = await verificarConflictos(combinacion);
      if (sinConflictos) {
        grupoValido = combinacion;
        break;
      }
    }

    if (!grupoValido) {
      return callback(new Error('No se encontró una combinación de materias sin conflictos'));
    }

    // Paso 3: Crear el grupo en la base de datos
    const sql = `
      INSERT INTO Grupos 
      (carrera_fk, materia1_fk, materia2_fk, materia3_fk, materia4_fk) 
      VALUES (?, ?, ?, ?, ?)
    `;
    
    db.query(sql, [carreraId, ...grupoValido], (err, result) => {
      if (err) return callback(err);
      callback(null, { 
        message: 'Grupo creado exitosamente', 
        grupoId: result.insertId,
        materias: grupoValido 
      });
    });
  } catch (err) {
    callback(err);
  }
};

// Obtener todos los grupos con información de materias
const obtenerGrupos = (callback) => {
  const sql = `
    SELECT 
      g.ID_grupos,
      c.nombre_carrera,
      m1.nombre_materia as materia1,
      m2.nombre_materia as materia2,
      m3.nombre_materia as materia3,
      m4.nombre_materia as materia4
    FROM Grupos g
    JOIN Carreras c ON g.carrera_fk = c.ID_carrera
    LEFT JOIN Materia m1 ON g.materia1_fk = m1.ID_materia
    LEFT JOIN Materia m2 ON g.materia2_fk = m2.ID_materia
    LEFT JOIN Materia m3 ON g.materia3_fk = m3.ID_materia
    LEFT JOIN Materia m4 ON g.materia4_fk = m4.ID_materia
  `;
  
  db.query(sql, (err, results) => {
    if (err) return callback(err);
    callback(null, results);
  });
};

// Nueva función para crear grupo manualmente
const crearGrupoManual = (carreraId, materias, callback) => {
  // Verificar que las materias pertenezcan a la carrera
  const sqlVerificar = `
    SELECT COUNT(*) as total 
    FROM Materia 
    WHERE ID_materia IN (?) AND carrera_FK = ?
  `;
  
  db.query(sqlVerificar, [materias, carreraId], (err, results) => {
    if (err) return callback(err);
    
    if (results[0].total !== 4) {
      return callback(new Error('Las materias no pertenecen a la carrera seleccionada'));
    }

    // Si la verificación es exitosa, crear el grupo
    const sqlInsert = `
      INSERT INTO Grupos (carrera_fk, materia1_fk, materia2_fk, materia3_fk, materia4_fk)
      VALUES (?, ?, ?, ?, ?)
    `;

    db.query(sqlInsert, [carreraId, ...materias], (err, result) => {
      if (err) return callback(err);
      
      callback(null, {
        message: 'Grupo creado exitosamente',
        grupoId: result.insertId
      });
    });
  });
};

module.exports = {
  crearGrupo,
  crearGrupoManual,
  obtenerGrupos,
  obtenerMateriasPorCarrera: async (carreraId) => {
    return new Promise((resolve, reject) => {
      const sql = `SELECT ID_materia, nombre_materia FROM Materia WHERE carrera_FK = ?`;
      db.query(sql, [carreraId], (err, results) => {
        if (err) return reject(err);
        resolve(results);
      });
    });
  }
};