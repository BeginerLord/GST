import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { useEffect } from "react";
import {
  getAllProcesses,
  createIncident,
  getIncidencesByProcess,
  getAllIncidences,
  resolveIncident,
  generateReport,
} from "@/service/supervisor";
import type {
  CreateIncidentRequest,
  ResolveIncidentRequest,
  ProcessResponse,
  Incidence,
  GenerateReportRequest,
  ReportResponse,
} from "@/models/incidents";

// ========================================
// HOOKS DE GESTIÓN DE PROCESOS
// ========================================

/**
 * Hook para obtener todos los procesos del sistema (acceso global)
 * Ejemplo de uso:
 * const { data: processes, isLoading, error, refetch } = useGetAllProcessesHook();
 */
export const useGetAllProcessesHook = (options?: {
  enabled?: boolean;
  onSuccess?: (data: ProcessResponse[]) => void;
  onError?: (error: Error) => void;
}) => {
  const query = useQuery({
    queryKey: ["supervisor", "processes", "all"],
    queryFn: getAllProcesses,
    enabled: options?.enabled ?? true,
  });

  useEffect(() => {
    if (query.data && query.isSuccess && options?.onSuccess) {
      options.onSuccess(query.data);
    }
  }, [query.data, query.isSuccess, options?.onSuccess]);

  useEffect(() => {
    if (query.error && query.isError) {
      const message =
        query.error instanceof Error
          ? query.error.message
          : "Error al obtener los procesos";
      toast.error(message);
      if (options?.onError) {
        options.onError(
          query.error instanceof Error ? query.error : new Error(message)
        );
      }
    }
  }, [query.error, query.isError, options?.onError]);

  return query;
};

export type UseGetAllProcessesHookReturn = ReturnType<typeof useGetAllProcessesHook>;

// ========================================
// HOOKS DE GESTIÓN DE INCIDENCIAS
// ========================================

/**
 * Hook para crear una incidencia
 * Ejemplo de uso:
 * const { createIncidentFn, isPending } = useCreateIncidentHook();
 * createIncidentFn({ processId, description, evidence });
 */
export const useCreateIncidentHook = (options?: {
  onSuccess?: (data: any) => void;
  onError?: (error: Error) => void;
}) => {
  const mutation = useMutation({
    mutationKey: ["supervisor", "incidents", "create"],
    mutationFn: (incidentData: CreateIncidentRequest) =>
      createIncident(incidentData),
    onSuccess: (data) => {
      toast.success("Incidencia creada exitosamente");
      options?.onSuccess?.(data);
    },
    onError: (error: any) => {
      const message =
        error instanceof Error
          ? error.message
          : "Ocurrió un error al crear la incidencia";
      toast.error(message);
      options?.onError?.(error instanceof Error ? error : new Error(message));
    },
  });

  return {
    createIncidentFn: (incidentData: CreateIncidentRequest) =>
      mutation.mutate(incidentData),
    createIncidentAsync: (incidentData: CreateIncidentRequest) =>
      mutation.mutateAsync(incidentData),
    ...mutation,
  };
};

export type UseCreateIncidentHookReturn = ReturnType<
  typeof useCreateIncidentHook
>;

/**
 * Hook para obtener incidencias de un proceso específico
 * Ejemplo de uso:
 * const { data: incidences, isLoading, error } = useGetIncidencesByProcessHook(processId);
 */
export const useGetIncidencesByProcessHook = (
  processId: string,
  options?: {
    enabled?: boolean;
    onSuccess?: (data: Incidence[]) => void;
    onError?: (error: Error) => void;
  }
) => {
  const query = useQuery({
    queryKey: ["supervisor", "incidents", "process", processId],
    queryFn: () => getIncidencesByProcess(processId),
    enabled: options?.enabled ?? true,
  });

  useEffect(() => {
    if (query.data && query.isSuccess && options?.onSuccess) {
      options.onSuccess(query.data);
    }
  }, [query.data, query.isSuccess, options?.onSuccess]);

  useEffect(() => {
    if (query.error && query.isError) {
      const message =
        query.error instanceof Error
          ? query.error.message
          : "Error al obtener las incidencias del proceso";
      toast.error(message);
      if (options?.onError) {
        options.onError(
          query.error instanceof Error ? query.error : new Error(message)
        );
      }
    }
  }, [query.error, query.isError, options?.onError]);

  return query;
};

export type UseGetIncidencesByProcessHookReturn = ReturnType<
  typeof useGetIncidencesByProcessHook
>;

/**
 * Hook para obtener todas las incidencias del sistema (acceso global)
 * Ejemplo de uso:
 * const { data: incidences, isLoading, error, refetch } = useGetAllIncidencesHook();
 */
export const useGetAllIncidencesHook = (options?: {
  enabled?: boolean;
  onSuccess?: (data: Incidence[]) => void;
  onError?: (error: Error) => void;
}) => {
  const query = useQuery({
    queryKey: ["supervisor", "incidents", "all"],
    queryFn: getAllIncidences,
    enabled: options?.enabled ?? true,
  });

  useEffect(() => {
    if (query.data && query.isSuccess && options?.onSuccess) {
      options.onSuccess(query.data);
    }
  }, [query.data, query.isSuccess, options?.onSuccess]);

  useEffect(() => {
    if (query.error && query.isError) {
      const message =
        query.error instanceof Error
          ? query.error.message
          : "Error al obtener las incidencias";
      toast.error(message);
      if (options?.onError) {
        options.onError(
          query.error instanceof Error ? query.error : new Error(message)
        );
      }
    }
  }, [query.error, query.isError, options?.onError]);

  return query;
};

export type UseGetAllIncidencesHookReturn = ReturnType<
  typeof useGetAllIncidencesHook
>;

/**
 * Hook para resolver una incidencia
 * Ejemplo de uso:
 * const { resolveIncidentFn, isPending } = useResolveIncidentHook();
 * resolveIncidentFn({ incidentId, resolveData });
 */
export const useResolveIncidentHook = (options?: {
  onSuccess?: (data: any) => void;
  onError?: (error: Error) => void;
}) => {
  const mutation = useMutation({
    mutationKey: ["supervisor", "incidents", "resolve"],
    mutationFn: ({
      incidentId,
      resolveData,
    }: {
      incidentId: string;
      resolveData?: ResolveIncidentRequest;
    }) => resolveIncident(incidentId, resolveData),
    onSuccess: (data) => {
      toast.success("Incidencia resuelta exitosamente");
      options?.onSuccess?.(data);
    },
    onError: (error: any) => {
      const message =
        error instanceof Error
          ? error.message
          : "Ocurrió un error al resolver la incidencia";
      toast.error(message);
      options?.onError?.(error instanceof Error ? error : new Error(message));
    },
  });

  return {
    resolveIncidentFn: (
      incidentId: string,
      resolveData?: ResolveIncidentRequest
    ) => mutation.mutate({ incidentId, resolveData }),
    resolveIncidentAsync: (
      incidentId: string,
      resolveData?: ResolveIncidentRequest
    ) => mutation.mutateAsync({ incidentId, resolveData }),
    ...mutation,
  };
};

export type UseResolveIncidentHookReturn = ReturnType<
  typeof useResolveIncidentHook
>;

// ========================================
// HOOKS DE GESTIÓN DE REPORTES
// ========================================

/**
 * Hook para generar un reporte consolidado
 * Ejemplo de uso:
 * const { generateReportFn, isPending } = useGenerateReportHook();
 * generateReportFn({ title, processIds });
 */
export const useGenerateReportHook = (options?: {
  onSuccess?: (data: ReportResponse) => void;
  onError?: (error: Error) => void;
}) => {
  const mutation = useMutation({
    mutationKey: ["supervisor", "reports", "generate"],
    mutationFn: (reportData: GenerateReportRequest) =>
      generateReport(reportData),
    onSuccess: (data) => {
      toast.success("Reporte generado exitosamente");
      options?.onSuccess?.(data);
    },
    onError: (error: any) => {
      const message =
        error instanceof Error
          ? error.message
          : "Ocurrió un error al generar el reporte";
      toast.error(message);
      options?.onError?.(error instanceof Error ? error : new Error(message));
    },
  });

  return {
    generateReportFn: (reportData: GenerateReportRequest) =>
      mutation.mutate(reportData),
    generateReportAsync: (reportData: GenerateReportRequest) =>
      mutation.mutateAsync(reportData),
    ...mutation,
  };
};

export type UseGenerateReportHookReturn = ReturnType<
  typeof useGenerateReportHook
>;