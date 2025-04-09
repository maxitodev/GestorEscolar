import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../styles/Materias.css'; 

function Materias() {
  const [nombre, setNombre] = useState('');
  const [carreraSeleccionada, setCarreraSeleccionada] = useState('');
  const [materias, setMaterias] = useState([]);
  const [carreras, setCarreras] = useState([]);
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');
  const [capacidad, setCapacidad] = useState('');

  useEffect(() => {
    obtenerMaterias();
    obtenerCarreras();
  }, []);

  // Nuevo useEffect para limpiar el mensaje después de 3 segundos
  useEffect(() => {
    if (mensaje) {
      const timer = setTimeout(() => setMensaje(''), 3000);
      return () => clearTimeout(timer);
    }
  }, [mensaje]);

  // Nuevo useEffect para limpiar el error después de 3 segundos
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(''), 3000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const obtenerMaterias = async () => {
    try {
      const res = await axios.get('http://localhost:3001/materias');
      setMaterias(res.data);
    } catch (err) {
      console.error('Error al obtener las materias:', err);
      setError('Error al cargar las materias.');
    }
  };

  const obtenerCarreras = async () => {
    try {
      const res = await axios.get('http://localhost:3001/carreras');
      setCarreras(res.data);
    } catch (err) {
      console.error('Error al obtener las carreras:', err);
      setError('Error al cargar las carreras.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje('');
    setError('');
  
    if (!nombre.trim()) {
      setError('Por favor completa el nombre de la materia.');
      return;
    }
  
    if (!carreraSeleccionada) {
      setError('Por favor selecciona una carrera.');
      return;
    }
  
    if (!capacidad || Number(capacidad) <= 0) {
      setError('Por favor ingresa el cupo.');
      return;
    }
  
    console.log({
      nombre_materia: nombre.trim(),
      id_carrera: carreraSeleccionada,
      capacidad: Number(capacidad)
    });
  
    try {
      const res = await axios.post('http://localhost:3001/materias', {
        nombre_materia: nombre.trim(),
        id_carrera: carreraSeleccionada,
        capacidad: Number(capacidad)
      });
  
      setMensaje(res.data.message);
      setNombre('');
      setCarreraSeleccionada('');
      setCapacidad('');
      obtenerMaterias();
    } catch (err) {
      if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else {
        setError('Ocurrió un error al registrar la materia.');
      }
    }
  };

  return (
    <div className="materias-component">
      <div className="contenedor-materias">
        <h2>Registrar Nueva Materia</h2>
        <form onSubmit={handleSubmit} className="form-materia">
          <input
            type="text"
            placeholder="Nombre de la materia"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
          />
          
          <input
            type="number"
            placeholder="Cupo"
            value={capacidad}
            onChange={(e) => setCapacidad(e.target.value)}
            required
          />
        <select
            value={carreraSeleccionada}
            onChange={(e) => setCarreraSeleccionada(e.target.value)}
            required
          >
            <option value="">Selecciona una carrera</option>
            {carreras.map((carrera) => (
              <option key={carrera.ID_carrera} value={carrera.ID_carrera}>
                {carrera.nombre_carrera}
              </option>
            ))}
        </select>
        <button type="submit">Registrar</button>
        </form>

        {mensaje && <div className="mensaje-exito">{mensaje}</div>}
        {error && <div className="mensaje-error">{error}</div>}

        <hr />

        <h3>Materias Registradas</h3>
        {materias.length > 0 ? (
          <table className="tabla-materias">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Carrera</th>
                <th>Capacidad</th>
              </tr>
            </thead>
            <tbody>
              {materias.map((materia) => (
                <tr key={materia.ID_materia}>
                  <td>{materia.ID_materia}</td>
                  <td>{materia.nombre_materia}</td>
                  <td>{materia.nombre_carrera}</td>
                  <td>{materia.capacidad}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No hay materias registradas aún.</p>
        )}
      </div>
    </div>
  );
}

export default Materias;