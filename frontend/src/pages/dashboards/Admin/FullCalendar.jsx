import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import axios from 'axios';
import '../../styles/FullCalendar.css';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const HorariosGrupo = () => {
  const [grupos, setGrupos] = useState([]);
  const [grupoSeleccionado, setGrupoSeleccionado] = useState(null);
  const [eventos, setEventos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const API_BASE_URL = 'http://localhost:3001';

  // Fetch grupos al cargar el componente
  useEffect(() => {
    const fetchGrupos = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/grupo`);
        setGrupos(response.data);
      } catch (err) {
        console.error("Error fetching grupos:", err);
        setError("Error al cargar los grupos. Intente más tarde.");
      }
    };
    fetchGrupos();
  }, []);

  // Fetch horarios cuando cambia el grupo seleccionado
  useEffect(() => {
    if (!grupoSeleccionado) return;

    const fetchHorarios = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${API_BASE_URL}/grupo/${grupoSeleccionado}/horarios`);
        const formattedEvents = response.data.map(horario => ({
          title: horario.nombre_materia,
          start: convertirHorario(horario.dia_sem, horario.Horario),
          end: convertirHorario(horario.dia_sem, horario.Horario, true)
        }));

        // Fusionar eventos que coinciden en horario
        const mergedEvents = formattedEvents.reduce((acc, event) => {
          const existingEvent = acc.find(e => e.start === event.start && e.end === event.end);
          if (existingEvent) {
            existingEvent.title = `${existingEvent.title}, ${event.title}`;
            // Limitar la longitud del título para evitar desbordamiento
            if (existingEvent.title.length > 50) {
              existingEvent.title = existingEvent.title.slice(0, 50) + "...";
            }
          } else {
            acc.push(event);
          }
          return acc;
        }, []);

        setEventos(mergedEvents);
        setError(null);
      } catch (err) {
        console.error("Error fetching horarios:", err);
        setError("Error al cargar los horarios. Intente más tarde.");
      } finally {
        setLoading(false);
      }
    };

    fetchHorarios();
  }, [grupoSeleccionado]);

  // Función para convertir horarios
  const convertirHorario = (dia, bloque, esFin = false) => {
    const bloques = {
      1: { start: '08:00', end: '10:00' },
      2: { start: '10:00', end: '12:00' },
      3: { start: '12:00', end: '14:00' },
      4: { start: '14:00', end: '16:00' },
      5: { start: '16:00', end: '18:00' }
    };

    if (!bloques[bloque]) {
      console.error(`Bloque ${bloque} no configurado`);
      return null;
    }

    const today = new Date();
    const currentDay = today.getDay();
    const startOfWeek = new Date(today.setDate(today.getDate() - currentDay));
    const targetDate = new Date(startOfWeek);
    targetDate.setDate(startOfWeek.getDate() + dia);

    const formattedDate = targetDate.toISOString().split('T')[0];
    const time = bloques[bloque][esFin ? 'end' : 'start'];

    return `${formattedDate}T${time}`;
  };

  // Calcular rango horario basado en eventos con horas exactas
  const calcularRangoHorario = () => {
    if (eventos.length === 0) {
      return { minTime: null, maxTime: null }; // No hay eventos
    }

    const horasInicio = eventos.map(evento => new Date(evento.start).getHours());
    const minutosInicio = eventos.map(evento => new Date(evento.start).getMinutes());
    const horasFin = eventos.map(evento => new Date(evento.end).getHours());

    const minHora = Math.min(...horasInicio);
    const minMinuto = Math.min(...minutosInicio);
    const maxHora = Math.max(...horasFin);

    // Ajustar margen solo si la primera clase no comienza en una hora exacta
    const minTime = minMinuto !== 0
      ? `${String(minHora - 1).padStart(2, '0')}:00:00` // Margen de 1 hora si no es :00
      : `${String(minHora).padStart(2, '0')}:00:00`; // Sin margen si es :00

    // Añadir 1 hora después de la última clase
    const maxTime = `${String(maxHora + 1).padStart(2, '0')}:00:00`;

    return {
      minTime,
      maxTime
    };
  };

  const { minTime, maxTime } = calcularRangoHorario();

  const exportarPDF = async () => {
    const calendarElement = document.querySelector('.fc'); // Selecciona el calendario
    if (!calendarElement) return;

    try {
      const canvas = await html2canvas(calendarElement);
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('landscape', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('horarios-grupo.pdf');
    } catch (err) {
      console.error('Error al exportar el calendario a PDF:', err);
    }
  };

  useEffect(() => {
    const container = document.querySelector('.full-calendar-container');
    if (container) {
      container.classList.add('loaded');
    }
  }, []);

  return (
    <div className="full-calendar-container">
      {/* Selector de Grupos */}
      <div className="grupo-selector">
        <label htmlFor="grupo" className="grupo-label">Selecciona un grupo:</label>
        <select
          id="grupo"
          value={grupoSeleccionado || ''}
          onChange={(e) => setGrupoSeleccionado(e.target.value)}
          className="grupo-select"
          aria-label="Seleccionar grupo"
        >
          <option value="" disabled>Seleccione un grupo</option>
          {grupos.length > 0 ? (
            grupos.map(grupo => (
              <option key={grupo.ID_grupos} value={grupo.ID_grupos}>
                {grupo.nombre_carrera} - Grupo {grupo.ID_grupos}
              </option>
            ))
          ) : (
            <option disabled>No hay grupos disponibles</option>
          )}
        </select>
      </div>

      {/* Estados de Carga y Error */}
      {loading && <div className="loading-message">Cargando horarios...</div>}
      {error && <div className="error-message">{error}</div>}

      {/* Calendario */}
      {!loading && !error && grupoSeleccionado && (
        <>
          {eventos.length > 0 ? (
            <FullCalendar
              plugins={[timeGridPlugin]}
              initialView="timeGridWeek"
              events={eventos}
              locale="es"
              firstDay={0}
              allDaySlot={false}
              slotMinTime={minTime}
              slotMaxTime={maxTime}
              height="auto"
              aspectRatio={1.0}
              eventOverlap={false}
              dayMaxEvents={false}
              slotLabelFormat={{
                hour: '2-digit',
                minute: '2-digit',
                hour12: false // Cambiar a formato 24 horas
              }}
              headerToolbar={false} // Oculta los botones de navegación
              hiddenDays={[0, 6]} // Ocultar domingo (0) y sábado (6)
              dayHeaderFormat={{
                weekday: 'long' // Mostrar solo el nombre del día (Lunes, Martes, etc.)
              }}
            />
          ) : (
            <div className="no-events-message">No hay horarios disponibles para este grupo.</div>
          )}
          {/* Botón para exportar a PDF */}
          <button
            onClick={exportarPDF}
            className="exportar-pdf-boton"
            style={{
              marginTop: '20px',
              padding: '10px 20px',
              backgroundColor: '#ff6f00',
              color: '#fff',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: 'bold',
            }}
          >
            Exportar a PDF
          </button>
        </>
      )}
    </div>
  );
};

HorariosGrupo.propTypes = {};

export default HorariosGrupo;