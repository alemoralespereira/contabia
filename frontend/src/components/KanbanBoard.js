import React, { useEffect, useState, useCallback } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import axios from '../axiosInstance'; // 👈 usa el wrapper con interceptor

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
     Función reutilizable para traer tareas
  ────────────────────────────────────────────*/
  const fetchTareas = useCallback(async () => {
    try {
      const { data } = await axios.get('/tareas');
      setTareas(data);

      // Distribuir tareas normalizando el estado
      const nuevasColumnas = { ...columnasIniciales };
      data.forEach((t) => {
        const estadoNormalizado = t.estado?.trim().toUpperCase();
        if (estadoNormalizado && nuevasColumnas[estadoNormalizado]) {
          nuevasColumnas[estadoNormalizado].push({ ...t, estado: estadoNormalizado });
        }
      });
      setColumnas(nuevasColumnas);
    } catch (err) {
      console.error('Error al obtener tareas:', err);
      // Podrías mostrar un toast o mensaje de error si lo deseas
    }
  }, []);

  /* ───────────────────────────────────────────
     Cargar tareas al montar el componente
  ────────────────────────────────────────────*/
  useEffect(() => {
    fetchTareas();
  }, [fetchTareas]);

  /* ───────────────────────────────────────────
     Drag-and-drop y actualización en backend
  ────────────────────────────────────────────*/
  const onDragEnd = async ({ destination, source }) => {
    if (!destination || destination.droppableId === source.droppableId) return;

    // Copias inmutables
    const nuevasColumnas = { ...columnas };
    const origenItems = Array.from(nuevasColumnas[source.droppableId]);
    const destinoItems = Array.from(nuevasColumnas[destination.droppableId]);

    const [tareaMovida] = origenItems.splice(source.index, 1);
    tareaMovida.estado = destination.droppableId; // actualizar estado local para feedback inmediato
    destinoItems.splice(destination.index, 0, tareaMovida);

    nuevasColumnas[source.droppableId] = origenItems;
    nuevasColumnas[destination.droppableId] = destinoItems;
    setColumnas(nuevasColumnas);

    // Persistir cambio en el backend y recargar para evitar duplicaciones
    try {
      await axios.put(`/tareas/${tareaMovida.id}`, {
        ...tareaMovida,
        estado: destination.droppableId.toUpperCase(),
      });
      // Refrescar las tareas desde el backend una vez confirmada la actualización
      await fetchTareas();
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
