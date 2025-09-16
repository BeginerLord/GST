import { gstApi } from "@/api";
import type {
  CreateIncidentRequest,
  ResolveIncidentRequest,
  ProcessResponse,
  Incidence,
  GenerateReportRequest,
  ReportResponse,
} from "@/models/incidents";

interface CreateIncidentResponse {
  success: boolean;
  message: string;
  data?: any;
  [k: string]: any;
}

export const createIncident = async (
  incidentData: CreateIncidentRequest
): Promise<CreateIncidentResponse> => {
  if (
    !incidentData.processId ||
    !incidentData.description ||
    !incidentData.evidence
  ) {
    throw new Error("processId, description y evidence son requeridos");
  }

  try {
    // Crear FormData para enviar el archivo
    const formData = new FormData();
    formData.append("processId", incidentData.processId);
    formData.append("description", incidentData.description);
    formData.append("evidence", incidentData.evidence);

    const { data } = await gstApi.post<CreateIncidentResponse>(
      "/incidents",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return data;
  } catch (err: any) {
    const message =
      err?.response?.data?.message ||
      err?.message ||
      "Error al crear la incidencia";
    throw new Error(message);
  }
};

export const getProcessesForReviewer = async (): Promise<ProcessResponse[]> => {
  try {
    const { data } = await gstApi.get<ProcessResponse[]>("/processes/reviewer");
    return data;
  } catch (err: any) {
    const message =
      err?.response?.data?.message ||
      err?.message ||
      "Error al obtener los procesos";
    throw new Error(message);
  }
};

// Obtener incidencias de un proceso específico
export const getIncidencesByProcess = async (
  processId: string
): Promise<Incidence[]> => {
  try {
    const { data } = await gstApi.get<any[]>(`/incidents/process/${processId}`);

    console.log("📋 Datos raw del backend para proceso", processId, ":", data);

    // Transformar los datos del backend al formato esperado por el frontend
    const transformedData: Incidence[] = data.map((incident: any) => ({
      id: incident._id,
      processId: processId, // Usar el processId pasado como parámetro
      description: incident.description,
      status: incident.status?.toUpperCase() === "PENDIENTE" || incident.status?.toUpperCase() === "PENDING"
        ? "PENDING"
        : "RESOLVED",
      evidence: incident.evidence,
      createdAt: incident.createdAt,
      resolvedAt: incident.resolvedAt,
      createdBy: incident.createdBy, // Puede ser string u objeto
    }));

    return transformedData;
  } catch (err: any) {
    const message =
      err?.response?.data?.message ||
      err?.message ||
      "Error al obtener las incidencias del proceso";
    throw new Error(message);
  }
};

// Obtener todas las incidencias de todos los procesos asignados al revisor
export const getAllIncidencesForReviewer = async (): Promise<Incidence[]> => {
  try {
    // Primero obtener todos los procesos asignados al revisor
    const processes = await getProcessesForReviewer();

    // Luego obtener las incidencias de cada proceso
    const allIncidences: Incidence[] = [];

    for (const process of processes) {
      try {
        const processIncidences = await getIncidencesByProcess(process.id);
        allIncidences.push(...processIncidences);
      } catch (error) {
        console.warn(
          `Error al obtener incidencias del proceso ${process.id}:`,
          error
        );
        // Continuar con el siguiente proceso aunque uno falle
      }
    }

    return allIncidences;
  } catch (err: any) {
    const message =
      err?.response?.data?.message ||
      err?.message ||
      "Error al obtener las incidencias del revisor";
    throw new Error(message);
  }
};

// Resolver una incidencia
export const resolveIncident = async (
  incidentId: string,
  resolveData?: ResolveIncidentRequest
): Promise<{ success: boolean; message: string }> => {
  try {
    const { data } = await gstApi.patch(
      `/incidents/${incidentId}/resolve`,
      {
        resolvedAt: resolveData?.resolvedAt || new Date().toISOString(),
      }
    );

    return data;
  } catch (err: any) {
    const message =
      err?.response?.data?.message ||
      err?.message ||
      "Error al resolver la incidencia";
    throw new Error(message);
  }
};

// Generar reporte
export const generateReport = async (
  reportData: GenerateReportRequest
): Promise<ReportResponse> => {
  try {
    console.log("📊 Enviando datos para generar reporte:", reportData);

    const { data } = await gstApi.post<ReportResponse>(
      "/reports",
      reportData
    );

    console.log("✅ Reporte generado exitosamente:", data);
    return data;
  } catch (err: any) {
    console.error("❌ Error al generar reporte:", err?.response?.data || err);
    const message =
      err?.response?.data?.error ||
      err?.response?.data?.message ||
      err?.message ||
      "Error al generar el reporte";
    throw new Error(message);
  }
};
