// Funciones para generar informes

export const generateTasksByUserReport = (tasks, users, clients) => {
  const userTasks = {};
  
  users.forEach(user => {
    const userTaskList = tasks.filter(task => task.assigneeId === user.id);
    
    if (userTaskList.length > 0) {
      userTasks[user.id] = {
        userName: user.name,
        totalTasks: userTaskList.length,
        completedTasks: userTaskList.filter(task => task.status === "completed").length,
        pendingTasks: userTaskList.filter(task => task.status === "pending").length,
        inProgressTasks: userTaskList.filter(task => task.status === "in_progress").length,
        reviewTasks: userTaskList.filter(task => task.status === "review").length,
        highPriorityTasks: userTaskList.filter(task => task.priority === "high").length,
        overdueTasks: userTaskList.filter(task => {
          const dueDate = new Date(task.dueDate);
          const today = new Date();
          return dueDate < today && task.status !== "completed";
        }).length,
        tasksByClient: userTaskList.reduce((acc, task) => {
          const client = clients.find(c => c.id === task.clientId);
          if (client) {
            if (!acc[client.id]) {
              acc[client.id] = {
                clientName: client.name,
                count: 0
              };
            }
            acc[client.id].count++;
          }
          return acc;
        }, {})
      };
    }
  });
  
  return userTasks;
};

export const generateTasksByTeamReport = (tasks, teams, users) => {
  const teamTasks = {};
  
  teams.forEach(team => {
    const teamMembers = users.filter(user => user.teamId === team.id).map(user => user.id);
    const teamTaskList = tasks.filter(task => teamMembers.includes(task.assigneeId));
    
    if (teamTaskList.length > 0) {
      teamTasks[team.id] = {
        teamName: team.name,
        totalTasks: teamTaskList.length,
        completedTasks: teamTaskList.filter(task => task.status === "completed").length,
        pendingTasks: teamTaskList.filter(task => task.status === "pending").length,
        inProgressTasks: teamTaskList.filter(task => task.status === "in_progress").length,
        reviewTasks: teamTaskList.filter(task => task.status === "review").length,
        highPriorityTasks: teamTaskList.filter(task => task.priority === "high").length,
        overdueTasks: teamTaskList.filter(task => {
          const dueDate = new Date(task.dueDate);
          const today = new Date();
          return dueDate < today && task.status !== "completed";
        }).length,
        memberPerformance: teamMembers.reduce((acc, memberId) => {
          const member = users.find(u => u.id === memberId);
          const memberTasks = teamTaskList.filter(task => task.assigneeId === memberId);
          
          if (member && memberTasks.length > 0) {
            acc[memberId] = {
              memberName: member.name,
              totalTasks: memberTasks.length,
              completedTasks: memberTasks.filter(task => task.status === "completed").length
            };
          }
          return acc;
        }, {})
      };
    }
  });
  
  return teamTasks;
};

export const generateClientTasksReport = (tasks, clients) => {
  const clientTasks = {};
  
  clients.forEach(client => {
    const clientTaskList = tasks.filter(task => task.clientId === client.id);
    
    if (clientTaskList.length > 0) {
      clientTasks[client.id] = {
        clientName: client.name,
        totalTasks: clientTaskList.length,
        completedTasks: clientTaskList.filter(task => task.status === "completed").length,
        pendingTasks: clientTaskList.filter(task => task.status === "pending").length,
        inProgressTasks: clientTaskList.filter(task => task.status === "in_progress").length,
        reviewTasks: clientTaskList.filter(task => task.status === "review").length,
        highPriorityTasks: clientTaskList.filter(task => task.priority === "high").length,
        overdueTasks: clientTaskList.filter(task => {
          const dueDate = new Date(task.dueDate);
          const today = new Date();
          return dueDate < today && task.status !== "completed";
        }).length
      };
    }
  });
  
  return clientTasks;
};