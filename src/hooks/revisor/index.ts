import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { useEffect } from "react";
import {
  createIncident,
  getProcessesForReviewer,
  getIncidencesByProcess,
  getAllIncidencesForReviewer,
  resolveIncident,
  generateReport,
} from "@/service/revisor";
import type {
  CreateIncidentRequest,
  ResolveIncidentRequest,
  ProcessResponse,
  Incidence,
  GenerateReportRequest,
  ReportResponse,
} from "@/models/incidents";

// ========================================
// HOOKS PARA PROCESOS (REVISOR)
// ========================================

// NOTA: Los revisores NO pueden crear procesos.
// La creación de procesos es exclusiva de los administradores.

/**
 * Hook para obtener los procesos del revisor
 */
export const useCreateIncidentHook = (options?: {
  onSuccess?: (data: any) => void;
  onError?: (error: Error) => void;
}) => {
  const mutation = useMutation({
    mutationKey: ["incidents", "create"],
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

export const useGetProcessesForReviewerHook = (options?: {
  enabled?: boolean;
  onSuccess?: (data: ProcessResponse[]) => void;
  onError?: (error: Error) => void;
}) => {
  const query = useQuery({
    queryKey: ["processes", "reviewer"],
    queryFn: getProcessesForReviewer,
    enabled: options?.enabled ?? true,
  });

  // Handle success and error callbacks with useEffect
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

export type UseGetProcessesForReviewerHookReturn = ReturnType<
  typeof useGetProcessesForReviewerHook
>;

// ========================================
// HOOKS PARA INCIDENCIAS (REVISOR)
// ========================================

/**
 * Hook para obtener incidencias de un proceso específico
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
    queryKey: ["incidences", "process", processId],
    queryFn: () => getIncidencesByProcess(processId),
    enabled: options?.enabled ?? true,
  });

  useEffect(() => {
    if (query.data && query.isSuccess && options?.onSuccess) {
      options.onSuccess(query.data);
    }
  }, [query.data, query.isSuccess]);

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
  }, [query.error, query.isError]);

  return query;
};

/**
 * Hook para obtener todas las incidencias del revisor
 */
export const useGetAllIncidencesForReviewerHook = (options?: {
  enabled?: boolean;
  onSuccess?: (data: Incidence[]) => void;
  onError?: (error: Error) => void;
}) => {
  const query = useQuery({
    queryKey: ["incidences", "reviewer", "all"],
    queryFn: getAllIncidencesForReviewer,
    enabled: options?.enabled ?? true,
  });

  useEffect(() => {
    if (query.data && query.isSuccess && options?.onSuccess) {
      options.onSuccess(query.data);
    }
  }, [query.data, query.isSuccess]);

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
  }, [query.error, query.isError]);

  return query;
};

/**
 * Hook para resolver una incidencia
 */
export const useResolveIncidentHook = (options?: {
  onSuccess?: (data: any) => void;
  onError?: (error: Error) => void;
}) => {
  const mutation = useMutation({
    mutationKey: ["incidents", "resolve"],
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

// ========================================
// HOOKS PARA REPORTES (REVISOR)
// ========================================

/**
 * Hook para generar un reporte PDF
 */
export const useGenerateReportHook = (options?: {
  onSuccess?: (data: ReportResponse) => void;
  onError?: (error: Error) => void;
}) => {
  const mutation = useMutation({
    mutationKey: ["reports", "generate"],
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
