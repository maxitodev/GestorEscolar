import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import './styles/Login.css'; // Asegúrate de tener este archivo para los estilos

function Login() {
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (window.location.protocol === 'file:') {
      console.error("Insecure context (file://), skipping auth check.");
      return;
    }
    let token, usuarioStr;
    try {
      token = localStorage.getItem('token');
      usuarioStr = localStorage.getItem('usuario');
    } catch (e) {
      console.error("LocalStorage access error:", e);
      return;
    }
    if (token && usuarioStr && (location.pathname === '/' || location.pathname === '/login')) {
      try {
        const usuario = JSON.parse(usuarioStr);
        if (usuario && usuario.rol) {
          const dashboardRoute = usuario.rol === 'admin' ? '/dashboard-admin' : '/dashboard-alumno';
          navigate(dashboardRoute, { replace: true });
        }
      } catch (err) {
        console.error("Error al parsear el usuario desde localStorage:", err);
      }
    }
  }, []); // useEffect runs only once on mount

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:3001/auth/login', {
        correo: correo.trim(),
        contrasena: contrasena.trim(),
      });
      
      console.log('Rol del usuario:', res.data.usuario.rol);

      try {
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('usuario', JSON.stringify(res.data.usuario));
      } catch (storageError) {
        console.error("Error al guardar en localStorage:", storageError);
      }
      
      setCorreo('');
      setContrasena('');
      
      const dashboardRoute = res.data.usuario.rol === 'admin'
        ? '/dashboard-admin'
        : '/dashboard-alumno';
      console.log('Redirigiendo a:', dashboardRoute);
      
      // Removed the alert pop-up to display notificaciones inline.
      // Instead, any error or success messages can be shown directly in the page.
      navigate(dashboardRoute, { replace: true });
    } catch (err) {
      if (err.response && err.response.data && err.response.data.error) {
        setError(err.response.data.error);
      } else {
        setError('Ocurrió un error al iniciar sesión. Inténtalo de nuevo.');
      }
      console.error('Error en el login:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Iniciar Sesión</h2>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleLogin} className="login-form">
          <input
            type="email"
            placeholder="Correo"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            required
            className="login-input"
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={contrasena}
            onChange={(e) => setContrasena(e.target.value)}
            required
            className="login-input"
          />
          <button type="submit" className="login-button" disabled={loading}>
            {loading ? 'Ingresando...' : 'Ingresar'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
