import { gstApi } from "@/api";
import type {
  ProcessResponse,
  Incidence,
  ReportResponse,
} from "@/models/incidents";
import type { AssignIncidentRequest } from "@/models/supervisor";

// ========================================
// GESTIÓN DE PROCESOS (SUPERVISOR)
// ========================================

/**
 * Obtener procesos en revisión (supervisor)
 * GET /api/v1/processes/supervisor
 */
export const getAllProcesses = async (): Promise<ProcessResponse[]> => {
  try {
    const { data } = await gstApi.get<any[]>("/processes/supervisor");

    console.log("📦 Datos crudos de procesos:", data);

    // Transformar datos del backend al formato esperado
    const transformedData: ProcessResponse[] = data.map((process: any) => ({
      id: process._id || process.id,
      name: process.name || process.title || "Sin nombre",
      description: process.description || "",
      status: process.status || "pendiente",
      dueDate: process.dueDate ? new Date(process.dueDate) : new Date(),
      createdAt: process.createdAt ? new Date(process.createdAt) : new Date(),
      createdBy: {
        name: process.createdBy?.name || process.createdBy?.username || "Usuario desconocido",
        email: process.createdBy?.email || "",
      },
    }));

    console.log("✅ Datos transformados de procesos:", transformedData);

    return transformedData;
  } catch (err: any) {
    console.error("❌ Error en getAllProcesses:", err);
    const message =
      err?.response?.data?.message ||
      err?.message ||
      "Error al obtener los procesos";
    throw new Error(message);
  }
};

// ========================================
// GESTIÓN DE INCIDENCIAS (SUPERVISOR)
// ========================================

/**
 * Obtener incidencias pendientes (supervisor)
 * GET /api/v1/incidents/pending
 */
export const getPendingIncidences = async (): Promise<Incidence[]> => {
  try {
    const { data } = await gstApi.get<any[]>("/incidents/pending");

    const transformedData: Incidence[] = data
      .filter((incident: any) => {
        const incidentId = incident._id || incident.id;
        if (!incidentId) {
          console.warn("⚠️ Incidencia sin ID encontrada y omitida:", incident);
          return false;
        }
        return true;
      })
      .map((incident: any) => ({
        id: incident._id || incident.id,
        processId: incident.processId?._id || incident.processId,
        description: incident.description,
        status: "PENDING",
        evidence: incident.evidence,
        createdAt: incident.createdAt,
        resolvedAt: incident.resolvedAt,
        createdBy: incident.createdBy,
      }));

    return transformedData;
  } catch (err: any) {
    const message =
      err?.response?.data?.message ||
      err?.message ||
      "Error al obtener las incidencias pendientes";
    throw new Error(message);
  }
};

/**
 * Asignar incidencia a un revisor
 * PATCH /api/v1/incidents/:incidentId/assign
 */
export const assignIncident = async (
  incidentId: string,
  assignData: AssignIncidentRequest
): Promise<{ success: boolean; message: string }> => {
  try {
    await gstApi.patch(
      `/incidents/${incidentId}/assign`,
      assignData
    );

    return { success: true, message: "Incidencia asignada correctamente" };
  } catch (err: any) {
    const message =
      err?.response?.data?.error ||
      err?.response?.data?.message ||
      err?.message ||
      "Error al asignar la incidencia";
    throw new Error(message);
  }
};

/**
 * Aprobar incidencia
 * PATCH /api/v1/incidents/:incidentId/approve
 */
export const approveIncident = async (
  incidentId: string
): Promise<{ success: boolean; message: string }> => {
  try {
    await gstApi.patch(`/incidents/${incidentId}/approve`);

    return { success: true, message: "Incidencia aprobada correctamente" };
  } catch (err: any) {
    const message =
      err?.response?.data?.error ||
      err?.response?.data?.message ||
      err?.message ||
      "Error al aprobar la incidencia";
    throw new Error(message);
  }
};

// ========================================
// GESTIÓN DE REPORTES (SUPERVISOR)
// ========================================

/**
 * Ver reporte generado
 * GET /api/v1/reports/:reportId
 */
export const getReport = async (reportId: string): Promise<ReportResponse> => {
  try {
    const { data } = await gstApi.get<ReportResponse>(`/reports/${reportId}`);
    return data;
  } catch (err: any) {
    const message =
      err?.response?.data?.error ||
      err?.response?.data?.message ||
      err?.message ||
      "Error al obtener el reporte";
    throw new Error(message);
  }
};
