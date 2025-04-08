const mysql = require('mysql2');
require('dotenv').config();

// Crear conexión a la base de datos 'gestor_escolar'
const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: 'gestor_escolar',
  multipleStatements: true
});

const seedSQL = `
-- Insertar sample de carreras
INSERT INTO Carreras (nombre_carrera) VALUES 
  ('Ingeniería en Sistemas'),
  ('Administración de Empresas'),
  ('Contabilidad'),
  ('Derecho'),
  ('Medicina');

-- Insertar sample de materias
-- Para Ingeniería en Sistemas (ID_carrera = 1)
INSERT INTO Materia (nombre_materia, carrera_FK, capacidad) VALUES 
  ('Programación', 1, 40),
  ('Matemáticas Discretas', 1, 35),
  ('Estructuras de Datos', 1, 30),
  ('Sistemas Operativos', 1, 40),
  ('Redes de Computadoras', 1, 30);

-- Para Administración de Empresas (ID_carrera = 2)
INSERT INTO Materia (nombre_materia, carrera_FK, capacidad) VALUES 
  ('Gestión Empresarial', 2, 50),
  ('Contabilidad Financiera', 2, 45),
  ('Marketing', 2, 40),
  ('Economía', 2, 35);

-- Para Contabilidad (ID_carrera = 3)
INSERT INTO Materia (nombre_materia, carrera_FK, capacidad) VALUES 
  ('Principios de Contabilidad', 3, 40),
  ('Contabilidad de Costos', 3, 35);

-- Para Derecho (ID_carrera = 4)
INSERT INTO Materia (nombre_materia, carrera_FK, capacidad) VALUES 
  ('Introducción al Derecho', 4, 50),
  ('Derecho Penal', 4, 45);

-- Para Medicina (ID_carrera = 5)
INSERT INTO Materia (nombre_materia, carrera_FK, capacidad) VALUES 
  ('Anatomía', 5, 60),
  ('Fisiología', 5, 55);

-- Insertar sample de horarios
-- Para materia 1 (Programación, suponiendo que ID_materia = 1)
INSERT INTO Horario (materia_FK, Horario, dia_sem) VALUES 
  (1, 1, 1),   -- 8-10, lunes
  (1, 2, 3);   -- 10-12, miércoles

-- Para materia 2 (Matemáticas Discretas, ID_materia = 2)
INSERT INTO Horario (materia_FK, Horario, dia_sem) VALUES 
  (2, 1, 2),   -- 8-10, martes
  (2, 3, 4);   -- 12-2, jueves

-- Para materia 6 (Gestión Empresarial, ID_materia = 6, de Administración de Empresas)
INSERT INTO Horario (materia_FK, Horario, dia_sem) VALUES 
  (6, 2, 1),   -- 10-12, lunes
  (6, 3, 3);   -- 12-2, miércoles

-- Insertar sample de salones
INSERT INTO Salon (no_salon, capacidad, dia_sem) VALUES 
  (101, 40, 1),
  (102, 50, 2),
  (103, 30, 3),
  (104, 40, 4);

-- Insertar sample de grupos
-- Para la carrera 1 (Ingeniería en Sistemas) se crean dos grupos:
-- Asumimos que las materias de Ingeniería en Sistemas tienen IDs 1 a 5.
INSERT INTO Grupos (carrera_fk, materia1_fk, materia2_fk, materia3_fk, materia4_fk) VALUES 
  (1, 1, 2, 3, 4),
  (1, 2, 3, 4, 5);

-- También, para Administración de Empresas (carrera 2), se crea un grupo:
-- Asumimos que las materias de Administración en Empresas tienen IDs 6 a 9.
INSERT INTO Grupos (carrera_fk, materia1_fk, materia2_fk, materia3_fk, materia4_fk) VALUES 
  (2, 6, 7, 8, 9);
`;

connection.query(seedSQL, (err, results) => {
  if (err) {
    console.error("❌ Error al sembrar la base de datos:", err.sqlMessage);
  } else {
    console.log("✅ Base de datos sembrada correctamente con datos de prueba.");
  }
  connection.end();
});
