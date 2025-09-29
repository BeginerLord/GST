// Modelo para registrar un nuevo usuario
export interface RegisterUserRequest {
  name: string;
  email: string;
  password: string;
  role: string;
}

// Modelo para la respuesta del registro de usuario
export interface RegisterUserResponse {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: Date;
}

// Modelo para un usuario completo
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'administrador' | 'revisor';
  createdAt: Date;
  updatedAt?: Date;
}

// Reutilizamos los modelos de incidents.ts para procesos, incidencias y reportes
// ya que el admin tiene acceso a los mismos endpoints