import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './styles/Register.css';

function Register() {
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [rol, setRol] = useState('admin');
  const [carreraFK, setCarreraFK] = useState(''); // Se asignará el ID de la carrera seleccionada
  const [carreras, setCarreras] = useState([]); // Lista de carreras para el dropdown
  const [loadingCarreras, setLoadingCarreras] = useState(false);
  const [errorCarreras, setErrorCarreras] = useState('');

  const navigate = useNavigate();

  // Obtener lista de carreras solo si el usuario es alumno
  useEffect(() => {
    // Si el rol es alumno, obtener carreras; si no, limpiar datos
    if (rol === 'alumno') {
      const fetchCarreras = async () => {
        try {
          setLoadingCarreras(true);
          setErrorCarreras('');
          const res = await axios.get('http://localhost:3001/carreras');
          setCarreras(res.data);
          if (res.data.length > 0) {
            // Asegurarse de que el valor sea una cadena, en caso de necesitarlo para el select
            setCarreraFK(res.data[0].ID_carrera.toString());
          }
        } catch (error) {
          console.error('Error al obtener las carreras:', error);
          setErrorCarreras('No se pudieron cargar las carreras. Intenta más tarde.');
        } finally {
          setLoadingCarreras(false);
        }
      };

      fetchCarreras();
    } else {
      setCarreras([]);
      setCarreraFK('');
    }
  }, [rol]);

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      // Construir el objeto payload; incluir carrera_FK solo si el rol es "alumno"
      const payload = { nombre, correo, contrasena, rol };
      if (rol === 'alumno') {
        payload.carrera_FK = carreraFK;
      }
      await axios.post('http://localhost:3001/auth/register', payload);
      alert('Usuario registrado correctamente. Inicia sesión.');
      navigate('/');
    } catch (err) {
      console.error('Error al registrar usuario:', err);
      alert('Error al registrar usuario. Por favor, verifica los datos e intenta nuevamente.');
    }
  };

  return (
    <div className="register-container">
      <h2>Registro de Usuario</h2>
      <form onSubmit={handleRegister} className="register-form">
        <input
          type="text"
          placeholder="Nombre completo"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
          className="register-input"
        />
        <input
          type="email"
          placeholder="Correo"
          value={correo}
          onChange={(e) => setCorreo(e.target.value)}
          required
          className="register-input"
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={contrasena}
          onChange={(e) => setContrasena(e.target.value)}
          required
          className="register-input"
        />
        <select value={rol} onChange={(e) => setRol(e.target.value)} required className="register-select">
          <option value="admin">Administrador</option>
          <option value="alumno">Alumno</option>
        </select>
        {/* Si el rol es alumno, mostrar el dropdown para seleccionar la carrera */}
        {rol === 'alumno' && (
          <>
            {loadingCarreras ? (
              <p>Cargando carreras...</p>
            ) : errorCarreras ? (
              <p className="error">{errorCarreras}</p>
            ) : (
              <select
                value={carreraFK}
                onChange={(e) => setCarreraFK(e.target.value)}
                required
                className="register-select"
              >
                {carreras.map((carrera) => (
                  <option key={carrera.ID_carrera} value={carrera.ID_carrera}>
                    {carrera.nombre_carrera}
                  </option>
                ))}
              </select>
            )}
          </>
        )}
        <button type="submit" className="register-button">Registrarse</button>
      </form>
      <p>
      </p>
    </div>
  );
}

export default Register;
