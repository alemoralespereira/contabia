import React from 'react';
import TaskCard from './TaskCard';

const KanbanBoard = ({ tasks, onStatusChange, clients, users, selectedUser, currentUser, onClearSelection }) => {
  // Agrupar tareas por estado
  const tasksByStatus = {
    pending: tasks.filter(task => task.status === 'pending'),
    in_progress: tasks.filter(task => task.status === 'in_progress'),
    review: tasks.filter(task => task.status === 'review'),
    completed: tasks.filter(task => task.status === 'completed')
  };
  
  // Mapeo de estados para mostrar en la UI
  const statusLabels = {
    pending: 'Pendiente',
    in_progress: 'En Progreso',
    review: 'En Revisión',
    completed: 'Completado'
  };
  
  // Colores para las columnas
  const statusColors = {
    pending: 'bg-gray-100',
    in_progress: 'bg-blue-50',
    review: 'bg-yellow-50',
    completed: 'bg-green-50'
  };
  
  // Función para manejar el cambio de estado de una tarea
  const handleDragStart = (e, taskId, currentStatus) => {
    e.dataTransfer.setData('taskId', taskId);
    e.dataTransfer.setData('currentStatus', currentStatus);
  };
  
  const handleDragOver = (e) => {
    e.preventDefault();
  };
  
  const handleDrop = (e, newStatus) => {
    e.preventDefault();
    const taskId = parseInt(e.dataTransfer.getData('taskId'));
    const currentStatus = e.dataTransfer.getData('currentStatus');
    
    if (currentStatus !== newStatus) {
      onStatusChange(taskId, newStatus);
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 min-h-0 overflow-hidden">
        <div className="h-full flex space-x-4 pb-16">
          {Object.keys(statusLabels).map((status) => (
            <div
              key={status}
              className={`flex-1 flex flex-col ${statusColors[status]} rounded-lg shadow`}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, status)}
            >
              <div className="p-2 font-medium text-gray-700 border-b border-gray-200 bg-white rounded-t-lg">
                <div className="flex justify-between items-center">
                  <span>{statusLabels[status]}</span>
                  <span className="bg-gray-200 text-gray-700 text-xs font-semibold px-2 py-1 rounded-full">
                    {tasksByStatus[status].length}
                  </span>
                </div>
              </div>
              
              <div className="flex-1 p-2 overflow-y-auto">
                {tasksByStatus[status].length > 0 ? (
                  <div className="space-y-2">
                    {tasksByStatus[status].map((task) => (
                      <TaskCard
                        key={task.id}
                        task={task}
                        client={clients.find(c => c.id === task.clientId)}
                        assignee={users.find(u => u.id === task.assigneeId)}
                        onDragStart={(e) => handleDragStart(e, task.id, task.status)}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-gray-500 text-sm">No hay tareas</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default KanbanBoard;