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

// Modelo para actualizar un usuario existente
export interface UpdateUserRequest {
  name?: string;
  email?: string;
  password?: string;
  role?: string;
}

// Modelo para la respuesta de actualización de usuario
export interface UpdateUserResponse {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
}

// Modelo para un usuario completo
export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'administrador' | 'revisor' | 'supervisor';
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
}

// Modelo para la respuesta de cambio de estado
export interface ToggleUserStatusResponse {
  id: string;
  isActive: boolean;
  message: string;
}

// ========================================
// MODELOS PARA GESTIÓN DE PROCESOS (ADMIN)
// ========================================

// Modelo para crear un nuevo proceso
export interface CreateProcessRequest {
  name: string;
  description: string;
  dueDate: string; // ISO string format (YYYY-MM-DD)
  assignedReviewerId: string;
}

// Modelo para la respuesta de un proceso
export interface ProcessResponse {
  id: string;
  name: string;
  description: string;
  status: "pendiente" | "en revisión" | "completado";
  dueDate: Date;
  createdAt: Date;
  createdBy: {
    name: string;
    email: string;
  };
}