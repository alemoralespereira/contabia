import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import KanbanBoard from './KanbanBoard';
import TeamManagement from './TeamManagement';
import ClientManagement from './ClientManagement';
import Reports from './Reports';
import UserProfile from './UserProfile';
import { tasks as initialTasks } from '../mock/tasks';
import { users as initialUsers } from '../mock/users'; // Renombrado para evitar conflicto
import { teams as initialTeams } from '../mock/users'; // Renombrado para evitar conflicto
import { accounts } from '../mock/users';
import { clients as initialClients } from '../mock/clients'; // Renombrado para evitar conflicto
import { getUserTeamMembers } from '../utils/auth';
import { getTasksByUser, updateTaskStatus } from '../utils/taskUtils';

const Dashboard = ({ user, onLogout }) => {
  const [currentView, setCurrentView] = useState('kanban');
  const [currentTasks, setCurrentTasks] = useState(initialTasks);
  const [currentUsers, setCurrentUsers] = useState(initialUsers);
  const [currentTeams, setCurrentTeams] = useState(initialTeams);
  const [currentClients, setCurrentClients] = useState(initialClients);
  const [selectedTeamMember, setSelectedTeamMember] = useState(null);
  
  // Obtener miembros del equipo si el user es supervisor o admin
  const teamMembers = getUserTeamMembers(user, Array.isArray(currentUsers) ? currentUsers : [], Array.isArray(currentTeams) ? currentTeams : []);
  
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

  // Funciones de administración para Clientes
  const handleAddClient = (newClient) => {
    setCurrentClients(prevClients => [...prevClients, { ...newClient, id: prevClients.length + 1 }]);
  };

  const handleEditClient = (updatedClient) => {
    setCurrentClients(prevClients => prevClients.map(client => 
      client.id === updatedClient.id ? updatedClient : client
    ));
  };

  // Funciones de administración para Equipos
  const handleAddTeam = (newTeam) => {
    setCurrentTeams(prevTeams => [...prevTeams, { ...newTeam, id: prevTeams.length + 1 }]);
  };

  const handleEditTeam = (updatedTeam) => {
    setCurrentTeams(prevTeams => prevTeams.map(team => 
      team.id === updatedTeam.id ? updatedTeam : team
    ));
  };

  const handleDeleteTeam = (teamId) => {
    setCurrentTeams(prevTeams => prevTeams.filter(team => team.id !== teamId));
    setCurrentUsers(prevUsers => prevUsers.map(user => 
      user.teamId === teamId ? { ...user, teamId: null } : user
    ));
  };

  const handleAssignSupervisor = (teamId, supervisorId) => {
    setCurrentTeams(prevTeams => prevTeams.map(team => 
      team.id === teamId ? { ...team, supervisorId: supervisorId } : team
    ));
  };

  // Funciones de administración para Miembros
  const handleAddMember = (newMember) => {
    // Generar un ID único para el nuevo miembro
    const newId = Math.max(...currentUsers.map(u => u.id)) + 1;
    const memberWithId = { ...newMember, id: newId };
    setCurrentUsers(prevUsers => [...prevUsers, memberWithId]);
    return memberWithId; // Devolver el miembro con su ID
  };

  const handleEditMember = (updatedMember) => {
    setCurrentUsers(prevUsers => prevUsers.map(member => 
      member.id === updatedMember.id ? updatedMember : member
    ));
  };

  const handleDeleteMember = (memberId) => {
    setCurrentUsers(prevUsers => prevUsers.filter(member => member.id !== memberId));
    setCurrentTasks(prevTasks => prevTasks.map(task => 
      task.assigneeId === memberId ? { ...task, assigneeId: null } : task
    ));
  };

  const handleAddTeamMember = (memberId, teamId) => {
    setCurrentUsers(prevUsers => prevUsers.map(user => 
      user.id === memberId ? { ...user, teamId: teamId } : user
    ));
  };

  const handleRemoveTeamMember = (memberId) => {
    setCurrentUsers(prevUsers => prevUsers.map(user => 
      user.id === memberId ? { ...user, teamId: null } : user
    ));
  };
  
  // Determinar qué tareas mostrar en el tablero Kanban
  const getKanbanTasks = () => {
    // Aseguramos que currentTasks sea un array antes de filtrar
    const tasksToFilter = Array.isArray(currentTasks) ? currentTasks : [];

    // Si hay un miembro del equipo seleccionado, mostrar sus tareas
    if (selectedTeamMember) {
      return getTasksByUser(tasksToFilter, selectedTeamMember);
    }
    // Si no hay miembro seleccionado, mostrar las tareas del user logueado
    return getTasksByUser(tasksToFilter, user.id);
  };
  
  // Renderizar la vista actual
  const renderCurrentView = () => {
    // Añadimos console.log para depurar el estado del user y la vista
    console.log("Dashboard: Rendering view:", currentView, "User:", user, "Selected Member:", selectedTeamMember);
    console.log("Dashboard: currentTasks length:", currentTasks.length);
    console.log("Dashboard: currentUsers length:", currentUsers.length);
    console.log("Dashboard: currentClients length:", currentClients.length);
    console.log("Dashboard: currentTeams length:", currentTeams.length);


    switch (currentView) {
      case 'kanban':
        return (
          <KanbanBoard 
            tasks={getKanbanTasks()} 
            onStatusChange={handleTaskStatusChange}
            clients={currentClients} 
            users={currentUsers}       
            selectedUser={selectedTeamMember ? currentUsers.find(u => u.id === selectedTeamMember) : user}
            currentUser={user}
            onClearSelection={() => setSelectedTeamMember(null)}
          />
        );
      case 'teams':
        return (
          <TeamManagement 
            teams={currentTeams} 
            users={currentUsers} 
            currentUser={user}
            onSelectMember={handleTeamMemberSelect}
            onAddTeam={handleAddTeam}
            onEditTeam={handleEditTeam}
            onDeleteTeam={handleDeleteTeam}
            onAddMember={handleAddMember} // Pasamos la función de agregar miembro
            onEditMember={handleEditMember}
            onDeleteMember={handleDeleteMember}
            onAddTeamMember={handleAddTeamMember} // Pasamos la función de asignar miembro a equipo
            onRemoveTeamMember={handleRemoveTeamMember}
            onAssignSupervisor={handleAssignSupervisor}
          />
        );
      case 'clients':
        return (
          <ClientManagement 
            clients={currentClients} 
            currentUser={user} 
            onAddClient={handleAddClient}
            onEditClient={handleEditClient}
          />
        );
      case 'reports':
        return (
          <Reports 
            tasks={currentTasks} 
            users={currentUsers} 
            teams={currentTeams} 
            clients={currentClients}
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
            clients={currentClients}
            users={currentUsers}
            selectedUser={user} // Por defecto, mostrar las tareas del user logueado
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