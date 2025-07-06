import React, { useEffect, useState } from "react";
import KanbanBoard from "./KanbanBoard";
import axios from "../axiosInstance";           // ⬅️ Usa la instancia con token

const ClientManagement = () => {
  const [clientes, setClientes] = useState([]);
  const [clienteSeleccionado, setClienteSeleccionado] = useState(null);
  const [tareas, setTareas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /* ----------------------- Cargar lista de clientes ---------------------- */
  useEffect(() => {
    const fetchClientes = async () => {
      try {
        const res = await axios.get("/clientes");
        setClientes(res.data);
      } catch (err) {
        console.error(err);
        setError("Error al obtener clientes");
      }
    };

    fetchClientes();
  }, []);

  /* ----------------------- Cargar tareas de cliente ---------------------- */
  useEffect(() => {
    const fetchTareas = async () => {
      if (!clienteSeleccionado) return;
      setLoading(true);

      try {
        const res = await axios.get("/tareas", {
          params: { cliente_id: clienteSeleccionado.id }, // ?cliente_id=XXX
        });
        setTareas(res.data);
      } catch (err) {
        console.error(err);
        setError("Error al obtener tareas");
      } finally {
        setLoading(false);
      }
    };

    fetchTareas();
  }, [clienteSeleccionado]);

  /* ----------------------------- Render UI ------------------------------ */
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Gestión de Clientes</h1>

      {error && <p className="text-red-500">{error}</p>}

      <div className="mb-4">
        <label className="mr-2 font-semibold">Seleccionar cliente:</label>
        <select
          value={clienteSeleccionado?.id || ""}
          onChange={(e) =>
            setClienteSeleccionado(
              clientes.find((c) => c.id === e.target.value)
            )
          }
          className="border p-1 rounded"
        >
          <option value="">-- Seleccionar --</option>
          {clientes.map((cliente) => (
            <option key={cliente.id} value={cliente.id}>
              {cliente.nombre}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <p>Cargando tareas...</p>
      ) : (
        clienteSeleccionado && (
          <>
            <h2 className="text-xl font-semibold mb-2">
              Tareas de {clienteSeleccionado.nombre}
            </h2>
            <KanbanBoard
              tareas={tareas}                    /* Prop igual que antes */
              clienteId={clienteSeleccionado.id} /* Prop igual que antes */
            />
          </>
        )
      )}
    </div>
  );
};

export default ClientManagement;

