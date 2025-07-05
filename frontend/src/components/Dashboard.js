import React, { useState, useEffect, useCallback } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import KanbanBoard from "./KanbanBoard";
import TeamManagement from "./TeamManagement";
import ClientManagement from "./ClientManagement";
import Reports from "./Reports";
import UserProfile from "./UserProfile";
import { getUserTeamMembers } from "../utils/auth";
import { getTasksByUser, updateTaskStatus } from "../utils/taskUtils";

const API = process.env.REACT_APP_API_URL; // https://contabia-backend.onrender.com

/** Utilidad genérica para llamadas fetch con token */
const fetchWithAuth = async (url, options = {}) => {
  const token = localStorage.getItem("token");
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
    ...options.headers,
  };
  const res = await fetch(url, { ...options, headers });
  if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`);
  return res.json();
};

const Dashboard = ({ user, onLogout }) => {
  // ---------------- Estado ----------------
  const [currentView, setCurrentView] = useState("kanban");
  const [currentTasks, setCurrentTasks] = useState([]);
  const [currentUsers, setCurrentUsers] = useState([]);
  const [currentTeams, setCurrentTeams] = useState([]);
  const [currentClients, setCurrentClients] = useState([]);
  const [selectedTeamMember, setSelectedTeamMember] = useState(null);

  // ---------------- Cargar datos desde el backend ----------------
  const loadInitialData = useCallback(async () => {
    try {
      const [tasks, clients, users] = await Promise.all([
        fetchWithAuth(`${API}/tareas`),
        fetchWithAuth(`${API}/clientes`),
        fetchWithAuth(`${API}/usuarios`), // solo admin verá la lista completa
      ]);
      setCurrentTasks(tasks);
      setCurrentClients(clients);
      setCurrentUsers(users);
      // (Opcional) Cargar teams si implementas endpoint /teams
      // const teams = await fetchWithAuth(`${API}/teams`);
      // setCurrentTeams(teams);
    } catch (err) {
      console.error("Error cargando datos iniciales:", err);
      if (err.message.includes("401")) onLogout(); // token expirado
    }
  }, [onLogout]);

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  // Obtener miembros del equipo (de utilidades)
  const teamMembers = getUserTeamMembers(user, currentUsers, currentTeams);

  // Reset selección de miembro al cambiar vista
  useEffect(() => {
    if (currentView !== "kanban") setSelectedTeamMember(null);
  }, [currentView]);

  // ---------------- Handlers de estado local y API ----------------
  // Actualizar estado de una tarea
  const handleTaskStatusChange = async (taskId, newStatus) => {
    try {
      await fetchWithAuth(`${API}/tareas/${taskId}`, {
        method: "PUT",
        body: JSON.stringify({ estado: newStatus }),
      });
      // Refrescar lista local
      setCurrentTasks((prev) => updateTaskStatus(prev, taskId, newStatus));
    } catch (err) {
      console.error("Error cambiando estado:", err);
    }
  };

  // Seleccionar miembro del equipo
  const handleTeamMemberSelect = (memberId) => {
    setSelectedTeamMember(memberId);
    setCurrentView("kanban");
  };

  // ---------- Clientes ----------
  const handleAddClient = async (newClient) => {
    try {
      const created = await fetchWithAuth(`${API}/clientes`, {
        method: "POST",
        body: JSON.stringify(newClient),
      });
      setCurrentClients((prev) => [...prev, created]);
    } catch (err) {
      console.error("Error añadiendo cliente:", err);
    }
  };

  const handleEditClient = async (updatedClient) => {
    try {
      const res = await fetchWithAuth(`${API}/clientes/${updatedClient.id}`, {
        method: "PUT",
        body: JSON.stringify(updatedClient),
      });
      setCurrentClients((prev) =>
        prev.map((c) => (c.id === res.id ? res : c))
      );
    } catch (err) {
      console.error("Error editando cliente:", err);
    }
  };

  // ---------- Teams & Users ----------
  // Aquí solo dejo stubs; implementarás endpoints /teams y /usuarios según necesites
  const handleAddTeam = async (newTeam) => {/* ... */};
  const handleEditTeam = async (team) => {/* ... */};
  const handleDeleteTeam = async (id) => {/* ... */};
  const handleAssignSupervisor = async (teamId, supervisorId) => {/* ... */};

  const handleAddMember = async (newMember) => {/* ... */};
  const handleEditMember = async (member) => {/* ... */};
  const handleDeleteMember = async (id) => {/* ... */};
  const handleAddTeamMember = async (memberId, teamId) => {/* ... */};
  const handleRemoveTeamMember = async (memberId) => {/* ... */};

  // ---------------- Helpers ----------------
  const getKanbanTasks = () => {
    const list = currentTasks || [];
    if (selectedTeamMember) return getTasksByUser(list, selectedTeamMember);
    return getTasksByUser(list, user.id);
  };

  // ---------------- Render principal ----------------
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
