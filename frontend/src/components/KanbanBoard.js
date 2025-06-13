
import React, { useEffect, useState } from 'react';

const estados = ['pendiente', 'en_progreso', 'completada'];

function KanbanBoard() {
  const [tareas, setTareas] = useState({
    pendiente: [],
    en_progreso: [],
    completada: []
  });

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/tareas`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    })
      .then(response => response.json())
      .then(data => {
        const agrupadas = {
          pendiente: [],
          en_progreso: [],
          completada: []
        };
        data.forEach(tarea => {
  	if (agrupadas[tarea.estado]) {
    	agrupadas[tarea.estado].push(tarea);
  	}
	});

        setTareas(agrupadas);
      })
      .catch(error => console.error('Error cargando tareas:', error));
  }, []);

  return (
    <div style={{ display: 'flex', gap: '20px' }}>
      {estados.map(estado => (
        <div key={estado} style={{ flex: 1, border: '1px solid #ccc', padding: '10px' }}>
          <h3>{estado.toUpperCase()}</h3>
          {tareas[estado].map(tarea => (
            <div key={tarea.id} style={{ margin: '10px 0', padding: '8px', backgroundColor: '#f0f0f0' }}>
              {tarea.titulo}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

export default KanbanBoard;
