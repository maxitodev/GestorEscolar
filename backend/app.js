const express = require('express');
const app = express();
const horarioRoutes = require('./routes/horarioMateria'); // Import the route
const inscripcionRoutes = require('./routes/inscribirMateria'); // Import the inscripcion route
app.use(express.json());
app.use('/horario', horarioRoutes);
app.use('/inscripcion', inscripcionRoutes);

app.listen(3001, () => {
  console.log('Servidor corriendo en http://localhost:3001');
});