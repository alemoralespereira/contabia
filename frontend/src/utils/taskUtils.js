// Funciones para manipulación y filtrado de tareas

export const getTasksByUser = (tasks, userId) => {
  return tasks.filter(task => task.assigneeId === userId);
};

export const getTasksByTeam = (tasks, teamId) => {
  return tasks.filter(task => task.teamId === teamId);
};

export const getTasksByClient = (tasks, clientId) => {
  return tasks.filter(task => task.clientId === clientId);
};

export const getTasksByStatus = (tasks, status) => {
  return tasks.filter(task => task.status === status);
};

export const getTasksByPriority = (tasks, priority) => {
  return tasks.filter(task => task.priority === priority);
};

export const getTasksDueThisWeek = (tasks) => {
  const today = new Date();
  const oneWeekLater = new Date(today);
  oneWeekLater.setDate(today.getDate() + 7);
  
  return tasks.filter(task => {
    const dueDate = new Date(task.dueDate);
    return dueDate >= today && dueDate <= oneWeekLater;
  });
};

export const getOverdueTasks = (tasks) => {
  const today = new Date();
  
  return tasks.filter(task => {
    const dueDate = new Date(task.dueDate);
    return dueDate < today && task.status !== "completed";
  });
};

export const groupTasksByStatus = (tasks) => {
  return {
    pending: tasks.filter(task => task.status === "pending"),
    in_progress: tasks.filter(task => task.status === "in_progress"),
    review: tasks.filter(task => task.status === "review"),
    completed: tasks.filter(task => task.status === "completed")
  };
};

export const updateTaskStatus = (tasks, taskId, newStatus) => {
  return tasks.map(task => {
    if (task.id === taskId) {
      return {
        ...task,
        status: newStatus,
        ...(newStatus === "completed" ? { completedAt: new Date().toISOString() } : {})
      };
    }
    return task;
  });
};