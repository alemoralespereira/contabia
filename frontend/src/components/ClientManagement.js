import React, { useEffect, useState } from 'react';
import KanbanBoard from './KanbanBoard';

const API_URL = process.env.REACT_APP_API_URL;

const ClientManagement = () => {
  const [clientes, setClientes] = useState([]);
  const [clienteSeleccionado, setClienteSeleccionado] = useState(null);
  const [tareas, setTareas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchClientes = async () => {
      try {
        const response = await fetch(`${API_URL}/clientes`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        const data = await response.json();
        setClientes(data);
      } catch (err) {
        setError('Error al obtener clientes');
      }
    };

    fetchClientes();
  }, [token]);

  useEffect(() => {
    const fetchTareas = async () => {
      if (!clienteSeleccionado) return;

      setLoading(true);
      try {
        const response = await fetch(`${API_URL}/tareas?cliente_id=${clienteSeleccionado.id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        const data = await response.json();
        setTareas(data);
        setLoading(false);
      } catch (err) {
        setError('Error al obtener tareas');
        setLoading(false);
      }
    };

    fetchTareas();
  }, [clienteSeleccionado, token]);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Gestión de Clientes</h1>

      {error && <p className="text-red-500">{error}</p>}

      <div className="mb-4">
        <label className="mr-2 font-semibold">Seleccionar cliente:</label>
        <select
          value={clienteSeleccionado?.id || ''}
          onChange={(e) => {
            const cliente = clientes.find(c => c.id === parseInt(e.target.value));
            setClienteSeleccionado(cliente);
          }}
          className="border p-1 rounded"
        >
          <option value="">-- Seleccionar --</option>
          {clientes.map(cliente => (
            <option key={cliente.id} value={cliente.id}>
              {cliente.nombre}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <p>Cargando tareas...</p>
      ) : clienteSeleccionado && (
        <>
          <h2 className="text-xl font-semibold mb-2">Tareas de {clienteSeleccionado.nombre}</h2>
          <KanbanBoard tareas={tareas} clienteId={clienteSeleccionado.id} />
        </>
      )}
    </div>
  );
};

export default ClientManagement;
