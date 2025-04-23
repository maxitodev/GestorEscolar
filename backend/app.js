const express = require('express');
const app = express();
const horarioRoutes = require('./routes/horarioMateria'); // Ensure this is imported
const inscripcionRoutes = require('./routes/inscribirMateria'); // Import the inscripcion route

// Middleware
app.use(express.json());

// Register routes
app.use('/horario', horarioRoutes); // Ensure this matches the base path
app.use('/inscripcion', inscripcionRoutes);

app.listen(3001, () => {
  console.log('Servidor corriendo en http://localhost:3001');
});