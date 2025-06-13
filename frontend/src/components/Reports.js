import React, { useState } from 'react';
import { generateTasksByUserReport, generateTasksByTeamReport, generateClientTasksReport } from '../utils/reportUtils';
import AIReportAssistant from './AIReportAssistant'; // Nuevo componente

const Reports = ({ tasks, users, teams, clients, currentUser }) => {
  const [activeTab, setActiveTab] = useState('users');
  
  // Generar informes
  const userTasksReport = generateTasksByUserReport(tasks, users, clients);
  const teamTasksReport = generateTasksByTeamReport(tasks, teams, users);
  const clientTasksReport = generateClientTasksReport(tasks, clients);
  
  // Filtrar usuarios según el rol
  const filteredUsers = currentUser.role === 'admin' 
    ? users 
    : users.filter(user => user.teamId === currentUser.teamId);
  
  // Filtrar equipos según el rol
  const filteredTeams = currentUser.role === 'admin' 
    ? teams 
    : teams.filter(team => team.supervisorId === currentUser.id);

  return (
    <div className="max-w-7xl mx-auto">
      <div className="pb-5 border-b border-gray-200">
        <h2 className="text-lg leading-6 font-medium text-gray-900">Informes</h2>
        <div className="mt-3">
          <nav className="flex space-x-4" aria-label="Tabs">
            <button
              onClick={() => setActiveTab('users')}
              className={`${
                activeTab === 'users'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-500 hover:text-gray-700'
              } px-3 py-2 font-medium text-sm rounded-md`}
            >
              Por Usuario
            </button>
            {(currentUser.role === 'admin' || currentUser.role === 'supervisor') && (
              <button
                onClick={() => setActiveTab('teams')}
                className={`${
                  activeTab === 'teams'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-500 hover:text-gray-700'
                } px-3 py-2 font-medium text-sm rounded-md`}
              >
                Por Equipo
              </button>
            )}
            <button
              onClick={() => setActiveTab('clients')}
              className={`${
                activeTab === 'clients'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-500 hover:text-gray-700'
              } px-3 py-2 font-medium text-sm rounded-md`}
            >
              Por Cliente
            </button>
            {(currentUser.role === 'admin' || currentUser.role === 'supervisor') && (
              <button
                onClick={() => setActiveTab('ai-assistant')}
                className={`${
                  activeTab === 'ai-assistant'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-500 hover:text-gray-700'
                } px-3 py-2 font-medium text-sm rounded-md`}
              >
                Asistente IA
              </button>
            )}
          </nav>
        </div>
      </div>
      
      <div className="mt-8">
        {activeTab === 'users' && (
          <div className="space-y-8">
            {filteredUsers.map((user) => {
              const report = userTasksReport[user.id];
              if (!report) return null;
              
              return (
                <div key={user.id} className="bg-white shadow rounded-lg overflow-hidden">
                  <div className="px-4 py-5 sm:px-6 flex items-center">
                    <img
                      className="h-10 w-10 rounded-full mr-4"
                      src={user.avatar || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"}
                      alt={user.name}
                    />
                    <div>
                      <h3 className="text-lg leading-6 font-medium text-gray-900">{user.name}</h3>
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                  </div>
                  
                  <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
                    <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2 md:grid-cols-4">
                      <div className="sm:col-span-1">
                        <dt className="text-sm font-medium text-gray-500">Total de tareas</dt>
                        <dd className="mt-1 text-3xl font-semibold text-gray-900">{report.totalTasks}</dd>
                      </div>
                      <div className="sm:col-span-1">
                        <dt className="text-sm font-medium text-gray-500">Completadas</dt>
                        <dd className="mt-1 text-3xl font-semibold text-green-600">{report.completedTasks}</dd>
                      </div>
                      <div className="sm:col-span-1">
                        <dt className="text-sm font-medium text-gray-500">Pendientes</dt>
                        <dd className="mt-1 text-3xl font-semibold text-yellow-600">{report.pendingTasks + report.inProgressTasks + report.reviewTasks}</dd>
                      </div>
                      <div className="sm:col-span-1">
                        <dt className="text-sm font-medium text-gray-500">Vencidas</dt>
                        <dd className="mt-1 text-3xl font-semibold text-red-600">{report.overdueTasks}</dd>
                      </div>
                    </dl>
                  </div>
                  
                  <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
                    <h4 className="text-sm font-medium text-gray-900 mb-4">Tareas por cliente</h4>
                    <div className="space-y-4">
                      {Object.values(report.tasksByClient).map((clientData, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <span className="text-sm text-gray-500">{clientData.clientName}</span>
                          <span className="text-sm font-medium text-gray-900">{clientData.count} tareas</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
        
        {activeTab === 'teams' && (
          <div className="space-y-8">
            {filteredTeams.map((team) => {
              const report = teamTasksReport[team.id];
              if (!report) return null;
              
              return (
                <div key={team.id} className="bg-white shadow rounded-lg overflow-hidden">
                  <div className="px-4 py-5 sm:px-6">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">{team.name}</h3>
                    <p className="mt-1 max-w-2xl text-sm text-gray-500">{team.description}</p>
                  </div>
                  
                  <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
                    <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2 md:grid-cols-4">
                      <div className="sm:col-span-1">
                        <dt className="text-sm font-medium text-gray-500">Total de tareas</dt>
                        <dd className="mt-1 text-3xl font-semibold text-gray-900">{report.totalTasks}</dd>
                      </div>
                      <div className="sm:col-span-1">
                        <dt className="text-sm font-medium text-gray-500">Completadas</dt>
                        <dd className="mt-1 text-3xl font-semibold text-green-600">{report.completedTasks}</dd>
                      </div>
                      <div className="sm:col-span-1">
                        <dt className="text-sm font-medium text-gray-500">Pendientes</dt>
                        <dd className="mt-1 text-3xl font-semibold text-yellow-600">{report.pendingTasks + report.inProgressTasks + report.reviewTasks}</dd>
                      </div>
                      <div className="sm:col-span-1">
                        <dt className="text-sm font-medium text-gray-500">Vencidas</dt>
                        <dd className="mt-1 text-3xl font-semibold text-red-600">{report.overdueTasks}</dd>
                      </div>
                    </dl>
                  </div>
                  
                  <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
                    <h4 className="text-sm font-medium text-gray-900 mb-4">Rendimiento por miembro</h4>
                    <div className="space-y-4">
                      {Object.values(report.memberPerformance).map((memberData, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <span className="text-sm text-gray-500">{memberData.memberName}</span>
                          <div className="text-sm">
                            <span className="font-medium text-gray-900">{memberData.completedTasks}</span>
                            <span className="text-gray-500"> / {memberData.totalTasks} completadas</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
        
        {activeTab === 'clients' && (
          <div className="space-y-8">
            {clients.map((client) => {
              const report = clientTasksReport[client.id];
              if (!report) return null;
              
              return (
                <div key={client.id} className="bg-white shadow rounded-lg overflow-hidden">
                  <div className="px-4 py-5 sm:px-6">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">{client.name}</h3>
                    <p className="mt-1 max-w-2xl text-sm text-gray-500">{client.contactName} - {client.email}</p>
                  </div>
                  
                  <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
                    <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2 md:grid-cols-4">
                      <div className="sm:col-span-1">
                        <dt className="text-sm font-medium text-gray-500">Total de tareas</dt>
                        <dd className="mt-1 text-3xl font-semibold text-gray-900">{report.totalTasks}</dd>
                      </div>
                      <div className="sm:col-span-1">
                        <dt className="text-sm font-medium text-gray-500">Completadas</dt>
                        <dd className="mt-1 text-3xl font-semibold text-green-600">{report.completedTasks}</dd>
                      </div>
                      <div className="sm:col-span-1">
                        <dt className="text-sm font-medium text-gray-500">Pendientes</dt>
                        <dd className="mt-1 text-3xl font-semibold text-yellow-600">{report.pendingTasks + report.inProgressTasks + report.reviewTasks}</dd>
                      </div>
                      <div className="sm:col-span-1">
                        <dt className="text-sm font-medium text-gray-500">Vencidas</dt>
                        <dd className="mt-1 text-3xl font-semibold text-red-600">{report.overdueTasks}</dd>
                      </div>
                    </dl>
                  </div>
                  
                  <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
                    <h4 className="text-sm font-medium text-gray-900 mb-4">Estado de tareas</h4>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div className="flex h-2.5 rounded-full overflow-hidden">
                        <div 
                          className="bg-green-500" 
                          style={{ width: `${(report.completedTasks / report.totalTasks) * 100}%` }}
                        ></div>
                        <div 
                          className="bg-yellow-500" 
                          style={{ width: `${(report.reviewTasks / report.totalTasks) * 100}%` }}
                        ></div>
                        <div 
                          className="bg-blue-500" 
                          style={{ width: `${(report.inProgressTasks / report.totalTasks) * 100}%` }}
                        ></div>
                        <div 
                          className="bg-gray-500" 
                          style={{ width: `${(report.pendingTasks / report.totalTasks) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className="flex justify-between text-xs mt-2">
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-green-500 rounded-full mr-1"></div>
                        <span>Completadas ({report.completedTasks})</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-yellow-500 rounded-full mr-1"></div>
                        <span>En revisión ({report.reviewTasks})</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-blue-500 rounded-full mr-1"></div>
                        <span>En progreso ({report.inProgressTasks})</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-gray-500 rounded-full mr-1"></div>
                        <span>Pendientes ({report.pendingTasks})</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {activeTab === 'ai-assistant' && (
          <AIReportAssistant 
            tasks={tasks} 
            users={users} 
            teams={teams} 
            clients={clients} 
            currentUser={currentUser} 
            userTasksReport={userTasksReport}
            teamTasksReport={teamTasksReport}
            clientTasksReport={clientTasksReport}
          />
        )}
      </div>
    </div>
  );
};

export default Reports;