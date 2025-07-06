import React, { useEffect, useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import axios from 'axios';

const estadoColumnas = {
  PENDIENTE: 'Pendiente',
  EN_PROGRESO: 'En progreso',
  COMPLETADA: 'Completada',
};

const columnasIniciales = {
  PENDIENTE: [],
  EN_PROGRESO: [],
  COMPLETADA: [],
};

const TableroKanban = () => {
  const [tareas, setTareas] = useState([]);
  const [columnas, setColumnas] = useState(columnasIniciales);

  useEffect(() => {
    axios.get('https://contabia-backend.onrender.com/tareas').then((res) => {
      setTareas(res.data);
      const nuevasColumnas = { ...columnasIniciales };
      res.data.forEach((tarea) => {
        nuevasColumnas[tarea.estado].push(tarea);
      });
      setColumnas(nuevasColumnas);
    });
  }, []);

  const onDragEnd = async (result) => {
    const { destination, source, draggableId } = result;
    if (!destination || destination.droppableId === source.droppableId) return;

    const tareaMovida = columnas[source.droppableId].find((t) => t.id.toString() === draggableId);
    const nuevasColumnas = { ...columnas };

    // Quitar de columna origen
    nuevasColumnas[source.droppableId] = [...nuevasColumnas[source.droppableId]];
    nuevasColumnas[source.droppableId].splice(source.index, 1);

    // Agregar a columna destino
    nuevasColumnas[destination.droppableId] = [...nuevasColumnas[destination.droppableId]];
    nuevasColumnas[destination.droppableId].splice(destination.index, 0, {
      ...tareaMovida,
      estado: destination.droppableId,
    });

    setColumnas(nuevasColumnas);

    // Actualizar en backend
    await axios.put(`https://contabia-backend.onrender.com/tareas/${tareaMovida.id}`, {
      ...tareaMovida,
      estado: destination.droppableId,
    });
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
                <h2 className="font-bold text-lg mb-2">{estadoColumnas[estado]}</h2>
                {columnas[estado].map((tarea, index) => (
                  <Draggable draggableId={tarea.id.toString()} index={index} key={tarea.id}>
                    {(provided) => (
                      <div
                        className="bg-white p-3 mb-2 rounded shadow"
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        {tarea.descripcion}
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

export default TableroKanban;


