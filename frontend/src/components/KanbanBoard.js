import React, { useEffect, useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import axios from '../axiosInstance';            // 👈 usa el wrapper con interceptor

// Etiquetas amigables para los encabezados de columna
const estadoColumnas = {
  PENDIENTE: 'Pendiente',
  EN_PROGRESO: 'En progreso',
  COMPLETADA: 'Completada',
};

// Estructura inicial vacía
const columnasIniciales = {
  PENDIENTE: [],
  EN_PROGRESO: [],
  COMPLETADA: [],
};

const KanbanBoard = () => {
  const [tareas, setTareas] = useState([]);
  const [columnas, setColumnas] = useState(columnasIniciales);

  /* ───────────────────────────────────────────
     Cargar tareas al montar el componente
  ────────────────────────────────────────────*/
  useEffect(() => {
    const fetchTareas = async () => {
      try {
        const { data } = await axios.get('/tareas');
        setTareas(data);

        // Distribuir tareas en sus columnas
        const nuevasColumnas = { ...columnasIniciales };
        data.forEach((t) => {
          if (nuevasColumnas[t.estado]) {
            nuevasColumnas[t.estado].push(t);
          }
        });
        setColumnas(nuevasColumnas);
      } catch (err) {
        console.error('Error al obtener tareas:', err);
        // Aquí podrías mostrar un toast o mensaje de error si lo deseas
      }
    };

    fetchTareas();
  }, []);

  /* ───────────────────────────────────────────
     Drag-and-drop y actualización en backend
  ────────────────────────────────────────────*/
  const onDragEnd = async ({ destination, source, draggableId }) => {
    if (!destination || destination.droppableId === source.droppableId) return;

    // Copias inmutables
    const nuevasColumnas = { ...columnas };
    const origenItems   = Array.from(nuevasColumnas[source.droppableId]);
    const destinoItems  = Array.from(nuevasColumnas[destination.droppableId]);

    const [tareaMovida] = origenItems.splice(source.index, 1);
    tareaMovida.estado = destination.droppableId;            // actualizar estado local
    destinoItems.splice(destination.index, 0, tareaMovida);

    nuevasColumnas[source.droppableId]     = origenItems;
    nuevasColumnas[destination.droppableId] = destinoItems;
    setColumnas(nuevasColumnas);

    // Persistir cambio en el backend
    try {
      await axios.put(`/tareas/${tareaMovida.id}`, {
        ...tareaMovida,
        estado: destination.droppableId,
      });
    } catch (err) {
      console.error('Error actualizando tarea:', err);
      // Podrías revertir el estado local o mostrar un mensaje de error
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



