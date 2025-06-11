import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import KanbanBoard from './KanbanBoard';
import TeamManagement from './TeamManagement';
import ClientManagement from './ClientManagement';
import Reports from './Reports';
import UserProfile from './UserProfile';
import { tasks as initialTasks } from '../mock/tasks';
import { users, teams, accounts } from '../mock/users';
import { clients } from '../mock/clients';
import { getUserTeamMembers } from '../utils/auth';
import { getTasksByUser, updateTaskStatus } from '../utils/taskUtils';

const Dashboard = ({ user, onLogout }) => {
  const [currentView, setCurrentView] = useState('kanban');
  const [currentTasks, setCurrentTasks] = useState(initialTasks);
  const [selectedTeamMember, setSelectedTeamMember] = useState(null);
  
  // Obtener miembros del equipo si el usuario es supervisor o admin
  const teamMembers = getUserTeamMembers(user, users, teams);
  
  // Efecto para resetear la selección de miembro cuando la vista cambia a algo que no es kanban
  useEffect(() => {
    if (currentView !== 'kanban') {
      setSelectedTeamMember(null);
    }
  }, [currentView]);

  // Manejar cambio de estado de una tarea
  const handleTaskStatusChange = (taskId, newStatus) => {
    const updatedTasks = updateTaskStatus(currentTasks, taskId, newStatus);
    setCurrentTasks(updatedTasks);
  };
  
  // Manejar la selección de un miembro del equipo para ver sus tareas
  const handleTeamMemberSelect = (memberId) => {
    setSelectedTeamMember(memberId);
    setCurrentView('kanban'); // Asegurarse de que la vista sea Kanban
  };
  
  // Determinar qué tareas mostrar en el tablero Kanban
  const getKanbanTasks = () => {
    // Si hay un miembro del equipo seleccionado, mostrar sus tareas
    if (selectedTeamMember) {
      return getTasksByUser(currentTasks, selectedTeamMember);
    }
    // Si no hay miembro seleccionado, mostrar las tareas del usuario logueado
    return getTasksByUser(currentTasks, user.id);
  };
  
  // Renderizar la vista actual
  const renderCurrentView = () => {
    // Añadimos un console.log para depurar el estado del usuario y la vista
    console.log("Rendering view:", currentView, "User:", user, "Selected Member:", selectedTeamMember);

    switch (currentView) {
      case 'kanban':
        return (
          <KanbanBoard 
            tasks={getKanbanTasks()} 
            onStatusChange={handleTaskStatusChange}
            clients={clients}
            users={users}
            selectedUser={selectedTeamMember ? users.find(u => u.id === selectedTeamMember) : user}
            currentUser={user}
            onClearSelection={() => setSelectedTeamMember(null)}
          />
        );
      case 'teams':
        return (
          <TeamManagement 
            teams={teams} 
            users={users} 
            currentUser={user}
            onSelectMember={handleTeamMemberSelect}
          />
        );
      case 'clients':
        return <ClientManagement clients={clients} currentUser={user} />;
      case 'reports':
        return (
          <Reports 
            tasks={currentTasks} 
            users={users} 
            teams={teams} 
            clients={clients}
            currentUser={user}
          />
        );
      case 'profile':
        return <UserProfile user={user} />;
      default:
        // Fallback seguro si currentView es un valor inesperado
        console.warn("Unexpected currentView:", currentView, "Defaulting to KanbanBoard.");
        return (
          <KanbanBoard 
            tasks={getKanbanTasks()} 
            onStatusChange={handleTaskStatusChange}
            clients={clients}
            users={users}
            selectedUser={user} // Por defecto, mostrar las tareas del usuario logueado
            currentUser={user}
            onClearSelection={() => setSelectedTeamMember(null)}
          />
        );
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar 
        currentView={currentView} 
        setCurrentView={setCurrentView}
        user={user}
      />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header 
          user={user} 
          onLogout={onLogout}
          teamMembers={teamMembers}
          selectedMember={selectedTeamMember}
          onSelectMember={handleTeamMemberSelect}
          onClearSelection={() => setSelectedTeamMember(null)}
        />
        
        <main className="flex-1 overflow-y-auto bg-gray-50 p-4">
          {renderCurrentView()}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
// DONE