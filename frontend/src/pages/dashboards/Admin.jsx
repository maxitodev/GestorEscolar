import React from 'react';
import { Routes, Route, NavLink, Navigate, useNavigate } from 'react-router-dom';
import '../styles/DashboardAdmin.css'; 
import Carreras from './Admin/Carreras';
import Materias from './Admin/Materias';
import HorariosForm from './Admin/Horarios'; // Importa el componente


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

            <Route index element={<Navigate to="/dashboard-admin/materias" replace />} />
            <Route path="materias" element={<Materias />} />
            <Route
              path="salones"
              element={
                <div>
                  <h3>Gestión de Salones</h3>
                  <p>Aquí se gestionan los salones.</p>
                </div>
              }
            />
            <Route
              path="grupos"
              element={
                <div>
                  <h3>Gestión de Grupos</h3>
                  <p>Aquí se crean y gestionan los grupos.</p>
                </div>
              }
            />
            <Route
              path="horarios"
              element={
                <div>
                  <h3>Gestión de Horarios</h3>
                  <p>Aquí se asignan y gestionan los horarios.</p>
                  <HorariosForm />
                </div>
              }
            />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default DashboardAdmin;
