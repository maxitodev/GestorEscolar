import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../styles/Carreras.css'; 

function Carreras() {
  const [nombre, setNombre] = useState('');
  const [carreras, setCarreras] = useState([]);
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    obtenerCarreras();
  }, []);

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
      setError('Por favor completa el nombre de la carrera.');
      return;
    }

    try {
      const res = await axios.post('http://localhost:3001/carreras', {
        nombre_carrera: nombre.trim()
      });

      setMensaje(res.data.message);
      setNombre('');
      obtenerCarreras();
    } catch (err) {
      if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else {
        setError('Ocurrió un error al registrar la carrera.');
      }
    }
  };

  return (
    <div className="carreras-component">
      <div className="contenedor-carreras">
        <h2>Registrar Nueva Carrera</h2>
        <form onSubmit={handleSubmit} className="form-carrera">
          <input
            type="text"
            placeholder="Nombre de la carrera"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
          />
          <button type="submit">Registrar</button>
        </form>

        {mensaje && <div className="mensaje-exito">{mensaje}</div>}
        {error && <div className="mensaje-error">{error}</div>}

        <hr />

        <h3>Carreras Registradas</h3>
        {carreras.length > 0 ? (
          <table className="tabla-carreras">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
              </tr>
            </thead>
            <tbody>
              {carreras.map((carrera) => (
                <tr key={carrera.ID_carrera}>
                  <td>{carrera.ID_carrera}</td>
                  <td>{carrera.nombre_carrera}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No hay carreras registradas aún.</p>
        )}
      </div>
    </div>
  );
}

export default Carreras;
