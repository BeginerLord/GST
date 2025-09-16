// Modelo para crear una nueva incidencia
export interface CreateIncidentRequest {
  processId: string;
  description: string;
  evidence: File;
}

// Modelo para resolver una incidencia
export interface ResolveIncidentRequest {
  resolvedAt?: string;
}

// Modelo para una incidencia completa (respuesta del backend)
export interface Incidence {
  id: string;
  processId: string;
  description: string;
  status: "PENDING" | "RESOLVED";
  evidence?: string[];
  createdAt: string;
  resolvedAt?: string;
  createdBy: string | { _id: string; name: string; email: string };
}

// Modelo para procesos asignados al revisor
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

// Modelo para generar reportes
export interface GenerateReportRequest {
  title: string;
  processIds: string[];
}

export interface ReportResponse {
  id: string;
  fileUrl: string;
  generatedAt: string;
}
