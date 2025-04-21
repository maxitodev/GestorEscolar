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
  
    if (!materiaFk) {
      setMensaje("Seleccione una materia.");
      return;
    }
  
    // Verificación de los datos antes de enviarlos
    console.log("Materia ID:", materiaFk);  // Verifica el ID de la materia
  
    // Enviar solicitud POST para inscribir al alumno en la materia
    axios.post('http://localhost:3001/inscripcion/inscribir', {
      materiaId: materiaFk,  // Solo pasamos materiaId
    })
      .then((response) => {
        setMensaje(response.data.message);  // Mostrar el mensaje de éxito
      })
      .catch((error) => {
        setMensaje(error.response ? error.response.data.error : error.message);  // Mostrar el mensaje de error
        console.error("Error de inscripción:", error);
      });
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
                  <p>Aquí se mostrará el horario semanal correspondiente a tus materias.</p>
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
