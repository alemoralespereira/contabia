import React from 'react';

const TaskCard = ({ task, client, assignee, onDragStart }) => {
  // Mapeo de prioridades para mostrar en la UI
  const priorityLabels = {
    low: { text: 'Baja', color: 'bg-gray-100 text-gray-800' },
    medium: { text: 'Media', color: 'bg-yellow-100 text-yellow-800' },
    high: { text: 'Alta', color: 'bg-red-100 text-red-800' }
  };
  
  // Formatear fecha
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('es-ES', options);
  };
  
  // Verificar si la tarea está vencida
  const isOverdue = () => {
    return new Date(task.dueDate) < new Date() && task.status !== 'completed';
  };

  return (
    <div
      className="bg-white rounded-lg shadow p-3 cursor-move"
      draggable
      onDragStart={onDragStart}
    >
      <div className="flex justify-between items-start">
        <h3 className="text-sm font-medium text-gray-900">{task.title}</h3>
        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${priorityLabels[task.priority].color}`}>
          {priorityLabels[task.priority].text}
        </span>
      </div>
      
      <p className="mt-1 text-xs text-gray-500 line-clamp-2">{task.description}</p>
      
      <div className="mt-2">
        <div className="flex items-center text-xs text-gray-500">
          <svg className="h-4 w-4 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
          <span>{client?.name || 'Cliente no asignado'}</span>
        </div>
      </div>
      
      <div className="mt-2 flex justify-between items-center">
        <div className="flex items-center">
          <img
            className="h-6 w-6 rounded-full"
            src={assignee?.avatar || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"}
            alt={assignee?.name || 'Usuario'}
          />
          <span className="ml-1 text-xs text-gray-500">{assignee?.name || 'Sin asignar'}</span>
        </div>
        
        <div className={`text-xs ${isOverdue() ? 'text-red-600 font-medium' : 'text-gray-500'}`}>
          {isOverdue() ? '¡Vencida!' : ''} {formatDate(task.dueDate)}
        </div>
      </div>
    </div>
  );
};

export default TaskCard;