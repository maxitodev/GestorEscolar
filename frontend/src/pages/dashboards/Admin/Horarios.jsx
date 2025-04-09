import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../styles/Horarios.css';

function HorariosForm() {
  const [materias, setMaterias] = useState([]);
  const [materiaId, setMateriaId] = useState('');
  const [diasSemana, setDiasSemana] = useState([]);
  const [horaInicio, setHoraInicio] = useState('');
  const [horaFin, setHoraFin] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    obtenerMaterias();
  }, []);

  useEffect(() => {
    if (mensaje || error) {
      const timer = setTimeout(() => {
        setMensaje('');
        setError('');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [mensaje, error]);

  const obtenerMaterias = async () => {
    try {
      const res = await axios.get('http://localhost:3001/materias');
      setMaterias(res.data);
    } catch (err) {
      setError('Error al cargar las materias.');
    }
  };

  const manejarCambioDias = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setDiasSemana([...diasSemana, value]);
    } else {
      setDiasSemana(diasSemana.filter((dia) => dia !== value));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje('');
    setError('');

    if (!materiaId || !horaInicio || !horaFin || diasSemana.length === 0) {
      setError('Por favor, completa todos los campos.');
      return;
    }

    try {
      await axios.post('http://localhost:3001/horarios/asignar', {
        materiaId,
        horaInicio,
        horaFin,
        diasSemana
      });

      setMensaje(`Horario asignado correctamente para los días: ${diasSemana.join(', ')}`);
      setMateriaId('');
      setDiasSemana([]);
      setHoraInicio('');
      setHoraFin('');
    } catch (err) {
      setError(err.response?.data?.error || 'Ocurrió un error al asignar el horario.');
    }
  };

  return (
    <div className="register-container">
      <h2>Asignar Horario</h2>
      <form onSubmit={handleSubmit} className="register-form">
        <select
          className="register-select"
          value={materiaId}
          onChange={(e) => setMateriaId(e.target.value)}
          required
        >
          <option value="">Seleccione una materia</option>
          {materias.map((materia) => (
            <option key={materia.ID_materia} value={materia.ID_materia}>
              {materia.nombre_materia}
            </option>
          ))}
        </select>

        <div className="dias-checkboxes">
          <label>Días de la semana:</label>
          {['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'].map((dia, idx) => (
            <label key={idx} className="checkbox-dia">
              <input
                type="checkbox"
                value={dia}
                checked={diasSemana.includes(dia)}
                onChange={manejarCambioDias}
              />
              <span>{dia}</span>
            </label>
          ))}
        </div>

        <input
          type="time"
          className="register-input"
          value={horaInicio}
          onChange={(e) => setHoraInicio(e.target.value)}
          step="3600"
          min="08:00"
          max="16:00"
          required
        />

        <input
          type="time"
          className="register-input"
          value={horaFin}
          onChange={(e) => setHoraFin(e.target.value)}
          step="3600"
          min="10:00"
          max="18:00"
          required
        />

        <button type="submit" className="register-button">Asignar Horario</button>
        {mensaje && <div className="mensaje-exito">{mensaje}</div>}
        {error && <div className="mensaje-error">{error}</div>}
      </form>
    </div>
  );
}

export default HorariosForm;
