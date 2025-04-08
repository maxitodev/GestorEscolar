const mysql = require('mysql2');
require('dotenv').config();

// Crear conexión sin especificar base de datos
const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  multipleStatements: true
});

const sql = `
DROP DATABASE IF EXISTS gestor_escolar;
CREATE DATABASE gestor_escolar;
USE gestor_escolar;

-- Tabla: Carreras
CREATE TABLE IF NOT EXISTS Carreras (
    ID_carrera INT AUTO_INCREMENT PRIMARY KEY,
    nombre_carrera VARCHAR(100) NOT NULL
);

-- Tabla: Usuarios
CREATE TABLE IF NOT EXISTS Usuarios (
    ID_usuario INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    correo VARCHAR(100) UNIQUE NOT NULL,
    contrasena VARCHAR(100) NOT NULL,
    rol ENUM('admin', 'alumno') NOT NULL,
    carrera_FK INT,
    FOREIGN KEY (carrera_FK) REFERENCES Carreras(ID_carrera)
);

-- Tabla: Materia
CREATE TABLE IF NOT EXISTS Materia (
    ID_materia INT AUTO_INCREMENT PRIMARY KEY,
    nombre_materia VARCHAR(100) NOT NULL,
    carrera_FK INT NOT NULL,
    capacidad INT NOT NULL,
    FOREIGN KEY (carrera_FK) REFERENCES Carreras(ID_carrera)
);

-- Tabla: Horario
CREATE TABLE IF NOT EXISTS Horario (
    ID_horario INT AUTO_INCREMENT PRIMARY KEY,
    materia_FK INT NOT NULL,
    Horario INT NOT NULL,
    dia_sem INT NOT NULL,
    FOREIGN KEY (materia_FK) REFERENCES Materia(ID_materia)
);

-- Tabla: Salon
CREATE TABLE IF NOT EXISTS Salon (
    ID_salon INT AUTO_INCREMENT PRIMARY KEY,
    no_salon INT NOT NULL,
    Horario1_FK INT,
    Horario2_FK INT,
    Horario3_FK INT,
    capacidad INT NOT NULL,
    dia_sem INT NOT NULL,
    FOREIGN KEY (Horario1_FK) REFERENCES Horario(ID_horario),
    FOREIGN KEY (Horario2_FK) REFERENCES Horario(ID_horario),
    FOREIGN KEY (Horario3_FK) REFERENCES Horario(ID_horario)
);

-- Tabla: Grupos
CREATE TABLE IF NOT EXISTS Grupos (
    ID_grupos INT AUTO_INCREMENT PRIMARY KEY,
    carrera_fk INT NOT NULL,
    materia1_fk INT,
    materia2_fk INT,
    materia3_fk INT,
    materia4_fk INT,
    FOREIGN KEY (carrera_fk) REFERENCES Carreras(ID_carrera),
    FOREIGN KEY (materia1_fk) REFERENCES Materia(ID_materia),
    FOREIGN KEY (materia2_fk) REFERENCES Materia(ID_materia),
    FOREIGN KEY (materia3_fk) REFERENCES Materia(ID_materia),
    FOREIGN KEY (materia4_fk) REFERENCES Materia(ID_materia)
);

-- Tabla: Materias_inscritas
CREATE TABLE IF NOT EXISTS Materias_inscritas (
    ID_inscitas INT AUTO_INCREMENT PRIMARY KEY,
    alumno_fk INT NOT NULL,
    materia_fk INT NOT NULL,
    FOREIGN KEY (alumno_fk) REFERENCES Usuarios(ID_usuario),
    FOREIGN KEY (materia_fk) REFERENCES Materia(ID_materia)
);
`;

connection.query(sql, (err, results) => {
  if (err) {
    console.error("❌ Error al inicializar la base de datos:", err.sqlMessage);
  } else {
    console.log("✅ Base de datos y tablas creadas correctamente");
  }
  connection.end();
});
