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

CREATE TABLE IF NOT EXISTS usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  correo VARCHAR(100) UNIQUE NOT NULL,
  contrasena VARCHAR(255) NOT NULL,
  rol ENUM('admin', 'alumno') NOT NULL
);
`;

connection.query(sql, (err, result) => {
  if (err) {
    console.error('❌ Error al inicializar la base de datos:', err.sqlMessage);
  } else {
    console.log('✅ Base de datos y tabla "usuarios" creadas correctamente');
  }
  connection.end();
});
