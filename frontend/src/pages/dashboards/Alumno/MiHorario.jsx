import React, { useState } from 'react';
import axios from 'axios';

function MiHorario() {
  const [horario, setHorario] = useState([]);
  const [mensaje, setMensaje] = useState('');

  const obtenerHorario = async () => {
    const usuario = JSON.parse(localStorage.getItem('usuario'));
    const alumnoId = usuario?.id;

    if (!alumnoId) {
      setMensaje('No se encontró el ID del alumno.');
      return;
    }

    console.log(`📤 Fetching schedule for alumnoId: ${alumnoId}`);

    try {
      const res = await axios.get(`http://localhost:3001/horario/${alumnoId}`);
      if (res.data.length === 0) {
        setMensaje('No tienes materias inscritas en tu horario.');
        setHorario([]);
      } else {
        setHorario(res.data);
      }
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Error al cargar el horario.';
      setMensaje(errorMessage);
      console.error('Error al obtener el horario:', err);
    }
  };

  const eliminarMateria = async (materiaId) => {
    try {
      await axios.delete(`http://localhost:3001/horario/eliminar/${materiaId}`);
      setMensaje('Materia eliminada del horario.');
      obtenerHorario();
    } catch (err) {
      setMensaje('Error al eliminar la materia.');
      console.error('Error al eliminar materia:', err);
    }
  };

  const confirmarInscripcion = async () => {
    try {
      const usuario = JSON.parse(localStorage.getItem('usuario'));
      const alumnoId = usuario?.id;

      if (!alumnoId) {
        setMensaje('No se encontró el ID del alumno.');
        return;
      }

      await axios.post('http://localhost:3001/inscripcion/confirmar', { alumnoId });
      setMensaje('Inscripción confirmada exitosamente.');
      setHorario([]);
    } catch (err) {
      setMensaje('Error al confirmar la inscripción.');
      console.error('Error al confirmar inscripción:', err);
    }
  };

  return (
    <div>
      <h3>Mi Horario</h3>
      <button onClick={obtenerHorario}>Cargar Horario</button>
      <ul>
        {horario.map((materia) => (
          <li key={materia.ID_materia}>
            {materia.nombre_materia} - {materia.horario} - {materia.dia}
            <button onClick={() => eliminarMateria(materia.ID_materia)}>Eliminar</button>
          </li>
        ))}
      </ul>
      <button onClick={confirmarInscripcion}>Confirmar Inscripción</button>
      {mensaje && <p>{mensaje}</p>}
    </div>
  );
}

export default MiHorario;