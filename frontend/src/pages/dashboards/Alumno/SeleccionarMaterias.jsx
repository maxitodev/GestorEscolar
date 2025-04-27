import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../styles/SeleccionMaterias.css'; 

function SeleccionarMaterias() {
  const [materias, setMaterias] = useState([]);
  const [materiaFk, setMateriaFk] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [mensajeTipo, setMensajeTipo] = useState(''); // Nuevo estado para tipo de mensaje (éxito o error)
  const [showMensaje, setShowMensaje] = useState(false); // Nuevo estado para controlar la visibilidad del mensaje
  const [inscripciones, setInscripciones] = useState([]); // nuevo estado para inscripciones

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

  // Función para obtener inscripciones del alumno
  const cargarInscripciones = async (alumnoId) => {
    try {
      const res = await axios.get(`http://localhost:3001/inscripcion/inscripciones/${alumnoId}`);
      setInscripciones(res.data);
    } catch (err) {
      console.error('Error al obtener inscripciones:', err);
    }
  };

  // Cargar inscripciones una vez que se tiene al usuario
  useEffect(() => {
    const usuario = JSON.parse(localStorage.getItem('usuario'));
    const alumnoId = usuario?.id;
    if (alumnoId) {
      cargarInscripciones(alumnoId);
    }
  }, []);

  useEffect(() => {
    if (mensaje) {
      setShowMensaje(true);
      const timer = setTimeout(() => setShowMensaje(false), 5000); // Ocultar el mensaje después de 5 segundos
      return () => clearTimeout(timer);
    }
  }, [mensaje]);

  const handleInscripcion = (e) => {
    e.preventDefault();

    const usuario = JSON.parse(localStorage.getItem('usuario'));
    const alumnoId = usuario?.id;

    if (!materiaFk || !alumnoId) {
      setMensaje("Seleccione una materia y asegúrese de estar autenticado.");
      setMensajeTipo('error');
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
          setMensajeTipo('error');
        } else {
          setMensaje(response.data.message);
          setMensajeTipo('success');
          cargarInscripciones(alumnoId); // recargar inscripciones al inscribir
        }
      })
      .catch((error) => {
        const errorMessage = error.response?.data?.error || 'Error al procesar la inscripción.';
        if (errorMessage.includes('Ya estás inscrito')) {
          setMensaje('Ya estás inscrito en esta materia.');
        } else {
          setMensaje(errorMessage);
        }
        setMensajeTipo('error');
        console.error("Error de inscripción:", errorMessage);
      });
  };

  return (
    <div className="seleccionar-materias">
      <div className="contenedor-seleccionar">
        <h3>Catálogo de Materias</h3>
        <form className="form-seleccionar" onSubmit={handleInscripcion}>
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
        {showMensaje && (
          <div className={`mensaje-${mensajeTipo} show`}>
            {mensaje}
          </div>
        )}
        <h4>Materias Inscritas</h4>
        {inscripciones.length > 0 ? (
          <table className="tabla-materias" border="1">
            <thead>
              <tr>
                <th>ID Inscripción</th>
                <th>Materia</th>
                <th>Fecha inscripción</th>
                <th>Confirmada</th>
              </tr>
            </thead>
            <tbody>
              {inscripciones.map((insc) => (
                <tr key={insc.ID_inscripcion}>
                  <td>{insc.ID_inscripcion}</td>
                  <td>{insc.nombre_materia}</td>
                  <td>{new Date(insc.fecha_inscripcion).toLocaleString()}</td>
                  <td>{insc.confirmada ? 'Sí' : 'No'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No hay materias inscritas.</p>
        )}
      </div>
    </div>
  );
}

export default SeleccionarMaterias;