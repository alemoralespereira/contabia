import React, { useEffect, useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

// Etiquetas amigables para los encabezados de columna
const estadoColumnas = {
  PENDIENTE: 'Pendiente',
  EN_PROGRESO: 'En progreso',
  COMPLETADA: 'Completada',
};

// Estructura inicial vacía (se clona cada vez que llegan nuevas tareas)
const columnasIniciales = {
  PENDIENTE: [],
  EN_PROGRESO: [],
  COMPLETADA: [],
};

/**
 * KanbanBoard
 * --------------------------------------------------
 * Ahora es un componente «controlado»: NO hace peticiones HTTP.
 *   - Recibe las tareas vía props.
 *   - Notifica al padre los cambios de estado con onStatusChange.
 *   - Mantiene solo el estado de columnas para renderizar.
 */
const KanbanBoard = ({ tasks = [], onStatusChange }) => {
  const [columnas, setColumnas] = useState(columnasIniciales);

  /* ───────────────────────────────────────────
     Reconstruir columnas cada vez que cambian las tareas
  ────────────────────────────────────────────*/
  useEffect(() => {
    const nuevasColumnas = { ...columnasIniciales };
    tasks.forEach((t) => {
      const estadoNormalizado = t.estado?.trim().toUpperCase();
      if (estadoNormalizado && nuevasColumnas[estadoNormalizado]) {
        nuevasColumnas[estadoNormalizado].push({ ...t, estado: estadoNormalizado });
      }
    });
    setColumnas(nuevasColumnas);
  }, [tasks]);

  /* ───────────────────────────────────────────
     Drag‑and‑drop — solo UI + callback al padre
  ────────────────────────────────────────────*/
  const onDragEnd = ({ destination, source }) => {
    if (!destination || destination.droppableId === source.droppableId) return;

    // Copias inmutables para feedback inmediato
    const nuevasColumnas = { ...columnas };
    const origenItems = Array.from(nuevasColumnas[source.droppableId]);
    const destinoItems = Array.from(nuevasColumnas[destination.droppableId]);

    const [tareaMovida] = origenItems.splice(source.index, 1);
    tareaMovida.estado = destination.droppableId;
    destinoItems.splice(destination.index, 0, tareaMovida);

    nuevasColumnas[source.droppableId] = origenItems;
    nuevasColumnas[destination.droppableId] = destinoItems;
    setColumnas(nuevasColumnas);

    // Avisar al componente padre para que persista y recargue
    if (onStatusChange) {
      onStatusChange(tareaMovida.id, destination.droppableId.toUpperCase());
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex space-x-4 p-4">
        {Object.keys(columnas).map((estado) => (
          <Droppable droppableId={estado} key={estado}>
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="bg-gray-100 rounded-md p-4 w-1/3"
              >
                <h2 className="font-bold text-lg mb-2">
                  {estadoColumnas[estado] || estado}
                </h2>

                {columnas[estado].map((tarea, index) => (
                  <Draggable
                    key={tarea.id}
                    draggableId={tarea.id.toString()}
                    index={index}
                  >
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className="bg-white p-3 mb-2 rounded shadow"
                      >
                        {tarea.descripcion || tarea.titulo}
                      </div>
                    )}
                  </Draggable>
                ))}

                {provided.placeholder}
              </div>
            )}
          </Droppable>
        ))}
      </div>
    </DragDropContext>
  );
};

export default KanbanBoard;
