import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../styles/Grupos.css'

function Grupos() {
  const [carreraSeleccionada, setCarreraSeleccionada] = useState('');
  const [modoManual, setModoManual] = useState(false);
  const [materiasSeleccionadas, setMateriasSeleccionadas] = useState([]);
  const [materiasDisponibles, setMateriasDisponibles] = useState([]);
  const [grupos, setGrupos] = useState([]);
  const [carreras, setCarreras] = useState([]);
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);

  useEffect(() => {
    obtenerGrupos();
    obtenerCarreras();
  }, []);

  useEffect(() => {
    if (mensaje || error) {
      const timer = setTimeout(() => {
        setMensaje('');
        setError('');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [mensaje, error]);

  const obtenerGrupos = async () => {
    try {
      const res = await axios.get('http://localhost:3001/grupo');
      setGrupos(res.data);
    } catch (err) {
      console.error('Error al obtener los grupos:', err);
      setError('Error al cargar los grupos.');
    }
  };

  const obtenerCarreras = async () => {
    try {
      const res = await axios.get('http://localhost:3001/carreras');
      setCarreras(res.data);
    } catch (err) {
      console.error('Error al obtener las carreras:', err);
      setError('Error al cargar las carreras.');
    }
  };

  const obtenerMateriasPorCarrera = async (carreraId) => {
    try {
      const res = await axios.get(`http://localhost:3001/grupo/materias/${carreraId}`);
      setMateriasDisponibles(res.data);
    } catch (err) {
      console.error('Error al obtener las materias:', err);
      setError('Error al cargar las materias de la carrera.');
    }
  };

  const generarGrupo = async (e) => {
    e.preventDefault();
    setMensaje('');
    setError('');
    setCargando(true);

    const id = Number(carreraSeleccionada);
    if (!id) {
      setError('Por favor selecciona una carrera.');
      setCargando(false);
      return;
    }

    try {
      const res = await axios.post(`http://localhost:3001/grupo/${id}`);
      setMensaje(res.data.message);
      obtenerGrupos();
    } catch (err) {
      setError(err.response?.data?.error || 'Error al generar el grupo.');
    } finally {
      setCargando(false);
    }
  };

  const crearGrupoManual = async (e) => {
    e.preventDefault();
    setMensaje('');
    setError('');
    setCargando(true);

    try {
      const carrera = parseInt(carreraSeleccionada, 10);
      const materias = materiasSeleccionadas.map(id => parseInt(id, 10));

      console.log("Enviando:", { carreraId: carrera, materias });

      await axios.post('http://localhost:3001/grupo/manual', {
        carreraId: carrera,
        materias: materias
      });
      
      setMensaje('Grupo creado exitosamente');
      setMateriasSeleccionadas([]);
      obtenerGrupos();
    } catch (err) {
      console.error('Error completo:', err);
      setError(err.response?.data?.error || 'Error al crear el grupo');
    } finally {
      setCargando(false);
    }
  };

  const toggleModo = () => {
    setModoManual(!modoManual);
    setMateriasSeleccionadas([]);
    setError('');
    setMensaje('');
  };

  const handleSeleccionMateria = (materiaId) => {
    setMateriasSeleccionadas(prev => {
      if (prev.includes(materiaId)) {
        return prev.filter(id => id !== materiaId);
      } else if (prev.length < 4) {
        return [...prev, materiaId];
      }
      return prev;
    });
  };

  return (
    <div className="grupos-component">
      <div className="contenedor-grupos">
        <h2>Gestión de Grupos</h2>
        
        <div className="modo-selector">
          <button 
            className={`btn ${!modoManual ? 'active' : ''}`}
            onClick={toggleModo}
          >
            Generación Automática
          </button>
          <button 
            className={`btn ${modoManual ? 'active' : ''}`}
            onClick={toggleModo}
          >
            Asignación Manual
          </button>
        </div>

        {!modoManual ? (
          <>
            <h3>Generar Nuevo Grupo Automático</h3>
            <form onSubmit={generarGrupo} className="form-grupo">
              <select
                value={carreraSeleccionada}
                onChange={(e) => {
                  setCarreraSeleccionada(e.target.value);
                  if (e.target.value) {
                    obtenerMateriasPorCarrera(e.target.value);
                  }
                }}
                required
                disabled={cargando}
              >
                <option value="">Selecciona una carrera</option>
                {carreras.map((carrera) => (
                  <option key={carrera.ID_carrera} value={carrera.ID_carrera}>
                    {carrera.nombre_carrera}
                  </option>
                ))}
              </select>
              
              <button type="submit" disabled={cargando}>
                {cargando ? 'Generando...' : 'Generar Grupo Automático'}
              </button>
            </form>
          </>
        ) : (
          <>
            <h3>Asignar Materias Manualmente</h3>
            <form onSubmit={crearGrupoManual} className="form-grupo">
              <select
                value={carreraSeleccionada}
                onChange={(e) => {
                  setCarreraSeleccionada(e.target.value);
                  setMateriasSeleccionadas([]);
                  if (e.target.value) {
                    obtenerMateriasPorCarrera(e.target.value);
                  }
                }}
                required
                disabled={cargando}
              >
                <option value="">Selecciona una carrera</option>
                {carreras.map((carrera) => (
                  <option key={carrera.ID_carrera} value={carrera.ID_carrera}>
                    {carrera.nombre_carrera}
                  </option>
                ))}
              </select>

              {carreraSeleccionada && (
                <div className="materias-container">
                  <h4>Selecciona 4 materias:</h4>
                  <div className="materias-list">
                    {materiasDisponibles.map((materia) => (
                      <div 
                        key={materia.ID_materia}
                        className={`materia-item ${materiasSeleccionadas.includes(materia.ID_materia) ? 'selected' : ''}`}
                        onClick={() => handleSeleccionMateria(materia.ID_materia)}
                      >
                        {materia.nombre_materia}
                        {materiasSeleccionadas.includes(materia.ID_materia) && (
                          <span className="checkmark">✓</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <button 
                type="submit" 
                disabled={cargando || materiasSeleccionadas.length !== 4}
              >
                {cargando ? 'Creando...' : 'Crear Grupo Manual'}
              </button>
            </form>
          </>
        )}

        {mensaje && <div className="mensaje-exito">{mensaje}</div>}
        {error && <div className="mensaje-error">{error}</div>}

        <hr />

        <h3>Grupos Registrados</h3>
        {grupos.length > 0 ? (
          <div className="tabla-responsive">
            <table className="tabla-grupos">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Carrera</th>
                  <th>Materias</th>
                </tr>
              </thead>
              <tbody>
                {grupos.map((grupo) => (
                  <tr key={grupo.ID_grupos}>
                    <td>{grupo.ID_grupos}</td>
                    <td>{grupo.nombre_carrera}</td>
                    <td>
                      <ul className="materias-grupo">
                        <li>{grupo.materia1 || '-'}</li>
                        <li>{grupo.materia2 || '-'}</li>
                        <li>{grupo.materia3 || '-'}</li>
                        <li>{grupo.materia4 || '-'}</li>
                      </ul>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p>No hay grupos registrados aún.</p>
        )}
      </div>
    </div>
  );
}

export default Grupos;