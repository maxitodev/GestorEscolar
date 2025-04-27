import React from 'react';
import { Routes, Route, NavLink, Navigate, useNavigate } from 'react-router-dom';
import SeleccionarMaterias from '../dashboards/Alumno/SeleccionarMaterias';
import MiHorario from '../dashboards/Alumno/MiHorario';
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
            <Route path="seleccionar-materias" element={<SeleccionarMaterias />} />
            <Route path="mi-horario" element={<MiHorario />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default DashboardAlumno;