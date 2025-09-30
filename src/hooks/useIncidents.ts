import { useState, useCallback } from "react";
import {
  getAllIncidencesForReviewer,
  getIncidencesByProcess,
  resolveIncident,
  createIncident,
} from "@/service/revisor";
import type {
  Incidence,
  CreateIncidentRequest,
  ResolveIncidentRequest,
} from "@/models/incidents";

export const useIncidents = () => {
  const [incidents, setIncidents] = useState<Incidence[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Cargar todas las incidencias del revisor
  const loadAllIncidents = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await getAllIncidencesForReviewer();
      setIncidents(data);
      return data;
    } catch (err: any) {
      const errorMessage = err.message || "Error al cargar las incidencias";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Cargar incidencias por proceso
  const loadIncidentsByProcess = useCallback(async (processId: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await getIncidencesByProcess(processId);
      setIncidents(data);
      return data;
    } catch (err: any) {
      const errorMessage =
        err.message || "Error al cargar las incidencias del proceso";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Crear nueva incidencia
  const createNewIncident = useCallback(
    async (incidentData: CreateIncidentRequest) => {
      try {
        setError(null);
        const response = await createIncident(incidentData);
        // Recargar las incidencias después de crear una nueva
        await loadAllIncidents();
        return response;
      } catch (err: any) {
        const errorMessage = err.message || "Error al crear la incidencia";
        setError(errorMessage);
        throw new Error(errorMessage);
      }
    },
    [loadAllIncidents]
  );

  // Resolver incidencia
  const resolveIncidentById = useCallback(
    async (incidentId: string, resolveData?: ResolveIncidentRequest) => {
      try {
        console.log(
          "🔄 [HOOK] Iniciando resolución de incidencia:",
          incidentId,
          resolveData
        );
        setError(null);
        const response = await resolveIncident(incidentId, resolveData);
        console.log("✅ [HOOK] Respuesta del servicio:", response);

        // Actualizar el estado local inmediatamente para mejor UX
        setIncidents((prev) =>
          prev.map((incident) =>
            incident.id === incidentId
              ? {
                  ...incident,
                  status: "RESOLVED" as const,
                  resolvedAt:
                    resolveData?.resolvedAt || new Date().toISOString(),
                }
              : incident
          )
        );

        console.log("✅ [HOOK] Estado local actualizado correctamente");
        return response;
      } catch (err: any) {
        console.error("❌ [HOOK] Error al resolver incidencia:", err);
        console.error("❌ [HOOK] Tipo de error:", typeof err);
        console.error("❌ [HOOK] Error message:", err.message);
        console.error("❌ [HOOK] Error stack:", err.stack);

        const errorMessage = err.message || "Error al resolver la incidencia";
        setError(errorMessage);
        throw new Error(errorMessage);
      }
    },
    []
  );

  // Limpiar error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    incidents,
    isLoading,
    error,
    loadAllIncidents,
    loadIncidentsByProcess,
    createNewIncident,
    resolveIncidentById,
    clearError,
  };
};
