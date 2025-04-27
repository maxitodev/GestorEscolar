import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { jsPDF } from 'jspdf'; // nuevo import
import '../../styles/MiHorario.css';

function MiHorario() {
  const [horarios, setHorarios] = useState([]);
  const [error, setError] = useState('');
  const [showError, setShowError] = useState(false); // Nuevo estado para controlar la visibilidad del error
  const [success, setSuccess] = useState(''); // Nuevo estado para mensajes de éxito
  const [showSuccess, setShowSuccess] = useState(false); // Controlar visibilidad del éxito

  useEffect(() => {
    if (error) {
      setShowError(true);
      const timer = setTimeout(() => setShowError(false), 3000); // Ocultar el error después de 3 segundos
      return () => clearTimeout(timer);
    }
  }, [error]);

  useEffect(() => {
    if (success) {
      setShowSuccess(true);
      const timer = setTimeout(() => setShowSuccess(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  // Mapeo corregido de bloques y días
  const bloquesHorarios = {
    1: '08:00-10:00',
    2: '10:00-12:00',
    3: '12:00-14:00',
    4: '14:00-16:00',
    5: '16:00-18:00'
  };

  const diasSemana = {
    1: 'Lunes',
    2: 'Martes',
    3: 'Miércoles',
    4: 'Jueves',
    5: 'Viernes'
  };

  useEffect(() => {
    const usuario = JSON.parse(localStorage.getItem('usuario'));
    const alumnoId = usuario?.id;
    
    if (!alumnoId) {
      setError('Usuario no autenticado.');
      return;
    }

    axios.get(`http://localhost:3001/horarios/${alumnoId}`)
      .then((res) => {
        setHorarios(res.data);
      })
      .catch((err) => {
        setError(err.response?.data?.error || 'Error al cargar el horario.');
        console.error('Error al obtener el horario:', err);
      });
  }, []);

  // Nueva función para confirmar inscripción
  const confirmarInscripcion = () => {
    const usuario = JSON.parse(localStorage.getItem('usuario'));
    if (!usuario || !usuario.id) {
      setError('Usuario no autenticado.');
      return;
    }
    axios.post('http://localhost:3001/inscripcion/confirmar', { alumnoId: usuario.id })  // Cambiada la URL
      .then((res) => {
        setSuccess(res.data.message); // Mostrar mensaje de éxito
      })
      .catch((err) => {
        setError(err.response?.data?.error || 'Error al confirmar inscripción.');
        console.error('Error al confirmar inscripción:', err);
      });
  };

  // Función para exportar el horario a PDF (actualizada para exportar el contenido visual)
  const exportarPDF = () => {
    const doc = new jsPDF();
    doc.html(document.getElementById('horario-pdf'), {
      callback: function (doc) {
        doc.save("MiHorario.pdf");
      },
      x: 10,
      y: 10
    });
  };

  // Crear estructura de horario corregida
  const generarCuadricula = () => {
    const cuadricula = [];
    
    // Iterar por cada bloque horario
    for (let bloque = 1; bloque <= 5; bloque++) {
      const fila = [];
      
      // Iterar por cada día de la semana
      for (let dia = 1; dia <= 5; dia++) {
        const materia = horarios.find(item => 
          Number(item.dia) === dia && 
          Number(item.Horario) === bloque
        );
        
        fila.push(materia ? materia.nombre_materia : null);
      }
      
      cuadricula.push(fila);
    }
    
    return cuadricula;
  };

  const cuadriculaHorario = generarCuadricula();

  return (
    // Se agrega id="horario-pdf" al contenedor principal
    <div id="horario-pdf" className="schedule-container">
      <h2 className="schedule-title">Mi Horario Académico</h2>
      
      {showError && (
        <div className="error-message visible">
          {error}
        </div>
      )}

      {showSuccess && (
        <div className="success-message visible">
          {success}
        </div>
      )}

      {horarios.length > 0 ? (
        <>
          <table className="schedule-table">
            <thead>
              <tr>
                <th>Horario</th>
                {Object.values(diasSemana).map((dia, index) => (
                  <th key={index}>{dia}</th>
                ))}
              </tr>
            </thead>
            
            <tbody>
              {cuadriculaHorario.map((fila, bloqueIndex) => (
                <tr key={bloqueIndex}>
                  <td className="time-slot">
                    {bloquesHorarios[bloqueIndex + 1]}
                  </td>
                  
                  {fila.map((materia, diaIndex) => (
                    <td 
                      key={diaIndex}
                      className={`schedule-cell ${materia ? 'filled' : 'empty'}`}
                    >
                      {materia || '-'}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          {/* Botón para confirmar inscripción */}
          <button onClick={confirmarInscripcion} className="confirm-button">
            Confirmar Inscripción
          </button>
        </>
      ) : (
        !error && <p className="no-schedule">No tienes materias asignadas</p>
      )}
    </div>
  );
}

export default MiHorario;