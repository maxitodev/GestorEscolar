import React from 'react';
import { Routes, Route, NavLink, Navigate, useNavigate } from 'react-router-dom';
import '../styles/DashboardAdmin.css'; 
import Carreras from './Admin/Carreras';
import Materias from './Admin/Materias';
import HorariosForm from './Admin/Horarios'; 
import Salones from './Admin/Salones';
import Grupos from './Admin/Grupos';
import HorariosGrupo from './Admin/FullCalendar'; // Corrected import name for consistency

function DashboardAdmin() {
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
    <div className="dashboard-admin">
      {/* Sidebar del Administrador */}
      <div className="admin-sidebar">
        <div>
          <h3>Menú Admin</h3>
          <ul>
            <li>
              <NavLink to="/dashboard-admin/carreras" className={({ isActive }) => isActive ? 'active' : ''}>
                Carreras
              </NavLink>
            </li>
            <li>
              <NavLink to="/dashboard-admin/materias" className={({ isActive }) => isActive ? 'active' : ''}>
                Materias
              </NavLink>
            </li>
            <li>
              <NavLink to="/dashboard-admin/salones" className={({ isActive }) => isActive ? 'active' : ''}>
                Salones
              </NavLink>
            </li>
            <li>
              <NavLink to="/dashboard-admin/grupos" className={({ isActive }) => isActive ? 'active' : ''}>
                Grupos
              </NavLink>
            </li>
            <li>
              <NavLink to="/dashboard-admin/horarios" className={({ isActive }) => isActive ? 'active' : ''}>
                Horarios
              </NavLink>
            </li>
            <li>
              <NavLink to="/dashboard-admin/horarios-grupo" className={({ isActive }) => isActive ? 'active' : ''}>
                Horarios por Grupo
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
      <div className="admin-content">
        <header>
          <h2>Panel de Administrador</h2>
        </header>
        <main>
          <Routes>
            <Route index element={<Navigate to="/dashboard-admin/carreras" replace />} />
            <Route path="carreras" element={<Carreras />} />
            <Route path="materias" element={<Materias />} />
            <Route path="salones" element={<Salones />} />
            <Route path="grupos" element={<Grupos />} />
            <Route path="horarios" element={<HorariosForm />} />
            <Route path="horarios-grupo" element={<HorariosGrupo grupoId={1} />} /> {/* Pass a valid grupoId */}
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default DashboardAdmin;
