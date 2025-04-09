import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../styles/Grupos.css';

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

  // ... (useEffects para limpiar mensajes se mantienen)

  const obtenerGrupos = async () => {
    try {
      const res = await axios.get('http://localhost:3001/grupos');
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
      const res = await axios.get(`http://localhost:3001/grupos/materias/${carreraId}`);
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

    if (!carreraSeleccionada) {
      setError('Por favor selecciona una carrera.');
      setCargando(false);
      return;
    }

    try {
      const res = await axios.post(`http://localhost:3001/grupos/${carreraSeleccionada}`);
      setMensaje(res.data.message);
      obtenerGrupos();
    } catch (err) {
      setError(err.response?.data?.error || 'Ocurrió un error al generar el grupo.');
    } finally {
      setCargando(false);
    }
  };

  const crearGrupoManual = async (e) => {
    e.preventDefault();
    setMensaje('');
    setError('');
    setCargando(true);

    if (!carreraSeleccionada) {
      setError('Por favor selecciona una carrera.');
      setCargando(false);
      return;
    }

    if (materiasSeleccionadas.length !== 4) {
      setError('Debes seleccionar exactamente 4 materias.');
      setCargando(false);
      return;
    }

    try {
      const res = await axios.post('http://localhost:3001/grupos/manual', {
        carreraId: carreraSeleccionada,
        materias: materiasSeleccionadas
      });
      
      setMensaje(res.data.message);
      setMateriasSeleccionadas([]);
      obtenerGrupos();
    } catch (err) {
      setError(err.response?.data?.error || 'Ocurrió un error al crear el grupo.');
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
            onClick={toggleModo}
            className={!modoManual ? 'active' : ''}
          >
            Generación Automática
          </button>
          <button 
            onClick={toggleModo}
            className={modoManual ? 'active' : ''}
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
            <form onSubmit={crearGrupoManual} className="form-grupo-manual">
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
        ) : (
          <p>No hay grupos registrados aún.</p>
        )}
      </div>
    </div>
  );
}

export default Grupos;