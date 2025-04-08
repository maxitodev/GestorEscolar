import React from 'react';
import { Routes, Route, NavLink, Navigate, useNavigate } from 'react-router-dom';
import '../styles/DashboardAlumno.css';

function DashboardAlumno() {
  const navigate = useNavigate();

  const handleLogout = () => {
    try {
      localStorage.removeItem('token');
      localStorage.removeItem('usuario');
    } catch (err) {
      console.error("LocalStorage remove error:", err);
    }
    navigate('/');
  };

  return (
    <div className="dashboard-alumno">
      {/* Sidebar del Alumno */}
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
          <button onClick={handleLogout}>
            Cerrar Sesión
          </button>
        </div>
      </div>

      {/* Área de contenido */}
      <div className="alumno-content">
        <header>
          <h2>Panel de Alumno</h2>
        </header>
        <main>
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard-alumno/seleccionar-materias" replace />} />
            <Route
              path="seleccionar-materias"
              element={
                <div>
                  <h3>Catálogo de Materias</h3>
                  <p>Aquí se listarán las materias disponibles para inscripción.</p>
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
