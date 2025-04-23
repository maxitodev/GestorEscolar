import React, { useState, useEffect } from 'react';
import { Routes, Route, NavLink, Navigate, useNavigate } from 'react-router-dom';
import axios from 'axios'; // Importa axios
import '../styles/DashboardAlumno.css';

function DashboardAlumno() {
  const navigate = useNavigate();

  // Estados
  const [materias, setMaterias] = useState([]);  // Inicializamos como un array vacío
  const [materiaFk, setMateriaFk] = useState('');  // Solo necesitamos la materia
  const [mensaje, setMensaje] = useState('');  // Para mostrar mensajes de éxito o error
  const [horario, setHorario] = useState([]); // Estado para el horario seleccionado

  // Cargar materias del backend
  useEffect(() => {
    const obtenerMaterias = async () => {
      try {
        const res = await axios.get('http://localhost:3001/materias');
        setMaterias(res.data);  // Guardamos las materias en el estado
      } catch (err) {
        setMensaje('Error al cargar las materias.');
        console.error('Error al obtener las materias:', err);
      }
    };

    obtenerMaterias(); // Llamamos la función para obtener las materias
  }, []);

  const handleLogout = () => {
    try {
      localStorage.removeItem('token');
      localStorage.removeItem('usuario');
    } catch (err) {
      console.error("LocalStorage remove error:", err);
    }
    navigate('/');
  };

  // Función para manejar la inscripción de materias
  const handleInscripcion = (e) => {
    e.preventDefault();
  
    const usuario = JSON.parse(localStorage.getItem('usuario')); // Parse the JSON string
    const alumnoId = usuario?.id; // Extract the 'id' field
  
    if (!materiaFk || !alumnoId) {
      setMensaje("Seleccione una materia y asegúrese de estar autenticado.");
      return;
    }
  
    // Verificación de los datos antes de enviarlos
    console.log("Materia ID:", materiaFk, "Alumno ID:", alumnoId); // Log both IDs for debugging
  
    // Enviar solicitud POST para inscribir al alumno en la materia
    axios.post('http://localhost:3001/inscripcion/inscribir', {
      materiaId: materiaFk,
      alumnoId: alumnoId, // Send the correct integer ID
    })
      .then((response) => {
        if (response.data.id_inscripcion === null) {
          setMensaje(response.data.mensaje); // Handle duplicate inscription message
        } else {
          setMensaje(response.data.message); // Handle successful inscription
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

  // Obtener horario seleccionado
  const obtenerHorario = async () => {
    const usuario = JSON.parse(localStorage.getItem('usuario'));
    const alumnoId = usuario?.id;

    if (!alumnoId) {
      setMensaje('No se encontró el ID del alumno.');
      return;
    }

    console.log(`📤 Fetching schedule for alumnoId: ${alumnoId}`); // Debug log

    try {
      const res = await axios.get(`http://localhost:3001/horario/${alumnoId}`);
      if (res.data.length === 0) {
        setMensaje('No tienes materias inscritas en tu horario.');
        setHorario([]); // Ensure the schedule is cleared
      } else {
        setHorario(res.data);
      }
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Error al cargar el horario.';
      setMensaje(errorMessage);
      console.error('Error al obtener el horario:', err);
    }
  };
  
  // Confirmar inscripción
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
      setHorario([]); // Clear the schedule after confirmation
    } catch (err) {
      setMensaje('Error al confirmar la inscripción.');
      console.error('Error al confirmar inscripción:', err);
    }
  };
  
  // Eliminar materia del horario
  const eliminarMateria = async (materiaId) => {
    try {
      await axios.delete(`http://localhost:3001/horario/eliminar/${materiaId}`);
      setMensaje('Materia eliminada del horario.');
      obtenerHorario(); // Actualizar el horario
    } catch (err) {
      setMensaje('Error al eliminar la materia.');
      console.error('Error al eliminar materia:', err);
    }
  };
  

  return (
    <div className="dashboard-alumno">
      {/* Sidebar */}
      <div className="alumno-sidebar">
        <div>
          <h3>Menú Alumno</h3>
          <ul>
            <li>
              <NavLink
                to="/dashboard-alumno/seleccionar-materias"
                className={({ isActive }) => isActive ? 'active' : ''}
              >
                Seleccionar Materias
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/dashboard-alumno/mi-horario"
                className={({ isActive }) => isActive ? 'active' : ''}
              >
                Mi Horario
              </NavLink>
            </li>
          </ul>
        </div>
        <div>
          <button onClick={handleLogout}>Cerrar Sesión</button>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="alumno-content">
        <header>
          <h2>Panel de Alumno</h2>
        </header>
        <main>
          <Routes>
            <Route index element={<Navigate to="/dashboard-alumno/seleccionar-materias" replace />} />
            <Route
              path="seleccionar-materias"
              element={
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
              }
            />
            <Route
              path="mi-horario"
              element={
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
              }
            />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default DashboardAlumno;
