import React from 'react';

const KanbanBoard = ({ tareas = [], clienteId }) => {
  const tareasFiltradas = clienteId
    ? tareas.filter((t) => t.clienteId === clienteId)
    : tareas;

  const columnas = {
    'Pendiente': tareasFiltradas.filter((t) => t.estado === 'Pendiente'),
    'En Progreso': tareasFiltradas.filter((t) => t.estado === 'En Progreso'),
    'Completada': tareasFiltradas.filter((t) => t.estado === 'Completada'),
  };

  return (
    <div className="grid grid-cols-3 gap-4 p-4">
      {Object.entries(columnas).map(([estado, tareas]) => (
        <div key={estado} className="bg-gray-100 rounded p-2">
          <h2 className="font-bold text-lg mb-2">{estado}</h2>
          {tareas.length === 0 ? (
            <p className="text-sm text-gray-500">Sin tareas</p>
          ) : (
            tareas.map((tarea) => (
              <div key={tarea.id} className="bg-white p-2 rounded shadow mb-2">
                {tarea.titulo}
              </div>
            ))
          )}
        </div>
      ))}
    </div>
  );
};

export default KanbanBoard;