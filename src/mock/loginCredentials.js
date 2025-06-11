// Estos son datos de prueba para la demostración
// En una aplicación real, estas credenciales estarían en una base de datos segura
// y nunca se incluirían en el código del cliente

export const demoCredentials = [
  {
    email: "usuario@ejemplo.com",
    password: "Contabia2023",
    role: "client",
    name: "Usuario Demo",
    company: "Empresa Ejemplo S.A."
  },
  {
    email: "admin@contabia.uy",
    password: "Admin1234",
    role: "admin",
    name: "Administrador",
    company: "Contabia"
  }
];

// Nota: En la implementación actual, cualquier combinación de email/contraseña
// mostrará un mensaje de error ya que el login es simulado.
// Para una implementación real, se necesitaría:
// 1. Un backend seguro para autenticación
// 2. Almacenamiento seguro de contraseñas (hash + salt)
// 3. Tokens JWT o similar para mantener la sesión
// 4. HTTPS para toda comunicación cliente-servidor

// DONE