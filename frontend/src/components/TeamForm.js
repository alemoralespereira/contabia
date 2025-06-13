import React, { useState, useEffect } from 'react';

const TeamForm = ({ team, onSave, onCancel, users }) => {
  const [formData, setFormData] = useState({
    id: team?.id || null,
    name: team?.name || '',
    description: team?.description || '',
    supervisorId: team?.supervisorId || ''
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (team) {
      setFormData({
        id: team.id,
        name: team.name,
        description: team.description,
        supervisorId: team.supervisorId || ''
      });
    } else {
      setFormData({
        id: null,
        name: '',
        description: '',
        supervisorId: ''
      });
    }
    setErrors({});
  }, [team]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "El nombre del equipo es requerido.";
    if (!formData.description.trim()) newErrors.description = "La descripción es requerida.";
    if (!formData.supervisorId) newErrors.supervisorId = "Debe asignar un supervisor al equipo.";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSave(formData);
    }
  };

  // Filtrar usuarios que pueden ser supervisores (rol 'supervisor' o 'admin')
  const possibleSupervisors = users.filter(u => u.role === 'supervisor' || u.role === 'admin');

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nombre del Equipo</label>
        <input
          type="text"
          name="name"
          id="name"
          value={formData.name}
          onChange={handleChange}
          className={`mt-1 block w-full rounded-md border ${errors.name ? 'border-red-500' : 'border-gray-300'} shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2`}
        />
        {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
      </div>
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">Descripción</label>
        <textarea
          name="description"
          id="description"
          rows="3"
          value={formData.description}
          onChange={handleChange}
          className={`mt-1 block w-full rounded-md border ${errors.description ? 'border-red-500' : 'border-gray-300'} shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2`}
        ></textarea>
        {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
      </div>
      <div>
        <label htmlFor="supervisorId" className="block text-sm font-medium text-gray-700">Supervisor</label>
        <select
          name="supervisorId"
          id="supervisorId"
          value={formData.supervisorId}
          onChange={handleChange}
          className={`mt-1 block w-full rounded-md border ${errors.supervisorId ? 'border-red-500' : 'border-gray-300'} shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2`}
        >
          <option value="">Selecciona un supervisor</option>
          {possibleSupervisors.map(user => (
            <option key={user.id} value={user.id}>{user.name}</option>
          ))}
        </select>
        {errors.supervisorId && <p className="mt-1 text-sm text-red-600">{errors.supervisorId}</p>}
      </div>
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

export default TeamForm;