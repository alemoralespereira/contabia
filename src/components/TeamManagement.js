import React from 'react';

const TeamManagement = ({ teams, users, currentUser, onSelectMember }) => {
  // Filtrar equipos según el rol del usuario
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

  return (
    <div className="max-w-7xl mx-auto">
      <div className="pb-5 border-b border-gray-200 sm:flex sm:items-center sm:justify-between">
        <h2 className="text-lg leading-6 font-medium text-gray-900">Equipos de Trabajo</h2>
        {currentUser.role === 'admin' && (
          <div className="mt-3 sm:mt-0 sm:ml-4">
            <button
              type="button"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Crear Equipo
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
              
              <div className="px-4 py-3 sm:px-6 border-b border-gray-200 bg-gray-50">
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
                        <button
                          onClick={() => onSelectMember(member.id)}
                          className="ml-2 inline-flex items-center px-2.5 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          Ver tareas
                        </button>
                      </li>
                    ))
                  ) : (
                    <li className="py-3 text-sm text-gray-500">No hay miembros en este equipo</li>
                  )}
                </ul>
              </div>
              
              {currentUser.role === 'admin' && (
                <div className="px-4 py-4 sm:px-6 bg-gray-50 border-t border-gray-200">
                  <button
                    type="button"
                    className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Editar equipo
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
    </div>
  );
};

export default TeamManagement;