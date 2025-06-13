// Funciones de autenticación y manejo de sesiones

export const authenticateUser = (email, password, users) => {
  const user = users.find(u => u.email === email && u.password === password);
  if (user) {
    // En una aplicación real, aquí generaríamos un token JWT
    return {
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        accountId: user.accountId,
        teamId: user.teamId,
        avatar: user.avatar,
        ci: user.ci // Incluir CI en el user object
      }
    };
  }
  return { success: false, message: "Credenciales inválidas" };
};

export const checkUserPermission = (user, requiredRole) => {
  if (!user) return false;
  
  // Roles en orden jerárquico
  const roles = ["member", "supervisor", "admin"];
  const userRoleIndex = roles.indexOf(user.role);
  const requiredRoleIndex = roles.indexOf(requiredRole);
  
  // El user tiene el rol requerido o un rol superior
  return userRoleIndex >= requiredRoleIndex;
};

export const getUserTeamMembers = (user, users, teams) => {
  if (!user || !Array.isArray(users) || !Array.isArray(teams)) return [];
  
  // Si es supervisor, obtener miembros de su equipo
  if (user.role === "supervisor") {
    return users.filter(u => u.teamId === user.teamId && u.id !== user.id);
  }
  
  // Si es admin, obtener todos los users que no sean el admin actual
  if (user.role === "admin") {
    return users.filter(u => u.id !== user.id);
  }
  
  return [];
};
// DONE