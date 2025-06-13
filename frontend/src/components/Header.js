import React, { useState } from 'react';
import { users } from '../mock/users'; // Importar users para buscar el nombre del miembro

const Header = ({ user, onLogout, teamMembers, selectedMember, onSelectMember, onClearSelection }) => {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isTeamMenuOpen, setIsTeamMenuOpen] = useState(false);
  
  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
    if (isTeamMenuOpen) setIsTeamMenuOpen(false);
  };
  
  const toggleTeamMenu = () => {
    setIsTeamMenuOpen(!isTeamMenuOpen);
    if (isUserMenuOpen) setIsUserMenuOpen(false);
  };
  
  const handleSelectMember = (memberId) => {
    onSelectMember(memberId);
    setIsTeamMenuOpen(false);
  };

  return (
    <header className="bg-white shadow-sm z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <h1 className="text-xl font-semibold text-gray-900">
              {selectedMember ? (
                <div className="flex items-center">
                  <button 
                    onClick={onClearSelection}
                    className="mr-2 text-gray-400 hover:text-gray-500"
                  >
                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  Tareas de {Array.isArray(users) && users.find(u => u.id === selectedMember)?.name || 'Usuario'}
                </div>
              ) : (
                'Mi Tablero'
              )}
            </h1>
          </div>
          
          <div className="flex items-center">
            {/* Selector de miembro del equipo (solo para supervisores y admins) */}
            {(user.role === 'supervisor' || user.role === 'admin') && Array.isArray(teamMembers) && teamMembers.length > 0 && (
              <div className="relative mr-4">
                <button
                  onClick={toggleTeamMenu}
                  className="flex items-center text-sm font-medium text-gray-700 hover:text-gray-900"
                >
                  <span>Ver tareas del equipo</span>
                  <svg className="ml-1 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
                
                {isTeamMenuOpen && (
                  <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                    <div className="py-1" role="menu" aria-orientation="vertical">
                      {teamMembers.map((member) => (
                        <button
                          key={member.id}
                          onClick={() => handleSelectMember(member.id)}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          role="menuitem"
                        >
                          {member.name}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
            
            {/* Menú de user */}
            <div className="relative">
              <button
                onClick={toggleUserMenu}
                className="flex items-center max-w-xs text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <span className="sr-only">Abrir menú de user</span>
                <img
                  className="h-8 w-8 rounded-full"
                  src={user.avatar || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"}
                  alt={user.name}
                />
                <span className="ml-2 text-gray-700">{user.name}</span>
                <svg className="ml-1 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
              
              {isUserMenuOpen && (
                <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                  <div className="py-1" role="menu" aria-orientation="vertical">
                    <div className="block px-4 py-2 text-sm text-gray-900 border-b">
                      <div className="font-medium">{user.name}</div>
                      <div className="text-gray-500">{user.email}</div>
                    </div>
                    <button
                      onClick={onLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      role="menuitem"
                    >
                      Cerrar sesión
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;