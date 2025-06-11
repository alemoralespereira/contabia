import React, { useState, useEffect, useRef } from 'react';

const AIReportAssistant = ({ tasks, users, teams, clients, currentUser, userTasksReport, teamTasksReport, clientTasksReport }) => {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  const [conversationContext, setConversationContext] = useState({
    lastMentionedTasks: null, // Últimas tareas mencionadas en detalle
    lastMentionedUser: null,
    lastMentionedTeam: null,
    lastMentionedClient: null,
    lastMentionedOverdueTasks: null, // Todas las tareas vencidas mencionadas
    lastMentionedHighPriorityTasks: null,
    lastMentionedSortedOverdueTasks: null, // Tareas vencidas ordenadas por antigüedad
    lastMentionedOldestTask: null,
    lastDiscussedTopic: null // Tema general de la última interacción
  });
  const chatContainerRef = useRef(null);

  // Simulación de la IA
  const generateAIResponse = (userQuery) => {
    setIsLoading(true);
    let aiResponse = "Lo siento, no pude encontrar información relevante para tu consulta. Intenta preguntar de otra manera.";
    let newContext = { ...conversationContext };

    const lowerQuery = userQuery.toLowerCase().trim();

    // Helper para obtener el nombre de un usuario por ID
    const getUserNameById = (id) => users.find(u => u.id === id)?.name || 'Desconocido';
    // Helper para obtener el nombre de un equipo por ID
    const getTeamNameById = (id) => teams.find(t => t.id === id)?.name || 'Desconocido';
    // Helper para obtener el nombre de un cliente por ID
    const getClientNameById = (id) => clients.find(c => c.id === id)?.name || 'Desconocido';
    
    // Helper para formatear fechas
    const formatDate = (dateString) => {
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      return new Date(dateString).toLocaleDateString('es-ES', options);
    };
    
    // Helper para calcular días de retraso
    const getDaysOverdue = (dueDate) => {
      const today = new Date();
      const due = new Date(dueDate);
      const diffTime = Math.abs(today - due);
      return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    };

    // Obtener todas las tareas vencidas
    const getAllOverdueTasks = () => {
      return tasks.filter(t => new Date(t.dueDate) < new Date() && t.status !== 'completed');
    };

    // Obtener la tarea vencida más antigua
    const getOldestOverdueTask = () => {
      const overdueTasks = getAllOverdueTasks();
      if (overdueTasks.length === 0) return null;
      
      return overdueTasks.reduce((oldest, current) => {
        return new Date(current.dueDate) < new Date(oldest.dueDate) ? current : oldest;
      }, overdueTasks[0]);
    };

    // --- Manejo de preguntas de seguimiento sobre tareas específicas ---
    if (
      (lowerQuery.includes("a quién") || lowerQuery.includes("a quien")) && 
      (lowerQuery.includes("están asignadas") || lowerQuery.includes("está asignada")) &&
      (lowerQuery.includes("esas") || lowerQuery.includes("estas") || lowerQuery.includes("las"))
    ) {
      if (newContext.lastMentionedTasks && newContext.lastMentionedTasks.length > 0) {
        aiResponse = `Las tareas que mencionaste están asignadas a:\n`;
        newContext.lastMentionedTasks.forEach((task, index) => {
          aiResponse += `${index + 1}. "${task.title}" está asignada a ${getUserNameById(task.assigneeId)}.\n`;
        });
      } else {
        aiResponse = "Lo siento, no tengo un contexto claro de a qué tareas te refieres. ¿Podrías especificar?";
      }
    }
    // Preguntas sobre las N tareas con mayor atraso
    else if (
      (lowerQuery.includes("dime") || lowerQuery.includes("muéstrame")) &&
      (lowerQuery.includes("las") || lowerQuery.includes("los")) &&
      (lowerQuery.includes("tareas") || lowerQuery.includes("pendientes")) &&
      (lowerQuery.includes("mayor atraso") || lowerQuery.includes("más atraso") || lowerQuery.includes("más antiguas")) &&
      (lowerQuery.match(/\d+/)) // Busca un número en la consulta
    ) {
      const numMatch = lowerQuery.match(/\d+/);
      const numTasks = parseInt(numMatch[0]);
      
      const overdueTasks = getAllOverdueTasks();
      
      if (overdueTasks.length > 0) {
        const sortedOverdueTasks = [...overdueTasks].sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
        const topTasks = sortedOverdueTasks.slice(0, numTasks);
        
        if (topTasks.length > 0) {
          aiResponse = `Aquí tienes las ${topTasks.length} tareas con mayor atraso:\n`;
          topTasks.forEach((task, index) => {
            const daysOverdue = getDaysOverdue(task.dueDate);
            const priorityText = task.priority === 'high' ? '(alta prioridad)' : 
                                task.priority === 'medium' ? '(prioridad media)' : 
                                '(baja prioridad)';
            
            aiResponse += `${index + 1}. "${task.title}" para ${getClientNameById(task.clientId)}, asignada a ${getUserNameById(task.assigneeId)}. Venció hace ${daysOverdue} días ${priorityText}.\n`;
          });
          
          // Actualizar contexto para futuras preguntas de seguimiento
          newContext.lastMentionedTasks = topTasks;
          newContext.lastMentionedOverdueTasks = topTasks;
          newContext.lastMentionedSortedOverdueTasks = sortedOverdueTasks;
          newContext.lastDiscussedTopic = "top_n_tareas_atrasadas";
        } else {
          aiResponse = `No hay ${numTasks} tareas vencidas para mostrar. Solo hay ${overdueTasks.length} tareas vencidas en total.`;
        }
      } else {
        aiResponse = "¡Buenas noticias! No hay tareas vencidas en este momento. Todo está al día.";
        newContext.lastMentionedTasks = [];
        newContext.lastMentionedOverdueTasks = [];
        newContext.lastMentionedSortedOverdueTasks = [];
      }
    }
    // Preguntas sobre quién tiene el pendiente más atrasado
    else if (
      (lowerQuery.includes("quién") || lowerQuery.includes("quien")) && 
      (lowerQuery.includes("pendiente") || lowerQuery.includes("tarea")) && 
      (lowerQuery.includes("atrasado") || lowerQuery.includes("atrasada") || lowerQuery.includes("atraso"))
    ) {
      // Buscar la tarea más atrasada
      let oldestTask = getOldestOverdueTask();
      
      if (oldestTask) {
        const oldestTaskDueDate = formatDate(oldestTask.dueDate);
        const daysOverdue = getDaysOverdue(oldestTask.dueDate);
        const assigneeName = getUserNameById(oldestTask.assigneeId);
        const clientName = getClientNameById(oldestTask.clientId);
        
        aiResponse = `${assigneeName} tiene la tarea más atrasada. Se trata de "${oldestTask.title}" para el cliente ${clientName}, que venció el ${oldestTaskDueDate} y lleva ${daysOverdue} días de atraso. `;
        
        // Agregar información sobre la prioridad
        if (oldestTask.priority === 'high') {
          aiResponse += `Es una tarea de alta prioridad y requiere atención inmediata.`;
        } else if (oldestTask.priority === 'medium') {
          aiResponse += `Es una tarea de prioridad media.`;
        } else {
          aiResponse += `Es una tarea de baja prioridad, pero aún así tiene un atraso considerable.`;
        }
        
        // Actualizar contexto
        newContext.lastMentionedOldestTask = oldestTask;
        newContext.lastDiscussedTopic = "persona_con_tarea_mas_atrasada";
      } else {
        aiResponse = "¡Buenas noticias! No hay tareas vencidas en este momento. Todo está al día.";
        newContext.lastMentionedOldestTask = null;
      }
    }
    
    // Preguntas sobre cuál es el pendiente más atrasado
    else if (
      (lowerQuery.includes("cuál") || lowerQuery.includes("cual")) && 
      (lowerQuery.includes("pendiente") || lowerQuery.includes("tarea")) && 
      (lowerQuery.includes("atrasado") || lowerQuery.includes("atrasada") || lowerQuery.includes("atraso")) ||
      (lowerQuery.includes("más") && lowerQuery.includes("atrasado"))
    ) {
      // Buscar la tarea más atrasada
      let oldestTask = getOldestOverdueTask();
      
      if (oldestTask) {
        const oldestTaskDueDate = formatDate(oldestTask.dueDate);
        const daysOverdue = getDaysOverdue(oldestTask.dueDate);
        const assigneeName = getUserNameById(oldestTask.assigneeId);
        const clientName = getClientNameById(oldestTask.clientId);
        
        aiResponse = `La tarea más atrasada es "${oldestTask.title}" para el cliente ${clientName}, asignada a ${assigneeName}. Venció el ${oldestTaskDueDate} y lleva ${daysOverdue} días de atraso. `;
        
        // Agregar información sobre la prioridad
        if (oldestTask.priority === 'high') {
          aiResponse += `Es una tarea de alta prioridad y requiere atención inmediata.`;
        } else if (oldestTask.priority === 'medium') {
          aiResponse += `Es una tarea de prioridad media.`;
        } else {
          aiResponse += `Es una tarea de baja prioridad, pero aún así tiene un atraso considerable.`;
        }
        
        // Actualizar contexto
        newContext.lastMentionedOldestTask = oldestTask;
        newContext.lastDiscussedTopic = "tarea_mas_atrasada";
      } else {
        aiResponse = "¡Buenas noticias! No hay tareas vencidas en este momento. Todo está al día.";
        newContext.lastMentionedOldestTask = null;
      }
    }
    
    // Preguntas sobre tareas más antiguas respecto a su vencimiento
    else if (
      (lowerQuery.includes("tareas") && lowerQuery.includes("antiguas") && lowerQuery.includes("vencimiento")) ||
      (lowerQuery.includes("tareas") && lowerQuery.includes("vencidas") && lowerQuery.includes("antiguas")) ||
      (lowerQuery.includes("tareas") && lowerQuery.includes("mayor") && lowerQuery.includes("atraso"))
    ) {
      const overdueTasks = getAllOverdueTasks();
      
      if (overdueTasks.length > 0) {
        // Ordenar tareas vencidas por fecha de vencimiento (más antigua primero)
        const sortedOverdueTasks = [...overdueTasks].sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
        
        aiResponse = `Las tareas vencidas ordenadas por antigüedad son:\n`;
        
        sortedOverdueTasks.forEach((task, index) => {
          const daysOverdue = getDaysOverdue(task.dueDate);
          const priorityText = task.priority === 'high' ? '(alta prioridad)' : 
                              task.priority === 'medium' ? '(prioridad media)' : 
                              '(baja prioridad)';
          
          aiResponse += `${index + 1}. "${task.title}" para ${getClientNameById(task.clientId)}, asignada a ${getUserNameById(task.assigneeId)}. Venció hace ${daysOverdue} días ${priorityText}.\n`;
        });
        
        // Actualizar contexto
        newContext.lastMentionedSortedOverdueTasks = sortedOverdueTasks;
        newContext.lastMentionedOverdueTasks = sortedOverdueTasks;
        newContext.lastMentionedOldestTask = sortedOverdueTasks[0];
        newContext.lastDiscussedTopic = "tareas_ordenadas_por_antiguedad";
      } else {
        aiResponse = "¡Buenas noticias! No hay tareas vencidas en este momento. Todo está al día.";
        newContext.lastMentionedOverdueTasks = [];
        newContext.lastMentionedSortedOverdueTasks = [];
        newContext.lastMentionedOldestTask = null;
      }
    }

    // Manejo de preguntas de seguimiento basadas en contexto
    else if (
      (lowerQuery.includes("cuáles") || lowerQuery.includes("cuales") || lowerQuery.includes("qué") || lowerQuery.includes("que")) && 
      (lowerQuery.includes("son") || lowerQuery.includes("es")) && 
      (lowerQuery.includes("esas") || lowerQuery.includes("estas") || lowerQuery.includes("las") || lowerQuery.includes("esas tareas") || lowerQuery.includes("estas tareas"))
    ) {
      // El usuario está preguntando por tareas mencionadas anteriormente
      if (newContext.lastMentionedHighPriorityTasks && newContext.lastMentionedHighPriorityTasks.length > 0) {
        const highPriorityTasks = newContext.lastMentionedHighPriorityTasks;
        
        aiResponse = `Las tareas de alta prioridad que mencioné son:\n`;
        highPriorityTasks.forEach((task, index) => {
          const daysOverdue = getDaysOverdue(task.dueDate);
          aiResponse += `${index + 1}. "${task.title}" para ${getClientNameById(task.clientId)}, asignada a ${getUserNameById(task.assigneeId)}. Venció hace ${daysOverdue} días.\n`;
        });
        
        newContext.lastDiscussedTopic = "tareas_alta_prioridad";
      } 
      else if (newContext.lastMentionedOverdueTasks && newContext.lastMentionedOverdueTasks.length > 0) {
        const overdueTasks = newContext.lastMentionedOverdueTasks;
        
        aiResponse = `Las tareas vencidas que mencioné son:\n`;
        overdueTasks.forEach((task, index) => {
          const daysOverdue = getDaysOverdue(task.dueDate);
          const priorityText = task.priority === 'high' ? '(alta prioridad)' : 
                              task.priority === 'medium' ? '(prioridad media)' : 
                              '(baja prioridad)';
          
          aiResponse += `${index + 1}. "${task.title}" para ${getClientNameById(task.clientId)}, asignada a ${getUserNameById(task.assigneeId)}. Venció hace ${daysOverdue} días ${priorityText}.\n`;
        });
        
        newContext.lastDiscussedTopic = "tareas_vencidas";
      }
      else {
        aiResponse = "Lo siento, no he mencionado tareas específicas en nuestra conversación anterior. ¿Te gustaría que te muestre las tareas vencidas o pendientes?";
      }
    }
    // Preguntas sobre la tarea vencida más antigua
    else if (
      lowerQuery.includes("tarea vencida más antigua") || 
      lowerQuery.includes("vencimiento más antiguo") || 
      lowerQuery.includes("vencida hace más tiempo") ||
      (lowerQuery.includes("cuál") && lowerQuery.includes("vencida") && lowerQuery.includes("más tiempo")) ||
      (lowerQuery.includes("cuál") && lowerQuery.includes("está vencida") && lowerQuery.includes("más tiempo"))
    ) {
      const oldestTask = getOldestOverdueTask();
      
      if (oldestTask) {
        const oldestTaskDueDate = formatDate(oldestTask.dueDate);
        const daysOverdue = getDaysOverdue(oldestTask.dueDate);
        const assigneeName = getUserNameById(oldestTask.assigneeId);
        const clientName = getClientNameById(oldestTask.clientId);
        
        aiResponse = `La tarea vencida hace más tiempo es "${oldestTask.title}" para el cliente ${clientName}. Está asignada a ${assigneeName} y venció el ${oldestTaskDueDate}, hace ${daysOverdue} días. `;
        
        // Agregar información sobre la prioridad
        if (oldestTask.priority === 'high') {
          aiResponse += `Esta tarea es de alta prioridad y requiere atención inmediata.`;
        } else if (oldestTask.priority === 'medium') {
          aiResponse += `Esta tarea es de prioridad media.`;
        } else {
          aiResponse += `Esta tarea es de baja prioridad, pero aún así está vencida.`;
        }
        
        // Actualizar contexto
        newContext.lastMentionedTasks = [oldestTask];
        newContext.lastMentionedOldestTask = oldestTask;
        
        // También guardar todas las tareas vencidas ordenadas
        const overdueTasks = getAllOverdueTasks();
        const sortedOverdueTasks = [...overdueTasks].sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
        newContext.lastMentionedSortedOverdueTasks = sortedOverdueTasks;
        newContext.lastDiscussedTopic = "tarea_mas_antigua";
      } else {
        aiResponse = "¡Buenas noticias! No hay tareas vencidas en este momento. Todo está al día.";
        newContext.lastMentionedTasks = [];
        newContext.lastMentionedSortedOverdueTasks = [];
        newContext.lastMentionedOldestTask = null;
      }
    }
    
    // Pendientes por nombre específico (sin necesidad de la palabra "integrante" o "colaborador")
    else if (lowerQuery.match(/pendientes\s+de\s+([\w\s]+)/) || lowerQuery.match(/tareas\s+de\s+([\w\s]+)/)) {
      const nameMatch = lowerQuery.match(/(?:pendientes|tareas)\s+de\s+([\w\s]+)/);
      if (nameMatch && nameMatch[1]) {
        const requestedName = nameMatch[1].trim();
        const user = users.find(u => u.name.toLowerCase().includes(requestedName.toLowerCase()));
        
        if (user) {
          const userTasks = tasks.filter(t => t.assigneeId === user.id && t.status !== 'completed');
          
          if (userTasks.length > 0) {
            const pendingCount = userTasks.filter(t => t.status === 'pending').length;
            const inProgressCount = userTasks.filter(t => t.status === 'in_progress').length;
            const reviewCount = userTasks.filter(t => t.status === 'review').length;
            const overdueCount = userTasks.filter(t => new Date(t.dueDate) < new Date()).length;
            
            aiResponse = `${user.name} tiene ${userTasks.length} tareas pendientes en total. De estas, ${pendingCount} están en estado pendiente, ${inProgressCount} en progreso y ${reviewCount} en revisión.`;
            
            if (overdueCount > 0) {
              aiResponse += ` ¡Atención! ${overdueCount} de estas tareas están vencidas.`;
              
              // Detallar las tareas vencidas
              const overdueTasks = userTasks.filter(t => new Date(t.dueDate) < new Date());
              const overdueDetails = overdueTasks.map(task => {
                const daysOverdue = getDaysOverdue(task.dueDate);
                return `"${task.title}" para ${getClientNameById(task.clientId)} (vencida hace ${daysOverdue} días)`;
              }).join(', ');
              
              aiResponse += ` Las tareas vencidas son: ${overdueDetails}.`;
            }
            
            // Listar las próximas tareas a vencer
            const upcomingTasks = userTasks
              .filter(t => new Date(t.dueDate) >= new Date())
              .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
              .slice(0, 3);
              
            if (upcomingTasks.length > 0) {
              const upcomingDetails = upcomingTasks.map(task => {
                return `"${task.title}" para ${getClientNameById(task.clientId)} (vence el ${formatDate(task.dueDate)})`;
              }).join(', ');
              
              aiResponse += ` Las próximas tareas a vencer son: ${upcomingDetails}.`;
            }
            
            // Actualizar contexto
            newContext.lastMentionedUser = user;
            newContext.lastMentionedTasks = userTasks;
            
            // Si hay tareas vencidas, guardar la más antigua
            if (overdueCount > 0) {
              const sortedOverdueTasks = [...userTasks.filter(t => new Date(t.dueDate) < new Date())].sort(
                (a, b) => new Date(a.dueDate) - new Date(b.dueDate)
              );
              newContext.lastMentionedSortedOverdueTasks = sortedOverdueTasks;
              newContext.lastMentionedOldestTask = sortedOverdueTasks[0];
            }
            newContext.lastDiscussedTopic = "pendientes_usuario";
          } else {
            aiResponse = `¡Buenas noticias! ${user.name} no tiene tareas pendientes en este momento.`;
            newContext.lastMentionedUser = user;
            newContext.lastMentionedTasks = [];
          }
        } else {
          aiResponse = `No encontré a ningún integrante llamado "${requestedName}". ¿Podrías verificar el nombre?`;
        }
      }
    }
    
    // Preguntas sobre tareas vencidas (más directas)
    else if (lowerQuery.includes("tareas vencidas") || lowerQuery.includes("cuántas vencidas")) {
      const overdueTasks = getAllOverdueTasks();
      const overdueTasksCount = overdueTasks.length;
      
      if (overdueTasksCount > 0) {
        // Ordenar tareas vencidas por fecha de vencimiento (más antigua primero)
        const sortedOverdueTasks = [...overdueTasks].sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
        const oldestTask = sortedOverdueTasks[0];
        const oldestTaskDueDate = formatDate(oldestTask.dueDate);
        const daysOverdue = getDaysOverdue(oldestTask.dueDate);
        
        // Filtrar tareas de alta prioridad
        const highPriorityTasks = sortedOverdueTasks.filter(t => t.priority === 'high');
        const highPriorityCount = highPriorityTasks.length;
        
        aiResponse = `Actualmente hay ${overdueTasksCount} tareas vencidas en el sistema. La tarea vencida más antigua es "${oldestTask.title}" para el cliente ${getClientNameById(oldestTask.clientId)}, asignada a ${getUserNameById(oldestTask.assigneeId)}. Esta tarea venció el ${oldestTaskDueDate} (hace ${daysOverdue} días).`;
        
        if (overdueTasksCount > 1 && highPriorityCount > 0) {
          aiResponse += ` De las tareas vencidas, ${highPriorityCount} son de alta prioridad y requieren atención inmediata.`;
        }
        
        // Actualizar contexto
        newContext.lastMentionedOverdueTasks = sortedOverdueTasks;
        newContext.lastMentionedHighPriorityTasks = highPriorityTasks;
        newContext.lastMentionedSortedOverdueTasks = sortedOverdueTasks;
        newContext.lastMentionedOldestTask = oldestTask;
        newContext.lastDiscussedTopic = "tareas_vencidas";
      } else {
        aiResponse = "¡Excelente! No hay tareas vencidas en este momento. ¡Vamos por buen camino!";
        newContext.lastMentionedOverdueTasks = [];
        newContext.lastMentionedHighPriorityTasks = [];
        newContext.lastMentionedSortedOverdueTasks = [];
        newContext.lastMentionedOldestTask = null;
      }
    }
    
    // --- Respuestas más flexibles para "pendientes" ---
    else if (lowerQuery.includes("pendientes") || lowerQuery.includes("situación actual") || lowerQuery.includes("cómo vamos")) {
      // Pendientes por equipo específico
      const teamNameMatch = lowerQuery.match(/equipo\s+([\w\s]+)/);
      if (teamNameMatch && teamNameMatch[1]) {
        const requestedTeamName = teamNameMatch[1].trim();
        const team = teams.find(t => t.name.toLowerCase().includes(requestedTeamName));
        if (team) {
          const report = teamTasksReport[team.id];
          if (report) {
            const totalPending = report.pendingTasks + report.inProgressTasks + report.reviewTasks;
            aiResponse = `El equipo "${team.name}" tiene un total de ${totalPending} tareas pendientes. Específicamente, ${report.pendingTasks} están en estado pendiente, ${report.inProgressTasks} en progreso y ${report.reviewTasks} en revisión.`;
            if (report.overdueTasks > 0) {
              aiResponse += ` ¡Ojo! También tienen ${report.overdueTasks} tareas vencidas.`;
            } else {
              aiResponse += ` ¡Y lo mejor es que no tienen tareas vencidas!`;
            }
            
            // Actualizar contexto
            newContext.lastMentionedTeam = team;
            const teamMemberIds = users.filter(u => u.teamId === team.id).map(u => u.id);
            newContext.lastMentionedTasks = tasks.filter(t => 
              teamMemberIds.includes(t.assigneeId) && 
              t.status !== 'completed'
            );
            
            // Si hay tareas vencidas, guardar la más antigua
            if (report.overdueTasks > 0) {
              const teamOverdueTasks = tasks.filter(t => 
                teamMemberIds.includes(t.assigneeId) && 
                t.status !== 'completed' &&
                new Date(t.dueDate) < new Date()
              );
              
              const sortedOverdueTasks = [...teamOverdueTasks].sort(
                (a, b) => new Date(a.dueDate) - new Date(b.dueDate)
              );
              
              newContext.lastMentionedSortedOverdueTasks = sortedOverdueTasks;
              newContext.lastMentionedOldestTask = sortedOverdueTasks[0];
            }
            newContext.lastDiscussedTopic = "pendientes_equipo";
          } else {
            aiResponse = `No se encontraron tareas para el equipo "${team.name}". Parece que están al día o no tienen asignaciones.`;
            newContext.lastMentionedTeam = team;
            newContext.lastMentionedTasks = [];
          }
        } else {
          aiResponse = `No encontré un equipo llamado "${requestedTeamName}". ¿Podrías verificar el nombre o intentar con otro?`;
        }
      } 
      // Pendientes por integrante específico
      else if (lowerQuery.includes("integrante") || lowerQuery.includes("colaborador") || lowerQuery.includes("usuario")) {
        const userNameMatch = lowerQuery.match(/(?:integrante|colaborador|usuario)\s+([\w\s]+)/);
        if (userNameMatch && userNameMatch[1]) {
          const requestedUserName = userNameMatch[1].trim();
          const user = users.find(u => u.name.toLowerCase().includes(requestedUserName));
          if (user) {
            const report = userTasksReport[user.id];
            if (report) {
              const totalPending = report.pendingTasks + report.inProgressTasks + report.reviewTasks;
              aiResponse = `"${user.name}" tiene un total de ${totalPending} tareas pendientes. De estas, ${report.pendingTasks} están en estado pendiente, ${report.inProgressTasks} en progreso y ${report.reviewTasks} en revisión.`;
              if (report.overdueTasks > 0) {
                aiResponse += ` ¡Cuidado! Tiene ${report.overdueTasks} tareas vencidas.`;
              } else {
                aiResponse += ` ¡Va muy bien, no tiene tareas vencidas!`;
              }
              
              // Actualizar contexto
              newContext.lastMentionedUser = user;
              newContext.lastMentionedTasks = tasks.filter(t => 
                t.assigneeId === user.id && 
                t.status !== 'completed'
              );
              
              // Si hay tareas vencidas, guardar la más antigua
              if (report.overdueTasks > 0) {
                const userOverdueTasks = tasks.filter(t => 
                  t.assigneeId === user.id && 
                  t.status !== 'completed' &&
                  new Date(t.dueDate) < new Date()
                );
                
                const sortedOverdueTasks = [...userOverdueTasks].sort(
                  (a, b) => new Date(a.dueDate) - new Date(b.dueDate)
                );
                
                newContext.lastMentionedSortedOverdueTasks = sortedOverdueTasks;
                newContext.lastMentionedOldestTask = sortedOverdueTasks[0];
              }
              newContext.lastDiscussedTopic = "pendientes_usuario";
            } else {
              aiResponse = `No se encontraron tareas para "${user.name}". Parece que está al día o no tiene asignaciones.`;
              newContext.lastMentionedUser = user;
              newContext.lastMentionedTasks = [];
            }
          } else {
            aiResponse = `No encontré un integrante llamado "${requestedUserName}". ¿Podrías verificar el nombre?`;
          }
        } else {
          // Resumen general de pendientes por integrante
          const userSummaries = users.map(user => {
            const report = userTasksReport[user.id];
            if (report && (report.pendingTasks + report.inProgressTasks + report.reviewTasks > 0 || report.overdueTasks > 0)) {
              return `"${user.name}" tiene ${report.pendingTasks + report.inProgressTasks + report.reviewTasks} pendientes (${report.overdueTasks} vencidas).`;
            }
            return null;
          }).filter(Boolean).join('\n');
          
          if (userSummaries) {
            aiResponse = `Aquí tienes un resumen de los pendientes por integrante:\n${userSummaries}`;
            
            // Actualizar contexto - todas las tareas pendientes
            newContext.lastMentionedTasks = tasks.filter(t => t.status !== 'completed');
          } else {
            aiResponse = "¡Felicidades! Parece que todos los integrantes están al día con sus tareas pendientes.";
            newContext.lastMentionedTasks = [];
          }
        }
      } else {
        // Resumen general de pendientes (todos los equipos/usuarios)
        const totalPendingTasks = tasks.filter(t => t.status !== 'completed').length;
        const totalOverdueTasks = tasks.filter(t => new Date(t.dueDate) < new Date() && t.status !== 'completed').length;
        
        if (totalPendingTasks > 0) {
          aiResponse = `En general, tenemos ${totalPendingTasks} tareas pendientes en el sistema. De estas, ${totalOverdueTasks} están vencidas.`;
          
          // Agregar información sobre la tarea más atrasada
          if (totalOverdueTasks > 0) {
            const overdueTasks = getAllOverdueTasks();
            const sortedOverdueTasks = [...overdueTasks].sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
            const oldestTask = sortedOverdueTasks[0];
            const daysOverdue = getDaysOverdue(oldestTask.dueDate);
            
            aiResponse += ` ¡Es importante revisar las tareas vencidas para evitar problemas! La tarea más atrasada es "${oldestTask.title}" asignada a ${getUserNameById(oldestTask.assigneeId)}, con ${daysOverdue} días de atraso.`;
            
            // Actualizar contexto
            newContext.lastMentionedOldestTask = oldestTask;
          }
          
          // Actualizar contexto
          newContext.lastMentionedTasks = tasks.filter(t => t.status !== 'completed');
          newContext.lastMentionedOverdueTasks = tasks.filter(t => 
            new Date(t.dueDate) < new Date() && 
            t.status !== 'completed'
          );
          
          // Ordenar tareas vencidas por fecha
          if (totalOverdueTasks > 0) {
            const sortedOverdueTasks = [...newContext.lastMentionedOverdueTasks].sort(
              (a, b) => new Date(a.dueDate) - new Date(b.dueDate)
            );
            newContext.lastMentionedSortedOverdueTasks = sortedOverdueTasks;
          }
          newContext.lastDiscussedTopic = "pendientes_general";
        } else {
          aiResponse = "¡Excelente! No hay tareas pendientes en este momento. ¡Todo está al día!";
          newContext.lastMentionedTasks = [];
          newContext.lastMentionedOverdueTasks = [];
          newContext.lastMentionedSortedOverdueTasks = [];
          newContext.lastMentionedOldestTask = null;
        }
      }
    }
    // --- Fin de respuestas flexibles para "pendientes" ---
    
    // Preguntas sobre tareas por cliente
    else if (lowerQuery.includes("cliente") && (lowerQuery.includes("tareas") || lowerQuery.includes("pendientes"))) {
      const clientNameMatch = lowerQuery.match(/cliente\s+([\w\s]+)/);
      if (clientNameMatch && clientNameMatch[1]) {
        const requestedClientName = clientNameMatch[1].trim();
        const client = clients.find(c => c.name.toLowerCase().includes(requestedClientName));
        
        if (client) {
          const clientTasks = tasks.filter(t => t.clientId === client.id);
          const pendingTasks = clientTasks.filter(t => t.status !== 'completed');
          const overdueTasks = clientTasks.filter(t => new Date(t.dueDate) < new Date() && t.status !== 'completed');
          
          if (clientTasks.length > 0) {
            aiResponse = `El cliente "${client.name}" tiene un total de ${clientTasks.length} tareas, de las cuales ${pendingTasks.length} están pendientes`;
            
            if (overdueTasks.length > 0) {
              aiResponse += ` y ${overdueTasks.length} están vencidas.`;
              
              // Información sobre la tarea vencida más antigua de este cliente
              if (overdueTasks.length > 0) {
                const sortedOverdueTasks = [...overdueTasks].sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
                const oldestTask = sortedOverdueTasks[0];
                const oldestTaskDueDate = formatDate(oldestTask.dueDate);
                const daysOverdue = getDaysOverdue(oldestTask.dueDate);
                
                aiResponse += ` La tarea vencida más antigua es "${oldestTask.title}", asignada a ${getUserNameById(oldestTask.assigneeId)}, que venció el ${oldestTaskDueDate} (hace ${daysOverdue} días).`;
                
                // Actualizar contexto
                newContext.lastMentionedOldestTask = oldestTask;
              }
            } else {
              aiResponse += `. ¡Buenas noticias! No hay tareas vencidas para este cliente.`;
            }
            
            // Actualizar contexto
            newContext.lastMentionedClient = client;
            newContext.lastMentionedTasks = pendingTasks;
            newContext.lastMentionedOverdueTasks = overdueTasks;
            if (overdueTasks.length > 0) {
              newContext.lastMentionedSortedOverdueTasks = [...overdueTasks].sort(
                (a, b) => new Date(a.dueDate) - new Date(b.dueDate)
              );
            }
            newContext.lastDiscussedTopic = "tareas_cliente";
          } else {
            aiResponse = `No se encontraron tareas para el cliente "${client.name}".`;
            newContext.lastMentionedClient = client;
            newContext.lastMentionedTasks = [];
            newContext.lastMentionedOverdueTasks = [];
            newContext.lastMentionedSortedOverdueTasks = [];
            newContext.lastMentionedOldestTask = null;
          }
        } else {
          aiResponse = `No encontré un cliente llamado "${requestedClientName}". ¿Podrías verificar el nombre?`;
        }
      } else {
        // Resumen general de tareas por cliente
        const clientSummaries = clients.map(client => {
          const clientTasks = tasks.filter(t => t.clientId === client.id);
          const pendingTasks = clientTasks.filter(t => t.status !== 'completed');
          const overdueTasks = clientTasks.filter(t => new Date(t.dueDate) < new Date() && t.status !== 'completed');
          
          if (clientTasks.length > 0) {
            return `"${client.name}": ${pendingTasks.length} pendientes, ${overdueTasks.length} vencidas.`;
          }
          return null;
        }).filter(Boolean).join('\n');
        
        if (clientSummaries) {
          aiResponse = `Aquí tienes un resumen de tareas por cliente:\n${clientSummaries}`;
          
          // Actualizar contexto - todas las tareas pendientes
          newContext.lastMentionedTasks = tasks.filter(t => t.status !== 'completed');
        } else {
          aiResponse = "No hay tareas asignadas a ningún cliente en este momento.";
          newContext.lastMentionedTasks = [];
        }
      }
    }
    
    // Preguntas sobre tareas completadas (más directas)
    else if (lowerQuery.includes("tareas completadas") || lowerQuery.includes("cuántas completadas")) {
      const completedTasks = tasks.filter(t => t.status === 'completed');
      const completedTasksCount = completedTasks.length;
      
      if (completedTasksCount > 0) {
        // Ordenar por fecha de completado (más reciente primero)
        const sortedCompletedTasks = [...completedTasks].sort((a, b) => new Date(b.completedAt || b.dueDate) - new Date(a.completedAt || a.dueDate));
        const latestTask = sortedCompletedTasks[0];
        const latestTaskCompletedDate = formatDate(latestTask.completedAt || latestTask.dueDate);
        
        aiResponse = `Se han completado ${completedTasksCount} tareas hasta ahora. La tarea completada más reciente es "${latestTask.title}" para el cliente ${getClientNameById(latestTask.clientId)}, completada el ${latestTaskCompletedDate}.`;
        
        // Agregar información sobre quién ha completado más tareas
        const completionsByUser = {};
        completedTasks.forEach(task => {
          const userId = task.assigneeId;
          completionsByUser[userId] = (completionsByUser[userId] || 0) + 1;
        });
        
        let topPerformer = null;
        let maxCompletions = 0;
        
        for (const userId in completionsByUser) {
          if (completionsByUser[userId] > maxCompletions) {
            maxCompletions = completionsByUser[userId];
            topPerformer = userId;
          }
        }
        
        if (topPerformer) {
          const topPerformerName = getUserNameById(parseInt(topPerformer));
          aiResponse += ` ${topPerformerName} es quien más tareas ha completado, con un total de ${maxCompletions}.`;
        }
        
        // Actualizar contexto
        newContext.lastMentionedTasks = completedTasks;
        newContext.lastDiscussedTopic = "tareas_completadas";
      } else {
        aiResponse = "Aún no hay tareas completadas. ¡Manos a la obra, que el tiempo vuela!";
        newContext.lastMentionedTasks = [];
      }
    }
    
    // Preguntas sobre rendimiento de equipos
    else if (lowerQuery.includes("rendimiento") && lowerQuery.includes("equipo")) {
      const teamNameMatch = lowerQuery.match(/equipo\s+([\w\s]+)/);
      if (teamNameMatch && teamNameMatch[1]) {
        const requestedTeamName = teamNameMatch[1].trim();
        const team = teams.find(t => t.name.toLowerCase().includes(requestedTeamName));
        
        if (team) {
          const report = teamTasksReport[team.id];
          if (report) {
            const completionRate = (report.completedTasks / report.totalTasks * 100).toFixed(1);
            const overdueRate = (report.overdueTasks / report.totalTasks * 100).toFixed(1);
            
            aiResponse = `El equipo "${team.name}" tiene una tasa de completado del ${completionRate}% (${report.completedTasks} de ${report.totalTasks} tareas). `;
            
            if (report.overdueTasks > 0) {
              aiResponse += `Sin embargo, tienen un ${overdueRate}% de tareas vencidas (${report.overdueTasks} tareas). `;
            } else {
              aiResponse += `Y lo mejor es que no tienen tareas vencidas. `;
            }
            
            // Información sobre el rendimiento de los miembros del equipo
            if (Object.keys(report.memberPerformance).length > 0) {
              const memberPerformance = Object.values(report.memberPerformance);
              const bestPerformer = memberPerformance.reduce((best, current) => {
                return (current.completedTasks > best.completedTasks) ? current : best;
              }, { memberName: '', completedTasks: 0 });
              
              if (bestPerformer.completedTasks > 0) {
                aiResponse += `${bestPerformer.memberName} es el miembro con mejor rendimiento, habiendo completado ${bestPerformer.completedTasks} tareas.`;
              }
            }
            
            // Actualizar contexto
            newContext.lastMentionedTeam = team;
            const teamMemberIds = users.filter(u => u.teamId === team.id).map(u => u.id);
            newContext.lastMentionedTasks = tasks.filter(t => teamMemberIds.includes(t.assigneeId));
            newContext.lastDiscussedTopic = "rendimiento_equipo";
          } else {
            aiResponse = `No se encontraron datos de rendimiento para el equipo "${team.name}".`;
            newContext.lastMentionedTeam = team;
          }
        } else {
          aiResponse = `No encontré un equipo llamado "${requestedTeamName}". ¿Podrías verificar el nombre?`;
        }
      } else {
        // Resumen general de rendimiento por equipo
        const teamPerformanceSummaries = teams.map(team => {
          const report = teamTasksReport[team.id];
          if (report && report.totalTasks > 0) {
            const completionRate = (report.completedTasks / report.totalTasks * 100).toFixed(1);
            return `"${team.name}": ${completionRate}% de tareas completadas (${report.completedTasks}/${report.totalTasks}).`;
          }
          return null;
        }).filter(Boolean).join('\n');
        
        if (teamPerformanceSummaries) {
          aiResponse = `Aquí tienes un resumen del rendimiento por equipo:\n${teamPerformanceSummaries}`;
          
          // Actualizar contexto - todas las tareas
          newContext.lastMentionedTasks = tasks;
          newContext.lastDiscussedTopic = "rendimiento_equipos";
        } else {
          aiResponse = "No hay datos de rendimiento disponibles para los equipos.";
          newContext.lastMentionedTasks = [];
        }
      }
    }
    
    // Saludos
    else if (lowerQuery.includes("hola") || lowerQuery.includes("qué tal") || lowerQuery.includes("buenos días") || lowerQuery.includes("buenas tardes")) {
      aiResponse = "¡Hola! Soy tu asistente de informes. ¿En qué puedo ayudarte hoy con los datos de tus equipos y tareas? Pregúntame sobre pendientes, vencidas o el estado de algún equipo o integrante.";
    }
    // Preguntas generales sobre la IA
    else if (lowerQuery.includes("qué puedes hacer") || lowerQuery.includes("cómo funcionas") || lowerQuery.includes("ayuda")) {
      aiResponse = "Puedo darte resúmenes sobre tareas pendientes (generales, por equipo o por integrante), tareas vencidas, y tareas completadas. También puedo decirte cuándo venció la tarea más antigua, el rendimiento de los equipos, y mucho más. Solo pregúntame algo como: '¿Cómo vamos con los pendientes?', 'Cuéntame sobre el equipo Impuestos', '¿Cuándo venció la tarea más antigua?' o '¿Qué tareas tiene Ana López?'";
    }

    // Actualizar el contexto de la conversación
    setConversationContext(newContext);

    setTimeout(() => {
      // Actualizar el historial con la respuesta
      setChatHistory(prevHistory => {
        const newHistory = [...prevHistory];
        if (newHistory.length > 0) {
          newHistory[newHistory.length - 1] = {
            ...newHistory[newHistory.length - 1],
            response: aiResponse
          };
        } else {
          // Si por alguna razón no hay historial, agregar la consulta y respuesta
          newHistory.push({ type: 'query', text: userQuery, response: aiResponse });
        }
        return newHistory;
      });
      
      setResponse('');
      setIsLoading(false);
      
      // Scroll al final del chat
      if (chatContainerRef.current) {
        chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
      }
    }, 1500); // Simula un tiempo de procesamiento de la IA
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      // Guardar la consulta en el historial
      setChatHistory([...chatHistory, { type: 'query', text: query }]);
      setResponse(''); // Limpiar respuesta anterior
      generateAIResponse(query);
      setQuery(''); // Limpiar input
    }
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Asistente de Informes con IA</h3>
      <p className="text-sm text-gray-500 mb-6">
        Pregúntame sobre el estado de las tareas de tus equipos o integrantes. Por ejemplo:
        "¿Cómo vamos con los pendientes?", "¿Cuántas tareas pendientes tiene el equipo Impuestos?", 
        "¿Qué tareas tiene Ana López?", "¿Cuándo venció la tarea más antigua?".
      </p>

      <div ref={chatContainerRef} className="border border-gray-200 rounded-md p-4 h-64 overflow-y-auto mb-4 bg-gray-50">
        {chatHistory.map((item, index) => (
          <div key={index} className="mb-3">
            <div className="text-gray-800">
              <span className="font-semibold text-gray-600">Tú: </span>{item.text}
            </div>
            {item.response && (
              <div className="text-gray-800 whitespace-pre-line mt-2">
                <span className="font-semibold text-blue-600">Asistente: </span>{item.response}
              </div>
            )}
          </div>
        ))}
        
        {isLoading && (
          <div className="flex items-center mt-2">
            <svg className="animate-spin h-5 w-5 text-blue-500 mr-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span className="text-gray-600">Pensando...</span>
          </div>
        )}
        
        {!isLoading && chatHistory.length === 0 && (
          <div className="text-gray-500 italic">Esperando tu pregunta...</div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="flex">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Escribe tu pregunta aquí..."
          className="flex-1 px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          disabled={isLoading}
        />
        <button
          type="submit"
          className="px-6 py-2 bg-blue-600 text-white rounded-r-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          disabled={isLoading || !query.trim()}
        >
          Preguntar
        </button>
      </form>
      
      <div className="mt-4">
        <p className="text-xs text-gray-500">Sugerencias de preguntas:</p>
        <div className="mt-2 flex flex-wrap gap-2">
          <button 
            onClick={() => setQuery("¿Cómo vamos con los pendientes?")}
            className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-800 py-1 px-2 rounded-full"
          >
            ¿Cómo vamos con los pendientes?
          </button>
          <button 
            onClick={() => setQuery("¿Cuál es el pendiente más atrasado?")}
            className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-800 py-1 px-2 rounded-full"
          >
            ¿Cuál es el más atrasado?
          </button>
          <button 
            onClick={() => setQuery("¿Quién tiene el pendiente más atrasado?")}
            className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-800 py-1 px-2 rounded-full"
          >
            ¿Quién tiene el más atrasado?
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIReportAssistant;

// DONE