import React, { useState, useEffect } from 'react';
import axios from 'axios';

function SeleccionarMaterias() {
  const [materias, setMaterias] = useState([]);
  const [materiaFk, setMateriaFk] = useState('');
  const [mensaje, setMensaje] = useState('');

  useEffect(() => {
    const obtenerMaterias = async () => {
      try {
        const res = await axios.get('http://localhost:3001/materias');
        setMaterias(res.data);
      } catch (err) {
        setMensaje('Error al cargar las materias.');
        console.error('Error al obtener las materias:', err);
      }
    };

    obtenerMaterias();
  }, []);

  const handleInscripcion = (e) => {
    e.preventDefault();

    const usuario = JSON.parse(localStorage.getItem('usuario'));
    const alumnoId = usuario?.id;

    if (!materiaFk || !alumnoId) {
      setMensaje("Seleccione una materia y asegúrese de estar autenticado.");
      return;
    }

    console.log("Materia ID:", materiaFk, "Alumno ID:", alumnoId);

    axios.post('http://localhost:3001/inscripcion/inscribir', {
      materiaId: materiaFk,
      alumnoId: alumnoId,
    })
      .then((response) => {
        if (response.data.id_inscripcion === null) {
          setMensaje(response.data.mensaje);
        } else {
          setMensaje(response.data.message);
        }
      })
      .catch((error) => {
        const errorMessage = error.response?.data?.error || 'Error al procesar la inscripción.';
        if (errorMessage.includes('Ya estás inscrito')) {
          setMensaje('Ya estás inscrito en esta materia.');
        } else {
          setMensaje(errorMessage);
        }
        console.error("Error de inscripción:", errorMessage);
      });
  };

  return (
    <div>
      <h3>Catálogo de Materias</h3>
      <form onSubmit={handleInscripcion}>
        <div>
          <label>Seleccionar Materia: </label>
          <select
            value={materiaFk}
            onChange={(e) => setMateriaFk(e.target.value)}
            required
          >
            <option value="">Seleccione una materia</option>
            {materias.length > 0 ? (
              materias.map((materia) => (
                <option key={materia.ID_materia} value={materia.ID_materia}>
                  {materia.nombre_materia}
                </option>
              ))
            ) : (
              <option value="">No hay materias disponibles</option>
            )}
          </select>
        </div>
        <button type="submit">Inscribir</button>
      </form>
      {mensaje && <p>{mensaje}</p>}
    </div>
  );
}

export default SeleccionarMaterias;