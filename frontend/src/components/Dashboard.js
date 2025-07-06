import React, { useState, useEffect, useCallback } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import KanbanBoard from "./KanbanBoard";
import TeamManagement from "./TeamManagement";
import ClientManagement from "./ClientManagement";
import Reports from "./Reports";
import UserProfile from "./UserProfile";
import { getUserTeamMembers } from "../utils/auth";
import { getTasksByUser } from "../utils/taskUtils";
import axios from "../axiosInstance";

const Dashboard = ({ user, onLogout }) => {
  const [currentView, setCurrentView] = useState("kanban");
  const [currentTasks, setCurrentTasks] = useState([]);
  const [currentUsers, setCurrentUsers] = useState([]);
  const [currentTeams, setCurrentTeams] = useState([]);
  const [currentClients, setCurrentClients] = useState([]);
  const [selectedTeamMember, setSelectedTeamMember] = useState(null);

  const loadInitialData = useCallback(async () => {
    try {
      const [tasksRes, clientsRes, usersRes] = await Promise.all([
        axios.get("/tareas"),
        axios.get("/clientes"),
        axios.get("/usuarios"),
      ]);
      setCurrentTasks(tasksRes.data);
      setCurrentClients(clientsRes.data);
      setCurrentUsers(usersRes.data);
      // const teamsRes = await axios.get("/equipos");
      // setCurrentTeams(teamsRes.data);
    } catch (err) {
      console.error("Error cargando datos iniciales:", err);
      if (err.response?.status === 401) onLogout();
    }
  }, [onLogout]);

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  const reloadTasks = async () => {
    try {
      const res = await axios.get("/tareas");
      setCurrentTasks(res.data);
    } catch (err) {
      console.error("Error recargando tareas:", err);
    }
  };

  const teamMembers = getUserTeamMembers(user, currentUsers, currentTeams);

  useEffect(() => {
    if (currentView !== "kanban") setSelectedTeamMember(null);
  }, [currentView]);

  const handleTaskStatusChange = async (taskId, newStatus) => {
    try {
      await axios.put(`/tareas/${taskId}`, { estado: newStatus });
      await reloadTasks();
    } catch (err) {
      console.error("Error cambiando estado:", err);
    }
  };

  const handleTeamMemberSelect = (memberId) => {
    setSelectedTeamMember(memberId);
    setCurrentView("kanban");
  };

  const handleAddClient = async (newClient) => {
    try {
      const res = await axios.post("/clientes", newClient);
      setCurrentClients((prev) => [...prev, res.data]);
    } catch (err) {
      console.error("Error añadiendo cliente:", err);
    }
  };

  const handleEditClient = async (updatedClient) => {
    try {
      const res = await axios.put(`/clientes/${updatedClient.id}`, updatedClient);
      setCurrentClients((prev) =>
        prev.map((c) => (c.id === res.data.id ? res.data : c))
      );
    } catch (err) {
      console.error("Error editando cliente:", err);
    }
  };

  const handleAddTeam = async (newTeam) => {};
  const handleEditTeam = async (team) => {};
  const handleDeleteTeam = async (id) => {};
  const handleAssignSupervisor = async (teamId, supervisorId) => {};
  const handleAddMember = async (newMember) => {};
  const handleEditMember = async (member) => {};
  const handleDeleteMember = async (id) => {};
  const handleAddTeamMember = async (memberId, teamId) => {};
  const handleRemoveTeamMember = async (memberId) => {};

  const getKanbanTasks = () => {
    if (selectedTeamMember)
      return getTasksByUser(currentTasks, selectedTeamMember);
    return getTasksByUser(currentTasks, user.id);
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case "kanban":
        return (
          <KanbanBoard
            tasks={getKanbanTasks()}
            onStatusChange={handleTaskStatusChange}
            clients={currentClients}
            users={currentUsers}
            selectedUser={
              selectedTeamMember
                ? currentUsers.find((u) => u.id === selectedTeamMember)
                : user
            }
            currentUser={user}
            onClearSelection={() => setSelectedTeamMember(null)}
          />
        );
      case "teams":
        return (
          <TeamManagement
            teams={currentTeams}
            users={currentUsers}
            currentUser={user}
            onSelectMember={handleTeamMemberSelect}
            onAddTeam={handleAddTeam}
            onEditTeam={handleEditTeam}
            onDeleteTeam={handleDeleteTeam}
            onAddMember={handleAddMember}
            onEditMember={handleEditMember}
            onDeleteMember={handleDeleteMember}
            onAddTeamMember={handleAddTeamMember}
            onRemoveTeamMember={handleRemoveTeamMember}
            onAssignSupervisor={handleAssignSupervisor}
          />
        );
      case "clients":
        return (
          <ClientManagement
            clients={currentClients}
            currentUser={user}
            onAddClient={handleAddClient}
            onEditClient={handleEditClient}
          />
        );
      case "reports":
        return (
          <Reports
            tasks={currentTasks}
            users={currentUsers}
            teams={currentTeams}
            clients={currentClients}
            currentUser={user}
          />
        );
      case "profile":
        return <UserProfile user={user} />;
      default:
        return (
          <KanbanBoard
            tasks={getKanbanTasks()}
            onStatusChange={handleTaskStatusChange}
            clients={currentClients}
            users={currentUsers}
            selectedUser={user}
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

