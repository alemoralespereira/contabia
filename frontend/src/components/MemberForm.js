import React, { useState, useEffect } from 'react';

const MemberForm = ({ member, onSave, onCancel, teams, isNewMember, initialTeamId }) => {
  const [formData, setFormData] = useState({
    id: member?.id || null,
    name: member?.name || '',
    email: member?.email || '',
    password: member?.password || (isNewMember ? '' : ''), // Solo pedir password si es nuevo
    role: member?.role || 'member',
    teamId: member?.teamId || initialTeamId || '',
    avatar: member?.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    ci: member?.ci || '' // Nuevo campo para la cédula de identidad
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (member) {
      setFormData({
        id: member.id,
        name: member.name,
        email: member.email,
        password: '', // No mostrar password real al editar
        role: member.role,
        teamId: member.teamId || '',
        avatar: member.avatar,
        ci: member.ci || ''
      });
    } else {
      setFormData({
        id: null,
        name: '',
        email: '',
        password: '',
        role: 'member',
        teamId: initialTeamId || '',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
        ci: ''
      });
    }
    setErrors({});
  }, [member, isNewMember, initialTeamId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "El nombre es requerido.";
    if (!formData.email.trim()) {
      newErrors.email = "El email es requerido.";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "El email no es válido.";
    }
    if (isNewMember && !formData.password.trim()) newErrors.password = "La contraseña es requerida para nuevos miembros.";
    if (!formData.role.trim()) newErrors.role = "El rol es requerido.";
    if (!formData.ci.trim()) {
      newErrors.ci = "La cédula de identidad es requerida.";
    } else if (!/^\d{7,8}$/.test(formData.ci.replace(/[\.\-]/g, ''))) { // Valida 7 u 8 dígitos sin puntos ni guiones
      newErrors.ci = "Formato de cédula inválido (solo números, 7 u 8 dígitos).";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      // Si no es un nuevo miembro y la contraseña no ha cambiado, no la enviamos
      const dataToSave = { ...formData };
      if (!isNewMember && dataToSave.password === '') {
        delete dataToSave.password;
      }
      // Asegurarse de que la CI se guarde sin puntos ni guiones
      dataToSave.ci = dataToSave.ci.replace(/[\.\-]/g, '');
      onSave(dataToSave);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nombre</label>
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
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
        <input
          type="email"
          name="email"
          id="email"
          value={formData.email}
          onChange={handleChange}
          className={`mt-1 block w-full rounded-md border ${errors.email ? 'border-red-500' : 'border-gray-300'} shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2`}
        />
        {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
      </div>
      <div>
        <label htmlFor="ci" className="block text-sm font-medium text-gray-700">Cédula de Identidad (sin puntos ni guiones)</label>
        <input
          type="text"
          name="ci"
          id="ci"
          value={formData.ci}
          onChange={handleChange}
          className={`mt-1 block w-full rounded-md border ${errors.ci ? 'border-red-500' : 'border-gray-300'} shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2`}
          placeholder="Ej: 12345678"
        />
        {errors.ci && <p className="mt-1 text-sm text-red-600">{errors.ci}</p>}
      </div>
      {isNewMember && (
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">Contraseña</label>
          <input
            type="password"
            name="password"
            id="password"
            value={formData.password}
            onChange={handleChange}
            className={`mt-1 block w-full rounded-md border ${errors.password ? 'border-red-500' : 'border-gray-300'} shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2`}
          />
          {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
        </div>
      )}
      <div>
        <label htmlFor="role" className="block text-sm font-medium text-gray-700">Rol</label>
        <select
          name="role"
          id="role"
          value={formData.role}
          onChange={handleChange}
          className={`mt-1 block w-full rounded-md border ${errors.role ? 'border-red-500' : 'border-gray-300'} shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2`}
        >
          <option value="member">Miembro</option>
          <option value="supervisor">Supervisor</option>
          <option value="admin">Administrador</option>
        </select>
        {errors.role && <p className="mt-1 text-sm text-red-600">{errors.role}</p>}
      </div>
      <div>
        <label htmlFor="teamId" className="block text-sm font-medium text-gray-700">Equipo</label>
        <select
          name="teamId"
          id="teamId"
          value={formData.teamId}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2"
        >
          <option value="">Sin equipo</option>
          {teams.map(team => (
            <option key={team.id} value={team.id}>{team.name}</option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="avatar" className="block text-sm font-medium text-gray-700">URL Avatar</label>
        <input
          type="text"
          name="avatar"
          id="avatar"
          value={formData.avatar}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2"
        />
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

export default MemberForm;