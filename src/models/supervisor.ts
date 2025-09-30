// Los supervisores reutilizan los modelos existentes de incidents.ts
// ya que tienen acceso a los mismos endpoints que los revisores

export type {
  CreateIncidentRequest,
  ResolveIncidentRequest,
  Incidence,
  ProcessResponse,
  GenerateReportRequest,
  ReportResponse
} from "./incidents";

// Modelo específico para el supervisor
export interface SupervisorStats {
  totalProcesses: number;
  totalIncidents: number;
  pendingIncidents: number;
  resolvedIncidents: number;
  recentActivity: Activity[];
}

export interface Activity {
  id: string;
  type: "incident_created" | "incident_resolved" | "report_generated";
  description: string;
  timestamp: string;
  userId?: string;
  userName?: string;
}

// Modelo para asignar incidencia a revisor
export interface AssignIncidentRequest {
  revisorId: string;
}

// Modelo para usuario revisor
export interface Revisor {
  _id: string;
  name: string;
  email: string;
  role: "revisor";
}