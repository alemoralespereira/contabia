import React from 'react';
import Logo from './Logo';

const Sidebar = ({ currentView, setCurrentView, user }) => {
  const navItems = [
    { id: 'kanban', label: 'Tablero Kanban', icon: (
      <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
    )},
    { id: 'teams', label: 'Equipos', icon: (
      <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ), roles: ['admin', 'supervisor'] },
    { id: 'clients', label: 'Clientes', icon: (
      <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ), roles: ['admin'] }, // Solo admin puede ver clientes
    { id: 'reports', label: 'Informes', icon: (
      <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ), roles: ['admin', 'supervisor'] }
  ];

  // Filtrar elementos de navegación según el rol del user
  const filteredNavItems = navItems.filter(item => {
    if (!item.roles) return true; // Si no tiene restricción de roles, mostrar para todos
    return item.roles.includes(user.rol);
  });

  return (
    <div className="bg-white w-64 flex-shrink-0 border-r border-gray-200">
      <div className="p-4 flex items-center">
        <Logo />
      </div>
      
      <nav className="mt-5 px-2">
        <div className="space-y-1">
          {filteredNavItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setCurrentView(item.id)}
              className={`${
                currentView === item.id
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              } group flex items-center px-2 py-2 text-base font-medium rounded-md w-full`}
            >
              <div className={`${
                currentView === item.id ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-500'
              } mr-3`}>
                {item.icon}
              </div>
              {item.label}
            </button>
          ))}
        </div>
      </nav>
      
      <div className="px-2 mt-8">
        <button
          onClick={() => setCurrentView('profile')}
          className={`${
            currentView === 'profile'
              ? 'bg-blue-50 text-blue-600'
              : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
          } group flex items-center px-2 py-2 text-base font-medium rounded-md w-full`}
        >
          <div className={`${
            currentView === 'profile' ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-500'
          } mr-3`}>
            <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          Mi Perfil
        </button>
      </div>
    </div>
  );
};

export default Sidebar;