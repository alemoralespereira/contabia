export const users = [
  {
    id: 1,
    name: "Carlos Rodríguez",
    email: "carlos@estudiocontable.com",
    password: "admin123",
    role: "admin",
    accountId: 1,
    avatar: "https://randomuser.me/api/portraits/men/1.jpg",
    ci: "12345678"
  },
  {
    id: 2,
    name: "Laura Martínez",
    email: "laura@estudiocontable.com",
    password: "supervisor123",
    role: "supervisor",
    accountId: 1,
    teamId: 1,
    avatar: "https://randomuser.me/api/portraits/women/1.jpg",
    ci: "87654321"
  },
  {
    id: 3,
    name: "Miguel Fernández",
    email: "miguel@estudiocontable.com",
    password: "supervisor123",
    role: "supervisor",
    accountId: 1,
    teamId: 2,
    avatar: "https://randomuser.me/api/portraits/men/2.jpg",
    ci: "11223344"
  },
  {
    id: 4,
    name: "Ana López",
    email: "ana@estudiocontable.com",
    password: "member123",
    role: "member",
    accountId: 1,
    teamId: 1,
    avatar: "https://randomuser.me/api/portraits/women/2.jpg",
    ci: "44332211"
  },
  {
    id: 5,
    name: "Pedro Gómez",
    email: "pedro@estudiocontable.com",
    password: "member123",
    role: "member",
    accountId: 1,
    teamId: 1,
    avatar: "https://randomuser.me/api/portraits/men/3.jpg",
    ci: "55667788"
  },
  {
    id: 6,
    name: "Sofía Pérez",
    email: "sofia@estudiocontable.com",
    password: "member123",
    role: "member",
    accountId: 1,
    teamId: 2,
    avatar: "https://randomuser.me/api/portraits/women/3.jpg",
    ci: "88776655"
  },
  {
    id: 7,
    name: "Juan Díaz",
    email: "juan@estudiocontable.com",
    password: "member123",
    role: "member",
    accountId: 1,
    teamId: 2,
    avatar: "https://randomuser.me/api/portraits/men/4.jpg",
    ci: "99887766"
  }
];

export const accounts = [
  {
    id: 1,
    name: "Estudio Contable ABC",
    plan: "premium",
    createdAt: "2023-01-15"
  }
];

export const teams = [
  {
    id: 1,
    name: "Equipo Impuestos",
    accountId: 1,
    supervisorId: 2,
    description: "Especialistas en impuestos y declaraciones fiscales"
  },
  {
    id: 2,
    name: "Equipo Auditoría",
    accountId: 1,
    supervisorId: 3,
    description: "Especialistas en auditoría y control interno"
  }
];