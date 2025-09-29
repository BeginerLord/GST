import { gstApi } from "@/api";
import type {
  RegisterUserRequest,
  RegisterUserResponse,
} from "@/models/admin";
import type {
  CreateIncidentRequest,
  ResolveIncidentRequest,
  ProcessResponse,
  Incidence,
  GenerateReportRequest,
  ReportResponse,
} from "@/models/incidents";

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

// ========================================
// GESTIÓN DE PROCESOS
// ========================================

// NOTA: El endpoint /processes/reviewer es exclusivo para revisores
// Los administradores no tienen acceso a este endpoint

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