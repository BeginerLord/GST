import { gstApi } from "@/api";
import type {
  RegisterUserRequest,
  RegisterUserResponse,
  UpdateUserRequest,
  UpdateUserResponse,
  User,
  ToggleUserStatusResponse,
  CreateProcessRequest,
  ProcessResponse,
} from "@/models/admin";

// ========================================
// GESTIÓN DE USUARIOS (EXCLUSIVO ADMIN)
// ========================================

/**
 * Registrar un nuevo usuario (SOLO administradores)
 * POST /api/v1/auth/register
 * Middleware: [verifyToken, requireAdmin]
 */
export const registerUser = async (
  userData: RegisterUserRequest
): Promise<RegisterUserResponse> => {
  if (!userData.name || !userData.email || !userData.password || !userData.role) {
    throw new Error("Todos los campos son requeridos");
  }

  try {
    const { data } = await gstApi.post<RegisterUserResponse>(
      "/auth/register",
      userData
    );

    return data;
  } catch (err: any) {
    const message =
      err?.response?.data?.message ||
      err?.message ||
      "Error al registrar el usuario";
    throw new Error(message);
  }
};

/**
 * Obtener lista de todos los usuarios (SOLO administradores)
 * GET /api/v1/users
 * Middleware: [verifyToken, requireAdmin]
 */
export const getUsers = async (): Promise<User[]> => {
  try {
    const { data } = await gstApi.get<User[]>("/users");
    return data;
  } catch (err: any) {
    const message =
      err?.response?.data?.message ||
      err?.message ||
      "Error al obtener la lista de usuarios";
    throw new Error(message);
  }
};

/**
 * Obtener lista de revisores activos (SOLO administradores)
 * Filtra usuarios con rol "revisor" y estado activo
 */
export const getActiveReviewers = async (): Promise<User[]> => {
  try {
    const { data } = await gstApi.get<User[]>("/users");
    // Filtrar solo revisores activos
    const reviewers = data.filter(
      (user) => user.role === "revisor" && user.isActive
    );
    return reviewers;
  } catch (err: any) {
    const message =
      err?.response?.data?.message ||
      err?.message ||
      "Error al obtener la lista de revisores";
    throw new Error(message);
  }
};

/**
 * Actualizar un usuario existente (SOLO administradores)
 * PUT /api/v1/users/:id
 * Middleware: [verifyToken, requireAdmin]
 */
export const updateUser = async (
  userId: string,
  userData: UpdateUserRequest
): Promise<UpdateUserResponse> => {
  if (!userId) {
    throw new Error("El ID del usuario es requerido");
  }

  try {
    const { data } = await gstApi.put<UpdateUserResponse>(
      `/users/${userId}`,
      userData
    );

    return data;
  } catch (err: any) {
    const message =
      err?.response?.data?.message ||
      err?.message ||
      "Error al actualizar el usuario";
    throw new Error(message);
  }
};

/**
 * Cambiar estado de un usuario (activar/desactivar) (SOLO administradores)
 * PATCH /api/v1/users/:id/status
 * Middleware: [verifyToken, requireAdmin]
 */
export const toggleUserStatus = async (
  userId: string
): Promise<ToggleUserStatusResponse> => {
  if (!userId) {
    throw new Error("El ID del usuario es requerido");
  }

  try {
    const { data } = await gstApi.patch<ToggleUserStatusResponse>(
      `/users/${userId}/status`
    );

    return data;
  } catch (err: any) {
    const message =
      err?.response?.data?.message ||
      err?.message ||
      "Error al cambiar el estado del usuario";
    throw new Error(message);
  }
};

// ========================================
// GESTIÓN DE PROCESOS (ADMIN)
// ========================================

/**
 * Crear un nuevo proceso (SOLO administradores)
 * POST /api/v1/reviewer
 * Middleware: [verifyToken, requireAdmin]
 */
export const createProcess = async (
  processData: CreateProcessRequest
): Promise<ProcessResponse> => {
  try {
    console.log("📝 [ADMIN] Creando proceso:", processData);
    console.log(
      "[ADMIN] URL que se formará:",
      `${gstApi.defaults.baseURL}/processes`
    );

    const { data } = await gstApi.post<any>("/processes", processData);

    console.log("✅ [ADMIN] Proceso creado exitosamente:", data);

    // Transformar respuesta del backend
    const transformedData = {
      id: data._id || data.id,
      name: data.name,
      description: data.description,
      status: data.status || "pendiente",
      dueDate: data.dueDate ? new Date(data.dueDate) : new Date(),
      createdAt: data.createdAt ? new Date(data.createdAt) : new Date(),
      createdBy: {
        name: data.createdBy?.name || data.createdBy?.username || "Usuario",
        email: data.createdBy?.email || "",
      },
    };

    return transformedData;
  } catch (err: any) {
    console.error("❌ [ADMIN] Error al crear proceso:", err?.response?.data || err);
    const message =
      err?.response?.data?.error ||
      err?.response?.data?.message ||
      err?.message ||
      "Error al crear el proceso";
    throw new Error(message);
  }
};

// ========================================
// GESTIÓN DE INCIDENCIAS
// ========================================

// NOTA: Los administradores no tienen acceso al endpoint /processes/reviewer
// Por lo tanto, no pueden crear ni gestionar incidencias que requieran información de procesos
// Las funcionalidades de incidencias están disponibles solo para revisores

// ========================================
// GESTIÓN DE REPORTES
// ========================================

// NOTA: La generación de reportes requiere processIds
// que solo están disponibles para revisores a través del endpoint /processes/reviewer
// Por lo tanto, los administradores no pueden generar reportes