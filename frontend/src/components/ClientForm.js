import React, { useState, useEffect } from "react";

const ClientForm = ({ client, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    id: client?.id || null,
    nombre: client?.nombre || "",
    persona_contacto: client?.persona_contacto || "",
    email: client?.email || "",
    telefono: client?.telefono || "",
    createdAt:
      client?.createdAt || new Date().toISOString().split("T")[0] // fecha actual por defecto
  });

  const [errors, setErrors] = useState({});

  // Reiniciar formulario cuando cambia el cliente que se edita
  useEffect(() => {
    if (client) {
      setFormData({
        id: client.id,
        nombre: client.nombre,
        persona_contacto: client.persona_contacto,
        email: client.email,
        telefono: client.telefono,
        createdAt: client.createdAt
      });
    } else {
      setFormData({
        id: null,
        nombre: "",
        persona_contacto: "",
        email: "",
        telefono: "",
        createdAt: new Date().toISOString().split("T")[0]
      });
    }
    setErrors({});
  }, [client]);

  // Handle inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  // Validaciones
  const validate = () => {
    const newErrors = {};
    if (!formData.nombre.trim())
      newErrors.nombre = "El nombre del cliente es requerido.";
    if (!formData.persona_contacto.trim())
      newErrors.persona_contacto = "El nombre de contacto es requerido.";
    if (!formData.email.trim()) {
      newErrors.email = "El email es requerido.";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "El email no es válido.";
    }
    if (!formData.telefono.trim())
      newErrors.telefono = "El teléfono es requerido.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit
  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Nombre */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Nombre del Cliente
        </label>
        <input
          type="text"
          name="nombre"
          value={formData.nombre}
          onChange={handleChange}
          className={`mt-1 block w-full rounded-md border ${
            errors.nombre ? "border-red-500" : "border-gray-300"
          } shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2`}
        />
        {errors.nombre && (
          <p className="mt-1 text-sm text-red-600">{errors.nombre}</p>
        )}
      </div>

      {/* Persona de contacto */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Persona de Contacto
        </label>
        <input
          type="text"
          name="persona_contacto"
          value={formData.persona_contacto}
          onChange={handleChange}
          className={`mt-1 block w-full rounded-md border ${
            errors.persona_contacto ? "border-red-500" : "border-gray-300"
          } shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2`}
        />
        {errors.persona_contacto && (
          <p className="mt-1 text-sm text-red-600">{errors.persona_contacto}</p>
        )}
      </div>

      {/* Email */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Email
        </label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className={`mt-1 block w-full rounded-md border ${
            errors.email ? "border-red-500" : "border-gray-300"
          } shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2`}
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-600">{errors.email}</p>
        )}
      </div>

      {/* Teléfono */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Teléfono
        </label>
        <input
          type="tel"
          name="telefono"
          value={formData.telefono}
          onChange={handleChange}
          className={`mt-1 block w-full rounded-md border ${
            errors.telefono ? "border-red-500" : "border-gray-300"
          } shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2`}
        />
        {errors.telefono && (
          <p className="mt-1 text-sm text-red-600">{errors.telefono}</p>
        )}
      </div>

      {/* Botones */}
      <div className="flex justify-end space-x-2 mt-4">
        <button
          type="button"
          onClick={onCancel}
          className="inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Guardar
        </button>
      </div>
    </form>
  );
};

export default ClientForm;
