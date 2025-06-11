import React, { useState } from 'react';
import KanbanBoard from './KanbanBoard';

const mockClientes = [
  { id: 'cliente_001', nombre: 'Cliente A' },
  { id: 'cliente_002', nombre: 'Cliente B' },
];

const mockTareas = [
  { id: 1, titulo: 'Enviar resumen', estado: 'Pendiente', clienteId: 'cliente_001' },
  { id: 2, titulo: 'Preparar DJ', estado: 'En Progreso', clienteId: 'cliente_001' },
  { id: 3, titulo: 'Facturar mes', estado: 'Pendiente', clienteId: 'cliente_002' },
  { id: 4, titulo: 'Llamar cliente', estado: 'Completada', clienteId: 'cliente_002' },
];

const ClientManagement = () => {
  const [clienteSeleccionado, setClienteSeleccionado] = useState(null);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Gestión de Clientes</h1>

      <div className="mb-4">
        <label className="mr-2 font-semibold">Seleccionar cliente:</label>
        <select
          value={clienteSeleccionado?.id || ''}
          onChange={(e) => {
            const cliente = mockClientes.find(c => c.id === e.target.value);
            setClienteSeleccionado(cliente);
          }}
          className="border p-1 rounded"
        >
          <option value="">-- Seleccionar --</option>
          {mockClientes.map(cliente => (
            <option key={cliente.id} value={cliente.id}>
              {cliente.nombre}
            </option>
          ))}
        </select>
      </div>

      {clienteSeleccionado && (
        <>
          <h2 className="text-xl font-semibold mb-2">Tareas de {clienteSeleccionado.nombre}</h2>
          <KanbanBoard tareas={mockTareas} clienteId={clienteSeleccionado.id} />
        </>
      )}
    </div>
  );
};

export default ClientManagement;