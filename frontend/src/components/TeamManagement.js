import React, { useState } from 'react';
import MemberForm from './MemberForm'; // Importar MemberForm

const TeamManagement = ({ 
  teams, 
  users, 
  currentUser, 
  onSelectMember, 
  onAddTeam, 
  onEditTeam, 
  onDeleteTeam, 
  onAddMember, 
  onEditMember, 
  onDeleteMember, 
  onAddTeamMember, 
  onRemoveTeamMember, 
  onAssignSupervisor 
}) => {
  const [showAddTeamModal, setShowAddTeamModal] = useState(false);
  const [showEditTeamModal, setShowEditTeamModal] = useState(false);
  const [showAssignSupervisorModal, setShowAssignSupervisorModal] = useState(false);
  const [showAddMemberModal, setShowAddMemberModal] = useState(false); 
  const [showEditMemberModal, setShowEditMemberModal] = useState(false); 
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [selectedMember, setSelectedMember] = useState(null); 
  const [newTeamName, setNewTeamName] = useState('');
  const [newTeamDescription, setNewTeamDescription] = useState('');
  const [selectedSupervisorId, setSelectedSupervisorId] = useState('');
  const [selectedTeamForNewMember, setSelectedTeamForNewMember] = useState(null); 

  // Filtrar equipos según el rol del user
  const filteredTeams = currentUser.role === 'admin' 
    ? teams 
    : teams.filter(team => team.supervisorId === currentUser.id);
  
  // Obtener miembros de un equipo
  const getTeamMembers = (teamId) => {
    return users.filter(user => user.teamId === teamId);
  };
  
  // Obtener supervisor de un equipo
  const getTeamSupervisor = (supervisorId) => {
    return users.find(user => user.id === supervisorId);
  };

  const handleCreateTeam = () => {
    if (newTeamName.trim()) {
      onAddTeam({ name: newTeamName, description: newTeamDescription, accountId: currentUser.accountId });
      setNewTeamName('');
      setNewTeamDescription('');
      setShowAddTeamModal(false);
    }
  };

  const handleEditTeamClick = (team) => {
    setSelectedTeam(team);
    setNewTeamName(team.name);
    setNewTeamDescription(team.description);
    setShowEditTeamModal(true);
  };

  const handleUpdateTeam = () => {
    if (selectedTeam && newTeamName.trim()) {
      onEditTeam({ ...selectedTeam, name: newTeamName, description: newTeamDescription });
      setShowEditTeamModal(false);
      setSelectedTeam(null);
    }
  };

  const handleAssignSupervisorClick = (team) => {
    setSelectedTeam(team);
    setSelectedSupervisorId(team.supervisorId || '');
    setShowAssignSupervisorModal(true);
  };

  const handleUpdateSupervisor = () => {
    if (selectedTeam && selectedSupervisorId) {
      onAssignSupervisor(selectedTeam.id, parseInt(selectedSupervisorId));
      setShowAssignSupervisorModal(false);
      setSelectedTeam(null);
      setSelectedSupervisorId('');
    }
  };

  const handleAddMemberToTeamClick = (teamId) => {
    setSelectedTeamForNewMember(teamId);
    setShowAddMemberModal(true);
  };

  const handleSaveNewMember = (newMemberData) => {
    const addedMember = onAddMember(newMemberData); 
    if (selectedTeamForNewMember && addedMember) {
      onAddTeamMember(addedMember.id, selectedTeamForNewMember); 
    }
    setShowAddMemberModal(false);
    setSelectedTeamForNewMember(null);
  };

  const handleEditMemberClick = (member) => {
    setSelectedMember(member);
    setShowEditMemberModal(true);
  };

  const handleSaveEditedMember = (updatedMemberData) => {
    onEditMember(updatedMemberData);
    setShowEditMemberModal(false);
    setSelectedMember(null);
  };

  const availableSupervisors = users.filter(user => user.role === 'supervisor' || user.role === 'admin');
  const availableMembers = users.filter(user => user.teamId === null); 

  return (
    <div className="max-w-7xl mx-auto">
      <div className="pb-5 border-b border-gray-200 sm:flex sm:items-center sm:justify-between">
        <h2 className="text-lg leading-6 font-medium text-gray-900">Gestión de Equipos y Miembros</h2>
        {currentUser.role === 'admin' && (
          <div className="mt-3 sm:mt-0 sm:ml-4 flex space-x-2">
            <button
              type="button"
              onClick={() => setShowAddTeamModal(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Crear Equipo
            </button>
            <button
              type="button"
              onClick={() => {
                setSelectedTeamForNewMember(null); 
                setShowAddMemberModal(true);
              }} 
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              Agregar Nuevo Miembro
            </button>
          </div>
        )}
      </div>
      
      <div className="mt-8 grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {filteredTeams.map((team) => {
          const teamMembers = getTeamMembers(team.id);
          const supervisor = getTeamSupervisor(team.supervisorId);
          
          return (
            <div key={team.id} className="bg-white shadow rounded-lg overflow-hidden">
              <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                <h3 className="text-lg leading-6 font-medium text-gray-900">{team.name}</h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">{team.description}</p>
              </div>
              
              <div className="px-4 py-3 sm:px-6 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
                <div className="flex items-center">
                  <img
                    className="h-8 w-8 rounded-full"
                    src={supervisor?.avatar || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"}
                    alt={supervisor?.name || 'Supervisor'}
                  />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">{supervisor?.name || 'Sin supervisor'}</p>
                    <p className="text-xs text-gray-500">Supervisor</p>
                  </div>
                </div>
                {currentUser.role === 'admin' && (
                  <button
                    onClick={() => handleAssignSupervisorClick(team)}
                    className="text-blue-600 hover:text-blue-900 text-sm"
                  >
                    Asignar/Cambiar
                  </button>
                )}
              </div>
              
              <div className="px-4 py-5 sm:p-6">
                <h4 className="text-sm font-medium text-gray-900 mb-3">Miembros del equipo</h4>
                <ul className="divide-y divide-gray-200">
                  {teamMembers.length > 0 ? (
                    teamMembers.map((member) => (
                      <li key={member.id} className="py-3 flex justify-between items-center">
                        <div className="flex items-center">
                          <img
                            className="h-8 w-8 rounded-full"
                            src={member.avatar || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"}
                            alt={member.name}
                          />
                          <div className="ml-3">
                            <p className="text-sm font-medium text-gray-900">{member.name}</p>
                            <p className="text-xs text-gray-500">{member.email}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => onSelectMember(member.id)}
                            className="inline-flex items-center px-2.5 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                          >
                            Ver tareas
                          </button>
                          {currentUser.role === 'admin' && (
                            <>
                              <button
                                onClick={() => handleEditMemberClick(member)}
                                className="inline-flex items-center px-2.5 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                              >
                                Editar
                              </button>
                              <button
                                onClick={() => onDeleteMember(member.id)}
                                className="inline-flex items-center px-2.5 py-1.5 border border-red-300 shadow-sm text-xs font-medium rounded text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                              >
                                Eliminar
                              </button>
                            </>
                          )}
                        </div>
                      </li>
                    ))
                  ) : (
                    <li className="py-3 text-sm text-gray-500">No hay miembros en este equipo</li>
                  )}
                </ul>
                {currentUser.role === 'admin' && (
                  <div className="mt-4">
                    <h5 className="text-sm font-medium text-gray-900 mb-2">Agregar miembro existente</h5>
                    <select
                      onChange={(e) => onAddTeamMember(parseInt(e.target.value), team.id)}
                      className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                    >
                      <option value="">Seleccionar miembro sin equipo</option>
                      {availableMembers.map(member => (
                        <option key={member.id} value={member.id}>{member.name}</option>
                      ))}
                    </select>
                    <button
                      onClick={() => handleAddMemberToTeamClick(team.id)}
                      className="mt-2 inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                    >
                      Crear y Agregar Nuevo Miembro
                    </button>
                  </div>
                )}
              </div>
              
              {currentUser.role === 'admin' && (
                <div className="px-4 py-4 sm:px-6 bg-gray-50 border-t border-gray-200 flex justify-end space-x-3">
                  <button
                    onClick={() => handleEditTeamClick(team)}
                    className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => onDeleteTeam(team.id)}
                    className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    Eliminar
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
      
      {filteredTeams.length === 0 && (
        <div className="text-center mt-8">
          <svg className="mx-auto h-12 w-12 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No hay equipos disponibles</h3>
          <p className="mt-1 text-sm text-gray-500">
            {currentUser.role === 'admin' 
              ? 'Comienza creando un nuevo equipo de trabajo.' 
              : 'No tienes equipos asignados como supervisor.'}
          </p>
          {currentUser.role === 'admin' && (
            <div className="mt-6">
              <button
                type="button"
                onClick={() => setShowAddTeamModal(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                Crear Equipo
              </button>
            </div>
          )}
        </div>
      )}

      {/* Modal para Crear Equipo */}
      {showAddTeamModal && (
        <div className="fixed z-10 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                  Crear Nuevo Equipo
                </h3>
                <div className="mt-2">
                  <input
                    type="text"
                    placeholder="Nombre del equipo"
                    value={newTeamName}
                    onChange={(e) => setNewTeamName(e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                  <textarea
                    placeholder="Descripción del equipo"
                    value={newTeamDescription}
                    onChange={(e) => setNewTeamDescription(e.target.value)}
                    rows="3"
                    className="mt-3 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:focus:border-blue-500 sm:text-sm"
                  ></textarea>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={handleCreateTeam}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Crear
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddTeamModal(false)}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal para Editar Equipo */}
      {showEditTeamModal && selectedTeam && (
        <div className="fixed z-10 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                  Editar Equipo
                </h3>
                <div className="mt-2">
                  <input
                    type="text"
                    placeholder="Nombre del equipo"
                    value={newTeamName}
                    onChange={(e) => setNewTeamName(e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                  <textarea
                    placeholder="Descripción del equipo"
                    value={newTeamDescription}
                    onChange={(e) => setNewTeamDescription(e.target.value)}
                    rows="3"
                    className="mt-3 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  ></textarea>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={handleUpdateTeam}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Guardar Cambios
                </button>
                <button
                  type="button"
                  onClick={() => setShowEditTeamModal(false)}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal para Asignar Supervisor */}
      {showAssignSupervisorModal && selectedTeam && (
        <div className="fixed z-10 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                  Asignar Supervisor a {selectedTeam.name}
                </h3>
                <div className="mt-2">
                  <select
                    value={selectedSupervisorId}
                    onChange={(e) => setSelectedSupervisorId(e.target.value)}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                  >
                    <option value="">Seleccionar Supervisor</option>
                    {availableSupervisors.map(supervisor => (
                      <option key={supervisor.id} value={supervisor.id}>{supervisor.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={handleUpdateSupervisor}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Asignar
                </button>
                <button
                  type="button"
                  onClick={() => setShowAssignSupervisorModal(false)}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal para Agregar Nuevo Miembro */}
      {showAddMemberModal && (
        <div className="fixed z-10 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                  Agregar Nuevo Miembro
                </h3>
                <MemberForm 
                  member={null} 
                  onSave={handleSaveNewMember} 
                  onCancel={() => setShowAddMemberModal(false)} 
                  teams={teams} 
                  isNewMember={true}
                  initialTeamId={selectedTeamForNewMember}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal para Editar Miembro */}
      {showEditMemberModal && selectedMember && (
        <div className="fixed z-10 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                  Editar Miembro
                </h3>
                <MemberForm 
                  member={selectedMember} 
                  onSave={handleSaveEditedMember} 
                  onCancel={() => setShowEditMemberModal(false)} 
                  teams={teams} 
                  isNewMember={false}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamManagement;