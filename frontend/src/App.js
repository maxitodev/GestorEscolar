import React, { useMemo } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Login';
import Register from './pages/Register';
import DashboardAdmin from './pages/dashboards/Admin';
import DashboardAlumno from './pages/dashboards/Alumno';

// Guard against running in an insecure context.
if (window.location.protocol === 'file:') {
  console.error("WARNING: App is running via file:// -- please use http://localhost:3000 or a secure origin.");
}

const ProtectedRoute = ({ element, allowedRole }) => {
  const { token, usuario } = useMemo(() => {
    let token, usuario;
    try {
      token = localStorage.getItem('token');
      usuario = JSON.parse(localStorage.getItem('usuario'));
    } catch (err) {
      console.error("LocalStorage access error:", err);
    }
    return { token, usuario };
  }, []);

  const isAuthenticated = Boolean(token);
  if (!isAuthenticated || usuario?.rol !== allowedRole) {
    return <Navigate to="/" replace />;
  }
  return element;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard-admin/*" element={<ProtectedRoute element={<DashboardAdmin />} allowedRole="admin" />} />
        <Route path="/dashboard-alumno/*" element={<ProtectedRoute element={<DashboardAlumno />} allowedRole="alumno" />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
